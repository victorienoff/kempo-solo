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
  const [categoryCompetitorCounts, setCategoryCompetitorCounts] = useState({});
  const [ageGroups, setAgeGroups] = useState({});
  const [weightCategories, setWeightCategories] = useState({});

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      const res = await axios.get(
        `http://localhost:3000/api/tournaments/${tournamentId}/categories`,
        axiosConfig
      );
      setCategories(res.data);
      // Pour chaque catégorie, charger le nombre de compétiteurs
      const counts = {};
      const ageGroupIds = new Set();
      const weightCategoryIds = new Set();
      res.data.forEach(cat => {
        if (cat.age_group) ageGroupIds.add(cat.age_group);
        if (cat.weight_category) weightCategoryIds.add(cat.weight_category);
      });
      await Promise.all(res.data.map(async (cat) => {
        try {
          const resp = await axios.get(
            `http://localhost:3000/api/tournaments/categories/${cat.id}/competitors`,
            axiosConfig
          );
          counts[cat.id] = Array.isArray(resp.data) ? resp.data.length : 0;
        } catch {
          counts[cat.id] = 0;
        }
      }));
      setCategoryCompetitorCounts(counts);
      // Fetch all unique age groups
      const ageGroupMap = {};
      await Promise.all(Array.from(ageGroupIds).map(async (id) => {
        try {
          const resp = await axios.get(`http://localhost:3000/api/age-groups/${id}`, axiosConfig);
          ageGroupMap[id] = resp.data?.name ? resp.data : null;
        } catch {
          ageGroupMap[id] = null;
        }
      }));
      setAgeGroups(ageGroupMap);
      // Fetch all unique weight categories
      const weightCategoryMap = {};
      await Promise.all(Array.from(weightCategoryIds).map(async (id) => {
        try {
          const resp = await axios.get(`http://localhost:3000/api/weight-categories/${id}`, axiosConfig);
          // L'API retourne un tableau
          weightCategoryMap[id] = Array.isArray(resp.data) ? resp.data[0] : resp.data;
        } catch {
          weightCategoryMap[id] = null;
        }
      }));
      setWeightCategories(weightCategoryMap);
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
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      const payload = {
        name: "AutoCat", // You may modify this or make it dynamic
        rank: categoryData.grades,
        gender: categoryData.gender,
        weight_category: categoryData.weight_category_id,
        elimination_type: categoryData.elimination_type, // Utilise la valeur du formulaire
        age_group: categoryData.age_group_id,
      };

      await axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/categories`,
        payload,
        axiosConfig
      );
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
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      await axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/categories`,
        testPayload,
        axiosConfig
      );
      alert("✅ Catégorie de test insérée !");
      fetchCategories();
    } catch (err) {
      console.error("❌ Erreur insertion test :", err.response?.data || err.message);
      alert("Erreur d'insertion test. Voir la console.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      await axios.delete(`http://localhost:3000/api/tournaments/categories/${categoryId}`, axiosConfig);
      alert("Catégorie supprimée");
      fetchCategories();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // Ajout de la logique pour démarrer le tournoi
  const handleStartTournament = async () => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      await axios.post(
        `http://localhost:3000/api/tournaments/${tournamentId}/start`,
        {},
        axiosConfig
      );
      alert("Tournoi démarré !");
      // Tu peux ici recharger les infos du tournoi si besoin
    } catch (error) {
      console.error("Erreur lors du démarrage du tournoi:", error.response?.data || error.message);
      alert("Erreur lors du démarrage du tournoi. Voir la console.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Détails du Tournoi</h2>

      <div className={styles.actions}>
        <button className={styles.startBtn} onClick={handleStartTournament}>Commencer le tournoi</button>
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
                <td>{cat.weight_category && weightCategories[cat.weight_category] ? `${weightCategories[cat.weight_category].name} (${weightCategories[cat.weight_category].weight_min}kg - ${weightCategories[cat.weight_category].weight_max}kg)` : "-"}</td>
                <td>{cat.age_group && ageGroups[cat.age_group] ? `${ageGroups[cat.age_group].name} (${ageGroups[cat.age_group].age_min} - ${ageGroups[cat.age_group].age_max} ans)` : "-"}</td>
                <td>{cat.elimination_type}</td>
                <td>
                  <button onClick={() => goToAddCompetitorsPage(cat.id)}>
                    ➕ Afficher les compétiteurs
                  </button>
                  {categoryCompetitorCounts[cat.id] === 0 && (
                    <button style={{marginLeft:8, background:'#dc3545', color:'#fff'}} onClick={() => handleDeleteCategory(cat.id)}>
                      🗑️ Supprimer
                    </button>
                  )}
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
