import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./AssignedCompetitors.module.css";
import { apiUrl } from '../../../config/api';

const AssignedCompetitors = () => {
  const { id: tournamentId } = useParams();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("categoryId");
  const [assignedCompetitors, setAssignedCompetitors] = useState([]);

  // Fetch competitor of category in tournament
  const fetchAssignedCompetitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      const res = await axios.get(
        apiUrl(`/api/tournaments/categories/${categoryId}/competitors`),
        axiosConfig
      );
      setAssignedCompetitors(res.data);
    } catch (error) {
      console.error("❌ Erreur récupération compétiteurs assignés:", error);
    }
  };

  // Delete competitor from tournament 
  const handleDelete = async (competitorId) => {
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      await axios.delete(
        apiUrl(`/api/tournaments/categories/${categoryId}/delete-competitor/${competitorId}`),
        axiosConfig
      );
      alert("✅ Compétiteur supprimé !");
      fetchAssignedCompetitors(); // Refresh list after delete
    } catch (error) {
      console.error("❌ Erreur suppression compétiteur:", error.response?.data || error.message);
      alert("Erreur lors de la suppression. Voir la console.");
    }
  };

  useEffect(() => {
    fetchAssignedCompetitors();
  }, [tournamentId, categoryId]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        ✅ Compétiteurs déjà ajoutés à la catégorie
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
                  Supprimer
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
