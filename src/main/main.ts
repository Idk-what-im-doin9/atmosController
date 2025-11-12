import { app, BrowserWindow, globalShortcut } from 'electron'
import path from 'path'
import { getAudioManager, IAudioSessionManager } from './services/audioSessionManager'
import { registerAudioHandlers } from './ipc/audioHandlers'

// Platform-specific optimizations
if (process.platform === 'win32') {
  // Disable GPU acceleration on Windows for better transparency support
  app.commandLine.appendSwitch('disable-gpu')
  app.commandLine.appendSwitch('disable-software-rasterizer')
} else if (process.platform === 'linux') {
  // Linux requires these flags for proper transparency
  app.commandLine.appendSwitch('enable-transparent-visuals')
  app.commandLine.appendSwitch('disable-gpu')
  app.disableHardwareAcceleration()
}

let mainWindow: BrowserWindow | null = null
let audioManager: IAudioSessionManager | null = null

const createWindow = async () => {
  // Initialize audio manager first
  try {
    audioManager = await getAudioManager()
  } catch (error) {
    console.error('[Main] Failed to initialize audio manager:', error)
    // Continue anyway - the UI will show no audio sessions
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      offscreen: false
    },
    backgroundColor: '#00000000', // Fully transparent
    ...(process.platform === 'linux' ? {
      type: 'toolbar', // Makes it float in tiling WMs
      skipTaskbar: true,
      thickFrame: false // No window decorations
    } : {})
  })

  // Remove any window decorations on Linux
  if (process.platform === 'linux') {
    mainWindow.setMenuBarVisibility(false)
  }

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Set audio manager window reference and start monitoring
  if (audioManager) {
    audioManager.setWindow(mainWindow)

    mainWindow.webContents.on('did-finish-load', () => {
      audioManager?.startMonitoring()
    })
  }

  // Handle window close
  mainWindow.on('closed', () => {
    audioManager?.stopMonitoring()
    mainWindow = null
  })
}

// App lifecycle
app.whenReady().then(async () => {
  // Register IPC handlers for audio control
  registerAudioHandlers()

  // On Linux, add delay for proper transparency initialization
  if (process.platform === 'linux') {
    setTimeout(async () => {
      await createWindow()
      registerHotkey()
    }, 300)
  } else {
    await createWindow()
    registerHotkey()
  }

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

function registerHotkey() {
  // Register global hotkey to toggle window (Alt+Shift+D on all platforms)
  const hotkey = 'Alt+Shift+D'

  const registered = globalShortcut.register(hotkey, () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  if (registered) {
    console.log(`[Main] Global hotkey registered: ${hotkey}`)
  } else {
    console.warn(`[Main] Failed to register global hotkey: ${hotkey}`)
  }
}

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Unregister all shortcuts and cleanup audio manager when quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  audioManager?.cleanup()
})

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('[Main] Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('[Main] Unhandled Rejection:', error)
})
