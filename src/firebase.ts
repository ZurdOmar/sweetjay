/**
 * Configuración de Firebase para el proyecto Sweetjay
 * 
 * Este archivo inicializa y exporta las instancias de los servicios de Firebase:
 * - App: La aplicación principal
 * - Auth: Autenticación de usuarios
 * - Firestore: Base de datos
 * - Storage: Almacenamiento de archivos
 * - Analytics: Analíticas de uso
 * 
 * @module firebase
 */

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

/**
 * Configuración del proyecto Firebase
 * 
 * Las credenciales se cargan desde variables de entorno (.env)
 * Si no existen, usa valores "dummy" para evitar errores en desarrollo
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id",
    measurementId: "G-3QK9L0HQCM"
};

/**
 * Inicializa la aplicación de Firebase
 */
const app = initializeApp(firebaseConfig);

/**
 * Instancia de Autenticación
 * 
 * Configurada para persistencia solo en sesión:
 * - El usuario debe loguearse cada vez que abre el navegador
 * - Más seguro para el panel de admin
 */
export const auth = getAuth(app);

// Force session-only persistence para requerir re-autenticación
// si el navegador se cierra o la sesión expira
setPersistence(auth, browserSessionPersistence).catch(console.error);

/**
 * Instancia de Firestore (Base de datos)
 */
export const db = getFirestore(app);

/**
 * Instancia de Storage (Almacenamiento de archivos)
 */
export const storage = getStorage(app);

/**
 * Instancia de Analytics (Analíticas de uso)
 */
export const analytics = getAnalytics(app);

/**
 * Exporta la app por defecto para imports directos
 */
export default app;
