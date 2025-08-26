// backend/src/controllers/item.controller.js

const { db } = require("../services/firebase");

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
};

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
    console.error("Erro ao listar itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

module.exports = {
  createItem,
  getAllItems,
};
