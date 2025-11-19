#!/bin/bash

# Script para actualizar automáticamente el .deb cuando se modifica el código
# Uso: ./auto-build.sh

echo "🔄 Actualizando archivos de distribución automáticamente..."
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Limpiar builds anteriores
echo "🧹 Limpiando archivos anteriores..."
rm -rf dist release

# Construir
echo "📦 Construyendo aplicación..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la aplicación"
    exit 1
fi

# Construir con Electron (solo Linux/Debian)
echo "⚡ Construyendo ejecutable .deb..."
npm run electron:build:linux

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Actualización completada!"
    echo ""
    echo "📁 Archivo .deb actualizado en: release/edusmart-app_1.0.0_amd64.deb"
    ls -lh release/*.deb 2>/dev/null
    echo ""
    echo "💡 El archivo .deb está listo para distribuir"
else
    echo ""
    echo "❌ Error en la construcción del .deb"
    exit 1
fi

