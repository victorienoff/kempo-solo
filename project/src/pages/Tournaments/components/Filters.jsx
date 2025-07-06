import React from "react";

const Filters = ({
  searchQuery,
  setSearchQuery,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
}) => {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 16, justifyContent: 'center' }}>
      <div>
        <label>🔎 Rechercher : </label>
        <input
          type="text"
          placeholder="Nom du tournoi"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        <label>📅 Date de début : </label>
        <input
          type="date"
          value={selectedStartDate}
          onChange={e => setSelectedStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>📅 Date de fin : </label>
        <input
          type="date"
          value={selectedEndDate}
          onChange={e => setSelectedEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Filters;
