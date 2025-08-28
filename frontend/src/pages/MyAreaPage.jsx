// frontend/src/pages/MyAreaPage.jsx

import React, { useState } from "react";
import { Grid, Box, Container, Typography, Divider } from "@mui/material";

import CreateItem from "../components/CreateItem";
import MyItems from "../components/MyItems";

// Esta página recebe o token como 'prop' para passar para seus componentes filhos
function MyAreaPage({ token }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Minha Área
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <CreateItem token={token} onItemCreated={triggerRefresh} />
        </Grid>
        <Grid item xs={12} md={7}>
          <MyItems token={token} refreshKey={refreshKey} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default MyAreaPage;
