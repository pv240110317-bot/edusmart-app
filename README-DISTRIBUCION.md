# 📦 Distribución Interna - eduSmart

## 🚀 Construir la Aplicación

### Método Rápido (Recomendado)

```bash
./build-dist.sh
```

Este script:
1. Limpia builds anteriores
2. Construye la aplicación React
3. Genera los ejecutables con Electron
4. Muestra dónde están los archivos

### Método Manual

```bash
# Para Linux (AppImage + DEB)
npm run dist:linux

# Para Windows
npm run electron:build:win

# Para macOS
npm run electron:build:mac
```

## 📁 Archivos de Distribución

Después de construir, encontrarás los archivos en `release/`:

### Linux
- **`eduSmart-1.0.0.AppImage`** - Ejecutable portable (recomendado)
  - No requiere instalación
  - Funciona en cualquier distribución Linux moderna
  - Solo hazlo ejecutable: `chmod +x eduSmart-1.0.0.AppImage`

- **`eduSmart_1.0.0_amd64.deb`** - Instalador para Debian/Ubuntu
  - Instalación: `sudo dpkg -i eduSmart_1.0.0_amd64.deb`

### Windows
- **`eduSmart Setup 1.0.0.exe`** - Instalador
  - Ejecutar y seguir el asistente
  - Se instala en: `C:\Users\[Usuario]\AppData\Local\Programs\edusmart-app\`

### macOS
- **`eduSmart-1.0.0.dmg`** - Imagen de disco
  - Abrir y arrastrar a Aplicaciones

## 📤 Cómo Distribuir

### Opción 1: Red Interna
1. Coloca los archivos en un servidor compartido
2. Comparte el enlace con los usuarios
3. Ellos descargan y ejecutan/instalan

### Opción 2: USB
1. Copia los archivos a una USB
2. Distribuye físicamente
3. Los usuarios copian a sus computadoras

### Opción 3: Cloud (Google Drive, Dropbox, etc.)
1. Sube los archivos a la nube
2. Comparte el enlace
3. Los usuarios descargan

## ✅ Instrucciones para Usuarios Finales

### Linux - AppImage (Más Fácil)
```bash
# 1. Descargar el archivo .AppImage
# 2. Hacer ejecutable
chmod +x eduSmart-1.0.0.AppImage

# 3. Ejecutar
./eduSmart-1.0.0.AppImage
```

### Linux - DEB
```bash
# 1. Descargar el archivo .deb
# 2. Instalar
sudo dpkg -i eduSmart_1.0.0_amd64.deb

# Si hay errores de dependencias:
sudo apt-get install -f
```

### Windows
1. Descargar el archivo `.exe`
2. Ejecutar el instalador
3. Seguir las instrucciones
4. La aplicación aparecerá en el menú de inicio

### macOS
1. Descargar el archivo `.dmg`
2. Abrir el DMG
3. Arrastrar eduSmart a la carpeta Aplicaciones
4. Ejecutar desde Aplicaciones

## 🔧 Requisitos

- **Linux**: Ubuntu 18.04+ o distribución moderna
- **Windows**: Windows 10 o superior (64-bit)
- **macOS**: macOS 10.13+ (Intel o Apple Silicon)

## 💾 Tamaño

Aproximadamente 150-200 MB por ejecutable.

## 🔒 Seguridad

- Los ejecutables son seguros para distribución interna
- No requieren conexión a internet después de la instalación
- Todos los datos se guardan localmente
- No hay telemetría ni tracking

## 🆘 Solución de Problemas

### AppImage no se ejecuta
```bash
chmod +x eduSmart-1.0.0.AppImage
./eduSmart-1.0.0.AppImage
```

### Error "FUSE" en AppImage
```bash
sudo apt-get install fuse
```

### DEB no se instala
```bash
sudo apt-get install -f
sudo dpkg -i eduSmart_1.0.0_amd64.deb
```

### Windows: "Windows protegió tu PC"
- Clic en "Más información"
- Clic en "Ejecutar de todas formas"
- (Esto es normal en aplicaciones no firmadas)

## 📝 Notas

- La aplicación funciona **completamente offline**
- Cada usuario tiene sus propios datos
- No se requiere registro ni activación
- Los datos se guardan en el sistema del usuario

## 🎯 Próximos Pasos

1. Construir: `./build-dist.sh`
2. Probar en un sistema limpio
3. Distribuir a usuarios
4. Recopilar feedback

