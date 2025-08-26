// backend/src/middleware/auth.middleware.js

const { auth } = require("../services/firebase");

const checkAuth = async (req, res, next) => {
  // 1. Pega o token do cabeçalho da requisição
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  // 2. Se não houver token, retorna um erro
  if (!idToken) {
    return res
      .status(401)
      .send({ error: "Acesso não autorizado. Token não fornecido." });
  }

  try {
    // 3. Usa o Firebase Admin para verificar se o token é válido
    const decodedToken = await auth.verifyIdToken(idToken);

    // 4. Se for válido, adiciona os dados do usuário na requisição
    req.user = decodedToken;

    // 5. Continua para a próxima função (o controller da rota)
    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res.status(403).send({ error: "Token inválido ou expirado." });
  }
};

module.exports = {
  checkAuth,
};
