// backend/src/routes/item.routes.js

const express = require("express");
const router = express.Router();

// A correção está aqui: adicionamos getMyItems à lista de importação
const {
  createItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItemStatus,
  getItemById,
} = require("../controllers/item.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// --- ROTAS ESPECÍFICAS PRIMEIRO ---

// Rota para LISTAR todos os itens (PÚBLICA)
router.get("/", getAllItems);

// Rota para LISTAR os itens do usuário logado (PROTEGIDA)
router.get("/my-items", checkAuth, getMyItems);

// --- ROTAS DINÂMICAS DEPOIS ---

// Buscar um item específico por ID (PÚBLICA)
router.get("/:itemId", getItemById);

// Rota para CRIAR um novo item (PROTEGIDA)
router.post("/", checkAuth, createItem);

// Atualizar o status de um item
router.patch("/:itemId/status", checkAuth, updateItemStatus);

// Apagar um item específico (PROTEGIDA)
// :itemId é um parâmetro dinâmico. O ID do item virá na URL.
router.delete("/:itemId", checkAuth, deleteItem);

module.exports = router;
