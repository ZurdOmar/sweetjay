import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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
        if (querySnapshot.empty) {
            console.log("No concert documents found.");
        }
        
        let docs = [];
        querySnapshot.forEach((d) => {
            docs.push({ id: d.id, data: d.data() });
        });
        
        docs.sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());
        
        for (let i = 0; i < docs.length; i++) {
            console.log(`[${i}] ID: ${docs[i].id} | Name: ${docs[i].data.name} | CreatedAt: ${docs[i].data.createdAt}`);
        }

        // Delete all except the newest one
        if (docs.length > 1) {
            console.log("Deleting older documents...");
            for (let i = 0; i < docs.length - 1; i++) {
                const docId = docs[i].id;
                console.log(`Deleting doc ID: ${docId}`);
                await deleteDoc(doc(db, "concerts", docId));
            }
        }
        console.log("Cleanup complete.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
