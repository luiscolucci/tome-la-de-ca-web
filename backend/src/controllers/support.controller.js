// backend/src/controllers/support.controller.js

const { db } = require("../services/firebase");

// Função para criar um novo ticket de suporte
const createSupportTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .send({ error: "Todos os campos são obrigatórios." });
    }

    // Gera um número de ticket simples baseado no tempo atual
    const ticketId = `TOME-${Date.now()}`;

    const newTicket = {
      ticketId,
      name,
      email,
      subject,
      message,
      status: "aberto", // O status inicial é sempre 'aberto'
      createdAt: new Date(),
    };

    // Guarda o novo ticket na coleção 'supportTickets'
    await db.collection("supportTickets").add(newTicket);

    // AVISO: O envio de e-mails será tratado por uma Cloud Function
    // que será acionada automaticamente quando este documento for criado.

    // Retorna o número do ticket para o utilizador
    res.status(201).send({
      message: "O seu pedido de suporte foi recebido com sucesso!",
      ticketId: ticketId,
    });
  } catch (error) {
    console.error("Erro ao criar ticket de suporte:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

module.exports = {
  createSupportTicket,
};
