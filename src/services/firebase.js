import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEbUAu7QzUnt9wGn-kcX6haUI7yIpJoIM",
  authDomain: "skill-swap-57eed.firebaseapp.com",
  projectId: "skill-swap-57eed",
  storageBucket: "skill-swap-57eed.firebasestorage.app",
  messagingSenderId: "496782536482",
  appId: "1:496782536482:web:36f4544a4f68a1861cbf7b",
  measurementId: "G-TG20PH67ND"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // ✅ Add this line

export {  googleProvider }; // ✅ Export it here
