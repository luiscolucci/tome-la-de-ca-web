// frontend/src/pages/AboutPage.jsx

import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Sobre o Tome lá, Dê cá
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Promovendo o Consumo Consciente e a Economia Circular.
        </Typography>
        <Typography variant="body1" paragraph>
          O projeto "Tome lá, Dê cá" nasceu da ideia de que todos temos itens
          valiosos em casa que já não usamos. Em vez de os deixar a ganhar pó
          ou, pior, deitá-los fora, porque não dar-lhes uma nova vida? A nossa
          plataforma foi criada para ser uma ponte segura e divertida,
          conectando pessoas que querem trocar ou vender os seus itens usados,
          promovendo um ciclo de consumo mais sustentável e inteligente.
        </Typography>
        <Typography variant="body1" paragraph>
          Acreditamos que cada troca ou venda de um item seminovo é uma pequena
          vitória contra o desperdício. É uma forma de economizar recursos,
          tanto financeiros como naturais, e de construir uma comunidade mais
          forte e consciente. Ao participar, você não está apenas a renovar os
          seus pertences, está a contribuir ativamente para um futuro mais
          verde.
        </Typography>
        <Typography variant="body1" paragraph>
          Junte-se a nós nesta missão. Anuncie, troque, venda e descubra
          tesouros escondidos. Vamos juntos fazer a diferença, um item de cada
          vez.
        </Typography>
      </Paper>
    </Container>
  );
}

export default AboutPage;
