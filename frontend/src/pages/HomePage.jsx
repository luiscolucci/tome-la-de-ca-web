// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import ItemList from "../components/ItemList";
import SearchAndFilter from "../components/SearchAndFilter";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "Todos"
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category && category !== "Todos") params.set("category", category);
    if (page > 1) params.set("page", page);
    navigate({ search: params.toString() }, { replace: true });
  }, [searchTerm, category, page, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={category} // Alinha com o nome esperado pelo SearchAndFilter
        setSelectedCategory={setCategory} // Alinha com o nome esperado pelo SearchAndFilter
        onSearch={() => setPage(1)} // Reseta a página para 1 em nova busca
      />
      <ItemList
        searchTerm={searchTerm}
        category={category}
        page={page}
        onPageChange={(newPage) => setPage(newPage)} // Corrige para passar uma função com argumento
      />
    </Container>
  );
}

export default HomePage;
