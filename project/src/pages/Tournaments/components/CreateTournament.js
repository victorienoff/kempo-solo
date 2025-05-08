import React, { useState } from "react";
import styles from "./CreateTournament.module.css";

const CreationTournoi = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);
  const [city, setCity] = useState("");

  const [grades, setGrades] = useState([]);
  const [genders, setGenders] = useState([]);
  const [eliminationSystems, setEliminationSystems] = useState([]);
  const [importType, setImportType] = useState("");

  const handleCheckboxChange = (value, setFn, currentList) => {
    if (currentList.includes(value)) {
      setFn(currentList.filter(item => item !== value));
    } else {
      setFn([...currentList, value]);
    }
  };

  
  const calculateEndDate = (start) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    return endDate.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !date ||
      !city.trim() ||
      grades.length === 0 ||
      genders.length === 0 ||
      eliminationSystems.length === 0 ||
      importType === ""
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const tournamentData = {
      name: name,
      rank: grades[0] || "",
      city: city,
      start_date: date,
      end_date: multiDay ? calculateEndDate(date) : date
    };

    try {
      const response = await fetch("http://localhost:3000/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tournamentData)
      });

      if (response.ok) {
        const result = await response.text();
        console.log("✅ Tournoi ajouté :", result);
        setIsOpen(false);
      } else {
        console.error(" Problème serveur :", await response.text());
      }
    } catch (err) {
      console.error(" Erreur réseau :", err);
    }
  };

  const handleReset = () => {
    setName("");
    setDate("");
    setCity("");
    setMultiDay(false);
    setGrades([]);
    setGenders([]);
    setEliminationSystems([]);
    setImportType("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        Créer un Tournoi
      </button>

      <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ""}`}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1>Création du tournoi</h1>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <div className="space-y-4 mt-4">
            <div className={styles.formGroup}>
              <label>Insérer nom du tournoi :</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Lieu du tournoi :</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date du tournoi :</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              <label className="flex items-center mt-2">
                <span className="text-red-500 text-sm">Tournoi sur plusieurs jours ?</span>
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={multiDay}
                  onChange={e => setMultiDay(e.target.checked)}
                />
              </label>
            </div>

            <div className={styles.groupBox}>
              <label>GRADE <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2">
                {[
                  "Ceinture Blanche", "Ceinture Jaune", "Ceinture Orange", "Ceinture Verte", "Ceinture Bleue", "Ceinture Marron",
                  "Ceinture Noire 1er Dan", "Ceinture Noire 2ème Dan", "Ceinture Noire 3ème Dan", "Ceinture Noire 4ème Dan", "Ceinture Noire 5ème Dan", "Ceinture Noire 6ème Dan"
                ].map(grade => (
                  <label key={grade}>
                    <input
                      type="checkbox"
                      checked={grades.includes(grade)}
                      onChange={() => handleCheckboxChange(grade, setGrades, grades)}
                    />{" "}
                    {grade}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.groupBox}>
              <label>GENRE <span className="text-red-500">*</span></label>
              {["Homme", "Femme"].map(gender => (
                <label key={gender}>
                  <input
                    type="checkbox"
                    checked={genders.includes(gender)}
                    onChange={() => handleCheckboxChange(gender, setGenders, genders)}
                  />{" "}
                  {gender}
                </label>
              ))}
            </div>

            <div className={styles.groupBox}>
              <label>SYSTÈME D'ÉLIMINATION <span className="text-red-500">*</span></label>
              {["Poules", "Élimination directe"].map(system => (
                <label key={system}>
                  <input
                    type="checkbox"
                    checked={eliminationSystems.includes(system)}
                    onChange={() => handleCheckboxChange(system, setEliminationSystems, eliminationSystems)}
                  />{" "}
                  {system}
                </label>
              ))}
            </div>

            <div className={styles.groupBox}>
              <label>IMPORTER LISTE PARTICIPANTS <span className="text-red-500">*</span></label>
              <label>
                <input
                  type="radio"
                  name="import"
                  checked={importType === "Manuellement"}
                  onChange={() => setImportType("Manuellement")}
                />{" "}
                Manuellement
              </label>
              <label>
                <input
                  type="radio"
                  name="import"
                  checked={importType === "Automatiquement"}
                  onChange={() => setImportType("Automatiquement")}
                />{" "}
                Automatiquement
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn} onClick={handleSubmit}>
                Ajouter le tournoi
              </button>
              <button className={styles.secondaryBtn} onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationTournoi;
