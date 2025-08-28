// backend/src/controllers/user.controller.js

const { db } = require("../services/firebase");
const { FieldValue } = require("firebase-admin/firestore");

// Função para adicionar um item à lista de interesses
const addToWishlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).send({ error: "O ID do item é obrigatório." });
    }

    const userRef = db.collection("users").doc(uid);

    await userRef.set(
      {
        wishlist: FieldValue.arrayUnion(itemId),
      },
      { merge: true }
    );

    res.status(200).send({ message: "Item adicionado à lista de interesses." });
  } catch (error) {
    console.error("Erro ao adicionar à lista de interesses:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

// Função para remover um item da lista de interesses
const removeFromWishlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.params;

    const userRef = db.collection("users").doc(uid);

    await userRef.update({
      wishlist: FieldValue.arrayRemove(itemId),
    });

    res.status(200).send({ message: "Item removido da lista de interesses." });
  } catch (error) {
    console.error("Erro ao remover da lista de interesses:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

// --- FUNÇÃO CORRIGIDA ---
// Função para buscar os itens da lista de interesses
const getWishlist = async (req, res) => {
  try {
    const { uid } = req.user;
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (
      !userDoc.exists ||
      !userDoc.data().wishlist ||
      userDoc.data().wishlist.length === 0
    ) {
      return res.status(200).send([]);
    }

    const itemIds = userDoc.data().wishlist;

    // LÓGICA NOVA E MAIS ROBUSTA:
    // 1. Criamos um array de "promessas", onde cada promessa é a busca por um único item.
    const itemPromises = itemIds.map((id) =>
      db.collection("items").doc(id).get()
    );

    // 2. Esperamos que todas as buscas terminem.
    const itemDocs = await Promise.all(itemPromises);

    // 3. Montamos a nossa lista de resposta.
    const wishlistItems = [];
    itemDocs.forEach((doc) => {
      // Verificamos se o item ainda existe antes de adicioná-lo
      // (caso o dono o tenha apagado, por exemplo)
      if (doc.exists) {
        wishlistItems.push({ id: doc.id, ...doc.data() });
      }
    });

    res.status(200).send(wishlistItems);
  } catch (error) {
    console.error("Erro ao buscar a lista de interesses:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
