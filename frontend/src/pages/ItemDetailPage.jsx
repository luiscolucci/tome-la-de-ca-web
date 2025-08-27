// frontend/src/pages/ItemDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ItemDetailPage() {
  // O hook 'useParams' pega os parâmetros da URL, no nosso caso, o 'itemId'.
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Busca os dados do item específico na nossa API do backend
    fetch(`http://localhost:3001/api/items/${itemId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Item não encontrado");
        }
        return response.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [itemId]); // Roda o efeito sempre que o itemId na URL mudar

  // Enquanto os dados estão carregando
  if (loading) {
    return <p>Carregando detalhes do item...</p>;
  }

  // Se deu erro ao buscar
  if (error) {
    return <p>Erro: {error}</p>;
  }

  // Se o item não foi encontrado
  if (!item) {
    return <p>Item não encontrado.</p>;
  }

  // Se tudo deu certo, exibe os detalhes
  return (
    <div style={{ border: "1px solid #ccc", padding: "20px" }}>
      <h2>{item.title}</h2>
      <p>
        <strong>Descrição:</strong> {item.description}
      </p>
      <p>
        <strong>Quantidade:</strong> {item.quantity}
      </p>
      <p>
        <strong>Categoria:</strong> {item.category}
      </p>
      <p>
        <strong>Status:</strong> {item.status}
      </p>
      <p>
        <strong>Anunciado por:</strong> {item.userName}
      </p>

      <br />
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}

export default ItemDetailPage;
