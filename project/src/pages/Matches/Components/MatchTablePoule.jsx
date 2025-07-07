import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./MatchesTable.module.css";
import RankingTable from "../../TournoiDetails/Components/RankingTable";
import { apiUrl } from '../../../config/api';

const MatchTablePoule = () => {
  const { categoryId } = useParams();
  const [matchesByPoule, setMatchesByPoule] = useState({});
  const [competitors, setCompetitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFormMatchId, setOpenFormMatchId] = useState(null);
  const [formData, setFormData] = useState({ score1: '', score2: '', keikuka1: '', keikuka2: '', winner: '' });
  const [ranking, setRanking] = useState(null);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState(null);

  useEffect(() => {
    const fetchMatchesAndCompetitors = async () => {
      try {
        const token = localStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        };
        const res = await axios.get(apiUrl(`/api/tournaments/categories/${categoryId}/matches`), axiosConfig);
        // Grouper les matchs par pool_number
        const grouped = {};
        const compMap = {};
        res.data.forEach(match => {
          const pool = match.pool_number || "Aucune poule";
          if (!grouped[pool]) grouped[pool] = [];
          grouped[pool].push(match);
          // Construction du mapping comme dans MatchTableDirect.js
          if (match.competitor1 && match.competitor1_name) compMap[match.competitor1] = match.competitor1_name;
          if (match.competitor2 && match.competitor2_name) compMap[match.competitor2] = match.competitor2_name;
          if (match.winner && match.winner_name) compMap[match.winner] = match.winner_name;
        });
        setMatchesByPoule(grouped);
        setCompetitors(compMap);
      } catch (err) {
        setMatchesByPoule({});
        setCompetitors({});
      } finally {
        setLoading(false);
      }
    };
    fetchMatchesAndCompetitors();
  }, [categoryId]);

  // Vérifie si tous les matchs de poule sont terminés
  const allPoolsFinished = Object.values(matchesByPoule).length > 0 && Object.values(matchesByPoule).every(
    (matches) => matches.every((match) => match.isFinished === true)
  );

  // Regrouper les matchs de classement (0-1 et 0-3)
  const classementMatches = [
    ...(matchesByPoule["0-1"] || []),
    ...(matchesByPoule["0-3"] || [])
  ];
  // Vérifie si tous les matchs de la poule de classement sont terminés
  const classementFinished = classementMatches.length > 0 && classementMatches.every(match => match.isFinished === true);

  // Nombre total de compétiteurs (hors doublons)
  const allCompetitorIds = new Set();
  Object.values(matchesByPoule).forEach(matches => {
    matches.forEach(match => {
      if (match.competitor1) allCompetitorIds.add(match.competitor1);
      if (match.competitor2) allCompetitorIds.add(match.competitor2);
    });
  });
  const totalCompetitors = allCompetitorIds.size;

  // Afficher le bouton placement SEULEMENT si tous les matchs de classement existent et sont terminés, et 7 compétiteurs ou plus
  const showPlacementButton = classementMatches.length == 0 && classementMatches.every(match => match.isFinished === true) && totalCompetitors >= 7 && Object.keys(matchesByPoule).length > 0;

  useEffect(() => {
    if (
      classementFinished &&
      !showPlacementButton &&
      classementMatches.length > 0
    ) {
      setRankingLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(
          apiUrl(`/api/tournaments/categories/${categoryId}/results`),
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setRanking(res.data && Array.isArray(res.data) ? res.data : [res.data]);
          setRankingLoading(false);
        })
        .catch((err) => {
          setRankingError("Erreur lors de la récupération du classement");
          setRankingLoading(false);
        });
    }
  }, [classementFinished, showPlacementButton, classementMatches.length, categoryId]);

  const handleEndPlacementMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        apiUrl(`/api/tournaments/categories/${categoryId}/start-ranking-pool`),
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );
      window.location.reload();
    } catch (err) {
      alert("Erreur lors de la finalisation des matchs de placement");
    }
  };

  const handleEndCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(
        apiUrl(`/api/tournaments/categories/${categoryId}/results`),
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );
      // Optionnel : reload ou feedback
    } catch (err) {
      alert("Erreur lors de la finalisation de la catégorie");
    }
  };

  // Ajout : fonction pour récupérer le nom d'un compétiteur par son id
  const fetchCompetitorName = async (id) => {
    if (!id || competitors[id]) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiUrl("/api/competitors/")}${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      if (res.data && res.data.firstname && res.data.lastname) {
        setCompetitors(prev => ({ ...prev, [id]: `${res.data.firstname} ${res.data.lastname}` }));
      }
    } catch (err) {
      // Optionnel : gérer l'erreur
    }
  };

  const handleScoreboardClick = (match) => {
    // Stocker les infos du match dans le localStorage
    const competitor1 = {
      name: competitors[match.competitor1] || match.competitor1,
      club: match.club1 || ''
    };
    const competitor2 = {
      name: competitors[match.competitor2] || match.competitor2,
      club: match.club2 || ''
    };
    localStorage.setItem('scoreboard_competitor1', JSON.stringify(competitor1));
    localStorage.setItem('scoreboard_competitor2', JSON.stringify(competitor2));
    localStorage.setItem('scoreboard_score1', match.score1 !== undefined ? match.score1 : 0);
    localStorage.setItem('scoreboard_score2', match.score2 !== undefined ? match.score2 : 0);
    localStorage.setItem('scoreboard_faults1', match.keikuka1 !== undefined ? match.keikuka1 : 0);
    localStorage.setItem('scoreboard_faults2', match.keikuka2 !== undefined ? match.keikuka2 : 0);
    localStorage.setItem('scoreboard_match_id', match.id);
    localStorage.setItem('scoreboard_competitor1_id', match.competitor1 || '');
    localStorage.setItem('scoreboard_competitor2_id', match.competitor2 || '');
    window.open('/telecommande?reload=' + Date.now(), '_blank', 'width=500,height=700');
    window.open('/scoreboard?reload=' + Date.now(), '_blank', 'width=900,height=700');
  };

  const handleOpenForm = (match) => {
    setOpenFormMatchId(match.id);
    setFormData({
      score1: match.score1 !== undefined && match.score1 !== null ? match.score1 : 0,
      score2: match.score2 !== undefined && match.score2 !== null ? match.score2 : 0,
      keikuka1: match.keikuka1 !== undefined && match.keikuka1 !== null ? match.keikuka1 : 0,
      keikuka2: match.keikuka2 !== undefined && match.keikuka2 !== null ? match.keikuka2 : 0,
      winner: match.winner || ''
    });
  };

  const handleCloseForm = () => {
    setOpenFormMatchId(null);
    setFormData({ score1: '', score2: '', keikuka1: '', keikuka2: '', winner: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e, match) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const body = {
        score1: parseInt(formData.score1),
        score2: parseInt(formData.score2),
        keikuka1: formData.keikuka1 !== '' && formData.keikuka1 !== undefined && formData.keikuka1 !== null ? parseInt(formData.keikuka1) : 0,
        keikuka2: formData.keikuka2 !== '' && formData.keikuka2 !== undefined && formData.keikuka2 !== null ? parseInt(formData.keikuka2) : 0
      };
      console.log('POST /api/matches/' + match.id, body);
      await axios.post(
        `${apiUrl("/api/matches/")}${match.id}`,
        body,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );
      // Refresh
      setLoading(true);
      setOpenFormMatchId(null);
      setFormData({ score1: '', score2: '', keikuka1: '', keikuka2: '', winner: '' });
      // Refetch
      const res = await axios.get(apiUrl(`/api/tournaments/categories/${categoryId}/matches`), {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      const grouped = {};
      const compMap = {};
      res.data.forEach(match => {
        const pool = match.pool_number || "Aucune poule";
        if (!grouped[pool]) grouped[pool] = [];
        grouped[pool].push(match);
        if (match.competitor1 && match.competitor1_name) compMap[match.competitor1] = match.competitor1_name;
        if (match.competitor2 && match.competitor2_name) compMap[match.competitor2] = match.competitor2_name;
        if (match.winner && match.winner_name) compMap[match.winner] = match.winner_name;
      });
      setMatchesByPoule(grouped);
      setCompetitors(compMap);
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const isWinnerEditable = (formData) => {
    return formData.score1 !== '' && formData.score2 !== '';
  };

  // Liste des poules "normales" (hors 0-1 et 0-3)
  const normalPoules = Object.entries(matchesByPoule).filter(
    ([poule]) => poule !== "0-1" && poule !== "0-3"
  );

  if (loading) return <div>Chargement...</div>;

  return (
    <div className={styles.container}>
      {classementFinished && !showPlacementButton && ranking && ranking[0] && (
        <div style={{ marginBottom: 48 }}>
          {/* Construction du tableau des 3 premiers */}
          <RankingTable
            rankings={['first', 'second', 'third'].map((place, idx) => {
              const id = ranking[0][place];
              const name = competitors[id]?.split(' ')[0] || '';
              const surname = competitors[id]?.split(' ').slice(1).join(' ') || '';
              return {
                id,
                name,
                surname,
              };
            })}
            podium={ranking[0]}
          />
        </div>
      )}
      <h2 className={styles.title}>📋 Matchs (Poule)</h2>
      {showPlacementButton && (
        <button className={styles.saveButton} style={{marginBottom: 32}} onClick={handleEndPlacementMatches}>
          Terminer les matchs de placement
        </button>
      )}
      {Object.keys(matchesByPoule).length === 0 && <p>Aucun match à afficher.</p>}
      {classementMatches.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ textAlign: 'center', color: '#007bff', margin: '18px 0' }}>Poules de classement</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Compétiteur 1</th>
                <th>Compétiteur 2</th>
                <th>Score 1</th>
                <th>Score 2</th>
                <th>Gagnant</th>
                <th>Fini</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {classementMatches.map(match => {
                if (match.competitor1 && !competitors[match.competitor1]) fetchCompetitorName(match.competitor1);
                if (match.competitor2 && !competitors[match.competitor2]) fetchCompetitorName(match.competitor2);
                if (match.winner && !competitors[match.winner]) fetchCompetitorName(match.winner);
                return (
                  <React.Fragment key={match.id}>
                    <tr>
                      <td>{competitors[match.competitor1] || match.competitor1}</td>
                      <td>{competitors[match.competitor2] || match.competitor2}</td>
                      <td>{match.score1}</td>
                      <td>{match.score2}</td>
                      <td>{competitors[match.winner] || match.winner || '-'}</td>
                      <td>{match.isFinished === true ? '✅' : '❌'}</td>
                      <td>
                        <button className={styles.scoreboardButton} onClick={() => handleScoreboardClick(match)}>Scoreboard</button>
                        <button className={styles.resultButton} style={{ marginLeft: 8 }} onClick={() => handleOpenForm(match)}>Rentrer des résultats</button>
                      </td>
                    </tr>
                    {openFormMatchId === match.id && (
                      <tr>
                        <td colSpan={7}>
                          <form onSubmit={(e) => handleFormSubmit(e, match)} className={styles.formRow}>
                            <div className={styles.scoreInputs}>
                              <label>Score 1:
                                <input type="number" name="score1" value={formData.score1} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                              </label>
                              <label>Score 2:
                                <input type="number" name="score2" value={formData.score2} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                              </label>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 16 }}>
                                <label>Keikuka 1:
                                  <input type="number" name="keikuka1" value={formData.keikuka1} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                </label>
                                <label>Keikuka 2:
                                  <input type="number" name="keikuka2" value={formData.keikuka2} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                </label>
                              </div>
                            </div>
                            <button type="submit" className={styles.saveButton}>Enregistrer</button>
                            <button type="button" onClick={handleCloseForm} className={styles.cancelButton}>Annuler</button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {rankingLoading && <p>Chargement du classement...</p>}
      {rankingError && <p style={{color: 'red'}}>{rankingError}</p>}
      {normalPoules.map(([poule, matches]) => (
        <div key={poule} style={{ marginBottom: 48 }}>
          <h3 style={{ textAlign: 'center', color: '#007bff', margin: '18px 0' }}>Poule {poule}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Compétiteur 1</th>
                <th>Compétiteur 2</th>
                <th>Score 1</th>
                <th>Score 2</th>
                <th>Gagnant</th>
                <th>Fini</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => {
                if (match.competitor1 && !competitors[match.competitor1]) fetchCompetitorName(match.competitor1);
                if (match.competitor2 && !competitors[match.competitor2]) fetchCompetitorName(match.competitor2);
                if (match.winner && !competitors[match.winner]) fetchCompetitorName(match.winner);
                return (
                  <React.Fragment key={match.id}>
                    <tr>
                      <td>{competitors[match.competitor1] || match.competitor1}</td>
                      <td>{competitors[match.competitor2] || match.competitor2}</td>
                      <td>{match.score1}</td>
                      <td>{match.score2}</td>
                      <td>{competitors[match.winner] || match.winner || '-'}</td>
                      <td>{match.isFinished === true ? '✅' : '❌'}</td>
                      <td>
                        <button className={styles.scoreboardButton} onClick={() => handleScoreboardClick(match)}>Scoreboard</button>
                        <button className={styles.resultButton} style={{ marginLeft: 8 }} onClick={() => handleOpenForm(match)}>Rentrer des résultats</button>
                      </td>
                    </tr>
                    {openFormMatchId === match.id && (
                      <tr>
                        <td colSpan={7}>
                          <form onSubmit={(e) => handleFormSubmit(e, match)} className={styles.formRow}>
                            <div className={styles.scoreInputs}>
                              <label>Score 1:
                                <input type="number" name="score1" value={formData.score1} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                              </label>
                              <label>Score 2:
                                <input type="number" name="score2" value={formData.score2} onChange={handleFormChange} required style={{ width: 60, marginLeft: 4 }} />
                              </label>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 16 }}>
                                <label>Keikuka 1:
                                  <input type="number" name="keikuka1" value={formData.keikuka1} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                </label>
                                <label>Keikuka 2:
                                  <input type="number" name="keikuka2" value={formData.keikuka2} onChange={handleFormChange} min="0" style={{ width: 60, marginLeft: 4 }} />
                                </label>
                              </div>
                            </div>
                            <button type="submit" className={styles.saveButton}>Enregistrer</button>
                            <button type="button" onClick={handleCloseForm} className={styles.cancelButton}>Annuler</button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MatchTablePoule;
