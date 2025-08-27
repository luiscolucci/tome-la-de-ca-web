// frontend/src/components/MyItems.jsx

import React, { useState, useEffect } from "react";

// Recebe o token e o refreshKey do componente App
function MyItems({ token, refreshKey }) {
  const [myItems, setMyItems] = useState([]);

  // useEffect busca os itens do usuário quando o componente carrega ou quando o token/refreshKey muda
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3001/api/items/my-items", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setMyItems(data))
      .catch((error) => console.error("Erro ao buscar meus itens:", error));
  }, [token, refreshKey]);

  // --- FUNÇÃO PARA APAGAR UM ITEM (COMPLETA) ---
  const handleDelete = async (itemId) => {
    if (!window.confirm("Tem certeza que deseja apagar este item?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao apagar o item.");
      }

      alert("Item apagado com sucesso!");

      // Atualiza a lista na tela removendo o item, sem recarregar a página
      setMyItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // --- FUNÇÃO PARA ATUALIZAR O STATUS (COMPLETA) ---
  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/items/${itemId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status.");
      }

      // Atualiza a lista na tela alterando o status do item, sem recarregar a página
      setMyItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );

      alert(`Item marcado como ${newStatus}!`);
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
              style={{ borderBottom: "1px solid #eee", padding: "15px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{item.title}</strong> (Qtde: {item.quantity})<br />
                  <span
                    style={{
                      fontSize: "0.9em",
                      color: item.status === "disponível" ? "green" : "red",
                    }}
                  >
                    Status: {item.status}
                  </span>
                </div>
                <div>
                  {item.status === "disponível" ? (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "vendido")}
                    >
                      Marcar como Vendido
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "disponível")}
                    >
                      Marcar como Disponível
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      backgroundColor: "#c0392b",
                      color: "white",
                      marginLeft: "10px",
                    }}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyItems;
