// backend/src/controllers/item.controller.js

const { db } = require("../services/firebase");

// Função para CRIAR um novo item (PROTEGIDA)
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, price, quantity } = req.body;
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
      quantity: quantity || 1,
      userId: uid,
      userName: name,
      createdAt: new Date(),
      status: "disponível",
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

const deleteItem = async (req, res) => {
  try {
    // Pega o ID do usuário que está fazendo a requisição (do token)
    const { uid } = req.user;
    // Pega o ID do item que deve ser apagado (da URL, ex: /api/items/xyz123)
    const { itemId } = req.params;

    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    // 1. Verifica se o item realmente existe
    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }

    // 2. VERIFICAÇÃO DE PERMISSÃO: Compara o ID do dono do item com o ID do usuário logado
    if (doc.data().userId !== uid) {
      return res
        .status(403)
        .send({ error: "Você não tem permissão para apagar este item." });
    }

    // 3. Se tudo estiver certo, apaga o item
    await itemRef.delete();

    res.status(200).send({ message: "Item apagado com sucesso." });
  } catch (error) {
    console.error("Erro ao apagar item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { uid } = req.user; // ID do usuário logado
    const { itemId } = req.params; // ID do item a ser atualizado
    const { status } = req.body; // O novo status (ex: 'vendido') virá no corpo da requisição

    // Validação
    if (!status) {
      return res.status(400).send({ error: "O novo status é obrigatório." });
    }

    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }

    if (doc.data().userId !== uid) {
      return res
        .status(403)
        .send({ error: "Você não tem permissão para alterar este item." });
    }

    // Atualiza apenas o campo 'status' do item
    await itemRef.update({ status: status });

    res
      .status(200)
      .send({ message: `Status do item atualizado para ${status}.` });
  } catch (error) {
    console.error("Erro ao atualizar status do item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params; // Pega o ID da URL
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    // Verifica se o documento com esse ID existe
    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }

    // Se existe, retorna os dados do item junto com seu ID
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar item por ID:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

// Exporta as TRÊS funções
module.exports = {
  createItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItemStatus,
  getItemById,
};
