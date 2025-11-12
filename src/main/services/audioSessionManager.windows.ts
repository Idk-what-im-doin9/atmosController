import { BrowserWindow } from 'electron'

export interface AudioSession {
  id: string
  name: string
  volume: number
  isMuted: boolean
  appName: string
  pid?: number
}

// Mock audio sessions for testing UI (native library integration pending)
const MOCK_SESSIONS: AudioSession[] = [
  { id: '1', name: 'Spotify', volume: 75, isMuted: false, appName: 'Spotify', pid: 1234 },
  { id: '2', name: 'Chrome', volume: 50, isMuted: false, appName: 'Google Chrome', pid: 5678 },
  { id: '3', name: 'Discord', volume: 60, isMuted: false, appName: 'Discord', pid: 9101 }
]

export class AudioSessionManager {
  private window: BrowserWindow | null = null
  private updateInterval: NodeJS.Timeout | null = null
  private sessions: Map<string, AudioSession> = new Map()
  private masterVolume: number = 80

  constructor() {
    this.initialize()
  }

  private initialize() {
    console.log('[AudioManager] Initialized with MOCK data (native library integration pending)')
    // Load mock sessions
    MOCK_SESSIONS.forEach(session => {
      this.sessions.set(session.id, { ...session })
    })
  }

  setWindow(window: BrowserWindow) {
    this.window = window
  }

  startMonitoring() {
    // Send initial update immediately
    this.sendSessionsToRenderer()

    // Poll every 2 seconds (slower for mock data)
    this.updateInterval = setInterval(() => {
      this.sendSessionsToRenderer()
    }, 2000)
  }

  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private sendSessionsToRenderer() {
    if (!this.window) return

    const sessionsArray = Array.from(this.sessions.values())
    this.window.webContents.send('audio-sessions-updated', sessionsArray)
  }

  getAllSessions(): AudioSession[] {
    return Array.from(this.sessions.values())
  }

  setVolume(sessionId: string, volume: number): boolean {
    const clampedVolume = Math.max(0, Math.min(100, volume))
    const session = this.sessions.get(sessionId)

    if (session) {
      session.volume = clampedVolume
      this.sendSessionsToRenderer()
      console.log(`[AudioManager] MOCK: Set volume for ${session.name} to ${clampedVolume}%`)
      return true
    }

    return false
  }

  setMute(sessionId: string, muted: boolean): boolean {
    const session = this.sessions.get(sessionId)

    if (session) {
      session.isMuted = muted
      this.sendSessionsToRenderer()
      console.log(`[AudioManager] MOCK: ${muted ? 'Muted' : 'Unmuted'} ${session.name}`)
      return true
    }

    return false
  }

  getMasterVolume(): number {
    return this.masterVolume
  }

  setMasterVolume(volume: number): boolean {
    const clampedVolume = Math.max(0, Math.min(100, volume))
    this.masterVolume = clampedVolume
    console.log(`[AudioManager] MOCK: Set master volume to ${clampedVolume}%`)
    return true
  }

  cleanup() {
    this.stopMonitoring()
    console.log('[AudioManager] Cleanup complete')
  }
}

export const audioManager = new AudioSessionManager()
