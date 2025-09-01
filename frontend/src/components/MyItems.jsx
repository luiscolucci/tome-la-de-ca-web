// frontend/src/components/MyItems.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api"; // Usado para a URL base da API

function MyItems({ token, refreshKey }) {
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/api/items/my-items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMyItems(data))
      .catch((error) => console.error("Erro ao buscar meus itens:", error));
  }, [token, refreshKey]);

  // --- FUNÇÃO DE APAGAR (COMPLETA) ---
  const handleDelete = async (itemId) => {
    if (!window.confirm("Tem certeza que deseja apagar este item?")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao apagar o item.");
      }
      alert("Item apagado com sucesso!");
      setMyItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // --- FUNÇÃO DE ATUALIZAR STATUS (COMPLETA) ---
  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/items/${itemId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao atualizar o status.");
      }

      setMyItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, ...data.item } : item
        )
      );

      alert(data.message);
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  {item.imageUrls && item.imageUrls.length > 0 && (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <Link
                      to={`/item/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <strong>{item.title}</strong>
                    </Link>
                    <span> (Qtde: {item.quantity})</span>
                    <br />

                    {item.type === "venda" && (
                      <span style={{ fontWeight: "bold", color: "#1976d2" }}>
                        R$ {Number(item.price).toFixed(2).replace(".", ",")}
                      </span>
                    )}

                    <br />
                    <span
                      style={{
                        fontSize: "0.9em",
                        color: item.status === "disponível" ? "green" : "red",
                      }}
                    >
                      Status: {item.status}
                    </span>
                  </div>
                </div>
                {/* --- BOTÕES DE AÇÃO (COMPLETOS) --- */}
                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
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
                    style={{ backgroundColor: "#c0392b", color: "white" }}
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
