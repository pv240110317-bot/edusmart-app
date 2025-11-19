# 📦 Guía para Actualizar Manualmente los Archivos de Distribución

Esta guía te explica cómo actualizar los archivos `.deb` y `.AppImage` después de hacer cambios en el código.

## 🚀 Método 1: Usando el Script Automático (Más Fácil)

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd /home/agualoka/Escritorio/cultura

# 2. Ejecuta el script de construcción
./build-dist.sh
```

O si el script no tiene permisos de ejecución:
```bash
chmod +x build-dist.sh
./build-dist.sh
```

## 🔧 Método 2: Usando npm directamente

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd /home/agualoka/Escritorio/cultura

# 2. Limpia builds anteriores (opcional pero recomendado)
rm -rf dist release

# 3. Construye la aplicación
npm run build

# 4. Construye los ejecutables con Electron
npm run electron:build
```

O en un solo comando:
```bash
npm run dist:linux
```

## 📝 Método 3: Paso a Paso Detallado

### Paso 1: Navegar al directorio del proyecto
```bash
cd /home/agualoka/Escritorio/cultura
```

### Paso 2: Limpiar builds anteriores (opcional)
```bash
rm -rf dist release
```
Esto elimina las carpetas `dist/` y `release/` para asegurar una construcción limpia.

### Paso 3: Construir la aplicación web
```bash
npm run build
```
Esto crea la carpeta `dist/` con los archivos compilados.

### Paso 4: Construir los ejecutables
```bash
npm run electron:build
```
O específicamente para Linux:
```bash
npm run electron:build:linux
```

### Paso 5: Verificar los archivos generados
```bash
ls -lh release/
```
Deberías ver:
- `eduSmart-1.0.0.AppImage`
- `edusmart-app_1.0.0_amd64.deb`

## ⚠️ Requisitos Previos

Asegúrate de tener instalado:
- Node.js y npm
- Todas las dependencias del proyecto instaladas:
  ```bash
  npm install
  ```

## 🔍 Verificar que Funcionó

Después de construir, verifica que los archivos se crearon:

```bash
# Ver tamaño y fecha de los archivos
ls -lh release/*.AppImage release/*.deb

# Verificar que los archivos existen
test -f release/eduSmart-1.0.0.AppImage && echo "✅ AppImage creado" || echo "❌ Error"
test -f release/edusmart-app_1.0.0_amd64.deb && echo "✅ DEB creado" || echo "❌ Error"
```

## 📋 Resumen de Comandos Rápidos

```bash
# Opción más rápida (todo en uno)
cd /home/agualoka/Escritorio/cultura && ./build-dist.sh

# O usando npm directamente
cd /home/agualoka/Escritorio/cultura && npm run dist:linux

# O paso a paso
cd /home/agualoka/Escritorio/cultura
rm -rf dist release
npm run build
npm run electron:build
```

## 🐛 Solución de Problemas

### Error: "command not found: npm"
```bash
# Instala Node.js y npm primero
sudo apt update
sudo apt install nodejs npm
```

### Error: "Permission denied"
```bash
# Da permisos de ejecución al script
chmod +x build-dist.sh
```

### Error: "Cannot find module"
```bash
# Instala las dependencias
npm install
```

### Los archivos no se actualizan
```bash
# Limpia todo y reconstruye
rm -rf dist release node_modules/.vite
npm install
npm run build
npm run electron:build
```

## 📍 Ubicación de los Archivos Finales

Después de construir, los archivos estarán en:
- **AppImage**: `release/eduSmart-1.0.0.AppImage`
- **DEB**: `release/edusmart-app_1.0.0_amd64.deb`

## 💡 Consejos

1. **Siempre limpia antes de construir** para evitar problemas con archivos antiguos
2. **Verifica los archivos** después de construir para asegurarte de que se crearon correctamente
3. **Prueba los archivos** antes de distribuirlos
4. **Mantén las dependencias actualizadas**: `npm update`

