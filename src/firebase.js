import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCa1Zvgdgb7DmFstgGlWm9s5YRdOgsip6s",
    authDomain: "peepify.firebaseapp.com",
    databaseURL: "https://peepify-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "peepify",
    storageBucket: "peepify.appspot.com",
    messagingSenderId: "200981294104",
    appId: "1:200981294104:web:14e03d7e3e6146ce54a76d",
    measurementId: "G-TK7QVTDB0R"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore();


  export { auth, db };