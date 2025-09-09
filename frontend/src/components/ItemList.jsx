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
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getItems } from "../api"; // ✅ usamos a função pronta da API

function ItemList({ searchTerm, category, page, onPageChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Monta query params dinamicamente
        const params = new URLSearchParams({
          page,
          search: searchTerm || "",
        });

        if (category && category !== "Todos") {
          params.append("category", category);
        }

        console.log("Buscando itens em:", `/api/items?${params.toString()}`);

        // Chama a função da API
        const data = await getItems(params.toString());

        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchTerm, category, page]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
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
                  {item.type === "venda" && item.price && (
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
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default ItemList;
