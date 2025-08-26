// backend/src/services/firebase.js

const admin = require("firebase-admin");
const path = require("path"); // 1. Importamos o módulo 'path'

// 2. Construímos o caminho absoluto para a chave
const serviceAccountPath = path.join(
  process.cwd(), // Pega o caminho da pasta raiz onde o 'npm start' foi executado (a pasta 'backend')
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH // Pega o caminho relativo do .env ('./config/...')
);

// 3. Usamos o caminho absoluto e correto para carregar o arquivo
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore(); // Adicionamos o firestore

module.exports = { auth, db }; // Exportamos os dois
