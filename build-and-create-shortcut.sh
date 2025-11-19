#!/bin/bash

echo "🔨 Construyendo la aplicación..."
cd "$(dirname "$0")"

# Construir la aplicación
npm run electron:build

if [ $? -eq 0 ]; then
    echo "✅ Aplicación construida exitosamente"
    
    # Buscar el ejecutable generado
    EXECUTABLE=$(find release -name "*.AppImage" -o -name "edusmart-app" -type f | head -n 1)
    
    if [ -n "$EXECUTABLE" ]; then
        echo "📝 Creando acceso directo al ejecutable..."
        
        # Crear acceso directo para el ejecutable
        cat > edusmart-executable.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=eduSmart
Comment=Aplicación de Asesoría en Línea e IA
Exec=$(realpath "$EXECUTABLE")
Icon=application-x-executable
Terminal=false
Categories=Education;
StartupNotify=true
EOF
        
        chmod +x edusmart-executable.desktop
        
        # Copiar al escritorio
        if [ -d ~/Escritorio ]; then
            cp edusmart-executable.desktop ~/Escritorio/
            echo "✅ Acceso directo creado en ~/Escritorio/"
        elif [ -d ~/Desktop ]; then
            cp edusmart-executable.desktop ~/Desktop/
            echo "✅ Acceso directo creado en ~/Desktop/"
        fi
        
        echo "🎉 ¡Listo! Puedes ejecutar la app desde el acceso directo"
    else
        echo "⚠️  No se encontró el ejecutable. Revisa la carpeta release/"
    fi
else
    echo "❌ Error al construir la aplicación"
    exit 1
fi

