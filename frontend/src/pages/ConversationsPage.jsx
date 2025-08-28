// frontend/src/pages/ConversationsPage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
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
} from "@mui/material";

function ConversationsPage({ token }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3001/api/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar conversas:", error);
        setLoading(false);
      });
  }, [token]);

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
            // Lógica para encontrar o nome e o ID do OUTRO participante
            const otherParticipantId = convo.participantIds.find(
              (id) => id !== currentUserId
            );
            const otherParticipantName =
              convo.participantNames[otherParticipantId];

            return (
              <React.Fragment key={convo.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  component={Link}
                  to={`/chat/${convo.id}`}
                >
                  <ListItemAvatar>
                    <Avatar alt={convo.itemTitle} src={convo.itemImageUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Conversa com ${otherParticipantName}`}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Sobre o item: {convo.itemTitle}
                      </Typography>
                    }
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
