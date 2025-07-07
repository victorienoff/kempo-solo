import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButtons from "../../components/AuthButtons";
import styles from "./Login.module.css";
import { apiUrl } from "../../config/api";

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
      const response = await fetch(apiUrl("/login"), {
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
      // Décoder le token pour extraire les droits et les stocker
      try {
        // Utilisation de jwt-decode (doit être installé dans le projet)
        // eslint-disable-next-line
        const decoded = window.jwt_decode ? window.jwt_decode(data.token) : require("jwt-decode")(data.token);
        if (decoded && decoded.rights) {
          localStorage.setItem("user_rights", JSON.stringify(decoded.rights));
        } else {
          localStorage.removeItem("user_rights");
        }
      } catch (e) {
        localStorage.removeItem("user_rights");
      }
      navigate("/", { state: { token: data.token } });
    } catch (err) {
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <AuthButtons />
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
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          className={styles.forgotPasswordBtn}
          style={{ background: 'none', border: 'none', color: '#1a237e', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1rem' }}
          onClick={async () => {
            if (!email) {
              setError("Veuillez entrer votre email pour réinitialiser le mot de passe.");
              return;
            }
            setError("");
            try {
              const response = await fetch(apiUrl(`/send/${encodeURIComponent(email)}`), {
                method: "POST"
              });
              const data = await response.json();
              if (!response.ok) {
                setError(data.error || "Erreur lors de l'envoi de l'email.");
              } else {
                alert("Un email de réinitialisation a été envoyé si l'adresse existe.");
              }
            } catch (err) {
              setError("Erreur réseau lors de l'envoi de l'email.");
            }
          }}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </div>
  );
}

export default Login;