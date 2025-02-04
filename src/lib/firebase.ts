// lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Si quieres usar Firestore
import { getAuth } from "firebase/auth"; // Si quieres usar autenticación

// Configuración de Firebase (reemplaza estos valores con los de tu consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyB_6ymqPIIx5lRJcnEJBxeC7b14EaG01K4",
    authDomain: "gestion-obras-1a927.firebaseapp.com",
    projectId: "gestion-obras-1a927",
    storageBucket: "gestion-obras-1a927.firebasestorage.app",
    messagingSenderId: "655542340186",
    appId: "1:655542340186:web:e30df2ad45b8344e6de663",
    measurementId: "G-TRMT1V12EM"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén instancias de los servicios que necesitas (Firestore y Auth en este caso)
export const db = getFirestore(app); // Para Firestore
export const auth = getAuth(app); // Para autenticación
