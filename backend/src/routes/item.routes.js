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
} = require("../controllers/item.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Rota para CRIAR um novo item (PROTEGIDA)
router.post("/", checkAuth, createItem);

// Rota para LISTAR os itens do usuário logado (PROTEGIDA)
// Agora a função getMyItems é reconhecida e a rota funciona
router.get("/my-items", checkAuth, getMyItems);

// Atualizar o status de um item
router.patch("/:itemId/status", checkAuth, updateItemStatus);

// Apagar um item específico (PROTEGIDA)
// :itemId é um parâmetro dinâmico. O ID do item virá na URL.
router.delete("/:itemId", checkAuth, deleteItem);

// Rota para LISTAR todos os itens (PÚBLICA)
router.get("/", getAllItems);

module.exports = router;
