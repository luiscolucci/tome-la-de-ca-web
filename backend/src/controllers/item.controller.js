const { db } = require("../services/firebase");

const createItem = async (req, res) => {
  try {
    const { title, description, category, type, price, quantity, imageUrls } =
      req.body;
    const { uid, name } = req.user;

    if (!title || !description || !category || !type) {
      return res.status(400).send({ error: "Campos obrigatórios faltando." });
    }

    if (type === "venda" && (!price || isNaN(price) || Number(price) <= 0)) {
      return res
        .status(400)
        .send({
          error:
            "Para venda, um preço numérico válido maior que zero é obrigatório.",
        });
    }

    const newItem = {
      title,
      description,
      category,
      type,
      price: type === "venda" ? Number(price) : null,
      quantity: Number(quantity) || 1,
      imageUrls: imageUrls || [],
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
};

const getAllItems = async (req, res) => {
  try {
    const { search = "", category = "", page = 1 } = req.query;
    const itemsPerPage = 9;

    let query = db.collection("items").where("status", "==", "disponível");

    if (category) {
      query = query.where("category", "==", category);
    }

    const allItemsSnapshot = await query.get();

    let filteredItems = allItemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    // Ordena os itens da página atual por data
    paginatedItems.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );

    res.status(200).send({
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Erro ao listar todos os itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const getMyItems = async (req, res) => {
  try {
    const { uid } = req.user;
    const itemsSnapshot = await db
      .collection("items")
      .where("userId", "==", uid)
      .get();
    const items = [];
    itemsSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    // Ordena por data antes de enviar
    items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    res.status(200).send(items);
  } catch (error) {
    console.error("Erro ao listar meus itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.params;
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();
    if (!doc.exists)
      return res.status(404).send({ error: "Item não encontrado." });
    if (doc.data().userId !== uid)
      return res
        .status(403)
        .send({ error: "Você não tem permissão para apagar este item." });
    await itemRef.delete();
    res.status(200).send({ message: "Item apagado com sucesso." });
  } catch (error) {
    console.error("Erro ao apagar item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.params;
    const { status: newStatus } = req.body;
    if (!newStatus)
      return res.status(400).send({ error: "O novo status é obrigatório." });
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();
    if (!doc.exists)
      return res.status(404).send({ error: "Item não encontrado." });
    const currentItemData = doc.data();
    if (currentItemData.userId !== uid)
      return res
        .status(403)
        .send({ error: "Você não tem permissão para alterar este item." });
    const currentQuantity = currentItemData.quantity || 1;
    let updatedData;
    if (newStatus === "vendido" && currentQuantity > 1) {
      updatedData = { quantity: currentQuantity - 1 };
      await itemRef.update(updatedData);
      res
        .status(200)
        .send({
          message: "Quantidade do item diminuída em 1.",
          item: { ...currentItemData, ...updatedData },
        });
    } else {
      updatedData = { status: newStatus };
      await itemRef.update(updatedData);
      res
        .status(200)
        .send({
          message: `Status do item atualizado para ${newStatus}.`,
          item: { ...currentItemData, ...updatedData },
        });
    }
  } catch (error) {
    console.error("Erro ao atualizar status do item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();
    if (!doc.exists)
      return res.status(404).send({ error: "Item não encontrado." });
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar item por ID:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItemStatus,
  getItemById,
};
