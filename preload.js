const { contextBrige, ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    loadPage: (title) => ipcRenderer.send('loadPage', title)
})