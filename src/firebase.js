// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9sZ6C-hnmbwFJuddXUhG9yjVsFTIl0QU",
  authDomain: "volt-31168.firebaseapp.com",
  projectId: "volt-31168",
  storageBucket: "volt-31168.firebasestorage.app",
  messagingSenderId: "248576673103",
  appId: "1:248576673103:web:6b6905fcbb8c90173f713a",
  measurementId: "G-KM7FNNVQKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);   
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, onAuthStateChanged, getDoc, doc };