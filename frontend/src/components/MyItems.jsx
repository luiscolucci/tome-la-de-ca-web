// frontend/src/components/MyItems.jsx

import React, { useState, useEffect } from "react";

// Recebe o token do usuário logado via props
function MyItems({ token }) {
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    // Se não tiver token, não faz nada
    if (!token) return;

    // Faz a chamada para a nossa nova rota protegida
    fetch("http://localhost:3001/api/items/my-items", {
      method: "GET",
      headers: {
        // Envia o token para provar que estamos logados
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMyItems(data))
      .catch((error) => console.error("Erro ao buscar meus itens:", error));

    // O useEffect vai rodar novamente se o token mudar (ex: ao fazer login/logout)
  }, [token]);

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Meus Itens Anunciados</h2>
      {myItems.length === 0 ? (
        <p>Você ainda não anunciou nenhum item.</p>
      ) : (
        <ul>
          {myItems.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyItems;
