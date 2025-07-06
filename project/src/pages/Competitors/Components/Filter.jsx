import React from "react";
import styles from "./Filter.module.css";

const Filter = ({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  selectedGrade,
  setSelectedGrade,
  onOpenAddModal, // 👈 Receive the function to open modal
  ranks = [],
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterItem}>
        <label htmlFor="search">
          <span>🔎</span> Rechercher:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Nom du compétiteur"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="dateFilter">
          <span>📅</span> Filtrer par date :
        </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className={styles.filterItem}>
        <label htmlFor="gradeFilter">
          <span>🏆</span> Filtrer par grade :
        </label>
        <select
          id="gradeFilter"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="">Tous les grades</option>
          {ranks.map((rank) => (
            <option key={rank} value={rank}>{rank}</option>
          ))}
        </select>
      </div>

      {/*
      <div className={styles.filterItem}>
        <button className={styles.addButton} onClick={onOpenAddModal}>
          <span>➕</span> Ajouter Compétiteur
        </button>
      </div>
      */}
    </div>
  );
};

export default Filter;
