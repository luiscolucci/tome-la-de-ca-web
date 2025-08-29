/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Inicializa o Firebase Admin para ter acesso ao Firestore
admin.initializeApp();

// Configuração das credenciais de e-mail a partir das variáveis de ambiente seguras
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

// Configura o "transportador" de e-mail usando o serviço do Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Define o e-mail do administrador que receberá os tickets
const ADMIN_EMAIL = "SEU_EMAIL_DE_ADMINISTRADOR_AQUI@exemplo.com";

/**
 * Cloud Function que é acionada sempre que um novo documento
 * é criado na coleção 'supportTickets'.
 */
exports.sendSupportTicketEmails = onDocumentCreated(
  "supportTickets/{ticketId}",
  (event) => {
    // Pega os dados do ticket que acabou de ser criado
    const ticketData = event.data.data();
    const ticketId = event.params.ticketId;

    logger.info(`Novo ticket de suporte recebido: ${ticketId}`, {
      structuredData: true,
    });

    // 1. Prepara o e-mail para o administrador
    const adminMailOptions = {
      from: `"Sistema Tome lá, Dê cá" <${gmailEmail}>`,
      to: ADMIN_EMAIL,
      subject: `Novo Ticket de Suporte: ${ticketData.subject} [#${ticketData.ticketNumber}]`,
      html: `
      <h1>Novo Pedido de Suporte Recebido</h1>
      <p><strong>Ticket ID:</strong> ${ticketData.ticketNumber}</p>
      <p><strong>De:</strong> ${ticketData.name} (${ticketData.email})</p>
      <p><strong>Assunto:</strong> ${ticketData.subject}</p>
      <hr>
      <p><strong>Mensagem:</strong></p>
      <p>${ticketData.message}</p>
    `,
    };

    // 2. Prepara o e-mail de confirmação para o cliente
    const clientMailOptions = {
      from: `"Suporte Tome lá, Dê cá" <${gmailEmail}>`,
      to: ticketData.email,
      subject: `Recebemos o seu pedido de suporte [#${ticketData.ticketNumber}]`,
      html: `
      <h1>Olá, ${ticketData.name}!</h1>
      <p>Obrigado por entrar em contacto connosco.</p>
      <p>Recebemos o seu pedido e a nossa equipa irá analisá-lo o mais breve possível.</p>
      <p>O seu número de ticket para referência é: <strong>${ticketData.ticketNumber}</strong></p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipa Tome lá, Dê cá</p>
    `,
    };

    // 3. Envia os dois e-mails
    return Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ])
      .then(() => {
        logger.info(`E-mails para o ticket ${ticketId} enviados com sucesso!`);
        return null;
      })
      .catch((error) => {
        logger.error(
          `Erro ao enviar e-mails para o ticket ${ticketId}:`,
          error
        );
        return null;
      });
  }
);
