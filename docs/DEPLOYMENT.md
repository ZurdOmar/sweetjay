# 🚀 Guía de Deployment

Esta guía explica cómo subir el sitio a producción paso a paso.

---

## 📋 Índice

1. [Requisitos Previos](#1-requisitos-previos)
2. [Preparar el Proyecto](#2-preparar-el-proyecto)
3. [Build para Producción](#3-build-para-producción)
4. [Deploy a Firebase Hosting](#4-deploy-a-firebase-hosting)
5. [Deploy de Reglas y Base de Datos](#5-deploy-de-reglas-y-base-de-datos)
6. [Verificar el Deploy](#6-verificar-el-deploy)
7. [Dominio Personalizado](#7-dominio-personalizado)
8. [Rollback (Volver a Versión Anterior)](#8-rollback-volver-a-versión-anterior)
9. [Solución de Problemas](#9-solución-de-problemas)

---

## 1. Requisitos Previos

### Tener instalado

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Firebase CLI**

### Verificar instalaciones

```bash
node --version    # Debe ser v18+
npm --version     # Debe ser v8+
firebase --version # Debe ser v10+
```

### Instalar Firebase CLI (si no la tienes)

```bash
npm install -g firebase-tools
```

### Iniciar sesión en Firebase

```bash
firebase login
```

Se abrirá el navegador. Inicia sesión con tu cuenta de Google.

---

## 2. Preparar el Proyecto

### Verificar que estás en la carpeta correcta

```bash
cd c:\Users\USUARIO\MisProyectos\sweetjay
```

### Verificar el proyecto Firebase

```bash
firebase projects:list
```

Deberías ver `sweetjay-official` (o el nombre de tu proyecto).

### Seleccionar el proyecto

```bash
firebase use sweetjay-official
```

> Cambia `sweetjay-official` por el ID de tu proyecto si es diferente.

### Verificar archivo `.firebaserc`

El archivo debe tener:

```json
{
  "projects": {
    "default": "sweetjay-official"
  }
}
```

---

## 3. Build para Producción

### Limpiar build anterior (opcional pero recomendado)

```bash
# En Windows (PowerShell)
Remove-Item -Recurse -Force dist

# En Windows (CMD)
rmdir /s /q dist

# En Mac/Linux
rm -rf dist
```

### Ejecutar build

```bash
npm run build
```

### Verificar que el build fue exitoso

Deberías ver algo como:

```
✓ built in 3.18s
```

Y debería existir la carpeta `dist/` con:

```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.css
│   └── index-xxxxx.js
└── images/ (si hay archivos estáticos)
```

### Vista previa local del build (opcional)

```bash
npm run preview
```

Abre `http://localhost:4173` para ver cómo se verá en producción.

---

## 4. Deploy a Firebase Hosting

### Deploy solo de Hosting

```bash
firebase deploy --only hosting
```

### Output esperado

```
=== Deploying to 'sweetjay-official'...

i  deploying hosting
i  hosting[sweetjay-official]: beginning deploy...
i  hosting[sweetjay-official]: found 44 files in dist
+  hosting[sweetjay-official]: file upload complete
i  hosting[sweetjay-official]: finalizing version...
+  hosting[sweetjay-official]: version finalized
i  hosting[sweetjay-official]: releasing new version...
+  hosting[sweetjay-official]: release complete

+  Deploy complete!

Project Console: https://console.firebase.google.com/project/sweetjay-official/overview
Hosting URL: https://sweetjay-official.web.app
```

### URLs después del deploy

- **Producción:** `https://sweetjay-official.web.app`
- **Consola:** `https://console.firebase.google.com/project/sweetjay-official/overview`

---

## 5. Deploy de Reglas y Base de Datos

### Deploy completo (Hosting + Firestore + Storage + Reglas)

```bash
firebase deploy
```

### Deploy solo de reglas de Firestore

```bash
firebase deploy --only firestore:rules
```

### Deploy solo de reglas de Storage

```bash
firebase deploy --only storage:rules
```

### Deploy solo de Firestore (índices)

```bash
firebase deploy --only firestore:indexes
```

---

## 6. Verificar el Deploy

### En el navegador

1. Abre `https://sweetjay-official.web.app`
2. Verifica que:
   - El sitio carga correctamente
   - Las imágenes se ven
   - El music player funciona
   - El formulario de contacto está visible

### En Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Hosting**
4. Verifica:
   - La versión más reciente
   - Los archivos subidos
   - El estado: `Active`

### Ver historial de deploys

```bash
firebase hosting:channel:list
```

---

## 7. Dominio Personalizado

### Agregar dominio en Firebase Console

1. Ve a **Hosting** → **Add custom domain**
2. Escribe tu dominio: `sweetjay.com.mx`
3. Click en **Next**

### Configurar DNS

Firebase te dará registros DNS. Agrega estos en tu proveedor de dominio:

#### Registro A (raíz)
```
Tipo: A
Nombre: @
Valor: 199.36.158.100
TTL: 3600
```

#### Registro A (www)
```
Tipo: A
Nombre: www
Valor: 199.36.158.100
TTL: 3600
```

### Verificar dominio

1. Regresa a Firebase Console
2. Click en **Verify**
3. Espera la propagación (puede tardar 1-48 horas)

### Forzar HTTPS (recomendado)

En Firebase Console → Hosting:
- ✅ **Redirect site to HTTPS**

### URL final

- **Principal:** `https://sweetjay.com.mx`
- **Redirección:** `https://www.sweetjay.com.mx` → `https://sweetjay.com.mx`

---

## 8. Rollback (Volver a Versión Anterior)

### Ver historial de versiones

```bash
firebase hosting:releases:list
```

### Hacer rollback

```bash
firebase hosting:rollback
```

Te preguntará qué versión quieres restaurar.

### Opción manual desde Console

1. Ve a Firebase Console → Hosting
2. Click en **Release history**
3. Encuentra la versión anterior
4. Click en **Rollback**

---

## 9. Solución de Problemas

### Error: "Not logged in"

```bash
firebase login
```

### Error: "Project not found"

```bash
firebase projects:list
firebase use <nombre-del-proyecto>
```

### Error: "Build failed"

```bash
# Verifica errores de TypeScript
npx tsc --noEmit

# Limpia y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### El deploy falla a la mitad

```bash
# Intenta de nuevo
firebase deploy --only hosting

# Si persiste, verifica tu conexión a internet
```

### Los cambios no se ven después del deploy

1. **Limpia caché del navegador:** Ctrl + Shift + Supr
2. **Espera 1-2 minutos:** Firebase CDN puede tardar
3. **Prueba en modo incógnito:** Ctrl + Shift + N

### Error: "API not enabled"

1. Ve a Firebase Console
2. Asegúrate de habilitar todos los servicios
3. Espera unos minutos
4. Intenta de nuevo

### Error: "Permission denied" en Firestore

Verifica las reglas en `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy de nuevas reglas:

```bash
firebase deploy --only firestore:rules
```

---

## 10. Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `firebase login` | Inicia sesión en Firebase |
| `firebase logout` | Cierra sesión |
| `firebase projects:list` | Lista tus proyectos |
| `firebase use <id>` | Selecciona proyecto activo |
| `npm run build` | Compila para producción |
| `firebase deploy` | Deploy completo |
| `firebase deploy --only hosting` | Solo hosting |
| `firebase hosting:rollback` | Volver a versión anterior |
| `firebase hosting:channel:list` | Ver canales de deploy |

---

## 11. Checklist Pre-Deploy

Antes de hacer deploy, verifica:

- [ ] El build funciona localmente (`npm run build`)
- [ ] Probaste el build (`npm run preview`)
- [ ] El archivo `.env` tiene las variables correctas
- [ ] Las reglas de Firestore están actualizadas
- [ ] Las reglas de Storage están actualizadas
- [ ] El proyecto Firebase está seleccionado (`firebase use`)
- [ ] Tienes permisos de escritor en el proyecto

---

## 12. Flujo de Trabajo Recomendado

### Para cambios pequeños

```bash
# 1. Hacer cambios en el código
# 2. Build
npm run build

# 3. Deploy
firebase deploy --only hosting
```

### Para cambios grandes

```bash
# 1. Hacer cambios en el código
# 2. Test local
npm run dev

# 3. Build
npm run build

# 4. Preview del build
npm run preview

# 5. Deploy
firebase deploy
```

### Para cambios en reglas de seguridad

```bash
# 1. Editar firestore.rules o storage.rules
# 2. Deploy de reglas
firebase deploy --only firestore:rules,storage:rules
```

---

*Última actualización: Marzo 2026*
