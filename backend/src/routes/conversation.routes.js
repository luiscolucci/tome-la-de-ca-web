// backend/src/routes/conversation.routes.js

const express = require("express");
const router = express.Router();

const { startConversation } = require("../controllers/conversation.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Rota para iniciar uma conversa. Protegida, pois o usuário precisa estar logado.
router.post("/", checkAuth, startConversation);

module.exports = router;
