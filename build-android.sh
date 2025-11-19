#!/bin/bash

# Script para construir la app Android
# Uso: ./build-android.sh

echo "🤖 Construyendo aplicación Android..."
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Verificar y configurar JAVA_HOME si no está configurado
if [ -z "$JAVA_HOME" ]; then
    echo "🔍 JAVA_HOME no está configurado, buscando Java..."
    
    # Buscar Java en ubicaciones comunes
    if [ -d "/usr/lib/jvm/java-11-openjdk-amd64" ]; then
        export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
        export PATH=$PATH:$JAVA_HOME/bin
        echo "✅ Java encontrado: $JAVA_HOME"
    elif [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
        export PATH=$PATH:$JAVA_HOME/bin
        echo "✅ Java encontrado: $JAVA_HOME"
    elif [ -d "/usr/lib/jvm/java-21-openjdk-amd64" ]; then
        export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
        export PATH=$PATH:$JAVA_HOME/bin
        echo "✅ Java encontrado: $JAVA_HOME"
    else
        echo "❌ Java no encontrado. Por favor instala Java JDK:"
        echo "   sudo apt install openjdk-11-jdk"
        echo "   export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"
        exit 1
    fi
else
    echo "✅ JAVA_HOME ya está configurado: $JAVA_HOME"
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf dist android/app/build

# Construir la aplicación web
echo "📦 Construyendo aplicación web..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al construir la aplicación"
    exit 1
fi

# Sincronizar con Capacitor
echo "🔄 Sincronizando con Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Error al sincronizar con Capacitor"
    exit 1
fi

# Construir APK
echo "🔨 Construyendo APK..."
cd android
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡APK construido exitosamente!"
    echo ""
    
    # Copiar APK a release y public
    mkdir -p ../release ../public
    cp app/build/outputs/apk/release/app-release.apk ../release/eduSmart-1.0.0.apk
    cp app/build/outputs/apk/release/app-release.apk ../public/eduSmart-1.0.0.apk
    
    echo "📁 APK disponible en:"
    echo "   - release/eduSmart-1.0.0.apk (para distribución)"
    echo "   - public/eduSmart-1.0.0.apk (para descarga desde la web)"
    ls -lh ../release/eduSmart-1.0.0.apk ../public/eduSmart-1.0.0.apk 2>/dev/null
    echo ""
    echo "💡 Para instalar en un dispositivo:"
    echo "   1. Transfiere el APK a tu teléfono"
    echo "   2. Activa 'Instalar desde fuentes desconocidas'"
    echo "   3. Abre el APK e instala"
else
    echo ""
    echo "❌ Error al construir el APK"
    exit 1
fi

