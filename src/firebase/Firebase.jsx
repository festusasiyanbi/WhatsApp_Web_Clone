import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALxJbPYi2EA2gPdKrSCHRQuy3t-thvlOg",
  authDomain: "whatsapp-web-clone-dd630.firebaseapp.com",
  projectId: "whatsapp-web-clone-dd630",
  storageBucket: "whatsapp-web-clone-dd630.appspot.com",
  messagingSenderId: "693271565647",
  appId: "1:693271565647:web:9f98864ad912bf23f9a13a",
  measurementId: "G-E0GZLFKFRH"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();