// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC66Jp3OnL_y-xL92zvdHlyqFhxtT6UUEU",
  authDomain: "dzikwa-trust-project.firebaseapp.com",
  databaseURL: "https://dzikwa-trust-project-default-rtdb.firebaseio.com",
  projectId: "dzikwa-trust-project",
  storageBucket: "dzikwa-trust-project.firebasestorage.app",
  messagingSenderId: "654354843094",
  appId: "1:654354843094:web:a4e2bb512baa3a173a1077",
  measurementId: "G-BJKNHX4D0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);