// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors"); // Permite que o frontend acesse a API

// Importa as rotas de autenticação
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");

const app = express();

// Middlewares essenciais
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota principal para teste
app.get("/", (req, res) => {
  res.send("API da Plataforma Tome lá, Dê Cá está no ar!");
});

// Usa as rotas de autenticação com o prefixo /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
