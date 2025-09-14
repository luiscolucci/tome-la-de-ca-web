// backend/src/routes/item.routes.js

const express = require("express");
const router = express.Router();

// Importa as funções do nosso controller de itens
const {
  createItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItemStatus,
  getItemById,
} = require("../controllers/item.controller");

// Importa o middleware de autenticação
const { checkAuth } = require("../middleware/auth.middleware");

/*
 * ESTRUTURA DAS ROTAS
 * É importante declarar as rotas mais específicas (como '/my-items')
 * antes das rotas dinâmicas (como '/:itemId') para evitar conflitos.
 */

// Rota para LISTAR todos os itens (PÚBLICA)
// Endpoint: GET /api/items
router.get("/", getAllItems);

// Rota para LISTAR os itens do utilizador autenticado (PROTEGIDA)
// Endpoint: GET /api/items/my-items
router.get("/my-items", checkAuth, getMyItems);

// Rota para OBTER um item específico pelo seu ID (PÚBLICA)
// Endpoint: GET /api/items/algum-id-de-item
router.get("/:itemId", getItemById);

// Rota para CRIAR um novo item (PROTEGIDA)
// Endpoint: POST /api/items
router.post("/", checkAuth, createItem);

// Rota para ATUALIZAR o estado de um item (PROTEGIDA)
// Endpoint: PATCH /api/items/algum-id-de-item/status
router.patch("/:itemId/status", checkAuth, updateItemStatus);

// Rota para APAGAR um item (PROTEGIDA)
// Endpoint: DELETE /api/items/algum-id-de-item
router.delete("/:itemId", checkAuth, deleteItem);

module.exports = router;
