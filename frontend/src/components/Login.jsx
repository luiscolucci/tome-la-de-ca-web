// frontend/src/components/Login.jsx

import React, { useState } from "react";
// Importa a função de login do Firebase e nossa configuração de autenticação
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      alert("Login bem-sucedido!");

      // EM VEZ DE console.log, AGORA CHAMAMOS A FUNÇÃO QUE VEIO DO App.jsx
      onLoginSuccess(idToken);

      setEmail("");
      setPassword("");
    } catch (error) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
