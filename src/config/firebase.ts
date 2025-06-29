import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAad17lH7fCNK5KHJkwQfX59plJuVlXd0A",
  authDomain: "communityproject-71e5d.firebaseapp.com",
  projectId: "communityproject-71e5d",
  storageBucket: "communityproject-71e5d.firebasestorage.app",
  messagingSenderId: "1097974054473",
  appId: "1:1097974054473:web:ad639e5784e30989cc4998",
  measurementId: "G-XXHZD0KTXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;