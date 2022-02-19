const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  window: {
    close () {
      ipcRenderer.send('window:close')
    },
    maximize () {
      ipcRenderer.send('window:maximize')
    },
    unmaximize () {
      ipcRenderer.send('window:unmaximize')
    },
    minimize () {
      ipcRenderer.send('window:minimize')
    },
    isMaximized (cb) {
      ipcRenderer.on('window:isMaximized', (e, val) => cb(val))
      cb(ipcRenderer.sendSync('window:isMaximized'))
    }
  },
  config: {
    get (cb) {
      ipcRenderer.send('config:get')
      ipcRenderer.once('config:get', (e, data) => cb(data))
    },
    getSync () {
      return ipcRenderer.sendSync('config:getSync')
    },
    listen (cb) {
      ipcRenderer.send('config:listen')
      ipcRenderer.on('config:listen', (e, val) => cb(val))
      ipcRenderer.send('config:get')
      ipcRenderer.once('config:get', (e, data) => cb(data))
    },
    update (data) {
      ipcRenderer.send('config:update', data)
    }
  }
})
