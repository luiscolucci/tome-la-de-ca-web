// backend/src/controllers/item.controller.js

const { db } = require("../services/firebase");

// Função para CRIAR um novo item (PROTEGIDA)
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, price } = req.body;
    const { uid, name } = req.user;

    if (!title || !description || !category || !type) {
      return res.status(400).send({ error: "Campos obrigatórios faltando." });
    }

    const newItem = {
      title,
      description,
      category,
      type,
      price: type === "venda" ? price : null,
      userId: uid,
      userName: name,
      createdAt: new Date(),
    };

    const itemRef = await db.collection("items").add(newItem);

    res.status(201).send({
      message: "Item criado com sucesso!",
      itemId: itemRef.id,
      data: newItem,
    });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
}; // Fim da função createItem

// Função para LISTAR TODOS os itens (PÚBLICA)
const getAllItems = async (req, res) => {
  try {
    const itemsSnapshot = await db
      .collection("items")
      .orderBy("createdAt", "desc")
      .get();
    const items = [];

    itemsSnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send(items);
  } catch (error) {
    console.error("Erro ao listar todos os itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
}; // Fim da função getAllItems

// Função para LISTAR OS ITENS DO USUÁRIO LOGADO (PROTEGIDA)
const getMyItems = async (req, res) => {
  try {
    const { uid } = req.user;

    const itemsSnapshot = await db
      .collection("items")
      .where("userId", "==", uid)
      .get();

    const items = [];
    itemsSnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send(items);
  } catch (error) {
    console.error("Erro ao listar meus itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
}; // Fim da função getMyItems

// Exporta as TRÊS funções
module.exports = {
  createItem,
  getAllItems,
  getMyItems,
};
