import React, { useEffect, useState, useCallback } from "react";
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
  const [openFormMatchId, setOpenFormMatchId] = useState(null);
  const [formData, setFormData] = useState({ score1: '', score2: '', winner: '', keikuka1: '', keikuka2: '' });

  const isWinnerEditable = (formData) => {
    const s1 = formData.score1 !== '';
    const s2 = formData.score2 !== '';
    const k1 = formData.keikuka1 !== '';
    const k2 = formData.keikuka2 !== '';
    if (!(s1 && s2 && k1 && k2)) return false;
    return Number(formData.score1) === Number(formData.score2) && Number(formData.keikuka1) === Number(formData.keikuka2);
  };

  // Utilise useCallback pour éviter la redéfinition à chaque rendu
  const fetchCompetitor = useCallback(async (id, axiosConfigParam) => {
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
  }, [competitors]);

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

  useEffect(() => {
    // Calcul automatique du gagnant si ce n'est pas un cas d'égalité
    if (!isWinnerEditable(formData)) {
      const s1 = Number(formData.score1);
      const s2 = Number(formData.score2);
      const k1 = Number(formData.keikuka1);
      const k2 = Number(formData.keikuka2);
      let winner = '';
      if (s1 > s2) winner = openFormMatchId ? matches.find(m => m.id === openFormMatchId)?.competitor1 : '';
      else if (s2 > s1) winner = openFormMatchId ? matches.find(m => m.id === openFormMatchId)?.competitor2 : '';
      else if (k1 > k2) winner = openFormMatchId ? matches.find(m => m.id === openFormMatchId)?.competitor2 : '';
      else if (k2 > k1) winner = openFormMatchId ? matches.find(m => m.id === openFormMatchId)?.competitor1 : '';
      setFormData((prev) => ({ ...prev, winner }));
    }
    // eslint-disable-next-line
  }, [formData.score1, formData.score2, formData.keikuka1, formData.keikuka2, openFormMatchId]);

  const handleScoreboardClick = (matchId) => {
    navigate(`/matches/${matchId}/scoreboard`);
  };

  const handleOpenForm = (match) => {
    setOpenFormMatchId(match.id);
    setFormData({
      score1: match.score1 || '',
      score2: match.score2 || '',
      winner: match.winner || '',
      keikuka1: match.keikuka1 || '',
      keikuka2: match.keikuka2 || '',
    });
  };

  const handleCloseForm = () => {
    setOpenFormMatchId(null);
    setFormData({ score1: '', score2: '', winner: '', keikuka1: '', keikuka2: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e, match) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/matches/${match.id}`,
        {
          score1: formData.score1,
          score2: formData.score2,
          winner: formData.winner,
          keikuka1: formData.keikuka1,
          keikuka2: formData.keikuka2,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      // Refresh matches
      setMatches((prev) => prev.map((m) => m.id === match.id ? { ...m, ...formData } : m));
      handleCloseForm();
    } catch (err) {
      alert('Erreur lors de la mise à jour du match');
    }
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
                <React.Fragment key={m.id}>
                  <tr>
                    <td>{competitors[m.competitor1] || m.competitor1}</td>
                    <td>{competitors[m.competitor2] || m.competitor2}</td>
                    <td>{m.score1}</td>
                    <td>{m.score2}</td>
                    <td>{competitors[m.winner] || m.winner || '-'}</td>
                    <td>
                      <button
                        className={styles.scoreboardButton}
                        onClick={() => handleScoreboardClick(m.id)}
                      >
                        Scoreboard
                      </button>
                      <button
                        className={styles.resultButton}
                        style={{ marginLeft: 8 }}
                        onClick={() => handleOpenForm(m)}
                      >
                        Rentrer des résultats
                      </button>
                    </td>
                  </tr>
                  {openFormMatchId === m.id && (
                    <tr>
                      <td colSpan={6}>
                        <form onSubmit={(e) => handleFormSubmit(e, m)} className={styles.formRow}>
                          <div className={styles.scoreInputs}>
                            <label>Score 1:
                              <input type="number" name="score1" value={formData.score1} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                            </label>
                            <label>Score 2:
                              <input type="number" name="score2" value={formData.score2} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                            </label>
                          </div>
                          <label>Keikuka 1:
                            <input type="number" name="keikuka1" value={formData.keikuka1} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                          </label>
                          <label>Keikuka 2:
                            <input type="number" name="keikuka2" value={formData.keikuka2} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                          </label>
                          <label>Gagnant:
                            <select name="winner" value={formData.winner} onChange={handleFormChange} required style={{ marginLeft: 4 }} disabled={!isWinnerEditable(formData)}>
                              <option value="">Choisir</option>
                              <option value={m.competitor1}>{competitors[m.competitor1] || m.competitor1}</option>
                              <option value={m.competitor2}>{competitors[m.competitor2] || m.competitor2}</option>
                            </select>
                          </label>
                          <button type="submit" className={styles.saveButton}>Enregistrer</button>
                          <button type="button" onClick={handleCloseForm} className={styles.cancelButton}>Annuler</button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
