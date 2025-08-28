// frontend/src/pages/HomePage.jsx

import React, { useState } from "react";
import { Container } from "@mui/material";

import ItemList from "../components/ItemList";
import SearchAndFilter from "../components/SearchAndFilter";

function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  // 1. NOVO ESTADO PARA CONTROLAR A PÁGINA ATUAL
  const [page, setPage] = useState(1);

  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  // Função para garantir que a pesquisa volta para a primeira página
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1); // Volta para a página 1 ao pesquisar
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setPage(1); // Volta para a página 1 ao filtrar
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      {/* 2. PASSAMOS O ESTADO DA PÁGINA E A FUNÇÃO PARA O ATUALIZAR PARA A ItemList */}
      <ItemList
        refreshKey={refreshKey}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        page={page}
        setPage={setPage}
      />
    </Container>
  );
}

export default HomePage;
