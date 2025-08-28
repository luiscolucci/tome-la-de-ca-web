// backend/src/routes/conversation.routes.js

const express = require("express");
const router = express.Router();

// 1. IMPORTAMOS A NOVA FUNÇÃO JUNTO COM A ANTIGA
const {
  startConversation,
  getUserConversations,
} = require("../controllers/conversation.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Rota para INICIAR uma conversa (continua a mesma)
router.post("/", checkAuth, startConversation);

// 2. ADICIONAMOS A NOVA ROTA PARA LISTAR AS CONVERSAS
// Também é protegida, pois o usuário precisa estar logado.
router.get("/", checkAuth, getUserConversations);

module.exports = router;
