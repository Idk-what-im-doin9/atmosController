/**
 * Platform-agnostic audio session manager
 * Dynamically imports the correct implementation based on the current platform
 */

import { platform } from 'os'

export interface AudioSession {
  id: string
  name: string
  volume: number
  isMuted: boolean
  appName: string
  pid?: number
}

export interface IAudioSessionManager {
  setWindow(window: any): void
  startMonitoring(): void
  stopMonitoring(): void
  getAllSessions(): AudioSession[]
  setVolume(sessionId: string, volume: number): boolean | Promise<boolean>
  setMute(sessionId: string, muted: boolean): boolean | Promise<boolean>
  getMasterVolume(): number
  setMasterVolume(volume: number): boolean | Promise<boolean>
  cleanup(): void
}

let audioManagerInstance: IAudioSessionManager | null = null

/**
 * Get the appropriate audio manager for the current platform
 */
export async function getAudioManager(): Promise<IAudioSessionManager> {
  if (audioManagerInstance) {
    return audioManagerInstance
  }

  const currentPlatform = platform()

  switch (currentPlatform) {
    case 'win32': {
      const { audioManager } = await import('./audioSessionManager.windows')
      audioManagerInstance = audioManager
      console.log('[AudioManager] Loaded Windows audio manager')
      break
    }
    case 'linux': {
      const { audioManager } = await import('./audioSessionManager.linux')
      audioManagerInstance = audioManager
      console.log('[AudioManager] Loaded Linux audio manager')
      break
    }
    case 'darwin': {
      // Future macOS implementation
      throw new Error('macOS is not yet supported. Please check back for future updates.')
    }
    default:
      throw new Error(`Unsupported platform: ${currentPlatform}`)
  }

  return audioManagerInstance
}

/**
 * Synchronous access to audio manager (only use after initialization)
 * @deprecated Use getAudioManager() instead for proper async initialization
 */
export let audioManager: IAudioSessionManager

// Initialize the audio manager immediately for backwards compatibility
getAudioManager().then(manager => {
  audioManager = manager
}).catch(error => {
  console.error('[AudioManager] Failed to initialize:', error)
  throw error
})
