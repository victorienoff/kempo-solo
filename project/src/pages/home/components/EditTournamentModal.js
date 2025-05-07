import React, { useState, useEffect } from "react";
import styles from "./EditTournamentModal.module.css"; // reuse the same styles

const EditTournoiModal = ({ isOpen, onClose, tournament, onUpdate }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);

  useEffect(() => {
    if (tournament) {
      setName(tournament.name || "");
      setCity(tournament.city || "");
      setDate(tournament.start_date?.split("T")[0] || "");
    }
  }, [tournament]);

  const handleSubmit = async () => {
    if (!name || !city || !date) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const updatedData = {
      name,
      city,
      start_date: date,
      end_date: multiDay
        ? new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            .toISOString()
            .split("T")[0]
        : date,
    };

    try {
      const response = await fetch(`http://localhost:3000/tournaments/${tournament.id}`, {
        method: "PUT", // or PATCH depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        onUpdate(); // refresh parent list
        onClose(); // close modal
      } else {
        console.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Modifier le Tournoi</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className={styles.formGroup}>
            <label>Nom du tournoi :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Lieu :</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date :</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
            <label className="flex items-center mt-2">
              <span>Tournoi sur plusieurs jours ?</span>
              <input
                type="checkbox"
                checked={multiDay}
                onChange={(e) => setMultiDay(e.target.checked)}
                className="ml-2"
              />
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn} onClick={handleSubmit}>
              Mettre à jour
            </button>
            <button className={styles.secondaryBtn} onClick={onClose}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTournoiModal;
