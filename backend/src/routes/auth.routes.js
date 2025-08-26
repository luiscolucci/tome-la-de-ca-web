const express = require("express");
const router = express.Router();

// Importa o controller de autenticação
const authController = require("../controllers/auth.controller");

// Define a rota POST para /register
// Quando uma requisição POST chegar em /api/auth/register,
// a função registerUser será executada.
router.post("/register", authController.registerUser);

// (Futuramente, adicionaremos a rota de login aqui)
// router.post("/login", authController.loginUser);

module.exports = router;
