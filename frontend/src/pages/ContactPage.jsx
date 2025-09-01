// frontend/src/pages/ContactPage.jsx

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Grid, // Importação movida para o topo
} from "@mui/material";
import API_BASE_URL from "../api"; // Importa a URL base da API

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Ocorreu uma falha ao enviar o seu pedido."
        );
      }

      setSubmissionResult({
        success: true,
        message: data.message,
        ticketId: data.ticketId,
      });

      // Limpa o formulário
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Fale Conosco
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Tem alguma questão ou sugestão? Preencha o formulário abaixo e a nossa
          equipa entrará em contacto.
        </Typography>

        {/* Mostra o resultado do envio aqui */}
        {submissionResult && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: "4px",
              backgroundColor: submissionResult.success
                ? "success.light"
                : "error.light",
              color: submissionResult.success ? "success.dark" : "error.dark",
            }}
          >
            <Typography variant="h6">{submissionResult.message}</Typography>
            {submissionResult.ticketId && (
              <Typography>
                O seu número de ticket é:{" "}
                <strong>{submissionResult.ticketId}</strong>
              </Typography>
            )}
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="O seu Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="O seu Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Assunto"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="A sua Mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                fullWidth
                multiline
                rows={6}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Enviar Pedido"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default ContactPage;
