// frontend/src/components/Login.jsx

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// Importa os componentes do Material-UI
import { Box, Typography, TextField, Button } from "@mui/material";

// Recebe a função onLoginSuccess para avisar o App.jsx que o login foi bem-sucedido
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Tenta fazer o login com o Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Se o login der certo, chama a função para fechar o modal
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  return (
    // Box é um container flexível. 'component="form"' faz ele se comportar como um formulário.
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth // Ocupa a largura toda
        margin="normal" // Adiciona uma margem padrão
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
      <Button
        type="submit"
        variant="contained" // Estilo do botão
        fullWidth
        sx={{ mt: 2 }} // Adiciona uma margem no topo (mt = margin-top)
      >
        Entrar
      </Button>
    </Box>
  );
}

export default Login;
