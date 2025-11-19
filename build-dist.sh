#!/bin/bash

echo "🚀 Construyendo aplicación para distribución interna..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# Limpiar builds anteriores
echo -e "${YELLOW}🧹 Limpiando builds anteriores...${NC}"
rm -rf dist release

# Construir la aplicación
echo -e "${BLUE}📦 Construyendo aplicación...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la aplicación"
    exit 1
fi

# Construir con Electron
echo -e "${BLUE}⚡ Construyendo ejecutable con Electron...${NC}"
npm run electron:build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ¡Aplicación construida exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}📁 Los archivos están en la carpeta 'release/':${NC}"
    ls -lh release/ 2>/dev/null || echo "   (La carpeta release se creará después de la construcción)"
    echo ""
    echo -e "${YELLOW}💡 Para distribuir:${NC}"
    echo "   - Linux: Comparte el archivo .AppImage o .deb de la carpeta release/"
    echo "   - Windows: Comparte el instalador .exe"
    echo "   - macOS: Comparte el archivo .dmg"
    echo ""
else
    echo "❌ Error al construir el ejecutable"
    exit 1
fi

