// frontend/src/api.js

// A URL base da nossa API virá da variável de ambiente que passamos no deploy.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Função para buscar itens
export async function getItems(params) {
  const res = await fetch(`${API_BASE_URL}/api/items?${params}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar itens");
  }
  return res.json();
}

// Função para criar item
export async function createItem(data) {
  const res = await fetch(`${API_BASE_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar item");
  }
  return res.json();
}

// Exportamos a URL para que outros arquivos possam usá-la.
export default API_BASE_URL;
