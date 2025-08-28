// frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// MUI Imports para o Modal
import { Modal, Box } from "@mui/material";

// Nossos Componentes e Páginas
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import Login from "./components/Login";
import Register from "./components/Register";

// Estilo para a caixa do Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Estados para controlar os modais
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  // Funções para abrir/fechar os modais
  const handleOpenLogin = () => setOpenLoginModal(true);
  const handleCloseLogin = () => setOpenLoginModal(false);
  const handleOpenRegister = () => setOpenRegisterModal(true);
  const handleCloseRegister = () => setOpenRegisterModal(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
        setUser(currentUser);
      } else {
        setToken(null);
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <Router>
      {/* O Header agora recebe as funções para controlar os modais e o estado de login */}
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onRegisterClick={handleOpenRegister}
      />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage token={token} />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
        </Routes>
      </main>

      {/* Modal de Login */}
      <Modal open={openLoginModal} onClose={handleCloseLogin}>
        <Box sx={modalStyle}>
          <Login
            onLoginSuccess={() => {
              handleCloseLogin();
              // A lógica de setToken já é cuidada pelo onAuthStateChanged
            }}
          />
        </Box>
      </Modal>

      {/* Modal de Cadastro */}
      <Modal open={openRegisterModal} onClose={handleCloseRegister}>
        <Box sx={modalStyle}>
          <Register onRegisterSuccess={handleCloseRegister} />
        </Box>
      </Modal>
    </Router>
  );
}

export default App;
