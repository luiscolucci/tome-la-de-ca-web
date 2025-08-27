// frontend/src/App.jsx

import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import "./App.css";
import ItemList from "./components/ItemList";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateItem from "./components/CreateItem";
import MyItems from "./components/MyItems";

function App() {
  const [token, setToken] = useState(null);
  // Este "gatilho" avisa os componentes de lista para recarregarem
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setToken(null);
        alert("Você saiu com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  // Esta função aciona o gatilho, forçando a atualização das listas
  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <h1>Tome lá, Dê cá</h1>

      {!token ? (
        <div style={{ display: "flex", gap: "20px" }}>
          <Register />
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <div>
          <p>Você está logado!</p>
          <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
            Sair (Logout)
          </button>
          {/* Passamos a função de gatilho para o componente de criação */}
          <CreateItem token={token} onItemCreated={triggerRefresh} />
          {/* Passamos o gatilho para a lista de "Meus Itens" */}
          <MyItems token={token} refreshKey={refreshKey} />
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
      {/* Passamos o gatilho para a lista pública também */}
      <ItemList refreshKey={refreshKey} />
    </div>
  );
}

export default App;
