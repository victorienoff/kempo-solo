import React, { useState, useEffect } from "react";
import styles from "./AddCategoryModal.module.css";
import axios from "axios";

const gradesList = [
  "Ceinture Blanche", "Ceinture Jaune", "Ceinture Orange", "Ceinture Verte",
  "Ceinture Bleue", "Ceinture Marron",
  "Ceinture Noire 1er Dan", "Ceinture Noire 2ème Dan", "Ceinture Noire 3ème Dan",
  "Ceinture Noire 4ème Dan", "Ceinture Noire 5ème Dan", "Ceinture Noire 6ème Dan"
];

const AddCategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [gender, setGender] = useState("");
  const [weightCategoryId, setWeightCategoryId] = useState("");
  const [ageGroupId, setAgeGroupId] = useState("");
  const [weightCategories, setWeightCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [weights, ages] = await Promise.all([
          axios.get("http://localhost:3000/weight-categories"),
          axios.get("http://localhost:3000/age-groups")
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
      age_group_id: parseInt(ageGroupId)
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ajouter une Catégorie</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Grade *</legend>
            {gradesList.map((grade) => (
              <label key={grade}>
                <input
                  type="checkbox"
                  checked={selectedGrades.includes(grade)}
                  onChange={() => handleGradeChange(grade)}
                />
                {grade}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Genre *</legend>
            <label>
              <input
                type="radio"
                name="gender"
                value="H"
                checked={gender === "H"}
                onChange={(e) => setGender(e.target.value)}
              />
              Homme
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="F"
                checked={gender === "F"}
                onChange={(e) => setGender(e.target.value)}
              />
              Femme
            </label>
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
