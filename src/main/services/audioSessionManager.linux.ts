import { BrowserWindow } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface AudioSession {
  id: string
  name: string
  volume: number
  isMuted: boolean
  appName: string
  pid?: number
}

type AudioSystem = 'pulseaudio' | 'pipewire' | 'unknown'

export class LinuxAudioSessionManager {
  private window: BrowserWindow | null = null
  private updateInterval: NodeJS.Timeout | null = null
  private sessions: Map<string, AudioSession> = new Map()
  private masterVolume: number = 100
  private audioSystem: AudioSystem = 'unknown'

  constructor() {
    this.initialize()
  }

  private async initialize() {
    await this.detectAudioSystem()
    console.log(`[AudioManager] Initialized Linux audio manager with ${this.audioSystem}`)
    await this.refreshSessions()
  }

  /**
   * Detect which audio system is running (PulseAudio or PipeWire)
   */
  private async detectAudioSystem(): Promise<void> {
    try {
      // Check for PipeWire
      const { stdout: pwCheck } = await execAsync('systemctl --user is-active pipewire 2>/dev/null || echo inactive')
      if (pwCheck.trim() === 'active') {
        this.audioSystem = 'pipewire'
        console.log('[AudioManager] Detected PipeWire audio system')
        return
      }
    } catch (error) {
      // PipeWire not found, continue checking
    }

    try {
      // Check for PulseAudio
      const { stdout: paCheck } = await execAsync('systemctl --user is-active pulseaudio 2>/dev/null || echo inactive')
      if (paCheck.trim() === 'active') {
        this.audioSystem = 'pulseaudio'
        console.log('[AudioManager] Detected PulseAudio audio system')
        return
      }
    } catch (error) {
      // PulseAudio not found
    }

    try {
      // Fallback: check if pactl command exists (works with both PulseAudio and PipeWire)
      await execAsync('which pactl')
      this.audioSystem = 'pulseaudio' // PipeWire has PA compatibility
      console.log('[AudioManager] Detected audio system via pactl command')
    } catch (error) {
      console.error('[AudioManager] No compatible audio system detected')
      this.audioSystem = 'unknown'
    }
  }

  setWindow(window: BrowserWindow) {
    this.window = window
  }

  startMonitoring() {
    if (this.audioSystem === 'unknown') {
      console.warn('[AudioManager] Cannot start monitoring - no audio system detected')
      return
    }

    // Send initial update
    this.sendSessionsToRenderer()

    // Poll every 1 second
    this.updateInterval = setInterval(async () => {
      await this.refreshSessions()
      this.sendSessionsToRenderer()
    }, 1000)

    console.log('[AudioManager] Started monitoring audio sessions')
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
      console.log('[AudioManager] Stopped monitoring audio sessions')
    }
  }

  private sendSessionsToRenderer() {
    if (!this.window) return

    const sessionsArray = Array.from(this.sessions.values())
    this.window.webContents.send('audio-sessions-updated', sessionsArray)
  }

  private async refreshSessions(): Promise<void> {
    if (this.audioSystem === 'unknown') return

    try {
      const { stdout } = await execAsync('pactl list sink-inputs 2>/dev/null || echo ""')
      const sessions = this.parsePulseAudioSinkInputs(stdout)

      // Update sessions map
      this.sessions.clear()
      sessions.forEach(session => {
        this.sessions.set(session.id, session)
      })

      // Also update master volume
      await this.refreshMasterVolume()
    } catch (error) {
      console.error('[AudioManager] Error refreshing sessions:', error)
    }
  }

  private parsePulseAudioSinkInputs(output: string): AudioSession[] {
    if (!output || output.trim() === '') {
      return []
    }

    const sessions: AudioSession[] = []
    const sinkInputs = output.split('Sink Input #')

    for (let i = 1; i < sinkInputs.length; i++) {
      const input = sinkInputs[i]

      try {
        // Extract sink input ID
        const idMatch = input.match(/^(\d+)/)
        if (!idMatch) continue
        const id = idMatch[1]

        // Extract application name
        const appNameMatch = input.match(/application\.name = "([^"]+)"/)
        const appName = appNameMatch ? appNameMatch[1] : 'Unknown'

        // Extract process ID
        const pidMatch = input.match(/application\.process\.id = "(\d+)"/)
        const pid = pidMatch ? parseInt(pidMatch[1]) : undefined

        // Extract volume percentage
        const volumeMatch = input.match(/Volume:.*?(\d+)%/)
        const volume = volumeMatch ? parseInt(volumeMatch[1]) : 100

        // Extract mute status
        const muteMatch = input.match(/Mute: (yes|no)/)
        const isMuted = muteMatch ? muteMatch[1] === 'yes' : false

        // Get a friendly name from process binary if available
        const processNameMatch = input.match(/application\.process\.binary = "([^"]+)"/)
        let name = processNameMatch ? processNameMatch[1] : appName

        // Clean up the name (remove path if present)
        if (name.includes('/')) {
          name = name.split('/').pop() || name
        }

        // Capitalize first letter
        name = name.charAt(0).toUpperCase() + name.slice(1)

        sessions.push({
          id,
          name,
          volume,
          isMuted,
          appName,
          pid
        })
      } catch (error) {
        console.error('[AudioManager] Error parsing sink input:', error)
        continue
      }
    }

    return sessions
  }

  private async refreshMasterVolume(): Promise<void> {
    try {
      const { stdout } = await execAsync('pactl get-sink-volume @DEFAULT_SINK@ 2>/dev/null')
      const volumeMatch = stdout.match(/(\d+)%/)
      if (volumeMatch) {
        this.masterVolume = parseInt(volumeMatch[1])
      }
    } catch (error) {
      // Silent fail - master volume not critical
    }
  }

  getAllSessions(): AudioSession[] {
    return Array.from(this.sessions.values())
  }

  async setVolume(sessionId: string, volume: number): Promise<boolean> {
    if (this.audioSystem === 'unknown') {
      console.warn('[AudioManager] Cannot set volume - no audio system detected')
      return false
    }

    try {
      const clampedVolume = Math.max(0, Math.min(100, volume))

      await execAsync(`pactl set-sink-input-volume ${sessionId} ${clampedVolume}%`)

      const session = this.sessions.get(sessionId)
      if (session) {
        session.volume = clampedVolume
        this.sendSessionsToRenderer()
        console.log(`[AudioManager] Set volume for ${session.name} to ${clampedVolume}%`)
      }

      return true
    } catch (error) {
      console.error(`[AudioManager] Error setting volume:`, error)
      return false
    }
  }

  async setMute(sessionId: string, muted: boolean): Promise<boolean> {
    if (this.audioSystem === 'unknown') {
      console.warn('[AudioManager] Cannot set mute - no audio system detected')
      return false
    }

    try {
      await execAsync(`pactl set-sink-input-mute ${sessionId} ${muted ? '1' : '0'}`)

      const session = this.sessions.get(sessionId)
      if (session) {
        session.isMuted = muted
        this.sendSessionsToRenderer()
        console.log(`[AudioManager] ${muted ? 'Muted' : 'Unmuted'} ${session.name}`)
      }

      return true
    } catch (error) {
      console.error(`[AudioManager] Error setting mute:`, error)
      return false
    }
  }

  getMasterVolume(): number {
    return this.masterVolume
  }

  async setMasterVolume(volume: number): Promise<boolean> {
    if (this.audioSystem === 'unknown') {
      console.warn('[AudioManager] Cannot set master volume - no audio system detected')
      return false
    }

    try {
      const clampedVolume = Math.max(0, Math.min(100, volume))
      await execAsync(`pactl set-sink-volume @DEFAULT_SINK@ ${clampedVolume}%`)
      this.masterVolume = clampedVolume
      console.log(`[AudioManager] Set master volume to ${clampedVolume}%`)
      return true
    } catch (error) {
      console.error('[AudioManager] Error setting master volume:', error)
      return false
    }
  }

  cleanup() {
    this.stopMonitoring()
    console.log('[AudioManager] Cleanup complete')
  }

  /**
   * Check if the audio system is available and configured correctly
   */
  isAvailable(): boolean {
    return this.audioSystem !== 'unknown'
  }

  /**
   * Get the detected audio system type
   */
  getAudioSystemType(): AudioSystem {
    return this.audioSystem
  }
}

export const audioManager = new LinuxAudioSessionManager()
