// frontend/src/pages/ItemDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Efeito para verificar quem é o usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Limpa o "ouvinte" ao desmontar
  }, []);

  // Efeito para buscar os dados do item do backend
  useEffect(() => {
    const fetchUrl = `http://localhost:3001/api/items/${itemId}`;

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Item não encontrado ou falha na rede");
        }
        return response.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [itemId]); // Roda o efeito sempre que o itemId na URL mudar

  // Variável que checa se o usuário logado é o dono do item
  const isOwner = currentUser && item && currentUser.uid === item.userId;

  // Função para o botão "Tenho Interesse"
  const handleInterestClick = async () => {
    if (!currentUser) {
      alert("Você precisa estar logado para iniciar uma conversa.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch("http://localhost:3001/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: itemId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível iniciar a conversa.");
      }

      const { conversationId } = data;
      // Redireciona o usuário para a página de chat com o ID da conversa
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // Renderiza estados de carregamento e erro
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        Erro: {error}
      </Typography>
    );
  if (!item)
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Item não encontrado.
      </Typography>
    );

  // Renderiza a página com os detalhes do item
  return (
    <Box sx={{ padding: { xs: 2, md: 3 } }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {item.title}
      </Typography>

      {item.type === "venda" && item.price > 0 && (
        <Typography variant="h4" component="p" color="primary" gutterBottom>
          R$ {Number(item.price).toFixed(2).replace(".", ",")}
        </Typography>
      )}

      <Box
        sx={{ display: "flex", gap: "20px", marginBottom: 3, flexWrap: "wrap" }}
      >
        {item.imageUrls && item.imageUrls.length > 0 ? (
          item.imageUrls.map((url, index) => (
            <Box
              key={index}
              component="img"
              sx={{
                height: 150,
                width: 150,
                objectFit: "cover",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              alt={`${item.title} - foto ${index + 1}`}
              src={url}
            />
          ))
        ) : (
          <Typography variant="caption">Nenhuma imagem fornecida.</Typography>
        )}
      </Box>

      {/* Botão "Tenho Interesse", que só aparece se o usuário estiver logado e NÃO for o dono do item */}
      {currentUser && !isOwner && (
        <Button
          variant="contained"
          onClick={handleInterestClick}
          sx={{ mb: 3 }}
        >
          Tenho Interesse / Entrar em Contato
        </Button>
      )}

      <Typography variant="body1" paragraph>
        <strong>Descrição:</strong> {item.description}
      </Typography>
      <Typography variant="body1">
        <strong>Quantidade:</strong> {item.quantity}
      </Typography>
      <Typography variant="body1">
        <strong>Categoria:</strong> {item.category}
      </Typography>
      <Typography variant="body1">
        <strong>Status:</strong> {item.status}
      </Typography>
      <Typography variant="body1">
        <strong>Anunciado por:</strong> {item.userName}
      </Typography>

      <br />
      <Link to="/">Voltar para a página inicial</Link>
    </Box>
  );
}

export default ItemDetailPage;
