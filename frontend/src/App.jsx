// frontend/src/App.jsx

import React, { useState } from "react";
import "./App.css";
import ItemList from "./components/ItemList";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateItem from "./components/CreateItem"; // Vamos criar este em breve

function App() {
  // Guarda o token do usuário. Se for 'null', o usuário não está logado.
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  return (
    <div>
      <h1>Tome lá, Dê cá</h1>

      {/* Renderização Condicional: Mostra uma coisa se o usuário NÃO está logado, e outra se ESTÁ. */}
      {!token ? (
        // Se não há token, mostra os formulários de Login e Cadastro
        <div style={{ display: "flex", gap: "20px" }}>
          <Register />
          <Login onLoginSuccess={handleLoginSuccess} />{" "}
          {/* Passamos a função para o Login */}
        </div>
      ) : (
        // Se há um token, o usuário está logado!
        <div>
          <p>Você está logado!</p>
          <CreateItem token={token} /> {/* Mostra o formulário de criar item */}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
      <ItemList />
    </div>
  );
}

export default App;
