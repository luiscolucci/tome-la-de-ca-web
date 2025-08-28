// frontend/src/pages/HomePage.jsx

import React, { useState } from "react";
import { Container } from "@mui/material";

import ItemList from "../components/ItemList";
import SearchAndFilter from "../components/SearchAndFilter"; // Importar o novo componente

function HomePage() {
  // Estado para a atualização da lista (continua o mesmo)
  const [refreshKey, setRefreshKey] = useState(0);

  // Novos estados para controlar os valores da pesquisa e do filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Função para forçar a atualização da lista (pode ser usada no futuro)
  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Adicionamos o componente de pesquisa e filtro */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Passamos os valores dos filtros para a ItemList */}
      <ItemList
        refreshKey={refreshKey}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
      />
    </Container>
  );
}

export default HomePage;
