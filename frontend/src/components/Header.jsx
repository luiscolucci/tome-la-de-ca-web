// frontend/src/components/Header.jsx

import React from "react";
import { AppBar, Toolbar, Typography, Button, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header({ user, onLoginClick, onRegisterClick, hasUnreadMessages }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Você saiu com sucesso!");
      navigate("/"); // Usa o navigate para redirecionar
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
          // --- VISTA PARA UTILIZADOR LOGADO ---
          <>
            <Typography sx={{ marginRight: 2 }}>
              Olá, {user.displayName || user.email}
            </Typography>

            <Button component={Link} to="/wishlist" color="inherit">
              Interesses
            </Button>

            <Button component={Link} to="/conversations" color="inherit">
              <Badge color="error" variant="dot" invisible={!hasUnreadMessages}>
                Conversas
              </Badge>
            </Button>

            <Button component={Link} to="/my-area" color="inherit">
              Minha Área
            </Button>

            {/* BOTÃO ADICIONADO AQUI */}
            <Button component={Link} to="/contact" color="inherit">
              Fale Connosco
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          // --- VISTA PARA VISITANTES ---
          <>
            {/* BOTÃO ADICIONADO AQUI TAMBÉM */}
            <Button component={Link} to="/contact" color="inherit">
              Fale Connosco
            </Button>

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
