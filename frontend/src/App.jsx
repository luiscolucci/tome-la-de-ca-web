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
// Se o usuário estiver logado (tem token), mostra a página.
// Se não, redireciona para a página inicial.
const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/" />;
};

function App() {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Estados para controlar a visibilidade dos modais
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  // Funções para abrir e fechar os modais
  const handleOpenLogin = () => setOpenLoginModal(true);
  const handleCloseLogin = () => setOpenLoginModal(false);
  const handleOpenRegister = () => setOpenRegisterModal(true);
  const handleCloseRegister = () => setOpenRegisterModal(false);

  // Efeito que roda uma vez para verificar o estado de autenticação do usuário
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
    // Limpa o "ouvinte" quando o componente é desmontado para evitar vazamentos de memória
    return () => unsubscribe();
  }, []);

  // Mostra uma mensagem de "Carregando..." enquanto verifica a sessão do usuário
  if (authLoading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <Router>
      {/* O Header é renderizado fora do <Routes> para aparecer em todas as páginas */}
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onRegisterClick={handleOpenRegister}
      />

      <main>
        {/* O <Routes> decide qual página renderizar com base na URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />

          {/* Nossa nova rota protegida para a "Minha Área" */}
          <Route
            path="/my-area"
            element={
              <PrivateRoute token={token}>
                <MyAreaPage token={token} />
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
