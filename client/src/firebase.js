import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCSn21GebXSGWUz8fQ5n38CfZzTablUdFs",
  authDomain: "email-sender-app-98d7c.firebaseapp.com",
  projectId: "email-sender-app-98d7c",
  storageBucket: "email-sender-app-98d7c.firebasestorage.app",
  messagingSenderId: "1018972221049",
  appId: "1:1018972221049:web:6b239d6612ef8046532ea8",
  measurementId: "G-MGRT7WSHE6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);