import styles from "./Filters.module.css";
import CreationTournoi from './CreateTournament';

const Filters = ({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className={styles.filtersContainer}>
      {/* 🔎 Search by Name */}
      <div className={styles.filterItem}>
        <label htmlFor="search"><span>🔎</span> Rechercher par nom :</label>
        <input 
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nom du tournoi" 
        />
      </div>

      {/* 📅 Filter by Date */}
      <div className={styles.filterItem}>
        <label htmlFor="dateFilter"><span>📅</span> Filtrer par date :</label>
        <input 
          type="date" 
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* ➕ Create Tournament Button */}
      <div className={styles.createBtn}>
        <CreationTournoi />
      </div>
    </div>
  );
};

export default Filters;
