# 📦 Guía de Distribución Interna - eduSmart

## 🎯 Distribución Rápida

### Paso 1: Construir la Aplicación

```bash
./build-dist.sh
```

O manualmente:

```bash
npm run dist:linux    # Para Linux
npm run electron:build:win  # Para Windows  
npm run electron:build:mac  # Para macOS
```

### Paso 2: Encontrar los Archivos

Los ejecutables estarán en la carpeta `release/`:

```
release/
├── eduSmart-1.0.0.AppImage    (Linux - Portable)
├── eduSmart_1.0.0_amd64.deb    (Linux - Instalador)
├── eduSmart Setup 1.0.0.exe   (Windows)
└── eduSmart-1.0.0.dmg          (macOS)
```

## 📤 Compartir con Usuarios

### Opción A: AppImage (Linux - Más Fácil)
1. Comparte el archivo `.AppImage`
2. El usuario hace doble clic o ejecuta:
   ```bash
   chmod +x eduSmart-1.0.0.AppImage
   ./eduSmart-1.0.0.AppImage
   ```

### Opción B: DEB (Linux - Instalación Permanente)
1. Comparte el archivo `.deb`
2. El usuario instala:
   ```bash
   sudo dpkg -i eduSmart_1.0.0_amd64.deb
   ```

### Opción C: Windows
1. Comparte el `.exe`
2. El usuario ejecuta el instalador

### Opción D: macOS
1. Comparte el `.dmg`
2. El usuario arrastra a Aplicaciones

## 🚀 Crear Acceso Directo (Linux)

Después de instalar el DEB, puedes crear un acceso directo:

```bash
# Crear acceso directo en el escritorio
cat > ~/Escritorio/eduSmart.desktop << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=eduSmart
Exec=/opt/edusmart-app/edusmart-app
Icon=edusmart-app
Terminal=false
Categories=Education;
EOF

chmod +x ~/Escritorio/eduSmart.desktop
```

## 📋 Checklist de Distribución

- [ ] Construir la aplicación (`./build-dist.sh`)
- [ ] Verificar que los archivos estén en `release/`
- [ ] Probar el ejecutable en un sistema limpio
- [ ] Crear instrucciones para usuarios finales
- [ ] Compartir archivos por red interna/USB/cloud
- [ ] Documentar requisitos del sistema

## 🔒 Seguridad

- Los ejecutables son firmados (si configuras certificados)
- No requieren permisos de administrador para ejecutarse (AppImage)
- Todos los datos se guardan localmente

## 📊 Tamaños Aproximados

- AppImage: ~150-200 MB
- DEB: ~150-200 MB
- Windows EXE: ~150-200 MB
- macOS DMG: ~150-200 MB

## 💡 Recomendaciones

1. **Para distribución masiva**: Usa AppImage (no requiere instalación)
2. **Para instalación permanente**: Usa DEB/EXE/DMG
3. **Para actualizaciones**: Considera un sistema de actualización automática
4. **Para múltiples usuarios**: Cada usuario tiene su propia instancia y datos

