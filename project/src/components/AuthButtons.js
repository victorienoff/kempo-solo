import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthButtons.module.css";

function AuthButtons() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.authButtons}>
      {!token ? (
        <>
          <button className={styles.btn} onClick={() => navigate("/signup")}>S'inscrire</button>
          <button className={styles.btn} onClick={() => navigate("/login")}>Connexion</button>
        </>
      ) : (
        <button className={styles.btn} onClick={handleLogout}>Déconnexion</button>
      )}
    </div>
  );
}

export default AuthButtons;
