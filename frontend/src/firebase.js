// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // 1. IMPORTE O FIRESTORE

// TODO: Cole a configuração do seu projeto Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyAkhcCluIujeBeM2btjBGBLlgWG_BUl-Z4",
  authDomain: "tome-la-de-ca.firebaseapp.com",
  projectId: "tome-la-de-ca",
  storageBucket: "tome-la-de-ca.firebasestorage.app",
  messagingSenderId: "269111269657",
  appId: "1:269111269657:web:2ca0fe2dde536abe994d88",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o serviço de autenticação para ser usado em outros componentes
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // 2. INICIALIZE E EXPORTE O BANCO DE DADOS
