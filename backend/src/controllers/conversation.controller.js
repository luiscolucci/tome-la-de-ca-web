// backend/src/controllers/conversation.controller.js

const { db } = require("../services/firebase");

// Função para iniciar uma nova conversa ou encontrar uma existente
const startConversation = async (req, res) => {
  try {
    const { itemId } = req.body; // O frontend nos enviará o ID do item
    const buyerId = req.user.uid; // O ID do comprador (usuário logado) vem do token

    if (!itemId) {
      return res.status(400).send({ error: "O ID do item é obrigatório." });
    }

    // 1. Busca os dados do item para encontrar o dono (vendedor)
    const itemRef = db.collection("items").doc(itemId);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }
    const itemData = itemDoc.data();
    const sellerId = itemData.userId;

    // 2. Verifica se o usuário está tentando iniciar uma conversa consigo mesmo
    if (buyerId === sellerId) {
      return res
        .status(400)
        .send({
          error: "Você não pode iniciar uma conversa sobre um item seu.",
        });
    }

    const participantIds = [buyerId, sellerId];

    // 3. Verifica se já existe uma conversa entre esses dois usuários sobre este item
    const conversationsRef = db.collection("conversations");
    const querySnapshot = await conversationsRef
      .where("itemId", "==", itemId)
      .where("participantIds", "array-contains", buyerId)
      .get();

    let existingConversation = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Garante que a conversa é exatamente entre estes dois participantes
      if (data.participantIds.includes(sellerId)) {
        existingConversation = { id: doc.id, ...data };
      }
    });

    // 4. Se a conversa já existe, retorna o ID dela
    if (existingConversation) {
      return res.status(200).send({
        message: "Conversa já existente.",
        conversationId: existingConversation.id,
      });
    }

    // 5. Se não existe, cria uma nova conversa
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
    // Este erro provavelmente será sobre a falta de um índice no Firestore
    console.error("Erro ao iniciar conversa:", error);
    res
      .status(500)
      .send({ error: "Ocorreu um erro no servidor.", details: error.message });
  }
};

module.exports = {
  startConversation,
};
