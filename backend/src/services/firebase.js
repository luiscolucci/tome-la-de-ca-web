const admin = require("firebase-admin");
const path = require("path");

// VERIFICA SE ESTAMOS NO AMBIENTE DE PRODUÇÃO (CLOUD RUN)
if (process.env.NODE_ENV === "production") {
  // Na nuvem, o SDK do Firebase encontra as credenciais automaticamente.
  // Nenhuma configuração extra é necessária.
  admin.initializeApp();
} else {
  // No nosso ambiente local (desenvolvimento), carregamos a chave a partir do ficheiro .env.
  const serviceAccountPath = path.join(
    process.cwd(),
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
  );
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Exporta os serviços de Autenticação e do Banco de Dados para serem usados noutras partes do backend
const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
