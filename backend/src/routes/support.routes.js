// backend/src/routes/support.routes.js

const express = require("express");
const router = express.Router();

const { createSupportTicket } = require("../controllers/support.controller");

// Esta rota é pública, qualquer pessoa pode enviar um pedido de suporte.
router.post("/", createSupportTicket);

module.exports = router;
