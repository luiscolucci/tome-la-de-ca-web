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
  CircularProgress,
  Pagination,
} from "@mui/material";

// 1. O componente agora recebe 'page' e 'setPage'
function ItemList({ refreshKey, searchTerm, selectedCategory, page, setPage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // 2. Novo estado para guardar o número total de páginas
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (selectedCategory && selectedCategory !== "Todos") {
      params.append("category", selectedCategory);
    }
    // 3. Adiciona o parâmetro da página à URL
    params.append("page", page);

    const queryString = params.toString();
    const fetchUrl = `http://localhost:3001/api/items?${queryString}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        // 4. O backend agora retorna um objeto, então guardamos as partes corretas
        setItems(data.items);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar itens:", error);
        setLoading(false);
      });
    // 5. O useEffect agora também depende da 'page' para se atualizar
  }, [refreshKey, searchTerm, selectedCategory, page]);

  // 6. Função para lidar com a mudança de página
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Itens Disponíveis
      </Typography>

      <Grid container spacing={3}>
        {items.length === 0 ? (
          <Grid item xs={12}>
            <Typography>
              Nenhum item encontrado com os filtros atuais.
            </Typography>
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

      {/* 7. ADICIONAR O COMPONENTE DE PAGINAÇÃO */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default ItemList;
