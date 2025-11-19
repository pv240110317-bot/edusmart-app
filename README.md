# eduSmart - Aplicación de Asesoría en Línea e IA

Aplicación de escritorio para asesoría educativa en línea con integración de inteligencia artificial.

## 🚀 Características

- ✅ Sistema de autenticación y creación de usuarios
- 📚 Asesoría en línea
- 🤖 Integración de IA
- 👤 Perfil de usuario
- 🖥️ Aplicación de escritorio con Electron

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

### Modo Web (solo desarrollo web)
```bash
npm run dev
```

### Modo App de Escritorio (Electron)
```bash
npm run electron:dev
```

## 🏗️ Construcción

### Construir para producción
```bash
npm run electron:build
```

Esto generará los ejecutables en la carpeta `release/`:
- **Linux**: AppImage y .deb
- **Windows**: Instalador .exe
- **macOS**: .dmg

### Solo empaquetar (sin instalador)
```bash
npm run electron:pack
```

## 📁 Estructura del Proyecto

```
cultura/
├── components/          # Componentes React
│   ├── Dashboard.jsx    # Panel principal
│   ├── Asesoria.jsx     # Sección de asesoría
│   ├── IA.jsx          # Sección de IA
│   └── Perfil.jsx      # Perfil de usuario
├── contexts/           # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── electron/           # Archivos de Electron
│   ├── main.js        # Proceso principal
│   └── preload.js     # Script de precarga
├── App.jsx            # Componente principal
├── Login.jsx          # Componente de login
└── main.jsx           # Punto de entrada

```

## 🔐 Autenticación

La aplicación crea automáticamente usuarios nuevos si no existen. Los datos se almacenan localmente en el navegador/Electron.

## 🎯 Uso

1. Ejecuta la aplicación en modo desarrollo o producción
2. Ingresa un nombre de usuario y contraseña
3. Si el usuario no existe, se creará automáticamente
4. Navega por las diferentes secciones desde el menú lateral

## 📝 Notas

- Los datos se almacenan en localStorage (localmente)
- Para producción, considera usar una base de datos real
- La integración de IA está preparada para conectarse a APIs externas

