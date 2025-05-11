import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./MatchesTable.module.css";
import { Bracket as ReactBrackets } from 'react-brackets';

// Fonction utilitaire pour transformer les matches en rounds pour react-brackets
function buildRoundsForReactBrackets(matches, competitors) {
  if (!matches || matches.length === 0) return [];
  const matchMap = {};
  matches.forEach(m => { matchMap[m.id] = m; });
  const finalMatch = matches.find(m => !m.next_match);
  if (!finalMatch) return [];
  function getAncestors(match) {
    const rounds = [];
    let currentRound = [match];
    while (currentRound.length > 0) {
      rounds.unshift(currentRound);
      const parents = [];
      currentRound.forEach(m => {
        const found = matches.filter(parent => parent.next_match === m.id);
        parents.push(...found);
      });
      currentRound = parents;
    }
    return rounds;
  }
  const roundsArr = getAncestors(finalMatch);
  const rounds = roundsArr.map((roundMatches, idx) => ({
    title: `Tour ${idx + 1}`,
    seeds: roundMatches.map(m => ({
      id: m.id,
      date: m.scheduled,
      teams: [
        {
          name: m.competitor1 ? (competitors[m.competitor1] || m.competitor1) : '?',
          score: (m.score1 === undefined || m.score1 === null || m.score1 === '') ? null : m.score1
        },
        {
          name: m.competitor2 ? (competitors[m.competitor2] || m.competitor2) : '?',
          score: (m.score2 === undefined || m.score2 === null || m.score2 === '') ? null : m.score2
        }
      ],
      winner: m.winner === m.competitor1 ? 0 : m.winner === m.competitor2 ? 1 : null
    }))
  }));
  return rounds;
}

const MatchesTable = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [competitors, setCompetitors] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCompetitor = async (id, axiosConfigParam) => {
    if (competitors[id]) return competitors[id];
    try {
      const token = localStorage.getItem("token");
      const axiosConfig = axiosConfigParam || {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      };
      const res = await axios.get(`http://localhost:3000/api/competitors/${id}`, axiosConfig);
      const name = `${res.data.firstname} ${res.data.lastname}`;
      setCompetitors((prev) => ({ ...prev, [id]: name }));
      return name;
    } catch (err) {
      return id;
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        };
        const res = await axios.get(
          `http://localhost:3000/api/tournaments/categories/${categoryId}/matches`,
          axiosConfig
        );
        setMatches(res.data);
        const uniqueIds = Array.from(
          new Set(res.data.flatMap((m) => [m.competitor1, m.competitor2]))
        );
        uniqueIds.forEach((id) => {
          fetchCompetitor(id, axiosConfig);
        });
      } catch (error) {
        // ...
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [categoryId, fetchCompetitor]);

  const handleScoreboardClick = (matchId) => {
    navigate(`/matches/${matchId}/scoreboard`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Matchs non terminés</h2>
      {loading && <p>Chargement...</p>}
      {!loading && matches && matches.length === 0 && <p>Aucun match à afficher.</p>}
      {!loading && matches && matches.length > 0 && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Compétiteur 1</th>
                <th>Compétiteur 2</th>
                <th>Score 1</th>
                <th>Score 2</th>
                <th>Gagnant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>{competitors[m.competitor1] || m.competitor1}</td>
                  <td>{competitors[m.competitor2] || m.competitor2}</td>
                  <td>{m.score1}</td>
                  <td>{m.score2}</td>
                  <td>{competitors[m.winner] || m.winner || "-"}</td>
                  <td>
                    <button
                      className={styles.scoreboardButton}
                      onClick={() => handleScoreboardClick(m.id)}
                    >
                      Scoreboard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 40, overflowX: "auto", minWidth: 1600, minHeight: 700, width: '100%', background: '#f8f8ff', border: '2px solid #bdbdbd', borderRadius: 12, padding: 32, boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <h3 style={{ position: 'absolute', left: 60, top: 0 }}>Arbre du tournoi (react-brackets)</h3>
            <div style={{ width: '100%', height: '100%', minWidth: 1400, minHeight: 600 }}>
              <ReactBrackets 
                rounds={buildRoundsForReactBrackets(matches, competitors)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchesTable;
