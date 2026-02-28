import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy-app-id",
    measurementId: "G-3QK9L0HQCM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
