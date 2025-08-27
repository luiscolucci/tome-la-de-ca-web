// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";

function App() {
  return (
    <Router>
      <div>
        {/* O Header pode ficar aqui para aparecer em todas as páginas */}
        <h1 style={{ textAlign: "center" }}>Tome lá, Dê cá</h1>
        <hr style={{ margin: "40px 0" }} />

        <Routes>
          {/* Rota para a Página Inicial */}
          <Route path="/" element={<HomePage />} />

          {/* Rota para a Página de Detalhes de um Item */}
          {/* O :itemId é um parâmetro, assim como no backend */}
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
