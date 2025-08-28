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
      // O ideal é redirecionar para a home após o logout
      window.location.href = "/";
    });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Tome lá, Dê cá
          </Link>
        </Typography>

        {user ? (
          <>
            <Typography sx={{ marginRight: 2 }}>
              Olá, {user.displayName || user.email}
            </Typography>

            {/* NOVO BOTÃO QUE LEVA PARA A /my-area */}
            <Button component={Link} to="/my-area" color="inherit">
              Minha Área
            </Button>

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
