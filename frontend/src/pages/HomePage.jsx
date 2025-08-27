// frontend/src/pages/HomePage.jsx

import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import ItemList from "../components/ItemList";
import Register from "../components/Register";
import Login from "../components/Login";
import CreateItem from "../components/CreateItem";
import MyItems from "../components/MyItems";

function HomePage() {
  const [token, setToken] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setToken(null);
      alert("Você saiu com sucesso!");
    });
  };

  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <>
      {" "}
      {/* Usamos um Fragment <>...</> para não adicionar uma div extra */}
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
          <CreateItem token={token} onItemCreated={triggerRefresh} />
          <MyItems token={token} refreshKey={refreshKey} />
        </div>
      )}
      <hr style={{ margin: "40px 0" }} />
      <ItemList refreshKey={refreshKey} />
    </>
  );
}

export default HomePage;
