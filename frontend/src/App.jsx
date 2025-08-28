// frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Importa componentes do Material-UI para o Modal
import { Modal, Box } from "@mui/material";

// Importa nosso Header, Páginas e Componentes de formulário
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MyAreaPage from "./pages/MyAreaPage";
import ChatPage from "./pages/ChatPage";
import ConversationsPage from "./pages/ConversationsPage";
import Login from "./components/Login";
import Register from "./components/Register";

// Estilo padrão para a caixa (Box) do Modal
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

// Componente auxiliar para proteger rotas
const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/" />;
};

function App() {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

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
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onRegisterClick={handleOpenRegister}
      />

      <main>
        <Routes>
          {/* CORREÇÃO: Passando o token para a HomePage */}
          <Route path="/" element={<HomePage token={token} />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />

          <Route
            path="/my-area"
            element={
              <PrivateRoute token={token}>
                <MyAreaPage token={token} />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:conversationId"
            element={
              <PrivateRoute token={token}>
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* MELHORIA: Adicionando a rota para a Caixa de Entrada */}
          <Route
            path="/conversations"
            element={
              <PrivateRoute token={token}>
                <ConversationsPage token={token} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* Modal de Login */}
      <Modal open={openLoginModal} onClose={handleCloseLogin}>
        <Box sx={modalStyle}>
          <Login onLoginSuccess={handleCloseLogin} />
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
