// frontend/src/components/CreateItem.jsx

import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import API_BASE_URL from "../api"; // O caminho pode variar um pouco
// 1. IMPORTAMOS MAIS COMPONENTES DO MUI PARA O MENU DE SELEÇÃO
import {
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// 2. DEFINIMOS AS CATEGORIAS DISPONÍVEIS
const categories = [
  "Roupas",
  "Brinquedos",
  "Eletrônicos",
  "Móveis",
  "Livros",
  "Acessórios",
  "Outros",
];

function CreateItem({ token, onItemCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState("troca");
  const [price, setPrice] = useState("");
  // 3. NOVO ESTADO PARA GUARDAR A CATEGORIA SELECIONADA
  const [category, setCategory] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files.length > 5) {
      alert("Você só pode enviar no máximo 5 fotos.");
      e.target.value = "";
      setImageFiles([]);
      return;
    }
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (imageFiles.length === 0) {
      alert("Por favor, selecione pelo menos uma imagem para o item.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = imageFiles.map((file) => {
        const imageRef = ref(storage, `items/${Date.now()}-${file.name}`);
        return uploadBytes(imageRef, file).then(() => getDownloadURL(imageRef));
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 4. ATUALIZAMOS O PAYLOAD PARA ENVIAR A CATEGORIA DO NOSSO ESTADO
      const payload = {
        title,
        description,
        quantity: Number(quantity),
        imageUrls: imageUrls,
        category: category, // Usa a categoria selecionada
        type: type,
        price: type === "venda" ? price : null,
      };

      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar item.");
      }

      alert("Item criado com sucesso!");
      // Limpa todo o formulário, incluindo a nova categoria
      setTitle("");
      setDescription("");
      setQuantity(1);
      setPrice("");
      setType("troca");
      setCategory(""); // Limpa a categoria
      setImageFiles([]);
      if (document.getElementById("file-input")) {
        document.getElementById("file-input").value = "";
      }

      if (onItemCreated) onItemCreated();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Criar Novo Item
      </Typography>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Tipo de Anúncio</FormLabel>
        <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
          <FormControlLabel value="troca" control={<Radio />} label="Troca" />
          <FormControlLabel value="venda" control={<Radio />} label="Venda" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="Título do Item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descrição"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        fullWidth
        margin="normal"
      />

      {/* 5. NOVO CAMPO DE SELEÇÃO DE CATEGORIA */}
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="category-select-label">Categoria</InputLabel>
        <Select
          labelId="category-select-label"
          value={category}
          label="Categoria"
          onChange={(e) => setCategory(e.target.value)}
        >
          {/* Gera as opções do menu a partir do nosso array de categorias */}
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type === "venda" && (
        <TextField
          label="Preço (R$)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputProps={{ min: 0, step: "0.01" }}
          required
          fullWidth
          margin="normal"
        />
      )}

      <TextField
        label="Quantidade"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        inputProps={{ min: 1 }}
        required
        fullWidth
        margin="normal"
      />

      <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
        <Typography variant="body1" sx={{ marginBottom: "5px" }}>
          Imagens do Item (máx. 5):
        </Typography>
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleImageChange}
          required
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isUploading}
      >
        {isUploading ? "Enviando..." : "Anunciar Item"}
      </Button>
    </Box>
  );
}

export default CreateItem;
