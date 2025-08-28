// frontend/src/components/ItemList.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// 1. IMPORTAMOS AS "PEÇAS DE LEGO" DO MUI
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardMedia,
} from "@mui/material";

function ItemList({ refreshKey }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Erro ao buscar itens:", error));
  }, [refreshKey]);

  return (
    // Box é um container genérico do MUI
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Itens Disponíveis
      </Typography>

      {/* Grid container é o que vai organizar nossos cards em uma grade responsiva */}
      <Grid container spacing={3}>
        {items.length === 0 ? (
          <Grid item xs={12}>
            <Typography>Nenhum item encontrado.</Typography>
          </Grid>
        ) : (
          items.map((item) => (
            // Cada Grid item representa uma coluna.
            // xs={12}: Em telas extra pequenas (celular), ocupa 12/12 colunas (tela inteira)
            // sm={6}: Em telas pequenas (tablet), ocupa 6/12 colunas (metade da tela)
            // md={4}: Em telas médias (desktop), ocupa 4/12 colunas (um terço da tela)
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              {/* O Card é o nosso novo container para cada item */}
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Mostra a imagem do item dentro do card */}
                <CardMedia
                  component="img"
                  height="140"
                  image={item.imageUrl || "https://via.placeholder.com/150"} // Imagem padrão se não houver
                  alt={item.title}
                />
                <CardContent>
                  {/* Typography controla a aparência do texto */}
                  <Typography gutterBottom variant="h5" component="div">
                    <Link
                      to={`/item/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description.substring(0, 100)}...
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ marginTop: 2 }}
                  >
                    Qtde: {item.quantity} | Por: {item.userName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default ItemList;
