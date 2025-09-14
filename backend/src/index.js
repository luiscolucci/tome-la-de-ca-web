require("dotenv").config();
require("./services/firebase");

const express = require("express");
const app = express();
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const conversationRoutes = require("./routes/conversation.routes");
const userRoutes = require("./routes/user.routes");
const supportRoutes = require("./routes/support.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API da Plataforma Tome lá, Dê Cá está no ar!");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
