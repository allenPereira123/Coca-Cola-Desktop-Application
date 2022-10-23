//var child = require('child_process').execFile;
//var executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('./server/index')
var win;

if(require('electron-squirrel-startup')) return;

const createWindow = () => {
    win = new BrowserWindow({
    webPreferences: {
     // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true,
      contextIsolation:false,
    }
  })

  win.loadFile('views/signin.html');
  win.setMenuBarVisibility(true);
}


app.whenReady().then(() => {
  createWindow();

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/*
ipcMain.on('loadPage', (event, fileName) => {
  win.loadFile(path.join(__dirname, 'views', fileName));
})

*/