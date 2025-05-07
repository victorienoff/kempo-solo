import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AssignedCompetitors.module.css";

const AssignedCompetitors = () => {
  const { id: tournamentId } = useParams();
  const [assignedCompetitors, setAssignedCompetitors] = useState([]);

  // Fetch assigned competitors
  const fetchAssignedCompetitors = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/tournaments/${tournamentId}/competitors`);
      setAssignedCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur récupération compétiteurs assignés:", error);
    }
  };

  // Delete competitor from tournament
  const handleDelete = async (competitorId) => {
    try {
      await axios.delete(`http://localhost:3000/tournaments/${tournamentId}/delete-competitor/${competitorId}`);
      alert("✅ Compétiteur supprimé !");
      fetchAssignedCompetitors(); // Refresh list after delete
    } catch (error) {
      console.error("❌ Erreur suppression compétiteur:", error.response?.data || error.message);
      alert("Erreur lors de la suppression. Voir la console.");
    }
  };

  useEffect(() => {
    fetchAssignedCompetitors();
  }, [tournamentId]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        ✅ Compétiteurs déjà ajoutés au tournoi
      </h3>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedCompetitors.map((c) => (
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
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(c.id)}
                >
                  ❌ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedCompetitors;
