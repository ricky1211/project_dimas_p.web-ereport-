// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCF7jzkhLAMouHaO5ZizbJ3Pj1M75zFK8g",
    authDomain: "ereport-6f9c3.firebaseapp.com",
    databaseURL: "https://ereport-6f9c3-default-rtdb.firebaseio.com",
    projectId: "ereport-6f9c3",
    storageBucket: "ereport-6f9c3.firebasestorage.app",
    messagingSenderId: "75485805767",
    appId: "1:75485805767:web:1c5c2bfb011298f146d2e2",
    measurementId: "G-69N67QD0BL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);