// frontend/src/components/ItemList.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Itens Disponíveis
      </Typography>

      <Grid container spacing={3}>
        {items.length === 0 ? (
          <Grid item xs={12}>
            <Typography>Nenhum item encontrado.</Typography>
          </Grid>
        ) : (
          items.map((item) => (
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

                  {/* NOVO: Exibe o preço apenas se o item for do tipo 'venda' */}
                  {item.type === "venda" && (
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      R$ {Number(item.price).toFixed(2).replace(".", ",")}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    {item.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Typography variant="caption" display="block">
                    Qtde: {item.quantity} | Por: {item.userName}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default ItemList;
