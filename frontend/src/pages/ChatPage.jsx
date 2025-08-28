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
} from "firebase/firestore";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

function ChatPage() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null); // Referência para o final da lista de mensagens

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Efeito para buscar mensagens em tempo real
  useEffect(() => {
    if (!conversationId) return;

    // Define a consulta para a sub-coleção 'messages' dentro da conversa específica
    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt"));

    // onSnapshot cria o "ouvinte" em tempo real
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
        console.error("Erro ao buscar mensagens: ", error);
        setLoading(false);
      }
    );

    // Limpa o "ouvinte" quando o componente é desmontado
    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !auth.currentUser) return;

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(), // Usa o timestamp do servidor para garantir a ordem
    });

    setNewMessage(""); // Limpa o campo de input
  };

  if (loading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Carregando conversa...
      </Typography>
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

      {/* Área de Mensagens */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 2,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "4px",
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
                variant="outlined"
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
        {/* Elemento invisível no final da lista para o scroll automático */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Formulário de Envio */}
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
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}

export default ChatPage;
