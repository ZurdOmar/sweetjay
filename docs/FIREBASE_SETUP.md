# 🔥 Guía de Configuración de Firebase

Esta guía te explica cómo configurar Firebase para el proyecto Sweetjay.

---

## 📋 Índice

1. [Crear Proyecto en Firebase](#1-crear-proyecto-en-firebase)
2. [Habilitar Servicios](#2-habilitar-servicios)
3. [Obtener Credenciales](#3-obtener-credenciales)
4. [Configurar Firestore](#4-configurar-firestore)
5. [Configurar Storage](#5-configurar-storage)
6. [Configurar Authentication](#6-configurar-authentication)
7. [Configurar Hosting](#7-configurar-hosting)
8. [Estructura de Datos](#8-estructura-de-datos)
9. [Reglas de Seguridad](#9-reglas-de-seguridad)
10. [Solución de Problemas](#10-solución-de-problemas)

---

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz click en **"Add project"** o **"Crear proyecto"**
3. Ponle nombre (ej. `sweetjay-official`)
4. Desactiva Google Analytics (no es necesario por ahora)
5. Haz click en **"Create project"**

---

## 2. Habilitar Servicios

En el menú izquierdo, habilita estos servicios:

### Firestore Database
1. Click en **"Build"** → **"Firestore Database"**
2. Click en **"Create database"**
3. Selecciona **"Start in test mode"** (luego actualizaremos las reglas)
4. Elige la ubicación: `nam5` (United States)

### Storage
1. Click en **"Build"** → **"Storage"**
2. Click en **"Get started"**
3. Click en **"Next"** y **"Done"**

### Authentication
1. Click en **"Build"** → **"Authentication"**
2. Click en **"Get started"**
3. En la pestaña **"Sign-in method"**, habilita **"Email/Password"**

### Hosting
1. Click en **"Build"** → **"Hosting"**
2. Click en **"Get started"**
3. Sigue las instrucciones (luego lo configuramos desde la CLI)

---

## 3. Obttener Credenciales

1. Click en el ícono de **engranaje** ⚙️ (Project Settings)
2. Baja hasta **"Your apps"**
3. Click en el ícono de **web** `</>`
4. Registra la app con el nombre: `Sweetjay Web`
5. Copia las credenciales que te da Firebase

### Ejemplo de credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "sweetjay-official.firebaseapp.com",
  projectId: "sweetjay-official",
  storageBucket: "sweetjay-official.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### Crear archivo `.env`

En la raíz del proyecto, crea un archivo `.env` con:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=sweetjay-official.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sweetjay-official
VITE_FIREBASE_STORAGE_BUCKET=sweetjay-official.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

> ⚠️ **Importante:** Nunca subas el archivo `.env` a Git. Ya está en `.gitignore`.

---

## 4. Configurar Firestore

### Crear Colecciones

Después de crear la base de datos, necesitas crear estas colecciones:

| Colección | Cómo se llena |
|-----------|---------------|
| `images` | Se llena desde el panel de admin |
| `carousel` | Se llena desde el panel de admin |
| `music` | Se llena desde el panel de admin |
| `events` | Se llena desde el panel de admin |
| `videos` | Se llena desde el panel de admin |
| `concerts` | Se llena desde el panel de admin |
| `ads` | Se llena desde el panel de admin |
| `promotions` | Se llena desde el panel de admin |
| `messages` | Se llena automáticamente cuando alguien envía el formulario de contacto |
| `settings` | Se crea manualmente (ver abajo) |

### Documento `settings`

En la colección `settings`, crea estos documentos manualmente:

#### `eventsInfo`
```json
{
  "title": "Tour 2025",
  "description": "Prepárate para vivir la experiencia de Sweetjay en vivo.",
  "footer": "Próximamente más fechas...",
  "isVisible": true
}
```

#### `concertsInfo`
```json
{
  "title": "Vivo",
  "description": "Revive la intensidad y la energía pura de Sweetjay.",
  "isVisible": true
}
```

#### `bioInfo`
```json
{
  "title": "Originario de Colima, 27 años",
  "content": "Sweetjay es un apasionado de la música...",
  "highlights": []
}
```

#### `activePromotion`
```json
{
  "url": "https://ejemplo.com/promo.jpg",
  "link": "https://ejemplo.com",
  "name": "Promoción Especial"
}
```

#### `activeMusic`
```json
{
  "url": "https://storage.googleapis.com/.../cancion.mp3",
  "name": "El Don"
}
```

---

## 5. Configurar Storage

### Crear Buckets

Storage se usa para almacenar:
- Imágenes de la galería
- Imágenes del carrusel
- Archivos de música (MP3)
- Videos de conciertos
- Banners de promociones

### Pasos:

1. Ve a **Storage** en Firebase Console
2. Los archivos se subirán automáticamente desde el panel de admin
3. Puedes verlos en la pestaña **"Files"**

### Estructura de carpetas (automática):

```
/
├── images/
│   └── imagen123.jpg
├── carousel/
│   └── slide456.jpg
├── music/
│   └── cancion789.mp3
├── concerts/
│   └── video012.mp4
└── ads/
    └── banner345.jpg
```

---

## 6. Configurar Authentication

### Emails Autorizados

Los únicos emails que pueden acceder al admin están en el código:

**Archivo:** `src/components/Admin.tsx` (línea ~155)

```typescript
const authorizedEmails = ['morentinomar@gmail.com', 'jeranmp@gmail.com'];
```

Para agregar más emails:
1. Abre `src/components/Admin.tsx`
2. Agrega el email al array
3. Haz deploy de nuevo

### Flujo de Login

1. El admin pone su email
2. Firebase envía un "email mágico" con enlace
3. El admin hace click en el enlace
4. Se autologa automáticamente

**Ventaja:** No necesita contraseña

---

## 7. Configurar Hosting

### Desde Firebase CLI

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Iniciar sesión:**
   ```bash
   firebase login
   ```

3. **Inicializar proyecto (solo la primera vez):**
   ```bash
   firebase init
   ```
   
   Selecciona:
   - ✅ Hosting
   - ✅ Use existing project (el que creaste)
   - ✅ `dist` como directorio público
   - ✅ Yes (single-page app)
   - ✅ No (GitHub)

4. **Hacer deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Dominio Personalizado

1. Ve a **Hosting** → **Add custom domain**
2. Escribe tu dominio (ej. `sweetjay.com.mx`)
3. Firebase te dará registros DNS
4. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
5. Agrega los registros DNS
6. Espera la propagación (1-48 horas)
7. Regresa a Firebase y verifica

---

## 8. Estructura de Datos

### Colección: `images`
```typescript
{
  url: string,        // URL de la imagen en Storage
  createdAt: number   // Timestamp de Firebase
}
```

### Colección: `carousel`
```typescript
{
  url: string,        // URL de la imagen en Storage
  order: number,      // Orden en el carrusel (0 = primero)
  createdAt: number   // Timestamp
}
```

### Colección: `music`
```typescript
{
  url: string,        // URL del MP3 en Storage
  name: string,       // Nombre de la canción
  createdAt: number   // Timestamp
}
```

### Colección: `events`
```typescript
{
  url: string,        // URL de la imagen del evento
  createdAt: number   // Timestamp
}
```

### Colección: `videos`
```typescript
{
  url: string,        // URL de YouTube (ej. https://youtube.com/watch?v=...)
  createdAt: number   // Timestamp
}
```

### Colección: `concerts`
```typescript
{
  url: string,        // URL del video en Storage
  createdAt: number   // Timestamp
}
```

### Colección: `ads`
```typescript
{
  url: string,        // URL del banner en Storage
  createdAt: number   // Timestamp
}
```

### Colección: `promotions`
```typescript
{
  url: string,        // URL de la promoción en Storage
  link?: string,      // Link opcional al hacer click
  name?: string,      // Nombre de la promoción
  createdAt: number   // Timestamp
}
```

### Colección: `messages`
```typescript
{
  name: string,       // Nombre del contacto
  email: string,      // Email del contacto
  message: string,    // Mensaje
  createdAt: number   // Timestamp
}
```

---

## 9. Reglas de Seguridad

### Firestore Rules (`firestore.rules`)

Las reglas actuales permiten:
- ✅ **Lectura pública:** Cualquiera puede leer los datos
- ✅ **Escritura autenticada:** Solo usuarios logueados pueden escribir

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

### Storage Rules (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### ⚠️ Importante

Estas reglas son para **desarrollo**. Para producción, considera:
- Limitar escritura a emails específicos
- Validar tipos de archivos
- Limitar tamaño de archivos

---

## 10. Solución de Problemas

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Causa:** El archivo `.env` no existe o tiene valores incorrectos.

**Solución:**
1. Verifica que `.env` existe en la raíz
2. Verifica que todas las variables están completas
3. Reinicia el servidor de desarrollo

### Error: "Permission denied" al subir archivos

**Causa:** Las reglas de Storage no permiten escritura.

**Solución:**
1. Ve a Firebase Console → Storage → Rules
2. Asegúrate de tener: `allow write: if request.auth != null;`
3. Publica los cambios

### El login por email no funciona

**Causa:** Authentication no está habilitado o el email no está autorizado.

**Solución:**
1. Verifica que Authentication está habilitado
2. Verifica que el método "Email/Password" está activo
3. Agrega el email al array `authorizedEmails` en `Admin.tsx`

### Los datos no se ven en el sitio

**Causa:** Firestore está vacío o las reglas no permiten lectura.

**Solución:**
1. Ve a Firebase Console → Firestore
2. Verifica que las colecciones existen y tienen datos
3. Verifica las reglas: `allow read: if true;`

### Error: "API not enabled"

**Causa:** Algún servicio de Firebase no está habilitado.

**Solución:**
1. Ve a Firebase Console
2. Asegúrate de habilitar: Firestore, Storage, Authentication, Hosting
3. Espera unos minutos y retry

---

## 📞 Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

*Última actualización: Marzo 2026*
