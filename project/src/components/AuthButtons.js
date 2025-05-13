import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthButtons.module.css";
import Profile from "../pages/Profile/Profile";
import ProfileIcon from "./ProfileIcon";

function AuthButtons() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_rights"); // Supprime aussi les droits à la déconnexion
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
        <><button className={styles.btn} onClick={handleLogout}>Déconnexion</button>
        <ProfileIcon className={styles.profileIcon} onClick={() => navigate("/profile")} /></>
      )}
    </div>
  );
}

export default AuthButtons;
