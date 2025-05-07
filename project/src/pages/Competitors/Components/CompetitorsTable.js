import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompetitorsTable.module.css";
import Filter from "./Filter";
import AjouterCompetiteurs from "./AddCompetitors";
import EditCompetitors from "./EditCompetitors";

const CompetitorTable = () => {
  const [competitors, setCompetitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCompetitors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/competitors");
      setCompetitors(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch competitors:", error);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleAdd = (newCompetitor) => {
    setCompetitors([...competitors, newCompetitor]);
    setIsAddModalOpen(false);
  };

  const openEditModal = (competitor) => {
    setSelectedCompetitor(competitor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCompetitor(null);
  };

  const handleDelete = async (competitorId) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce compétiteur ?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/competitors/${competitorId}`);
      setCompetitors(prev => prev.filter(c => c.id !== competitorId));
      alert("✅ Compétiteur supprimé !");
    } catch (error) {
      console.error("❌ Erreur suppression :", error.response?.data || error.message);
      alert("Erreur lors de la suppression du compétiteur.");
    }
  };

  const filteredCompetitors = competitors.filter((c) => {
    const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || (c.birthday && c.birthday.startsWith(selectedDate));
    const matchesGrade = !selectedGrade || c.rank === selectedGrade;
    return matchesName && matchesDate && matchesGrade;
  });

  return (
    <div className={styles.container}>
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>👤 Nom</th>
              <th>🏆 Grade</th>
              <th>📅 Date de Naissance</th>
              <th>⚖️ Poids</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitors.length > 0 ? (
              filteredCompetitors.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstname} {c.lastname}</td>
                  <td>{c.rank}</td>
                  <td>{c.birthday ? new Date(c.birthday).toLocaleDateString() : "-"}</td>
                  <td>{c.weight ?? "-"}</td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEditModal(c)}>✏️</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(c.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucun compétiteur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AjouterCompetiteurs
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <EditCompetitors
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        competitor={selectedCompetitor}
        onSave={fetchCompetitors}
      />
    </div>
  );
};

export default CompetitorTable;
