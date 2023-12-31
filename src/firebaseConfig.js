// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbi0leBeoBVXvJiX9yvmuPe0JidWLzLe0",
    authDomain: "qtrobot-interface.firebaseapp.com",
    databaseURL: "https://qtrobot-interface-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "qtrobot-interface",
    storageBucket: "qtrobot-interface.appspot.com",
    messagingSenderId: "1069557423332",
    appId: "1:1069557423332:web:f04f43d8234568bbdc20f1",
    measurementId: "G-SKYX0NQCKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "Primary");
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const secondaryAuth = getAuth(secondaryApp)
export default app
export const db = getDatabase(app)