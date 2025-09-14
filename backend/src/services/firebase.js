const admin = require("firebase-admin");
const path = require("path"); // Importa o módulo 'path' do Node.js
require("dotenv").config();

try {
  // *** LINHA DE DIAGNÓSTICO ***
  // Vamos imprimir o caminho completo que o Node.js está tentando usar para a chave
  const serviceAccountPath = path.join(
    __dirname,
    "../config/tome-la-de-ca-firebase-admin-key.json"
  );

  console.log("🔑 Tentando carregar a chave de:", serviceAccountPath);
  //path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  //);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });

  console.log("✅ Conexão com o Firebase estabelecida com sucesso!");
} catch (error) {
  console.error("❌ Erro ao inicializar o Firebase Admin:", error.message);
  process.exit(1);
}

// ... resto do arquivo
// Obtém as instâncias dos serviços que vamos usar
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage().bucket("tome-la-de-ca.appspot.com");

// Exporta as instâncias para serem usadas em outros lugares do app
module.exports = {
  db,
  auth,
  storage,
  admin,
};
