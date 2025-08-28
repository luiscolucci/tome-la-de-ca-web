// frontend/src/components/Header.jsx

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header({ user, onLoginClick, onRegisterClick }) {
  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Você saiu com sucesso!");
    });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Título do site, que é um link para a home */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Tome lá, Dê cá
          </Link>
        </Typography>

        {/* Lógica: Se o usuário existe (está logado), mostra o email e o botão de Sair.
            Se não, mostra os botões de Login e Cadastro. */}
        {user ? (
          <>
            <Typography sx={{ marginRight: 2 }}>
              Olá, {user.displayName || user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={onLoginClick}>
              Login
            </Button>
            <Button color="inherit" onClick={onRegisterClick}>
              Cadastrar
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
