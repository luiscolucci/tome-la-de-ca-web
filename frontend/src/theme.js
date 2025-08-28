// frontend/src/theme.js

import { createTheme } from "@mui/material/styles";

// Criamos o nosso objeto de tema personalizado
const theme = createTheme({
  // 1. PALETA DE CORES
  palette: {
    primary: {
      main: "#0077b6", // Um azul profissional e moderno
    },
    secondary: {
      main: "#00b4d8", // Um azul-ciano para contraste
    },
    background: {
      default: "#f7f9fc", // Um cinzento muito claro para o fundo
      paper: "#ffffff", // O fundo dos nossos cards e modais será branco puro
    },
    text: {
      primary: "#333333", // Cor de texto principal um pouco mais suave que o preto
      secondary: "#555555",
    },
  },

  // 2. TIPOGRAFIA
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 700, // Títulos mais fortes
    },
    h5: {
      fontWeight: 600,
    },
  },

  // 3. ESTILOS GLOBAIS PARA COMPONENTES
  components: {
    // Estilo para todos os botões
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Botões com cantos mais arredondados
          textTransform: "none", // Texto do botão sem ser tudo em maiúsculas
        },
      },
    },
    // Estilo para todos os cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Cards com cantos mais arredondados
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // Uma sombra mais suave
          border: "1px solid #e0e0e0",
        },
      },
    },
    // Estilo para a barra do topo (Header)
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none", // Remove a sombra padrão para um look mais "flat"
        },
      },
    },
  },
});

export default theme;
