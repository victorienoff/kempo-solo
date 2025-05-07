import React, { useState, useEffect } from "react";
import styles from "./EditCompetitors.module.css";
import axios from "axios";

const EditCompetitors = ({ isOpen, onClose, competitor, onSave }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthday: "",
    club: "",
    country: "",
    weight: "",
    rank: "",
    gender: "",
  });

  useEffect(() => {
    if (competitor) {
      setFormData(competitor);
    }
  }, [competitor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/competitors/${competitor.id}`, formData);
      alert("✅ Compétiteur mis à jour !");
      onSave(); // trigger refresh
      onClose();
    } catch (err) {
      console.error("❌ Erreur mise à jour :", err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>✏️ Modifier Compétiteur</h2>
        <div className={styles.form}>
          <input name="firstname" placeholder="Prénom" value={formData.firstname} onChange={handleChange} />
          <input name="lastname" placeholder="Nom" value={formData.lastname} onChange={handleChange} />
          <input name="birthday" type="date" value={formData.birthday?.substring(0, 10)} onChange={handleChange} />
          <input name="club" placeholder="Club" value={formData.club} onChange={handleChange} />
          <input name="country" placeholder="Pays" value={formData.country} onChange={handleChange} />
          <input name="weight" type="number" placeholder="Poids" value={formData.weight} onChange={handleChange} />
          <input name="rank" placeholder="Grade" value={formData.rank} onChange={handleChange} />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Genre</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Annuler</button>
          <button onClick={handleSubmit} className={styles.saveBtn}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default EditCompetitors;
