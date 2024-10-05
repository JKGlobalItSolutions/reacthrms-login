import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage for Firebase Storage

// Your Firebase config object here
const firebaseConfig = {
  apiKey: "AIzaSyB-13T3ZJgw4iu1DJmD7V7M-j3GpVKqTKg",
  authDomain: "hrmstest-2830d.firebaseapp.com",
  projectId: "hrmstest-2830d",
  storageBucket: "hrmstest-2830d.appspot.com",
  messagingSenderId: "430155521206",
  appId: "1:430155521206:web:3b7257bed94097dbbbda17",
  measurementId: "G-XQ3T8CV802"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firebase services
export { auth, db, storage };  // Now storage is exported
