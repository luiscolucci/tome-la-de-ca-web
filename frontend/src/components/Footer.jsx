// frontend/src/components/Footer.jsx

import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // py = padding no eixo y (topo e fundo)
        px: 2, // px = padding no eixo x (lados)
        mt: "auto", // mt: 'auto' empurra o rodapé para o fundo da página
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          Tome lá, Dê cá | Desenvolvido por Luis Colucci ©{" "}
          {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink component={RouterLink} to="/about" color="inherit">
            Sobre Nós
          </MuiLink>
          {" | "}
          <MuiLink component={RouterLink} to="/contact" color="inherit">
            Fale Conosco
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}

// A LINHA QUE FALTAVA ESTÁ AQUI
export default Footer;
