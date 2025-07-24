const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
const PADDING = 20;  // extra room for shadows

function measureAndResize() {
  const measureCode = `
    (() => {
      const full = document.getElementById('fullWidget');
      const compact = document.getElementById('compactWidget');
      const container = full.style.display !== 'none'
        ? full.firstElementChild
        : compact.firstElementChild;
      const r = container.getBoundingClientRect();
      return { width: Math.ceil(r.width), height: Math.ceil(r.height) };
    })()
  `;
  win.webContents.executeJavaScript(measureCode, true)
    .then(({ width, height }) => {
      win.setContentSize(width + PADDING, height + PADDING);
    })
    .catch(err => console.error('Resize error:', err));
}

function createWindow() {
  win = new BrowserWindow({
    useContentSize: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.webContents.on('did-finish-load', measureAndResize);
}

ipcMain.on('request-resize', measureAndResize);

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
