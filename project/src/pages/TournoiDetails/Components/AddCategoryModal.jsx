import React, { useState, useEffect } from "react";
import styles from "./AddCategoryModal.module.css";
import axios from "axios";
import { apiUrl } from '../../../config/api';

const gradesList = [
  "Ceinture Blanche", "Ceinture Jaune", "Ceinture Orange", "Ceinture Verte",
  "Ceinture Bleue", "Ceinture Marron",
  "Ceinture Noire 1ère dan", "Ceinture Noire 2ème dan", "Ceinture Noire 3ème dan",
  "Ceinture Noire 4ème dan", "Ceinture Noire 5ème dan", "Ceinture Noire 6ème dan"
];

const AddCategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [gender, setGender] = useState("");
  const [weightCategoryId, setWeightCategoryId] = useState("");
  const [ageGroupId, setAgeGroupId] = useState("");
  const [weightCategories, setWeightCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [eliminationType, setEliminationType] = useState("Directe");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        };
        const [weights, ages] = await Promise.all([
          axios.get(apiUrl("/api/weight-categories"), axiosConfig),
          axios.get(apiUrl("/api/age-groups"), axiosConfig)
        ]);
        setWeightCategories(weights.data);
        setAgeGroups(ages.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    if (isOpen) fetchOptions();
  }, [isOpen]);

  const handleGradeChange = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGrades.length || !gender || !weightCategoryId || !ageGroupId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onSubmit({
      grades: selectedGrades,
      gender,
      weight_category_id: parseInt(weightCategoryId),
      age_group_id: parseInt(ageGroupId),
      elimination_type: eliminationType
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ajouter une Catégorie</h2>
        <form onSubmit={handleSubmit}>
          <fieldset style={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
            <legend>Grade *</legend>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2em" }}>
              {gradesList.map((grade) => (
                <label
                  key={grade}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    fontWeight: "normal"
                  }}
                >
                  <span style={{ minWidth: "150px", display: "inline-block" }}>{grade}</span>
                  <input
                    type="checkbox"
                    checked={selectedGrades.includes(grade)}
                    onChange={() => handleGradeChange(grade)}
                    style={{ marginLeft: "1em" }}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Genre *</legend>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2em" }}>
              <label style={{ display: "flex", alignItems: "center", fontWeight: "normal" }}>
                <span style={{ minWidth: "70px", display: "inline-block" }}>Homme</span>
                <input
                  type="radio"
                  name="gender"
                  value="H"
                  checked={gender === "H"}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ marginLeft: "1em" }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", fontWeight: "normal" }}>
                <span style={{ minWidth: "70px", display: "inline-block" }}>Femme</span>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === "F"}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ marginLeft: "1em" }}
                />
              </label>
            </div>
          </fieldset>

          <label>
            Catégorie de Poids *
            <select
              value={weightCategoryId}
              onChange={(e) => setWeightCategoryId(e.target.value)}
              required
            >
              <option value="">Sélectionner</option>
              {weightCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.weight_min}kg - {cat.weight_max}kg)
                </option>
              ))}
            </select>
          </label>

          <label>
            Groupe d’âge *
            <select
              value={ageGroupId}
              onChange={(e) => setAgeGroupId(e.target.value)}
              required
            >
              <option value="">Sélectionner</option>
              {ageGroups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name} ({grp.age_min} - {grp.age_max} ans)
                </option>
              ))}
            </select>
          </label>

          <label>
            Type d'élimination *
            <select
              value={eliminationType}
              onChange={(e) => setEliminationType(e.target.value)}
              required
            >
              <option value="Directe">Élimination directe</option>
              <option value="Poule">Poule</option>
            </select>
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
