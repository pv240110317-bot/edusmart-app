#!/bin/bash

# Script para monitorear cambios y reconstruir automáticamente
# Requiere: inotify-tools (sudo apt install inotify-tools)
# Uso: ./watch-build.sh

echo "👀 Monitoreando cambios en el código..."
echo "Presiona Ctrl+C para detener"
echo ""

# Verificar si inotifywait está instalado
if ! command -v inotifywait &> /dev/null; then
    echo "❌ inotifywait no está instalado"
    echo "Instala con: sudo apt install inotify-tools"
    exit 1
fi

# Directorios a monitorear
WATCH_DIRS="components contexts Login.jsx App.jsx main.jsx"

# Función para construir
build() {
    echo ""
    echo "🔄 Cambios detectados, reconstruyendo..."
    ./auto-build.sh
    echo ""
    echo "👀 Monitoreando cambios..."
}

# Construir inicialmente
build

# Monitorear cambios
while inotifywait -r -e modify,create,delete $WATCH_DIRS 2>/dev/null; do
    build
done

