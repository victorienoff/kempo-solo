import React from "react";
import styles from "./RankingTable.module.css"; 

const RankingTable = ({ rankings = [], podium = {} }) => { 
  if (!Array.isArray(rankings) || rankings.length === 0) {
    return <p className={styles.noData}>Aucun classement disponible.</p>;   
  }

  // Création d'un mapping id -> place pour le podium
  const podiumMap = {};
  if (podium && typeof podium === 'object') {
    if (podium.first) podiumMap[podium.first] = '🥇';
    if (podium.second) podiumMap[podium.second] = '🥈';
    if (podium.third) podiumMap[podium.third] = '🥉';
  }

  return (
    <div>
      <h2>🏅 Classement :</h2>
      <table className={styles.rankingTable}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
        </thead>
        <tbody>
          {rankings?.map((player, index) => {  
            let rowClass = "";
            let place = podiumMap[player?.id] || `#${index + 1}`;
            if (podiumMap[player?.id] === '🥇') rowClass = styles.gold;
            else if (podiumMap[player?.id] === '🥈') rowClass = styles.silver;
            else if (podiumMap[player?.id] === '🥉') rowClass = styles.bronze;

            return (
              <tr key={player?.id || index} className={rowClass}>
                <td>{place}</td>
                <td>{player?.name || "N/A"}</td>
                <td>{player?.surname || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;
