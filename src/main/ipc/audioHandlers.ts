import { ipcMain } from 'electron'
import { getAudioManager } from '../services/audioSessionManager'

export function registerAudioHandlers() {
  // Get all audio sessions
  ipcMain.handle('audio:get-sessions', async () => {
    const audioManager = await getAudioManager()
    return audioManager.getAllSessions()
  })

  // Set volume for specific session
  ipcMain.handle('audio:set-volume', async (_event, sessionId: string, volume: number) => {
    const audioManager = await getAudioManager()
    return await audioManager.setVolume(sessionId, volume)
  })

  // Set mute for specific session
  ipcMain.handle('audio:set-mute', async (_event, sessionId: string, muted: boolean) => {
    const audioManager = await getAudioManager()
    return await audioManager.setMute(sessionId, muted)
  })

  // Get master volume
  ipcMain.handle('audio:get-master-volume', async () => {
    const audioManager = await getAudioManager()
    return audioManager.getMasterVolume()
  })

  // Set master volume
  ipcMain.handle('audio:set-master-volume', async (_event, volume: number) => {
    const audioManager = await getAudioManager()
    return await audioManager.setMasterVolume(volume)
  })

  console.log('[IPC] Audio handlers registered')
}
