// frontend/src/pages/ItemDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import API_BASE_URL from "../api"; // Importa a URL base da API

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
    return () => unsubscribe();
  }, []);

  // Efeito para buscar os dados do item do backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/items/${itemId}`)
      .then((response) => {
        if (!response.ok)
          throw new Error("Item não encontrado ou falha na rede");
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
  }, [itemId]);

  const isOwner = currentUser && item && currentUser.uid === item.userId;

  // --- FUNÇÃO PARA O BOTÃO "ENTRAR EM CONTATO" ---
  const handleStartChat = async () => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: itemId }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Não foi possível iniciar a conversa.");
      navigate(`/chat/${data.conversationId}`);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // --- FUNÇÃO PARA O BOTÃO "ADICIONAR AOS INTERESSES" ---
  const handleAddToWishlist = async () => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/users/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: itemId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Não foi possível adicionar o item.");
      }
      alert("Item adicionado à sua lista de interesses com sucesso!");
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

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

      {/* --- BOTÕES DE AÇÃO SEPARADOS --- */}
      {currentUser && !isOwner && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={handleStartChat}>
            Entrar em Contato
          </Button>
          <Button variant="outlined" onClick={handleAddToWishlist}>
            Adicionar aos Interesses
          </Button>
        </Box>
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
