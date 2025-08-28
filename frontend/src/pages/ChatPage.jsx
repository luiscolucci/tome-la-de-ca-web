// frontend/src/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

function ChatPage() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Efeito para rolar a tela para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Efeito para buscar e "escutar" as mensagens em tempo real
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao escutar mensagens:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Função para enviar uma nova mensagem
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !auth.currentUser) {
      return;
    }

    const currentUser = auth.currentUser;
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    try {
      // Adiciona a nova mensagem à sub-coleção 'messages'
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // Atualiza o documento 'conversation' principal
      const conversationRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationRef, {
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
        lastSenderId: currentUser.uid,
      });

      setNewMessage(""); // Limpa o campo de input
    } catch (error) {
      console.error("ERRO ao tentar enviar a mensagem:", error);
      alert("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        padding: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Conversa
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 2,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg) => {
          const isSender = msg.senderId === auth.currentUser?.uid;
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: isSender ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  backgroundColor: isSender ? "#1976d2" : "#e0e0e0",
                  color: isSender ? "white" : "black",
                  borderRadius: "10px",
                  maxWidth: "60%",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ display: "flex" }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          autoComplete="off"
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}

export default ChatPage;
