// backend/src/controllers/auth.controller.js

const { auth } = require("../services/firebase");

const registerUser = async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).send({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    return res.status(201).send({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return res.status(409).send({ error: "Este e-mail já está em uso." });
    }
    return res
      .status(500)
      .send({ error: "Ocorreu um erro ao registrar o usuário." });
  }
};

module.exports = {
  registerUser,
};
