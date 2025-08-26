// backend/src/services/firebase.js

const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(
  process.cwd(),
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
