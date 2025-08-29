const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { defineString } = require("firebase-functions/params");

admin.initializeApp();

// Define os segredos como parâmetros, a nova forma recomendada
const gmailEmail = defineString("GMAIL_EMAIL");
const gmailPassword = defineString("GMAIL_PASSWORD");

// A nossa função principal, agora usando a sintaxe da 2ª Geração
exports.sendSupportTicketEmails = onDocumentCreated(
  "supportTickets/{ticketId}",
  async (event) => {
    // Pega os dados do ticket que foi acabado de criar
    const ticketData = event.data.data();
    const ticketId = event.params.ticketId;

    logger.log("Novo ticket recebido:", ticketId, ticketData);

    // Acede aos segredos usando .value()
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail.value(),
        pass: gmailPassword.value(),
      },
    });

    // 1. Configurações do e-mail para o administrador
    const adminMailOptions = {
      from: `"Tome lá, Dê cá" <${gmailEmail.value()}>`,
      to: gmailEmail.value(),
      subject: `Novo Pedido de Suporte Recebido - Ticket #${ticketData.ticketNumber}`,
      html: `<h1>Novo Pedido de Suporte</h1><p><strong>Ticket:</strong> ${ticketData.ticketNumber}</p><p><strong>De:</strong> ${ticketData.name} (${ticketData.email})</p><p><strong>Assunto:</strong> ${ticketData.subject}</p><hr><p><strong>Mensagem:</strong></p><p>${ticketData.message}</p>`,
    };

    // 2. Configurações do e-mail de confirmação para o cliente
    const clientMailOptions = {
      from: `"Tome lá, Dê cá" <${gmailEmail.value()}>`,
      to: ticketData.email,
      subject: `O seu pedido de suporte foi recebido! - Ticket #${ticketData.ticketNumber}`,
      html: `<h1>Obrigado por nos contactar!</h1><p>Olá ${ticketData.name},</p><p>Recebemos o seu pedido de suporte e já estamos a trabalhar nele. O seu número de ticket é <strong>${ticketData.ticketNumber}</strong>.</p><p>Entraremos em contacto o mais breve possível.</p><br><p>Atenciosamente,</p><p>Equipa Tome lá, Dê cá</p>`,
    };

    try {
      // 3. Envia os dois e-mails
      await mailTransport.sendMail(adminMailOptions);
      logger.log(
        "E-mail para o admin enviado com sucesso para:",
        gmailEmail.value()
      );
      await mailTransport.sendMail(clientMailOptions);
      logger.log(
        "E-mail de confirmação enviado com sucesso para:",
        ticketData.email
      );
    } catch (error) {
      logger.error("Ocorreu um erro ao enviar os e-mails:", error);
    }
  }
);
