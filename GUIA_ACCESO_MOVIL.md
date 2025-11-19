# 📱 Guía de Acceso Móvil a eduSmart

## 🌐 Opción 1: Acceso Web desde el Teléfono

### Pasos para acceder:

1. **Conecta tu teléfono a la misma red WiFi que tu computadora**
   - Asegúrate de que ambos dispositivos estén en la misma red

2. **Obtén la IP de tu computadora:**
   ```bash
   # En Linux/Mac
   hostname -I
   # O
   ip addr show | grep "inet "
   
   # En Windows
   ipconfig
   # Busca "IPv4 Address"
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   cd /home/agualoka/Escritorio/cultura
   npm run dev
   ```

4. **Abre en tu teléfono:**
   - Abre el navegador (Chrome, Safari, etc.)
   - Ve a: `http://TU_IP:5173`
   - Ejemplo: `http://192.168.1.100:5173`

### Configurar Vite para acceso desde red local:

Edita `vite.config.js` y agrega:
```javascript
server: {
  port: 5173,
  host: '0.0.0.0', // Permite acceso desde cualquier IP
}
```

## 📦 Opción 2: Construir Versión Web para Servidor

### Pasos:

1. **Construir la aplicación:**
   ```bash
   npm run build
   ```

2. **Servir con un servidor HTTP simple:**
   ```bash
   # Opción A: Python
   cd dist
   python3 -m http.server 8080
   
   # Opción B: Node.js (http-server)
   npm install -g http-server
   cd dist
   http-server -p 8080
   ```

3. **Acceder desde el teléfono:**
   - `http://TU_IP:8080`

## 🔧 Opción 3: Usar ngrok (Acceso desde Internet)

1. **Instalar ngrok:**
   ```bash
   # Descargar de https://ngrok.com
   # O con snap
   sudo snap install ngrok
   ```

2. **Iniciar túnel:**
   ```bash
   npm run dev
   # En otra terminal
   ngrok http 5173
   ```

3. **Usar la URL que ngrok proporciona:**
   - Ejemplo: `https://abc123.ngrok.io`
   - Esta URL funciona desde cualquier lugar

## 📱 Opción 4: Instalar como PWA (Progressive Web App)

### Configurar PWA:

1. **Crear `public/manifest.json`:**
```json
{
  "name": "eduSmart",
  "short_name": "eduSmart",
  "description": "Aplicación de Asesoría en Línea e IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Agregar al `index.html`:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#667eea">
```

3. **Instalar en el teléfono:**
   - Abre la app en el navegador
   - Menú → "Agregar a pantalla de inicio"
   - Se instalará como una app nativa

## 🚀 Recomendación Rápida

**Para desarrollo rápido:**
```bash
# 1. Edita vite.config.js y agrega host: '0.0.0.0'
# 2. Ejecuta:
npm run dev
# 3. En tu teléfono, abre: http://TU_IP:5173
```

## ⚠️ Notas de Seguridad

- Solo usa en redes de confianza
- No expongas a Internet sin protección
- Considera usar HTTPS en producción
- Usa contraseñas fuertes

## 🔍 Solución de Problemas

**No puedo acceder desde el teléfono:**
- Verifica que ambos estén en la misma red WiFi
- Revisa el firewall de tu computadora
- Asegúrate de que el puerto 5173 esté abierto

**La app se ve mal en el teléfono:**
- La app ya tiene diseño responsive
- Refresca la página
- Limpia la caché del navegador

