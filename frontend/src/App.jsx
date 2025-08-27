// frontend/src/App.jsx

import React, { useState } from "react";
// 1. IMPORTAMOS AS FERRAMENTAS NECESSÁRIAS DO FIREBASE
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import "./App.css";
import ItemList from "./components/ItemList";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateItem from "./components/CreateItem";
import MyItems from "./components/MyItems"; // 1. Importa o novo componente

function App() {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  // 2. CRIAMOS A FUNÇÃO DE LOGOUT
  const handleLogout = () => {
    signOut(auth) // Avisa o Firebase para encerrar a sessão
      .then(() => {
        setToken(null); // Limpa nosso token local, deslogando o usuário na interface
        alert("Você saiu com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout.");
      });
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
          {/* 3. ADICIONAMOS O BOTÃO DE LOGOUT */}
          <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
            Sair (Logout)
          </button>
          <CreateItem token={token} />
          <MyItems token={token} />{" "}
          {/* 2. Adiciona o componente aqui, passando o token */}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
      <ItemList />
    </div>
  );
}

export default App;
