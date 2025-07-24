const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  requestResize: () => ipcRenderer.send('request-resize')
});
