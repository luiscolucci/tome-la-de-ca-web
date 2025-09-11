require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Importação das suas rotas de API
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const conversationRoutes = require("./routes/conversation.routes");
const userRoutes = require("./routes/user.routes");
const supportRoutes = require("./routes/support.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da sua API
// Essas rotas permanecem como estão
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);

// --- CÓDIGO ADICIONADO PARA SERVIR O FRONTEND ---

// Define o caminho para a pasta de build do frontend.
// O Dockerfile irá copiar os arquivos de 'frontend/dist' para 'backend/public'.
const frontendBuildPath = path.join(__dirname, "..", "public");

// Serve os arquivos estáticos (JS, CSS, imagens, etc.) do frontend.
app.use(express.static(frontendBuildPath));

// Para qualquer outra rota GET que não seja uma API, serve o index.html.
// Isso é essencial para que o roteamento de Single-Page Applications (SPA) funcione.
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// --- FIM DO CÓDIGO ADICIONADO ---

// A porta padrão foi alterada para 8080 para alinhar com o deploy no Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
