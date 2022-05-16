const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('./server/index')
var win;

const createWindow = () => {
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('loadPage', (event, fileName) => {
  win.loadFile(path.join(__dirname, 'views', fileName));
})