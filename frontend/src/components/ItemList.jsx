// frontend/src/components/ItemList.jsx

import React, { useState, useEffect } from "react";

function ItemList() {
  // 'useState' é um "Hook" do React para guardar dados que podem mudar.
  // Começamos com uma lista de itens vazia.
  const [items, setItems] = useState([]);

  // 'useEffect' é um Hook para executar efeitos colaterais, como buscar dados.
  // O array vazio [] no final faz com que ele rode apenas uma vez, quando o componente é montado.
  useEffect(() => {
    // Esta é a chamada de API para o nosso backend!
    fetch("http://localhost:3001/api/items")
      .then((response) => response.json()) // Converte a resposta para JSON
      .then((data) => setItems(data)) // Atualiza nosso estado 'items' com os dados recebidos
      .catch((error) => console.error("Erro ao buscar itens:", error)); // Lida com possíveis erros
  }, []);

  // O HTML que o componente vai renderizar
  return (
    <div>
      <h2>Itens Disponíveis para Troca/Venda</h2>
      {/* Se não houver itens, mostra uma mensagem. */}
      {items.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        // Se houver itens, mapeia (faz um loop) sobre eles e cria um card para cada um.
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
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
