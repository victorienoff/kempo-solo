import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Erreur lors de la connexion.");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/", { state: { token: data.token } });
    } catch (err) {
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Connexion</h1>
      {error && <div className={styles.loginError}>{error}</div>}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label className={styles.loginLabel} htmlFor="email">Email</label>
        <input
          className={styles.loginInput}
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
        <label className={styles.loginLabel} htmlFor="password">Mot de passe</label>
        <input
          className={styles.loginInput}
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button className={styles.loginButton} type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;