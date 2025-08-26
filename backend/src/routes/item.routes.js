// backend/src/routes/item.routes.js

const express = require("express");
const router = express.Router();

const { createItem, getAllItems } = require("../controllers/item.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Rota para CRIAR um novo item
// Note como o 'checkAuth' é usado como middleware antes de chamar o 'createItem'
// Isso PROTEGE a rota, só permitindo acesso a usuários logados.
router.post("/", checkAuth, itemController.createItem);

// Rota para LISTAR todos os itens (PÚBLICA, sem middleware)
router.get("/", getAllItems);

// Futuramente, adicionaremos outras rotas aqui (ex: GET para listar itens)

module.exports = router;
