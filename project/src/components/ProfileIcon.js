import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileIcon.module.css";

const ProfileIcon = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.profileIcon} onClick={() => navigate("/profile")}
      title="Profil utilisateur"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f1d33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    </div>
  );
};

export default ProfileIcon;
