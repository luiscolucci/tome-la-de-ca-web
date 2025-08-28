// frontend/src/pages/WishlistPage.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

function WishlistPage({ token }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegação

  const fetchWishlist = () => {
    if (!token) return;

    fetch("http://localhost:3001/api/users/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setWishlistItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de interesses:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (itemId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/wishlist/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao remover o item.");
      }

      alert("Item removido com sucesso!");
      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // --- NOVA FUNÇÃO PARA INICIAR O CHAT ---
  const handleStartChat = async (itemId) => {
    if (!token) return;
    try {
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
      // Redireciona para a página de chat
      navigate(`/chat/${data.conversationId}`);
    } catch (error) {
      alert(`Erro: ${error.message}`);
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
    <Box sx={{ padding: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Minha Lista de Interesses
      </Typography>
      {wishlistItems.length === 0 ? (
        <Typography>A sua lista de interesses está vazia.</Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    item.imageUrls && item.imageUrls.length > 0
                      ? item.imageUrls[0]
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    <Link
                      to={`/item/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.title}
                    </Link>
                  </Typography>
                  {item.type === "venda" && (
                    <Typography variant="h6" color="primary">
                      R$ {Number(item.price).toFixed(2).replace(".", ",")}
                    </Typography>
                  )}
                </CardContent>
                {/* --- BOTÕES DE AÇÃO ATUALIZADOS --- */}
                <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStartChat(item.id)}
                    fullWidth
                  >
                    Contactar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    fullWidth
                  >
                    Remover
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default WishlistPage;
