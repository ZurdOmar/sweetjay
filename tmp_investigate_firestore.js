const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
apiKey: process.env.VITE_FIREBASE_API_KEY,
authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
projectId: process.env.VITE_FIREBASE_PROJECT_ID,
storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    console.log("Fetching concerts...");
    try {
        const querySnapshot = await getDocs(collection(db, "concerts"));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } catch (e) {
        console.error(e);
    }
}
main();
