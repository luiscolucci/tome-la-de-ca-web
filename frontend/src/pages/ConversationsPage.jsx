// frontend/src/pages/ConversationsPage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Badge,
} from "@mui/material";

// O componente agora recebe a função para limpar a notificação global
function ConversationsPage({ token, onEnterPage }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;

  // Efeito que roda UMA VEZ quando a página abre para limpar a notificação do Header
  useEffect(() => {
    if (onEnterPage) {
      onEnterPage();
    }
  }, [onEnterPage]);

  // Efeito que agora "escuta" as conversas em tempo real
  useEffect(() => {
    if (!token) return;

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos = [];
      querySnapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() });
      });
      setConversations(convos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [token, currentUserId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Minha Caixa de Entrada
      </Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {conversations.length === 0 ? (
          <Typography>Você não tem nenhuma conversa ainda.</Typography>
        ) : (
          conversations.map((convo, index) => {
            const otherParticipantId = convo.participantIds.find(
              (id) => id !== currentUserId
            );
            const otherParticipantName =
              convo.participantNames[otherParticipantId];

            // Lógica para saber se a conversa está "não lida" para o usuário atual
            const isUnread =
              convo.lastSenderId && convo.lastSenderId !== currentUserId;

            return (
              <React.Fragment key={convo.id}>
                <ListItem button component={Link} to={`/chat/${convo.id}`}>
                  <ListItemAvatar>
                    {/* O BADGE MOSTRA O PONTO DE NOTIFICAÇÃO INDIVIDUAL */}
                    <Badge color="error" variant="dot" invisible={!isUnread}>
                      <Avatar alt={convo.itemTitle} src={convo.itemImageUrl} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Conversa com ${otherParticipantName}`}
                    secondary={`Sobre o item: ${convo.itemTitle}`}
                  />
                </ListItem>
                {index < conversations.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          })
        )}
      </List>
    </Box>
  );
}

export default ConversationsPage;
