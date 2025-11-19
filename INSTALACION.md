# 📦 Guía de Instalación y Distribución Interna - eduSmart

## 🚀 Construir la Aplicación

### Opción 1: Script Automático (Recomendado)

```bash
chmod +x build-dist.sh
./build-dist.sh
```

### Opción 2: Manual

```bash
# Construir para Linux
npm run dist:linux

# Construir para Windows
npm run electron:build:win

# Construir para macOS
npm run electron:build:mac

# Construir para todas las plataformas
npm run dist:all
```

## 📁 Archivos Generados

Después de la construcción, los archivos estarán en la carpeta `release/`:

### Linux
- **AppImage**: `eduSmart-1.0.0.AppImage` - Ejecutable portable, no requiere instalación
- **DEB**: `eduSmart_1.0.0_amd64.deb` - Paquete para instalación en sistemas basados en Debian/Ubuntu

### Windows
- **Instalador NSIS**: `eduSmart Setup 1.0.0.exe` - Instalador con interfaz gráfica

### macOS
- **DMG**: `eduSmart-1.0.0.dmg` - Imagen de disco para instalación

## 📤 Distribución Interna

### Para Linux (AppImage - Recomendado)
1. Comparte el archivo `.AppImage`
2. El usuario debe hacerlo ejecutable:
   ```bash
   chmod +x eduSmart-1.0.0.AppImage
   ./eduSmart-1.0.0.AppImage
   ```

### Para Linux (DEB)
1. Comparte el archivo `.deb`
2. Instalación:
   ```bash
   sudo dpkg -i eduSmart_1.0.0_amd64.deb
   sudo apt-get install -f  # Si hay dependencias faltantes
   ```

### Para Windows
1. Comparte el archivo `.exe`
2. El usuario ejecuta el instalador y sigue las instrucciones
3. La aplicación se instalará en `C:\Users\[Usuario]\AppData\Local\Programs\edusmart-app\`

### Para macOS
1. Comparte el archivo `.dmg`
2. El usuario abre el DMG y arrastra la aplicación a la carpeta Aplicaciones

## 🔧 Requisitos del Sistema

### Linux
- Ubuntu 18.04 o superior
- Debian 10 o superior
- Otras distribuciones basadas en Debian/Ubuntu

### Windows
- Windows 10 o superior
- 64-bit

### macOS
- macOS 10.13 o superior
- Intel o Apple Silicon

## 📝 Notas de Distribución

- Los archivos son **portables** y no requieren conexión a internet después de la instalación
- Todos los datos se guardan localmente en el sistema del usuario
- No se requiere registro ni activación
- La aplicación funciona completamente offline

## 🛠️ Solución de Problemas

### Error al ejecutar AppImage
```bash
chmod +x eduSmart-1.0.0.AppImage
./eduSmart-1.0.0.AppImage
```

### Error de dependencias en DEB
```bash
sudo apt-get install -f
```

### La aplicación no se abre
- Verifica que el archivo tenga permisos de ejecución
- En Linux, asegúrate de que FUSE esté instalado para AppImage

## 📧 Soporte

Para problemas o preguntas sobre la distribución, contacta al equipo de desarrollo.

