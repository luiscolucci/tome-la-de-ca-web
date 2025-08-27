// frontend/src/components/CreateItem.jsx

import React, { useState } from "react";

// O componente recebe o token como uma "prop" do App.jsx
function CreateItem({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Adicione outros states para category, type, price se quiser

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // AQUI ESTÁ A MÁGICA! Enviamos o token no cabeçalho de autorização.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category: "Geral", // Vamos simplificar por enquanto
          type: "troca",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao criar item.");
      }

      alert("Item criado com sucesso!");
      setTitle("");
      setDescription("");

      // Idealmente, aqui nós também avisaríamos a ItemList para recarregar. Veremos isso depois!
      window.location.reload(); // Recarrega a página para ver o novo item na lista
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
        <button type="submit" style={{ marginTop: "20px" }}>
          Anunciar Item
        </button>
      </form>
    </div>
  );
}

export default CreateItem;
