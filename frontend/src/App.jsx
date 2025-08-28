// frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Importa componentes do Material-UI
import { Modal, Box, CircularProgress } from "@mui/material";

// Importa nosso Header e todas as Páginas
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MyAreaPage from "./pages/MyAreaPage";
import ChatPage from "./pages/ChatPage";
import ConversationsPage from "./pages/ConversationsPage";

// Importa os componentes de formulário
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

// Componente auxiliar para proteger rotas.
// Se o usuário estiver logado (tem token), mostra a página.
// Se não, redireciona para a página inicial.
const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/" />;
};

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Funções para abrir e fechar os modais
  const handleOpenLogin = () => setOpenLoginModal(true);
  const handleCloseLogin = () => setOpenLoginModal(false);
  const handleOpenRegister = () => setOpenRegisterModal(true);
  const handleCloseRegister = () => setOpenRegisterModal(false);

  // Efeito para verificar a sessão do usuário ao carregar a página
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

  // Efeito "ouvinte global" para notificações de novas mensagens
  useEffect(() => {
    if (!user) {
      setHasUnreadMessages(false);
      return; // Se não há usuário, desliga o ouvinte
    }

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let unreadFound = false;
      querySnapshot.forEach((doc) => {
        const conversation = doc.data();
        if (
          conversation.lastSenderId &&
          conversation.lastSenderId !== user.uid
        ) {
          unreadFound = true;
        }
      });
      setHasUnreadMessages(unreadFound);
    });

    return () => unsubscribe(); // Limpa o ouvinte ao deslogar
  }, [user]); // Roda sempre que o objeto 'user' mudar

  // Função para limpar a notificação global ao entrar na página de conversas
  const clearGlobalNotification = () => {
    setHasUnreadMessages(false);
    // No futuro, podemos adicionar lógica aqui para marcar todas as conversas como lidas no DB.
  };

  // Exibe "Carregando..." enquanto o estado de autenticação é verificado
  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onRegisterClick={handleOpenRegister}
        hasUnreadMessages={hasUnreadMessages}
      />

      <main>
        <Routes>
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
          <Route
            path="/conversations"
            element={
              <PrivateRoute token={token}>
                <ConversationsPage
                  token={token}
                  onEnterPage={clearGlobalNotification}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Modal open={openLoginModal} onClose={handleCloseLogin}>
        <Box sx={modalStyle}>
          <Login onLoginSuccess={handleCloseLogin} />
        </Box>
      </Modal>

      <Modal open={openRegisterModal} onClose={handleCloseRegister}>
        <Box sx={modalStyle}>
          <Register onRegisterSuccess={handleCloseRegister} />
        </Box>
      </Modal>
    </Router>
  );
}

export default App;
