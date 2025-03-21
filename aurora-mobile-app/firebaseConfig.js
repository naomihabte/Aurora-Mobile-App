// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBLI7Fh0fcoByy-DRzkLSIBYXhdcKaWBg",
  authDomain: "aurora-water-tracker.firebaseapp.com",
  databaseURL: "https://aurora-water-tracker-default-rtdb.firebaseio.com",
  projectId: "aurora-water-tracker",
  storageBucket: "aurora-water-tracker.firebasestorage.app",
  messagingSenderId: "1018502143319",
  appId: "1:1018502143319:web:b179fb1ff1a5a1742bf212"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log("🔥 Firebase Initialized!");

export { database };