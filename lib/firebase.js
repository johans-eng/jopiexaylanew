import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBuJdTBjT7WrnZMb6bn3AwJFsn37fx9tFo",
    authDomain: "jopiexayla.firebaseapp.com",
    projectId: "jopiexayla",
    storageBucket: "jopiexayla.firebasestorage.app",
    messagingSenderId: "541183366451",
    appId: "1:541183366451:web:0a21605e75dc5140301a46",
    measurementId: "G-W08B7CFQ3E"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);