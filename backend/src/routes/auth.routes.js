// backend/src/routes/auth.routes.js

const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/auth.controller");

// Rota para CRIAR um novo usuário
router.post("/register", registerUser);

module.exports = router;
