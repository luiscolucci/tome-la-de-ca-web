// backend/src/middleware/auth.middleware.js

const { auth } = require("../services/firebase");

const checkAuth = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res
      .status(401)
      .send({ error: "Acesso não autorizado. Token não fornecido." });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res.status(403).send({ error: "Token inválido ou expirado." });
  }
};

module.exports = {
  checkAuth,
};
