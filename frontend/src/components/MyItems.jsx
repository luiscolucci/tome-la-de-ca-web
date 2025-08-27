// frontend/src/components/MyItems.jsx

import React, { useState, useEffect } from "react";

function MyItems({ token }) {
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3001/api/items/my-items", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setMyItems(data))
      .catch((error) => console.error("Erro ao buscar meus itens:", error));
  }, [token]);

  // --- NOVA FUNÇÃO PARA APAGAR UM ITEM ---
  const handleDelete = async (itemId) => {
    // Pede confirmação antes de apagar
    if (!window.confirm("Tem certeza que deseja apagar este item?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/items/${itemId}`,
        {
          method: "DELETE", // Usa o método DELETE
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token para provar que somos nós
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao apagar o item.");
      }

      alert("Item apagado com sucesso!");

      // ATUALIZA A LISTA NA TELA SEM PRECISAR RECARREGAR A PÁGINA
      // Filtramos o item apagado da nossa lista local
      setMyItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Meus Itens Anunciados</h2>
      {myItems.length === 0 ? (
        <p>Você ainda não anunciou nenhum item.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {myItems.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #eee",
                padding: "10px",
              }}
            >
              <span>{item.title}</span>
              {/* --- NOVO BOTÃO DE APAGAR --- */}
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                }}
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyItems;
