// backend/src/index.js

// Carrega as variáveis de ambiente do arquivo .env no início de tudo
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Importa os arquivos de rotas
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const conversationRoutes = require("./routes/conversation.routes");
const userRoutes = require("./routes/user.routes"); // <-- 1. IMPORTE AS NOVAS ROTAS

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("API da Plataforma Tome lá, Dê Cá está no ar!");
});

// Conecta as rotas ao servidor com seus prefixos
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes); // <-- 2. USE AS NOVAS ROTAS

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
