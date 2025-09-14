// backend/src/controllers/item.controller.js

const { db } = require("../services/firebase");

/**
 * Cria um novo item na base de dados.
 */
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, price, quantity, imageUrls } =
      req.body;
    // req.user é adicionado pelo middleware checkAuth
    const { uid, name } = req.user;

    // Validação de campos essenciais
    if (!title || !description || !category || !type) {
      return res.status(400).send({ error: "Campos obrigatórios em falta." });
    }
    if (type === "venda" && (!price || isNaN(price) || Number(price) <= 0)) {
      return res.status(400).send({
        error:
          "Para venda, é obrigatório um preço numérico válido maior que zero.",
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
    });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

/**
 * Obtém todos os itens disponíveis, com filtros e paginação.
 * Contém registos de diagnóstico detalhados.
 */
const getAllItems = async (req, res) => {
  console.log("\n--- [getAllItems] Nova Requisição ---");
  try {
    const { search = "", category = "", page = 1 } = req.query;
    console.log(
      `  -> Parâmetros recebidos: search='${search}', category='${category}', page='${page}'`
    );

    const itemsPerPage = 9;
    let query = db.collection("items").where("status", "==", "disponível");

    if (category && category !== "Todos") {
      console.log(`  -> A aplicar filtro de categoria: '${category}'`);
      query = query.where("category", "==", category);
    }

    const allItemsSnapshot = await query.get();
    console.log(
      `  -> O Firestore encontrou ${allItemsSnapshot.size} item(ns) com o estado 'disponível' (e categoria, se aplicável).`
    );

    if (allItemsSnapshot.empty) {
      console.log(
        "  -> A base de dados não retornou itens. A enviar resposta vazia."
      );
      return res.status(200).send({
        items: [],
        totalPages: 0,
        currentPage: 1,
      });
    }

    let itemsFromDB = allItemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let filteredItems = itemsFromDB;
    if (search) {
      const searchLower = search.toLowerCase();
      const countBefore = filteredItems.length;
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
      console.log(
        `  -> A pesquisa em memória filtrou de ${countBefore} para ${filteredItems.length} item(ns).`
      );
    }

    // Ordena por data DEPOIS de filtrar, mas ANTES de paginar
    filteredItems.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    console.log(
      `  -> A paginar: a enviar ${paginatedItems.length} de um total de ${totalItems} itens para a página ${page}.`
    );

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: Number(page),
    };

    console.log("  -> Resposta enviada com sucesso.");
    res.status(200).send(responseData);
  } catch (error) {
    console.error("--- ERRO GRAVE EM getAllItems ---:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

/**
 * Obtém os itens pertencentes ao utilizador autenticado.
 */
const getMyItems = async (req, res) => {
  try {
    const { uid } = req.user;
    const itemsSnapshot = await db
      .collection("items")
      .where("userId", "==", uid)
      .get();

    const items = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    res.status(200).send(items);
  } catch (error) {
    console.error("Erro ao listar os meus itens:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

/**
 * Apaga um item, verificando a permissão do utilizador.
 */
const deleteItem = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.params;
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }
    if (doc.data().userId !== uid) {
      return res
        .status(403)
        .send({ error: "Não tem permissão para apagar este item." });
    }
    await itemRef.delete();
    res.status(200).send({ message: "Item apagado com sucesso." });
  } catch (error) {
    console.error("Erro ao apagar item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

/**
 * Atualiza o estado de um item (ex: disponível -> vendido).
 */
const updateItemStatus = async (req, res) => {
  try {
    const { uid } = req.user;
    const { itemId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ error: "O novo estado é obrigatório." });
    }

    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }
    if (doc.data().userId !== uid) {
      return res
        .status(403)
        .send({ error: "Não tem permissão para alterar este item." });
    }

    await itemRef.update({ status });
    res
      .status(200)
      .send({ message: `Estado do item atualizado para ${status}.` });
  } catch (error) {
    console.error("Erro ao atualizar o estado do item:", error);
    res.status(500).send({ error: "Ocorreu um erro no servidor." });
  }
};

/**
 * Obtém um único item pelo seu ID.
 */
const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const itemRef = db.collection("items").doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: "Item não encontrado." });
    }
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao obter item por ID:", error);
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
