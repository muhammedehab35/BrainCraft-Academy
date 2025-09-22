// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-course-generator-508b2.firebaseapp.com",
  projectId: "ai-course-generator-508b2",
  storageBucket: "ai-course-generator-508b2.appspot.com",
  messagingSenderId: "653060677544",
  appId: "1:653060677544:web:dcb79bc2ee72c411ce479d",
  measurementId: "G-1Q1E2J2GR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);