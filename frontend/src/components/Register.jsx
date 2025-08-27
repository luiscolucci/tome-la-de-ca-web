// frontend/src/components/Register.jsx

import React, { useState } from "react";

function Register() {
  // Criamos um "estado" para cada campo do formulário
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função que será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    // Impede o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    try {
      // Faz a chamada de API para o nosso endpoint de registro no backend
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST", // O método da requisição
        headers: {
          "Content-Type": "application/json", // Avisa que estamos enviando JSON
        },
        // Converte nosso estado do formulário para uma string JSON
        body: JSON.stringify({ displayName, email, password }),
      });

      // Pega a resposta do servidor e converte para JSON
      const data = await response.json();

      // Se a resposta não for bem-sucedida (ex: erro 409 - email já existe),
      // o backend nos manda um objeto com a chave "error"
      if (!response.ok) {
        throw new Error(data.error || "Falha ao cadastrar.");
      }

      // Se tudo deu certo, mostra uma mensagem de sucesso
      alert("Usuário cadastrado com sucesso!");
      // Limpa os campos do formulário
      setDisplayName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      // Se houver qualquer erro, mostra a mensagem de erro
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <br />
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Senha:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Register;
