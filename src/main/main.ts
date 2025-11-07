import { app, BrowserWindow, globalShortcut } from 'electron'
import path from 'path'
import { audioManager } from './services/audioSessionManager'
import { registerAudioHandlers } from './ipc/audioHandlers'
import { registerWindowHandlers } from './ipc/windowHandlers'

// Disable GPU acceleration on Windows for better transparency support
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('disable-gpu')
  app.commandLine.appendSwitch('disable-software-rasterizer')
}

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: true,
    title: 'atmosController',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      enableWebSQL: false
    },
    backgroundColor: '#00000000' // Fully transparent
  })

  // Enable system audio capture
  mainWindow.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    const allowed = ['media', 'mediaKeySystem', 'geolocation', 'notifications', 'midi', 'midiSysex', 'pointerLock', 'fullscreen', 'openExternal']
    if (allowed.includes(permission)) {
      callback(true)
    } else {
      callback(false)
    }
  })

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // Open DevTools in development
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Set audio manager window reference and start monitoring
  audioManager.setWindow(mainWindow)

  mainWindow.webContents.on('did-finish-load', () => {
    audioManager.startMonitoring()
  })

  // Handle window close
  mainWindow.on('closed', () => {
    audioManager.stopMonitoring()
    mainWindow = null
  })
}

// App lifecycle
app.whenReady().then(() => {
  // Register IPC handlers for audio control
  registerAudioHandlers()
  registerWindowHandlers()

  createWindow()

  // Register global hotkey (Alt+Shift+D) to toggle window
  globalShortcut.register('Alt+Shift+D', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Unregister all shortcuts and cleanup audio manager when quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  audioManager.cleanup()
})

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})
