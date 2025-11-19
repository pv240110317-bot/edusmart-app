const { contextBridge } = require('electron');

// Exponer APIs seguras al renderer si es necesario
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
});

