import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyDdDrntLySV29o3bamdvbi5Vf2eYaKjCLQ",
  authDomain: "feelfree-f9a1f.firebaseapp.com",
  projectId: "feelfree-f9a1f",
  storageBucket: "feelfree-f9a1f.firebasestorage.app",
  messagingSenderId: "585519510087",
  appId: "1:585519510087:web:3f0ecbc6ab685d6d607762",
  measurementId: "G-9WR9ZBE0HN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
