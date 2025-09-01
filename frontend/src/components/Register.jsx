// frontend/src/components/Register.jsx

import React, { useState } from "react";
import API_BASE_URL from "../api"; // Importa a URL base da API

// Importa os componentes do Material-UI
import { Box, Typography, TextField, Button } from "@mui/material";

// Recebe a função onRegisterSuccess para avisar o App.jsx que o cadastro foi bem-sucedido
function Register({ onRegisterSuccess }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao cadastrar.");
      }

      alert("Usuário cadastrado com sucesso! Por favor, faça o login.");

      // Se o cadastro deu certo, chama a função para fechar o modal
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        Cadastre-se
      </Typography>
      <TextField
        label="Nome"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Cadastrar
      </Button>
    </Box>
  );
}

export default Register;
