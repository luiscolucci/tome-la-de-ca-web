// frontend/src/components/ItemList.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ItemList({ refreshKey }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Erro ao buscar itens:", error));
    // A CORREÇÃO: O useEffect roda de novo sempre que o refreshKey muda.
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
                margin: "10px",
                padding: "10px",
              }}
            >
              {/* 2. TRANSFORME O TÍTULO EM UM LINK */}
              <Link
                to={`/item/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>{item.title}</h3>
              </Link>
              <p>{item.description}</p>
              <small>Quantidade: {item.quantity}</small>
              <br />
              <small>Categoria: {item.category}</small> <br />
              <small>Anunciado por: {item.userName}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;
