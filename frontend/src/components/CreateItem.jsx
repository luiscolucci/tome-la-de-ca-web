// frontend/src/components/CreateItem.jsx

import React, { useState } from "react";

function CreateItem({ token, onItemCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          quantity: Number(quantity),
          category: "Geral",
          type: "troca",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar item.");
      }

      alert("Item criado com sucesso!");
      setTitle("");
      setDescription("");
      setQuantity(1);

      // A CORREÇÃO: Chamamos a função para atualizar as listas, sem recarregar a página.
      if (onItemCreated) {
        onItemCreated();
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Criar Novo Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Descrição:</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Quantidade:</label>
          <br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Anunciar Item
        </button>
      </form>
    </div>
  );
}

export default CreateItem;
