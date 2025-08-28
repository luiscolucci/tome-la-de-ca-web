// frontend/src/pages/ItemDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material"; // Importamos o Button
import { onAuthStateChanged } from "firebase/auth"; // Importamos para verificar o usuário logado
import { auth } from "../firebase";

function ItemDetailPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Estado para guardar o usuário logado

  // Efeito para verificar quem é o usuário logado
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  // Efeito para buscar os dados do item
  useEffect(() => {
    const fetchUrl = `http://localhost:3001/api/items/${itemId}`;

    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Item não encontrado");
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

  // LINHA DE INVESTIGAÇÃO: Vamos ver os dados que o componente recebe
  console.log("Dados do item na página de detalhes:", item);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">Erro: {error}</Typography>;
  if (!item) return <Typography>Item não encontrado.</Typography>;

  // Variável para verificar se o usuário logado é o dono do item
  const isOwner = currentUser && currentUser.uid === item.userId;

  const handleInterestClick = () => {
    alert("Funcionalidade de chat ou carrinho será implementada em breve!");
  };

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

      {/* BOTÃO "TENHO INTERESSE" */}
      {/* Condições: O usuário precisa estar logado E não pode ser o dono do item */}
      {currentUser && !isOwner && (
        <Button
          variant="contained"
          onClick={handleInterestClick}
          sx={{ mb: 3 }}
        >
          Tenho Interesse
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
