const { initializeApp } = require("firebase/app");
const { getFirestore,doc,setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAUFR7hq8CiJvN_qLjUTewGjvknomXAufE",
  authDomain: "feelfree-bf1b1.firebaseapp.com",
  projectId: "feelfree-bf1b1",
  storageBucket: "feelfree-bf1b1.appspot.com",
  messagingSenderId: "95778360206",
  appId: "1:95778360206:web:1787390cf9c9f52c8172df",
  measurementId: "G-7NLMLS3GD0"
};

const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);

module.exports = { firestoreDB, doc, setDoc };
