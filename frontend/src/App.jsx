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
import {
  ThemeProvider,
  CssBaseline,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import theme from "./theme";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MyAreaPage from "./pages/MyAreaPage";
import ChatPage from "./pages/ChatPage";
import ConversationsPage from "./pages/ConversationsPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Login from "./components/Login";
import Register from "./components/Register";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

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

  useEffect(() => {
    if (!user) {
      setHasUnreadMessages(false);
      return;
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
    return () => unsubscribe();
  }, [user]);

  const clearGlobalNotification = () => {
    setHasUnreadMessages(false);
  };

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Header
            user={user}
            onLoginClick={handleOpenLogin}
            onRegisterClick={handleOpenRegister}
            hasUnreadMessages={hasUnreadMessages}
          />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage token={token} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
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
              <Route
                path="/wishlist"
                element={
                  <PrivateRoute token={token}>
                    <WishlistPage token={token} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
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
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
