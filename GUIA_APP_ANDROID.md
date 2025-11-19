# 📱 Guía para Crear App Android de eduSmart

## 🚀 Construcción Rápida

```bash
./build-android.sh
```

O manualmente:
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

El APK estará en: `release/eduSmart-1.0.0.apk`

## 📋 Requisitos Previos

### 1. Java JDK 11 o superior
```bash
sudo apt install openjdk-11-jdk
```

### 2. Android Studio (opcional, para desarrollo)
- Descargar de: https://developer.android.com/studio
- O usar solo la línea de comandos

### 3. Android SDK
```bash
# Instalar Android SDK Command Line Tools
sudo apt install android-sdk
```

## 🔧 Configuración

### 1. Variables de Entorno
Agrega a `~/.bashrc` o `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Aceptar Licencias
```bash
yes | sdkmanager --licenses
```

## 📦 Distribución Interna

### Opción 1: Servidor Web Local
1. Coloca el APK en la carpeta `dist/` o `public/`
2. El botón de descarga en el login apuntará a: `/eduSmart-1.0.0.apk`
3. Los usuarios pueden descargar directamente desde el navegador

### Opción 2: Compartir Archivo
1. Comparte el APK desde `release/eduSmart-1.0.0.apk`
2. Los usuarios lo transfieren a su teléfono
3. Instalan manualmente

### Opción 3: QR Code
1. Genera un QR code con la URL del APK
2. Los usuarios escanean y descargan

## 🔐 Instalación en Dispositivos

### Para el Usuario:
1. **Activar fuentes desconocidas:**
   - Configuración → Seguridad → Fuentes desconocidas (activar)
   - O en Android 8+: Permitir desde esta fuente

2. **Instalar APK:**
   - Abrir el archivo APK
   - Tocar "Instalar"
   - Aceptar permisos

3. **Usar la app:**
   - Abrir eduSmart
   - Iniciar sesión normalmente

## 🛠️ Desarrollo

### Abrir en Android Studio:
```bash
npm run android:dev
```

### Construir APK de Debug:
```bash
cd android
./gradlew assembleDebug
```

### Construir APK Firmado (Producción):
1. Crear keystore:
```bash
keytool -genkey -v -keystore edusmart-release.keystore -alias edusmart -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurar en `android/app/build.gradle`

## 📝 Notas Importantes

- **Versión interna:** La app es para uso interno de la institución
- **Sin Play Store:** No se publicará en Google Play
- **Actualizaciones:** Los usuarios deben descargar nuevas versiones manualmente
- **Permisos:** La app puede requerir permisos de almacenamiento para archivos

## 🔄 Actualizar la App

1. Hacer cambios en el código
2. Ejecutar `./build-android.sh`
3. Distribuir el nuevo APK
4. Los usuarios instalan sobre la versión anterior

## ⚠️ Solución de Problemas

**Error: "SDK location not found"**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

**Error: "Gradle not found"**
```bash
cd android
./gradlew wrapper
```

**Error: "License not accepted"**
```bash
yes | sdkmanager --licenses
```

---

**¡Listo para distribuir la app Android!** 📱✨

