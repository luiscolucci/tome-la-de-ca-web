// frontend/src/pages/HomePage.jsx

import React, { useState } from "react";
import { Container } from "@mui/material";
import ItemList from "../components/ItemList";

function HomePage() {
  // A HomePage ainda precisa do refreshKey para se atualizar
  const [refreshKey, setRefreshKey] = useState(0);

  // No futuro, se alguma ação na home precisar atualizar a lista, usaremos esta função
  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ItemList refreshKey={refreshKey} />
    </Container>
  );
}

export default HomePage;
