# 🎵 Sweetjay Web - Sitio Oficial

Sitio web oficial del artista **Sweetjay**. Una experiencia inmersiva que incluye música, videos, galería, eventos y más.

---

## 📋 Índice

- [Demo](#demo)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Build para Producción](#build-para-producción)
- [Deploy a Firebase](#deploy-a-firebase)
- [Firebase - Configuración](#firebase---configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Útiles](#comandos-útiles)
- [Solución de Problemas](#solución-de-problemas)
- [Créditos](#créditos)

---

## 🌐 Demo

- **Producción:** [sweetjay.com.mx](https://sweetjay.com.mx)
- **Firebase Hosting:** [zotek-ia.web.app](https://zotek-ia.web.app)

---

## ✨ Características

### Para Visitantes
- ✅ **Landing page** con carrusel de imágenes animado
- ✅ **Reproductor de música** integrado (siempre visible)
- ✅ **Secciones:** Música, Eventos, Conciertos, Videos, Galería, Biografía, Contacto
- ✅ **Intro animada** de bienvenida
- ✅ **Diseño responsive** (móvil, tablet, desktop)
- ✅ **Animaciones suaves** con Framer Motion

### Para el Administrador
- ✅ **Panel de admin** protegido con autenticación
- ✅ **Subir imágenes** a la galería y carrusel
- ✅ **Subir música** (archivos MP3)
- ✅ **Subir videos** (YouTube o archivos locales)
- ✅ **Gestionar eventos** y conciertos
- ✅ **Editar biografía** del artista
- ✅ **Ver mensajes** de contacto
- ✅ **Crear promociones** (modales y banners)

---

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Framework principal |
| **TypeScript** | 5.9.3 | Lenguaje con tipos |
| **Vite** | 7.2.4 | Build tool y dev server |
| **Tailwind CSS** | 3.4.17 | Estilos y diseño |
| **Framer Motion** | 12.30.0 | Animaciones |
| **Firebase** | 12.10.0 | Backend (Hosting, Firestore, Storage, Auth) |
| **React Router** | 7.13.1 | Navegación entre páginas |
| **Lucide React** | 0.563.0 | Íconos |
| **React Player** | 3.4.0 | Reproductor de video/audio |

---

## 📁 Estructura del Proyecto

```
sweetjay/
├── public/                     # Archivos estáticos (imágenes, íconos, etc.)
│   └── images/                 # Imágenes del sitio
├── src/
│   ├── components/             # Componentes de React
│   │   ├── Admin.tsx           # Panel de administración
│   │   ├── HeroCarousel.tsx    # Carrusel de la sección principal
│   │   ├── Intro.tsx           # Pantalla de intro
│   │   ├── MusicPlayer.tsx     # Reproductor de música
│   │   ├── PromotionModal.tsx  # Modal de promociones
│   │   └── PromotionBanner.tsx # Banner de promociones
│   ├── App.tsx                 # Componente principal (toda la landing page)
│   ├── App.css                 # Estilos específicos de App
│   ├── firebase.ts             # Configuración de Firebase
│   ├── index.css               # Estilos globales (Tailwind)
│   └── main.tsx                # Punto de entrada de la app
├── .firebaserc                 # Configuración del proyecto Firebase
├── firebase.json               # Configuración de hosting, firestore, storage
├── firestore.rules             # Reglas de seguridad de Firestore
├── storage.rules               # Reglas de seguridad de Storage
├── index.html                  # HTML principal
├── package.json                # Dependencias y scripts
├── tailwind.config.js          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración de Vite
```

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** versión 18 o superior ([descargar](https://nodejs.org/))
- **npm** (viene con Node.js)
- **Cuenta de Firebase** (gratis en [firebase.google.com](https://firebase.google.com/))

### Pasos

1. **Clonar o descargar el proyecto**
   ```bash
   cd sweetjay
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   
   Crea un archivo `.env` en la raíz del proyecto con:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

   > **Nota:** Estas credenciales se obtienen en Firebase Console → Project Settings → General → Tus apps → SDK setup and configuration → Config

4. **Verificar instalación**
   ```bash
   npm run dev
   ```
   Debería abrirse en `http://localhost:5173`

---

## 💻 Desarrollo

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

- Abre tu navegador en `http://localhost:5173`
- Los cambios se reflejan automáticamente (Hot Module Replacement)

### Acceder al Panel de Admin

1. Ve a `http://localhost:5173/admin`
2. Ingresa un email autorizado (configurado en `Admin.tsx`)
3. Recibirás un enlace mágico por email
4. Haz click en el enlace para iniciar sesión

---

## 📦 Build para Producción

### Compilar el proyecto

```bash
npm run build
```

Esto crea una carpeta `dist/` con:
- Archivos HTML, CSS y JS optimizados
- Assets minificados
- Listo para subir a cualquier hosting

### Vista previa del build

```bash
npm run preview
```

---

## 🚀 Deploy a Firebase

### Requisitos

1. **Tener Firebase CLI instalado:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Iniciar sesión en Firebase:**
   ```bash
   firebase login
   ```

3. **Seleccionar el proyecto:**
   ```bash
   firebase use sweetjay-official
   ```
   > Cambia `sweetjay-official` por el ID de tu proyecto Firebase

### Pasos para Deploy

1. **Compilar el proyecto:**
   ```bash
   npm run build
   ```

2. **Desplegar solo hosting:**
   ```bash
   firebase deploy --only hosting
   ```

3. **Desplegar todo (hosting + firestore + storage):**
   ```bash
   firebase deploy
   ```

### Ver el sitio en producción

Después del deploy, Firebase te dará una URL como:
```
Hosting URL: https://sweetjay-official.web.app
```

### Dominio Personalizado

Para conectar un dominio como `sweetjay.com.mx`:

1. Ve a Firebase Console → Hosting → Add custom domain
2. Sigue las instrucciones para agregar el dominio
3. Actualiza los DNS de tu dominio con los registros que Firebase te dé
4. Espera la propagación (puede tardar hasta 48 horas)

---

## 🔥 Firebase - Configuración

### Colecciones de Firestore

El proyecto usa las siguientes colecciones en Firestore:

| Colección | Propósito | Campos principales |
|-----------|-----------|-------------------|
| `images` | Galería de fotos | `url`, `createdAt` |
| `carousel` | Imágenes del carrusel principal | `url`, `order`, `createdAt` |
| `music` | Canciones | `url`, `name`, `createdAt` |
| `events` | Próximos eventos | `url`, `createdAt` |
| `videos` | Videos de YouTube | `url`, `createdAt` |
| `concerts` | Videos de conciertos | `url`, `createdAt` |
| `ads` | Anuncios/banners | `url`, `createdAt` |
| `promotions` | Promociones (modales) | `url`, `link`, `name`, `createdAt` |
| `messages` | Mensajes de contacto | `name`, `email`, `message`, `createdAt` |
| `settings` | Configuraciones varias | Documentos: `eventsInfo`, `concertsInfo`, `bioInfo`, `activePromotion`, `activeMusic` |

### Reglas de Seguridad

Las reglas están en:
- `firestore.rules` - Reglas de Firestore
- `storage.rules` - Reglas de Storage

**Importante:** Las reglas actuales permiten lectura pública y escritura solo para usuarios autenticados.

### Emails Autorizados

Los emails que pueden acceder al admin están en `src/components/Admin.tsx`:

```typescript
const authorizedEmails = ['morentinomar@gmail.com', 'jeranmp@gmail.com'];
```

Agrega o quita emails según necesites.

---

## 🔐 Variables de Entorno

### Archivo `.env` (no subir a Git)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Archivo `.env.example` (sí subir a Git)

Crea un archivo `.env.example` con los mismos nombres pero sin valores reales:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 📚 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Revisa errores de código |
| `firebase login` | Inicia sesión en Firebase |
| `firebase use <project-id>` | Selecciona proyecto Firebase |
| `firebase deploy` | Despliega todo |
| `firebase deploy --only hosting` | Despliega solo hosting |

---

## 🐛 Solución de Problemas

### El servidor de desarrollo no inicia

```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error de Firebase "No app has been assigned"

Verifica que el archivo `.env` exista y tenga las variables correctas.

### El deploy falla

```bash
# Verifica que estás en el proyecto correcto
firebase projects:list

# Re-inicia sesión
firebase logout
firebase login

# Intenta de nuevo
firebase deploy --only hosting
```

### Los cambios no se ven en producción

1. Limpia la caché del navegador (Ctrl + Shift + Supr)
2. Espera 1-2 minutos (Firebase CDN puede tardar)
3. Verifica que el build se hizo correctamente: `npm run build`

### Error de TypeScript

```bash
# Revisa errores de tipo
npx tsc --noEmit
```

---

## 👨‍💻 Créditos

**Desarrollado por:** [Tu Nombre]
**Para:** Sweetjay
**Fecha:** Marzo 2026

**Tecnologías clave:**
- React: [react.dev](https://react.dev)
- Firebase: [firebase.google.com](https://firebase.google.com)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)
- Framer Motion: [framer.com/motion](https://framer.com/motion)

---

## 📞 Soporte

Para dudas o problemas:
- **Email:** [tu-email@ejemplo.com]
- **Documentación adicional:** Ver archivos en `/docs`

---

*Última actualización: Marzo 2026*
