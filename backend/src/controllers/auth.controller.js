// Importa o serviço de autenticação do Firebase que configuramos
const { auth } = require("../services/firebase");

// Função assíncrona para registrar um novo usuário
const registerUser = async (req, res) => {
  // Extrai os dados do corpo da requisição (que virão do formulário do frontend)
  const { email, password, displayName } = req.body;

  // Validação básica para garantir que todos os campos foram enviados
  if (!email || !password || !displayName) {
    return res.status(400).send({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Usa o SDK do Firebase para criar um novo usuário
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    // Se o usuário for criado com sucesso, retorna os dados básicos
    // Não retorne a senha!
    return res.status(201).send({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    });
  } catch (error) {
    // Se o Firebase retornar um erro (ex: email já existe), envia uma mensagem amigável
    console.error("Erro ao registrar usuário:", error);
    // O erro 'auth/email-already-exists' é comum, podemos tratá-lo especificamente
    if (error.code === "auth/email-already-exists") {
      return res.status(409).send({ error: "Este e-mail já está em uso." });
    }
    return res
      .status(500)
      .send({ error: "Ocorreu um erro ao registrar o usuário." });
  }
};

// Exporta a função para ser usada nas rotas
module.exports = {
  registerUser,
};
