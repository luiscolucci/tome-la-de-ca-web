// frontend/src/components/ItemList.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// O componente recebe o 'refreshKey' para saber quando se atualizar
function ItemList({ refreshKey }) {
  const [items, setItems] = useState([]);

  // O useEffect busca os dados no backend sempre que o componente é montado ou o refreshKey muda
  useEffect(() => {
    fetch("http://localhost:3001/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Erro ao buscar itens:", error));
  }, [refreshKey]);

  return (
    <div>
      <h2>Itens Disponíveis para Troca/Venda</h2>
      {items.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Exibe a imagem do item, se ela existir */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: "20px",
                    borderRadius: "8px",
                  }}
                />
              )}

              <div>
                {/* O título agora é um link para a página de detalhes */}
                <Link
                  to={`/item/${item.id}`}
                  style={{ textDecoration: "none", color: "#2c3e50" }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "5px" }}>
                    {item.title}
                  </h3>
                </Link>
                <p style={{ margin: "0 0 10px 0" }}>{item.description}</p>
                <small>Quantidade: {item.quantity}</small>
                <br />
                <small>Categoria: {item.category}</small> <br />
                <small>Anunciado por: {item.userName}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;
