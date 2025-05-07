import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddCategoryModal from "./Components/AddCategoryModal";
import styles from "./TournoiDetails.module.css";

const TournoiDetails = () => {
  const { id: tournamentId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/tournaments/${tournamentId}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur chargement catégories :", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [tournamentId]);

  const handleAddCategory = () => setIsModalOpen(true);

  const handleCategorySubmit = async (categoryData) => {
    try {
      const payload = {
        name: "AutoCat", // You may modify this or make it dynamic
        rank: categoryData.grades,
        gender: categoryData.gender,
        weight_category: categoryData.weight_category_id,
        elimination_type: "Directe",
        age_group: categoryData.age_group_id,
      };

      await axios.post(`http://localhost:3000/tournaments/${tournamentId}/categories`, payload);
      alert("Catégorie ajoutée avec succès !");
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error.response?.data || error.message);
      alert("Erreur lors de l'ajout de la catégorie. Voir la console.");
    }
    setIsModalOpen(false);
  };

  const goToAddCompetitorsPage = (categoryId) => {
    navigate(`/tournoiDetails/${tournamentId}/ajouter-competiteurs?categoryId=${categoryId}`);
  };

  const handleManualTestInsert = async () => {
    const testPayload = {
      name: "Test Category",
      rank: ["Ceinture Blanche", "Ceinture Jaune"],
      gender: "H",
      weight_category: 1,
      age_group: 1,
      elimination_type: "Directe"
    };

    try {
      await axios.post(`http://localhost:3000/tournaments/${tournamentId}/categories`, testPayload);
      alert("✅ Catégorie de test insérée !");
      fetchCategories();
    } catch (err) {
      console.error("❌ Erreur insertion test :", err.response?.data || err.message);
      alert("Erreur d'insertion test. Voir la console.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Détails du Tournoi</h2>

      <div className={styles.actions}>
        <button onClick={handleAddCategory}>➕ Ajouter Catégorie</button>
        {/* <button onClick={handleManualTestInsert}>📥 Insert Test Catégorie</button> */}
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCategorySubmit}
      />

      <table className={styles.categoryTable}>
        <thead>
          <tr>
            <th>Rangs</th>
            <th>Genre</th>
            <th>Poids</th>
            <th>Âge</th>
            <th>Type élimination</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan="6">Aucune catégorie pour ce tournoi.</td></tr>
          ) : (
            categories.map((cat, i) => (
              <tr key={i}>
                <td>{cat.rank?.join(", ")}</td>
                <td>{cat.gender}</td>
                <td>{cat.weight_category?.name || "-"}</td>
                <td>{cat.age_group?.name || "-"}</td>
                <td>{cat.elimination_type}</td>
                <td>
                  <button onClick={() => goToAddCompetitorsPage(cat.id)}>
                    ➕ Afficher les compétiteurs
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TournoiDetails;
