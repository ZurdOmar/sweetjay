# 📐 Guía de Arquitectura del Proyecto

Esta guía explica cómo está organizado el código y cómo funciona cada parte.

---

## 📋 Índice

1. [Diagrama de Arquitectura](#1-diagrama-de-arquitectura)
2. [Flujo de la Aplicación](#2-flujo-de-la-aplicación)
3. [Componentes Principales](#3-componentes-principales)
4. [Flujo de Datos](#4-flujo-de-datos)
5. [Estados Globales](#5-estados-globales)
6. [Autenticación](#6-autenticación)
7. [Subida de Archivos](#7-subida-de-archivos)
8. [Rutas](#8-rutas)

---

## 1. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   App.tsx   │  │  Admin.tsx   │  │  MusicPlayer.tsx        │ │
│  │  (Landing)  │  │   (Panel)    │  │  (Reproductor)          │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│         │                │                      │                │
│         └────────────────┴──────────────────────┘                │
│                              │                                   │
│                    ┌─────────▼─────────┐                         │
│                    │   firebase.ts     │                         │
│                    │  (Configuración)  │                         │
│                    └─────────┬─────────┘                         │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE (Backend)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │   Hosting    │  │  Firestore   │  │       Storage         │  │
│  │  (Archivos)  │  │ (Base datos) │  │    (Archivos)         │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│                               │                                  │
│                    ┌──────────▼──────────┐                       │
│                    │   Authentication    │                       │
│                    │     (Login)         │                       │
│                    └─────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Flujo de la Aplicación

### Para Visitantes

```
1. Usuario entra a sweetjay.com.mx
         │
         ▼
2. Carga Intro.tsx (pantalla de bienvenida)
         │
         ▼
3. Usuario hace click en "Entrar"
         │
         ▼
4. Carga MainSite (App.tsx)
         │
         ▼
5. Se cargan datos desde Firebase:
   - Imágenes del carrusel
   - Música
   - Videos
   - Eventos
   - etc.
         │
         ▼
6. Usuario navega por las secciones:
   - Inicio → Música → Eventos → Conciertos → Videos → Galería → Bio → Contacto
         │
         ▼
7. MusicPlayer.tsx reproduce música de fondo
```

### Para Administradores

```
1. Admin va a sweetjay.com.mx/admin
         │
         ▼
2. Ingresa su email autorizado
         │
         ▼
3. Firebase envía email mágico
         │
         ▼
4. Admin hace click en el enlace
         │
         ▼
5. Admin.tsx se carga con el panel completo
         │
         ▼
6. Admin puede:
   - Subir imágenes
   - Subir música
   - Gestionar eventos
   - Ver mensajes
   - etc.
```

---

## 3. Componentes Principales

### `App.tsx` - Componente Principal

**Propósito:** Contiene toda la landing page y la lógica de carga de datos.

**Estados principales:**
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false);           // Menú móvil
const [galleryImages, setGalleryImages] = useState<any[]>([]); // Imágenes galería
const [firebaseVideos, setFirebaseVideos] = useState<any[]>([]); // Videos
const [firebaseConcerts, setFirebaseConcerts] = useState<any[]>([]); // Conciertos
const [firebaseEvents, setFirebaseEvents] = useState<any[]>([]); // Eventos
const [firebaseMusic, setFirebaseMusic] = useState<any[]>([]); // Música
const [activePromotion, setActivePromotion] = useState<any>(null); // Promoción activa
```

**Funciones clave:**
```typescript
fetchDynamicData()     // Carga datos desde Firebase al iniciar
handleContactSubmit()  // Maneja el formulario de contacto
```

**Secciones que renderiza:**
1. Navigation (menú superior)
2. Hero Section (carrusel + redes sociales)
3. Music Section (discografía)
4. Eventos Section (próximos eventos)
5. Conciertos Section (videos en vivo)
6. Videos Section (videos oficiales)
7. Galería Section (fotos)
8. Bio Section (biografía)
9. Contacto Section (formulario)
10. Footer

---

### `Admin.tsx` - Panel de Administración

**Propósito:** Permitir al administrador gestionar todo el contenido del sitio.

**Estados principales (20+):**
```typescript
const [user, setUser] = useState<any>(null);              // Usuario logueado
const [email, setEmail] = useState('');                   // Email para login
const [uploading, setUploading] = useState(false);        // Estado de subida
const [imagesList, setImagesList] = useState<any[]>([]);  // Lista de imágenes
const [musicList, setMusicList] = useState<any[]>([]);    // Lista de música
// ... y muchos más
```

**Funciones clave:**
```typescript
handleLogin()           // Envía email mágico
handleConfirmEmail()    // Confirma login con el enlace
refreshData()           // Recarga todos los datos
handleImageUpload()     // Sube imágenes a Storage
handleMusicUpload()     // Sube música a Storage
handleDelete()          // Elimina elementos
```

**Secciones del panel:**
1. Login (email mágico)
2. Subir imágenes (galería y carousel)
3. Subir música
4. Gestionar eventos
5. Gestionar videos (YouTube)
6. Gestionar conciertos (videos locales)
7. Gestionar promociones
8. Ver mensajes de contacto
9. Editar biografía

---

### `MusicPlayer.tsx` - Reproductor de Música

**Propósito:** Reproducir música de fondo en todo el sitio.

**Características:**
- Siempre visible (fixed en la esquina inferior derecha)
- Se sincroniza con Firebase (canción activa)
- Controles: Play/Pause, Mute, Volumen
- Muestra nombre de la canción

**Funciones clave:**
```typescript
togglePlay()     // Play o pause
toggleMute()     // Silenciar/activar sonido
forcePlay()      // Forzar reproducción (desde intro)
```

---

### `HeroCarousel.tsx` - Carrusel Principal

**Propósito:** Mostrar imágenes rotativas en la sección principal.

**Características:**
- Carga imágenes desde Firebase (`carousel` collection)
- Si no hay imágenes, usa fallback estático
- Transición suave entre slides
- Indicadores de posición
- Auto-rotación cada 4 segundos

**Lógica de ordenamiento:**
```typescript
// 1. Ordena por 'order' (ascendente)
// 2. Si no hay order, usa createdAt (descendente)
// 3. Limita a 15 imágenes
```

---

### `Intro.tsx` - Pantalla de Intro

**Propósito:** Mostrar pantalla de bienvenida antes del sitio.

**Características:**
- Logo animado
- Botón "Entrar"
- Animaciones con Framer Motion
- Desaparece después de entrar

---

### `PromotionModal.tsx` - Modal de Promociones

**Propósito:** Mostrar promociones emergentes.

**Características:**
- Se abre automáticamente al cargar
- Muestra imagen de promoción
- Botón opcional con link externo
- Se puede cerrar

---

### `PromotionBanner.tsx` - Banner de Promociones

**Propósito:** Mostrar banner promocional en la parte inferior.

**Características:**
- Fijo en la parte inferior
- Menos intrusivo que el modal
- Botón de cerrar
- Link opcional

---

## 4. Flujo de Datos

### Carga Inicial (App.tsx)

```typescript
useEffect(() => {
  const fetchDynamicData = async () => {
    // 1. Imágenes
    const photosQ = query(collection(db, 'images'), orderBy('createdAt', 'desc'), limit(8));
    const photosSnapshot = await getDocs(photosQ);
    setGalleryImages(photosSnapshot.docs.map(doc => doc.data()));

    // 2. Videos
    // 3. Conciertos
    // 4. Eventos
    // 5. Música
    // 6. Ads
    // 7. Settings (eventsInfo, concertsInfo, bioInfo)
  };
  fetchDynamicData();
}, []);
```

### Monitoreo en Tiempo Real (Promociones)

```typescript
useEffect(() => {
  const unsub = onSnapshot(doc(db, 'settings', 'activePromotion'), (snapshot) => {
    if (snapshot.exists()) {
      setActivePromotion(snapshot.data());
    } else {
      setActivePromotion(null);
    }
  });
  return () => unsub();
}, []);
```

**Ventaja:** Si el admin cambia la promoción, todos los visitantes la ven actualizada sin recargar.

---

## 5. Estados Globales

No hay un estado global centralizado (como Redux). Cada componente maneja su propio estado con `useState`.

**Comunicación entre componentes:**

1. **Padre → Hijo:** Props
   ```typescript
   <MusicPlayer ref={musicPlayerRef} />
   ```

2. **Hijo → Padre:** Callbacks
   ```typescript
   // No usado en este proyecto, pero posible
   ```

3. **Firebase como "estado global":**
   - Todos los componentes leen de Firebase
   - Los cambios se reflejan automáticamente

---

## 6. Autenticación

### Flujo de Login

```typescript
// 1. Usuario pone email
const [email, setEmail] = useState('');

// 2. Click en "Enviar enlace"
await sendSignInLinkToEmail(auth, email, actionCodeSettings);

// 3. Firebase envía email
// 4. Usuario hace click en el enlace
// 5. La app detecta el enlace:
if (isSignInWithEmailLink(auth, window.location.href)) {
  await signInWithEmailLink(auth, tempEmail, window.location.href);
  // ¡Logueado!
}
```

### Emails Autorizados

Solo estos emails pueden acceder:
```typescript
const authorizedEmails = ['morentinomar@gmail.com', 'jeranmp@gmail.com'];
```

### Persistencia de Sesión

```typescript
// Solo persiste en la sesión del navegador
setPersistence(auth, browserSessionPersistence);
```

**Ventaja:** Si cierra el navegador, tiene que loguearse de nuevo (más seguro).

---

## 7. Subida de Archivos

### Flujo de Subida (Admin.tsx)

```typescript
// 1. Usuario selecciona archivo
const file = event.target.files[0];

// 2. Crea referencia en Storage
const storageRef = ref(storage, `images/${file.name}`);

// 3. Inicia subida
const uploadTask = uploadBytesResumable(storageRef, file);

// 4. Monitorea progreso
uploadTask.on('state_changed', (snapshot) => {
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  setProgress(progress);
});

// 5. Obtiene URL después de subir
const url = await getDownloadURL(uploadTask.snapshot.ref);

// 6. Guarda URL en Firestore
await addDoc(collection(db, 'images'), { url, createdAt: new Date() });
```

### Tipos de Archivos Soportados

| Tipo | Extensiones | Colección |
|------|-------------|-----------|
| Imágenes | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` | `images`, `carousel` |
| Audio | `.mp3`, `.wav` | `music` |
| Video | `.mp4`, `.mov`, `.avi` | `concerts` |
| Banners | `.jpg`, `.png` | `ads`, `promotions` |

---

## 8. Rutas

El proyecto usa React Router con 2 rutas principales:

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainSite musicPlayerRef={musicPlayerRef} showIntro={showIntro} />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
</BrowserRouter>
```

### Rutas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `MainSite` (App.tsx) | Landing page principal |
| `/admin` | `Admin` | Panel de administración |

### Navegación Interna (Anclas)

La landing page usa anclas para navegación:

```
#inicio      → Sección principal
#música      → Sección de música
#eventos     → Sección de eventos
#conciertos  → Sección de conciertos
#videos      → Sección de videos
#galería     → Sección de galería
#bio         → Sección de biografía
#contacto    → Sección de contacto
```

---

## 9. Dependencias Clave

### Producción

| Paquete | Propósito |
|---------|-----------|
| `react` | Framework principal |
| `react-dom` | Renderizado en el DOM |
| `firebase` | SDK de Firebase |
| `framer-motion` | Animaciones |
| `react-router-dom` | Navegación |
| `lucide-react` | Íconos |
| `react-player` | Reproductor de video/audio |

### Desarrollo

| Paquete | Propósito |
|---------|-----------|
| `typescript` | Lenguaje con tipos |
| `vite` | Build tool |
| `tailwindcss` | Framework CSS |
| `eslint` | Linter de código |

---

## 10. Archivos de Configuración

### `firebase.ts`
Configuración del SDK de Firebase.

### `tailwind.config.js`
Configuración de Tailwind CSS (colores, fuentes, etc.).

### `vite.config.ts`
Configuración de Vite (plugins, aliases, etc.).

### `tsconfig.json`
Configuración de TypeScript (tipos, compilación, etc.).

### `firebase.json`
Configuración de Firebase Hosting, Firestore y Storage.

### `.firebaserc`
Define el proyecto Firebase por defecto (`sweetjay-official`).

---

## 11. Convenciones de Código

### Nombres de Variables

```typescript
// Estados: sustantivos
const [user, setUser] = useState();
const [loading, setLoading] = useState();

// Funciones: verbo + sustantivo
const handleLogin = () => {};
const fetchImages = async () => {};
const uploadFile = async () => {};
```

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from 'react';

// 2. Tipos (si los hay)
interface Props { ... }

// 3. Componente
export function ComponentName({ prop }: Props) {
  // 3.1. Estados
  const [state, setState] = useState();
  
  // 3.2. Efectos
  useEffect(() => { ... }, []);
  
  // 3.3. Funciones
  const handleClick = () => { ... };
  
  // 3.4. Render
  return <div>...</div>;
}
```

---

*Última actualización: Marzo 2026*
