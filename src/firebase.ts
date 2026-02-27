import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    projectId: "sweetjay-official",
    appId: "1:254468019294:web:3809122e018adefbce10cf",
    storageBucket: "sweetjay-official.firebasestorage.app",
    apiKey: "AIzaSyDam-KSyLftjH4rwes-9FIhSGs09tALZrc",
    authDomain: "sweetjay-official.firebaseapp.com",
    messagingSenderId: "254468019294"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
