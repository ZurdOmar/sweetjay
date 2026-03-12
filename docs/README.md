# 📚 Documentación del Proyecto Sweetjay

Este es el índice principal de toda la documentación del proyecto.

---

## 📖 Guías Disponibles

### Para Todos los Desarrolladores

| Documento | Descripción | Cuándo leerlo |
|-----------|-------------|---------------|
| [README.md](../README.md) | Introducción general, instalación, comandos | **Primero** - Para empezar |
| [docs/ARQUITECTURA.md](./ARQUITECTURA.md) | Cómo está organizado el código | Cuando necesites entender la estructura |
| [docs/FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Configuración de Firebase | Al configurar el proyecto por primera vez |
| [docs/DEPLOYMENT.md](./DEPLOYMENT.md) | Cómo subir a producción | Cuando hagas deploy |

### Para el Cliente

| Documento | Descripción |
|-----------|-------------|
| [DOCUMENTACION_ENTREGA_CLIENTE.md](../DOCUMENTACION_ENTREGA_CLIENTE.md) | Documentación técnica detallada |
| [GUIA_CLIENTE_SIMPLE.md](../GUIA_CLIENTE_SIMPLE.md) | Guía simple sin tecnicismos |

---

## 🗺️ Ruta de Aprendizaje Recomendada

### Si eres nuevo en el proyecto:

```
1. README.md              ← Empieza aquí
   │
   ├─→ ¿Necesitas configurar Firebase?
   │   └─→ docs/FIREBASE_SETUP.md
   │
   ├─→ ¿Necesitas entender el código?
   │   └─→ docs/ARQUITECTURA.md
   │
   └─→ ¿Necesitas hacer deploy?
       └─→ docs/DEPLOYMENT.md
```

### Si eres el cliente:

```
1. GUIA_CLIENTE_SIMPLE.md   ← Lee esto primero
   │
   └─→ ¿Quieres más detalles técnicos?
       └─→ DOCUMENTACION_ENTREGA_CLIENTE.md
```

---

## 📋 Resumen Rápido

### ¿Qué es este proyecto?

Sitio web oficial del artista **Sweetjay** con:
- Landing page con carrusel de imágenes
- Reproductor de música integrado
- Panel de administración para subir contenido
- Integración con Firebase

### Tecnologías principales

- **React 19** + **TypeScript**
- **Vite** + **Tailwind CSS**
- **Firebase** (Hosting, Firestore, Storage, Auth)

### Comandos esenciales

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting
```

### Estructura de carpetas

```
sweetjay/
├── src/
│   ├── components/     # Componentes de React
│   ├── App.tsx         # Componente principal
│   ├── firebase.ts     # Configuración de Firebase
│   └── main.tsx        # Punto de entrada
├── docs/               # Documentación
├── public/             # Archivos estáticos
└── dist/               # Build para producción
```

---

## 🔗 Enlaces Útiles

### Recursos del Proyecto

- [Producción](https://sweetjay.com.mx)
- [Firebase Console](https://console.firebase.google.com/project/sweetjay-official/overview)

### Recursos Externos

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://framer.com/motion)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## 📞 Soporte

Para dudas sobre la documentación o el proyecto:

- **Email:** [tu-email@ejemplo.com]
- **Documentación reportada:** [tu-email@ejemplo.com]

---

## 📝 Contribuciones a la Documentación

Si encuentras errores o quieres mejorar la documentación:

1. Edita el archivo correspondiente
2. Actualiza la fecha de "Última actualización"
3. Commit con mensaje claro: `docs: descripción del cambio`

---

*Última actualización: Marzo 2026*
