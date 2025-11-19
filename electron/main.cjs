const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const isDev = process.env.NODE_ENV === 'development';

// Función para encontrar el puerto de Vite
function findVitePort() {
  return new Promise((resolve) => {
    const ports = [5173, 5174, 5175, 5176, 5177];
    let resolved = false;
    let checked = 0;
    
    const checkPort = (port) => {
      const req = http.get(`http://localhost:${port}`, (res) => {
        if (!resolved) {
          resolved = true;
          resolve(port);
        }
        req.destroy();
      });
      
      req.setTimeout(500, () => {
        req.destroy();
        checked++;
        if (checked === ports.length && !resolved) {
          resolved = true;
          resolve(5173);
        }
      });
      
      req.on('error', () => {
        checked++;
        if (checked === ports.length && !resolved) {
          resolved = true;
          resolve(5173); // Puerto por defecto
        }
      });
    };
    
    // Probar todos los puertos
    ports.forEach(checkPort);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true, // Mantener seguridad web
    },
    // icon: path.join(__dirname, '../assets/icon.png'), // Icono opcional
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    show: false, // No mostrar hasta que esté listo
  });

  // Mostrar ventana cuando esté lista
  win.once('ready-to-show', () => {
    win.show();
  });

  // Manejar errores de carga
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  // Manejar errores de consola
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (level === 3) { // Error level
      console.error('Console error:', message, 'at', sourceId, ':', line);
    }
  });

  if (isDev) {
    // En desarrollo, cargar desde Vite
    // Intentar encontrar el puerto correcto
    const vitePort = await findVitePort();
    // Esperar un poco más para asegurar que Vite esté completamente listo
    setTimeout(() => {
      win.loadURL(`http://localhost:${vitePort}`);
      win.webContents.openDevTools();
    }, 1000);
  } else {
    // En producción, cargar el archivo HTML compilado
    // Con asar: true, Electron maneja automáticamente las rutas dentro del .asar
    // __dirname apunta a resources/app.asar/electron cuando está empaquetado
    // La ruta relativa ../dist/index.html debería funcionar desde electron/
    const distPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading production file from:', distPath);
    console.log('App path:', app.getAppPath());
    console.log('Is packaged:', app.isPackaged);
    
    win.loadFile(distPath).catch((err) => {
      console.error('Error loading file:', err);
      // Si falla, intentar con ruta absoluta usando app.getAppPath()
      const appPath = app.getAppPath();
      const altPath = path.join(appPath, 'dist', 'index.html');
      console.log('Trying alternative path:', altPath);
      win.loadFile(altPath).catch((err2) => {
        console.error('Alternative path also failed:', err2);
        // Habilitar DevTools para depuración
        win.webContents.openDevTools();
      });
    });
    
    // Temporalmente habilitar DevTools para depuración (quitar en producción final)
    // Descomentar la siguiente línea para ver errores en la consola
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

