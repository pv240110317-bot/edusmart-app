# 📱 Acceso Rápido desde Móvil

## ✅ Tu IP es: **192.168.100.12**

## 🚀 Pasos para Acceder:

1. **Asegúrate de que tu teléfono esté en la misma red WiFi que tu computadora**

2. **Abre el navegador en tu teléfono** (Chrome, Safari, Firefox, etc.)

3. **Escribe en la barra de direcciones:**
   ```
   http://192.168.100.12:5173
   ```

4. **¡Listo!** Deberías ver la aplicación eduSmart

## 🔧 Si no funciona:

### Verificar que el servidor esté corriendo:
```bash
# En la terminal de tu computadora
npm run dev
```

### Verificar el firewall:
```bash
# Permitir el puerto 5173
sudo ufw allow 5173
```

### Verificar la IP:
```bash
hostname -I
```

## 📝 Notas:

- El servidor debe estar corriendo en tu computadora
- Ambos dispositivos deben estar en la misma red WiFi
- Si cambias de red, la IP puede cambiar
- Para detener el servidor: `Ctrl + C` en la terminal

## 🎯 URL de Acceso:

**http://192.168.100.12:5173**

---

**¡Disfruta usando eduSmart desde tu móvil!** 📱✨

