import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./MatchesTable.module.css";
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

// Nouvelle fonction pour transformer les matches en format compatible avec @g-loot/react-tournament-brackets
function buildBracketMatches(matches, competitors) {
  if (!matches || matches.length === 0) return [];
  // Trouver tous les rounds distincts et les trier
  const roundNames = Array.from(new Set(matches.map(m => m._roundName || m.pool_number))).sort((a, b) => {
    const numA = a && a.match(/\d+/) ? parseInt(a.match(/\d+/)[0], 10) : 0;
    const numB = b && b.match(/\d+/) ? parseInt(b.match(/\d+/)[0], 10) : 0;
    return numA - numB;
  });
  // Toujours afficher Tour 1, Tour 2, ...
  const roundLabels = roundNames.map((_, idx) => `Tour ${idx + 1}`);
  return matches.map(m => {
    let roundIdx = roundNames.indexOf(m._roundName || m.pool_number);
    let roundText = m._displayRound || (roundIdx !== -1 ? roundLabels[roundIdx] : '');
    return {
      id: m.id,
      name: '', // On masque l'id du match dans le champ name
      nextMatchId: m.next_match || null,
      tournamentRoundText: roundText,
      startTime: m.scheduled || '',
      state: m.winner ? 'DONE' : 'SCHEDULED',
      participants: [
        m.competitor1 ? {
          id: m.competitor1,
          name: competitors[m.competitor1] || m.competitor1,
          resultText: m.score1 !== undefined && m.score1 !== null ? String(m.score1) : '',
          isWinner: m.winner === m.competitor1
        } : null,
        m.competitor2 ? {
          id: m.competitor2,
          name: competitors[m.competitor2] || m.competitor2,
          resultText: m.score2 !== undefined && m.score2 !== null ? String(m.score2) : '',
          isWinner: m.winner === m.competitor2
        } : null
      ].filter(Boolean)
    };
  });
}

// Personnalisation du composant Match pour masquer l'id
const CustomMatch = (props) => {
  const { match } = props;
  // On masque l'id dans le nom affiché (participants et match)
  const matchWithoutId = {
    ...match,
    name: '', // Toujours vide
    participants: match.participants.map(p => ({ ...p, id: '', name: p.name })),
  };
  return <Match {...props} match={matchWithoutId} />;
};

// Personnalisation du SVGViewer pour forcer le zoom au minimum (encore plus dézoomé)
const CustomSVGViewer = (props) => (
  <SVGViewer {...props} initialScale={0.15} />
);

// Composant pour afficher le titre du round en français
const FrenchRoundTitle = ({ title }) => (
  <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff', margin: '12px 0' }}>{title}</div>
);

const MatchesTable = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [competitors, setCompetitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFormMatchId, setOpenFormMatchId] = useState(null);
  const [formData, setFormData] = useState({ score1: '', score2: '', winner: '', keikuka1: '', keikuka2: '' });
  const [rounds, setRounds] = useState([]); // Ajouté pour stocker les rounds

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
    if (!id) return id; // Ne fait rien si l'id est null ou undefined
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
    const fetchBracket = async () => {
      try {
        const token = localStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        };
        const res = await axios.get(
          `http://localhost:3000/api/tournaments/categories/${categoryId}/bracket`,
          axiosConfig
        );
        // res.data est un objet { round-1: [...], round-2: [...], ... }
        const roundNames = Object.keys(res.data).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        const roundsArr = Object.entries(res.data)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .map(([roundName, matches], idx) => ({
            roundName,
            displayName: `Tour ${idx + 1}`,
            matches
          }));
        setRounds(roundsArr);
        // Pour react-brackets, on a besoin d'un tableau à plat de tous les matchs
        const allMatches = roundsArr.flatMap(r => r.matches.map(m => ({ ...m, _displayRound: r.displayName, _roundName: r.roundName })));
        setMatches(allMatches);
        // Charger les compétiteurs
        const uniqueIds = Array.from(
          new Set(allMatches.flatMap((m) => [m.competitor1, m.competitor2]))
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
    fetchBracket();
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
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    // Récupérer les infos des compétiteurs
    const competitor1 = {
      name: competitors[match.competitor1] || match.competitor1,
      club: match.club1 || '',
    };
    const competitor2 = {
      name: competitors[match.competitor2] || match.competitor2,
      club: match.club2 || '',
    };
    // Stocker dans le localStorage
    localStorage.setItem('scoreboard_competitor1', JSON.stringify(competitor1));
    localStorage.setItem('scoreboard_competitor2', JSON.stringify(competitor2));
    localStorage.setItem('scoreboard_score1', match.score1 !== undefined ? match.score1 : 0);
    localStorage.setItem('scoreboard_score2', match.score2 !== undefined ? match.score2 : 0);
    localStorage.setItem('scoreboard_faults1', match.keikuka1 !== undefined ? match.keikuka1 : 0);
    localStorage.setItem('scoreboard_faults2', match.keikuka2 !== undefined ? match.keikuka2 : 0);
    localStorage.setItem('scoreboard_match_id', match.id);
    // Ajout : stocker les id pour la sauvegarde
    localStorage.setItem('scoreboard_competitor1_id', match.competitor1 || '');
    localStorage.setItem('scoreboard_competitor2_id', match.competitor2 || '');
    // Ouvrir la télécommande et le scoreboard (forcer le reload pour chaque fenêtre)
    window.open('/telecommande?reload=' + Date.now(), '_blank', 'width=500,height=700');
    window.open('/scoreboard?reload=' + Date.now(), '_blank', 'width=900,height=700');
  };

  const handleOpenForm = (match) => {
    setOpenFormMatchId(match.id);
    setFormData({
      score1: match.score1 || '',
      score2: match.score2 || '',
      winner: match.winner || '',
      keikuka1: match.keikuka1 !== undefined && match.keikuka1 !== null ? match.keikuka1 : 0,
      keikuka2: match.keikuka2 !== undefined && match.keikuka2 !== null ? match.keikuka2 : 0,
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
      const body = {
        score1: parseInt(formData.score1),
        score2: parseInt(formData.score2),
        winner: formData.winner,
        keikuka1: formData.keikuka1 !== '' && formData.keikuka1 !== undefined && formData.keikuka1 !== null ? parseInt(formData.keikuka1) : 0,
        keikuka2: formData.keikuka2 !== '' && formData.keikuka2 !== undefined && formData.keikuka2 !== null ? parseInt(formData.keikuka2) : 0,
      };
      await axios.post(
        `http://localhost:3000/api/matches/${match.id}`,
        body,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      window.location.reload(); // Force la page à se recharger pour afficher les valeurs à jour
    } catch (err) {
      alert('Erreur lors de la mise à jour du match');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Matchs </h2>
      {loading && <p>Chargement...</p>}
      {!loading && matches && matches.length === 0 && <p>Aucun match à afficher.</p>}
      {!loading && rounds && rounds.length > 0 && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tour</th>
                <th>Compétiteur 1</th>
                <th>Compétiteur 2</th>
                <th>Score 1</th>
                <th>Score 2</th>
                <th>Gagnant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round, idx) => (
                <React.Fragment key={round.roundName}>
                  {round.matches.map((m, i) => (
                    <React.Fragment key={m.id}>
                      <tr>
                        {i === 0 && (
                          <td rowSpan={round.matches.length} style={{ fontWeight: 'bold', background: '#f0f0f0' }}>{round.displayName}</td>
                        )}
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
                          <td colSpan={7}>
                            <form onSubmit={(e) => handleFormSubmit(e, m)} className={styles.formRow}>
                              <div className={styles.scoreInputs}>
                                <label>Score 1:
                                  <input type="number" name="score1" value={formData.score1} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                                </label>
                                <label>Score 2:
                                  <input type="number" name="score2" value={formData.score2} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                                </label>
                                {/* Keikuka 1 et 2 côte à côte */}
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 16 }}>
                                  <label>Keikuka 1:
                                    <input type="number" name="keikuka1" value={formData.keikuka1} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                  </label>
                                  <label>Keikuka 2:
                                    <input type="number" name="keikuka2" value={formData.keikuka2} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                  </label>
                                </div>
                              </div>
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          <div className={styles.bracketContainer}>
            <SingleEliminationBracket
              matches={buildBracketMatches(matches, competitors)}
              matchComponent={CustomMatch}
              svgWrapper={CustomSVGViewer}
              roundTitleComponent={FrenchRoundTitle}
              style={{ width: '100%', minWidth: 600, minHeight: 500 }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MatchesTable;
