// backend/src/routes/item.routes.js

const express = require("express");
const router = express.Router();

const { createItem, getAllItems } = require("../controllers/item.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Rota para CRIAR um novo item (PROTEGIDA)
router.post("/", checkAuth, createItem);

// Rota para LISTAR todos os itens (PÚBLICA)
router.get("/", getAllItems);

module.exports = router;
