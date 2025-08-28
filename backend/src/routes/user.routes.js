// backend/src/routes/user.routes.js

const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/user.controller");
const { checkAuth } = require("../middleware/auth.middleware");

// Todas as rotas de perfil/usuário são protegidas
router.use(checkAuth);

// Rota para buscar a lista de interesses
router.get("/wishlist", getWishlist);

// Rota para adicionar um item à lista de interesses
router.post("/wishlist", addToWishlist);

// Rota para remover um item da lista de interesses
router.delete("/wishlist/:itemId", removeFromWishlist);

module.exports = router;
