#!/bin/bash

# Script simple para actualizar los archivos de distribución
# Uso: ./actualizar.sh

echo "🔄 Actualizando archivos de distribución..."
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Limpiar builds anteriores
echo "🧹 Limpiando archivos anteriores..."
rm -rf dist release

# Construir
echo "📦 Construyendo aplicación..."
npm run build && npm run electron:build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Actualización completada!"
    echo ""
    echo "📁 Archivos en: release/"
    ls -lh release/*.AppImage release/*.deb 2>/dev/null
else
    echo ""
    echo "❌ Error en la construcción"
    exit 1
fi

