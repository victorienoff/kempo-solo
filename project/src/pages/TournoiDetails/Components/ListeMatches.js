import React from "react";
import styles from "./ListeMatches.module.css"; 

const MatchTable = ({ matches = [] }) => { 
  if (!Array.isArray(matches) || matches.length === 0) {
    return <p className={styles.noData}>Aucun match disponible.</p>;
  }

  return (
    <div>
      <h2>⚔️ Liste des competiteurs :</h2>
      <table className={styles.matchTable}>
        <thead>
          <tr>
            <th>Combat</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Club</th>
            <th>Ippon</th>
            <th>Kekkou</th>
            <th>Vainqueur</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.combat}</td>
              <td>{match.name}</td>
              <td>{match.surname}</td>
              <td>{match.club || "-"}</td>
              <td>{match.ippon}</td>
              <td>{match.kekkou}</td>
              <td><button className={styles.selectBtn}>SELECT</button></td>
              <td>
                <button className={styles.startBtn}>START</button>
                <button className={styles.forfaitBtn}>FORFAIT</button>
                <button className={styles.editBtn}>✎</button>
                <button className={styles.deleteBtn}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;
