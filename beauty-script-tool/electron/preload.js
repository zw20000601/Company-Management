const { contextBridge } = require('electron')

// Expose minimal APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
})
