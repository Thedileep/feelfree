const { initializeApp } = require("firebase/app");
const { getFirestore,doc,setDoc } = require("firebase/firestore");

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
const firestoreDB = getFirestore(app);

module.exports = { firestoreDB, doc, setDoc };
