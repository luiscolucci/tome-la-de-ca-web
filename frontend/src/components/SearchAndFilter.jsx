// frontend/src/components/SearchAndFilter.jsx

import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Lista de categorias disponíveis para o filtro
const categories = [
  "Todos",
  "Roupas",
  "Brinquedos",
  "Eletrónicos",
  "Móveis",
  "Livros",
  "Outros",
];

// O componente recebe o estado e as funções para o atualizar a partir do componente pai (HomePage)
function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 4,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <TextField
        label="Pesquisar por nome ou descrição"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1, minWidth: "250px" }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="category-filter-label">Categoria</InputLabel>
        <Select
          labelId="category-filter-label"
          value={selectedCategory}
          label="Categoria"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {/* Gera as opções do menu a partir da nossa lista de categorias */}
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SearchAndFilter;
