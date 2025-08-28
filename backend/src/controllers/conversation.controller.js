// backend/src/controllers/conversation.controller.js

const { db } = require("../services/firebase");

// Função para iniciar uma nova conversa ou encontrar uma existente
const startConversation = async (req, res) => {
  try {
    const { itemId } = req.body;
    const buyerId = req.user.uid;

    if (!itemId) {
      return res.status(400).send({ error: "O ID do item é obrigatório." });
    }

    const itemRef = db.collection("items").doc(itemId);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }
    const itemData = itemDoc.data();
    const sellerId = itemData.userId;

    if (buyerId === sellerId) {
      return res.status(400).send({
        error: "Você não pode iniciar uma conversa sobre um item seu.",
      });
    }

    const participantIds = [buyerId, sellerId];

    const conversationsRef = db.collection("conversations");
    const querySnapshot = await conversationsRef
      .where("itemId", "==", itemId)
      .where("participantIds", "array-contains", buyerId)
      .get();

    let existingConversation = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participantIds.includes(sellerId)) {
        existingConversation = { id: doc.id, ...data };
      }
    });

    if (existingConversation) {
      return res.status(200).send({
        message: "Conversa já existente.",
        conversationId: existingConversation.id,
      });
    }

    const newConversation = {
      participantIds,
      participantNames: {
        [buyerId]: req.user.name,
        [sellerId]: itemData.userName,
      },
      itemId: itemId,
      itemTitle: itemData.title,
      itemImageUrl:
        itemData.imageUrls && itemData.imageUrls.length > 0
          ? itemData.imageUrls[0]
          : null,
      lastMessage: "",
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const conversationRef = await conversationsRef.add(newConversation);

    res.status(201).send({
      message: "Conversa iniciada com sucesso!",
      conversationId: conversationRef.id,
    });
  } catch (error) {
    console.error("Erro ao iniciar conversa:", error);
    res
      .status(500)
      .send({ error: "Ocorreu um erro no servidor.", details: error.message });
  }
};

// --- FUNÇÃO ADICIONADA ---
const getUserConversations = async (req, res) => {
  try {
    const { uid } = req.user; // Pega o ID do usuário logado

    const querySnapshot = await db
      .collection("conversations")
      .where("participantIds", "array-contains", uid)
      .orderBy("updatedAt", "desc") // Ordena pelas mais recentes
      .get();

    const conversations = [];
    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send(conversations);
  } catch (error) {
    console.error("Erro ao buscar conversas do usuário:", error);
    res
      .status(500)
      .send({ error: "Ocorreu um erro no servidor.", details: error.message });
  }
};

// --- EXPORTAÇÃO ATUALIZADA ---
module.exports = {
  startConversation,
  getUserConversations,
};
