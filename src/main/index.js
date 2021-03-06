'use strict'

import { app, protocol, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    frame: false,
    minWidth: 400,
    minHeight: 200,
    width: 1000,
    height: 700,
    webPreferences: {
      webSecurity: false,

      preload: path.join(app.getAppPath(), 'preload.js'),

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: !!process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { role: 'reload' },
    { role: 'toggleDevTools' }
  ]))

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // Open urls in the user's browse
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(1)
  })

  win.on('close', () => win.destroy())

  const update = () => win.webContents.send('window:isMaximized', win.isMaximized())
  win.on('maximize', () => update())
  win.on('unmaximize', () => update())

  update()
}

ipcMain.on('window:close', e => BrowserWindow.getAllWindows().find(x => x.id === e.frameId).close())
ipcMain.on('window:maximize', e => BrowserWindow.getAllWindows().find(x => x.id === e.frameId).maximize())
ipcMain.on('window:unmaximize', e => BrowserWindow.getAllWindows().find(x => x.id === e.frameId).unmaximize())
ipcMain.on('window:minimize', e => BrowserWindow.getAllWindows().find(x => x.id === e.frameId).minimize())
ipcMain.on('window:isMaximized', e => { e.returnValue = BrowserWindow.getAllWindows().find(x => x.id === e.frameId).isMaximized() })

const configPath = path.join(app.getPath('userData'), 'config.json')
function getConfigJson (cb) {
  fs.readFile(configPath, 'utf-8', (err, json) => {
    if (err) {
      cb(undefined)
      return
    }

    try {
      var data = JSON.parse(json)

      cb(data)
    } catch {
      cb(undefined)
    }
  })
}
ipcMain.on('config:get', e => {
  getConfigJson((data) => {
    e.reply('config:get', data || {})
  })
})
ipcMain.on('config:getSync', e => {
  try {
    e.returnValue = JSON.parse(fs.readFileSync(configPath, 'utf-8')) || {}
  } catch {
    e.returnValue = {}
  }
})
ipcMain.on('config:listen', e => {
  chokidar.watch(configPath).on('change', () => {
    getConfigJson((data) => {
      e.reply('config:listen', data || {})
    })
  })
})
ipcMain.on('config:update', (e, data) => {
  fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
    err && console.log(err)
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
