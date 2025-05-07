import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./addCompetitorToCateg.module.css";
import AssignedCompetitors from "./AssignedCompetitors";

const AddCompetitorsToCategory = () => {
  const location = useLocation();
  const { id: tournamentId } = useParams();
  const categoryId = new URLSearchParams(location.search).get("categoryId");
  const navigate = useNavigate();

  const [competitors, setCompetitors] = useState([]);
  const [assignedCompetitors, setAssignedCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/competitors/categories/${categoryId}`
      );
      setCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement compétiteurs:", error);
    }
  };

  const fetchAssignedCompetitors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/tournaments/${tournamentId}/competitors`
      );
      setAssignedCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur chargement compétiteurs assignés:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await fetchCompetitors();
      await fetchAssignedCompetitors();
      setLoading(false);
    };

    if (categoryId) fetchAll();
  }, [categoryId, tournamentId]);

  const handleAddClick = async (competitorId) => {
    try {
      await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/add-competitor/${competitorId}`
      );

      await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/assign-competitor/${categoryId}`,
        { competitor_id: competitorId }
      );

      alert("✅ Compétiteur ajouté et assigné à la catégorie !");
      await fetchAssignedCompetitors();
    } catch (error) {
      console.error("❌ Erreur ajout :", error.response?.data || error.message);
      alert("Erreur ajout compétiteur.");
    }
  };

  const handleStartTournament = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/tournaments/${tournamentId}/start`
      );
      alert("🚀 Tournoi démarré !");
      console.log("Réponse :", res.data);
    } catch (error) {
      console.error("❌ Erreur démarrage tournoi:", error.response?.data || error.message);
      alert("Impossible de démarrer le tournoi.");
    }
  };

  const handleGoToMatches = () => {
    navigate(`/matches/${categoryId}`);
  };

  const assignedIds = new Set(assignedCompetitors.map((c) => c.id));
  const unassignedCompetitors = competitors.filter((c) => !assignedIds.has(c.id));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des Compétiteurs</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : unassignedCompetitors.length === 0 ? (
        <p>✅ Tous les compétiteurs de cette catégorie ont été ajoutés au tournoi.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Genre</th>
                <th>Grade</th>
                <th>Date de naissance</th>
                <th>Club</th>
                <th>Pays</th>
                <th>Poids</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unassignedCompetitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstname}</td>
                  <td>{c.lastname}</td>
                  <td>{c.gender}</td>
                  <td>{c.rank}</td>
                  <td>{c.birthday ? new Date(c.birthday).toLocaleDateString() : "-"}</td>
                  <td>{c.club || "-"}</td>
                  <td>{c.country || "-"}</td>
                  <td>{c.weight ?? "-"}</td>
                  <td>
                    <button className={styles.addBtn} onClick={() => handleAddClick(c.id)}>
                      ➕ Ajouter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AssignedCompetitors />

      <div className={styles.startBtnWrapper}>
        <button className={styles.startBtn} onClick={handleStartTournament}>
          🚀 Commencer le tournoi
        </button>

        <button className={styles.matchBtn} onClick={handleGoToMatches}>
          📋 Matchs
        </button>
      </div>
    </div>
  );
};

export default AddCompetitorsToCategory;
