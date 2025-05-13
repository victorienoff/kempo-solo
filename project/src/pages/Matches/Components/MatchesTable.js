import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MatchTablePoule from "./MatchTablePoule";
import MatchTableDirect from "./MatchTableDirect";
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
  const [matches, setMatches] = useState([]);
  const [competitors, setCompetitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFormMatchId, setOpenFormMatchId] = useState(null);
  const [formData, setFormData] = useState({ score1: '', score2: '', winner: '', keikuka1: '', keikuka2: '' });
  const [rounds, setRounds] = useState([]); // Ajouté pour stocker les rounds
  const [eliminationType, setEliminationType] = useState(null); // Ajouté pour le type d'élimination

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
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem('token');
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        };
        const res = await axios.get(`http://localhost:3000/api/tournaments/categories/${categoryId}`, axiosConfig);
        setEliminationType(res.data.elimination_type);
      } catch (err) {
        setEliminationType(null);
      }
    };
    fetchCategory();
  }, [categoryId]);

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
        const roundNames = Object.keys(res.data).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        const roundsArr = Object.entries(res.data)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .map(([roundName, matches], idx) => ({
            roundName,
            displayName: `Tour ${idx + 1}`,
            matches
          }));
        setRounds(roundsArr);
        const allMatches = roundsArr.flatMap(r => r.matches.map(m => ({
          ...m,
          _displayRound: r.displayName,
          _roundName: r.roundName,
          club1: m.competitor1 && m.competitor1.club ? m.competitor1.club : (m.club1 || ''),
          club2: m.competitor2 && m.competitor2.club ? m.competitor2.club : (m.club2 || '')
        })));
        setMatches(allMatches);
        // Construction du mapping competitors à partir des propriétés *_name
        const compMap = {};
        allMatches.forEach(match => {
          if (match.competitor1 && match.competitor1_name) compMap[match.competitor1] = match.competitor1_name;
          if (match.competitor2 && match.competitor2_name) compMap[match.competitor2] = match.competitor2_name;
          if (match.winner && match.winner_name) compMap[match.winner] = match.winner_name;
        });
        setCompetitors(compMap);
        // Compléter dynamiquement les noms manquants via l'API
        const uniqueIds = Array.from(
          new Set(allMatches.flatMap((m) => [m.competitor1, m.competitor2, m.winner]))
        ).filter(Boolean);
        uniqueIds.forEach(async (id) => {
          if (!compMap[id]) {
            try {
              const res = await axios.get(`http://localhost:3000/api/competitors/${id}`, axiosConfig);
              if (res.data && res.data.firstname && res.data.lastname) {
                setCompetitors(prev => ({ ...prev, [id]: `${res.data.firstname} ${res.data.lastname}` }));
              }
            } catch (err) { /* ignore */ }
          }
        });
      } catch (error) {
        // ...
      } finally {
        setLoading(false);
      }
    };
    fetchBracket();
  }, [categoryId]);

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

  const handleScoreboardClick = async (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    // Récupérer les infos des compétiteurs via l'API pour avoir le club
    const getCompetitorData = async (id) => {
      if (!id) return { name: '', club: '' };
      try {
        const token = localStorage.getItem("token");
        const axiosConfig = {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        };
        const res = await axios.get(`http://localhost:3000/api/competitors/${id}`, axiosConfig);
        return {
          name: `${res.data.firstname} ${res.data.lastname}`,
          club: res.data.club || ''
        };
      } catch {
        return { name: id, club: '' };
      }
    };
    const competitor1 = await getCompetitorData(match.competitor1);
    const competitor2 = await getCompetitorData(match.competitor2);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  const isPoule = eliminationType && eliminationType.toLowerCase().includes('poule');
  const isDirect = eliminationType && (
    eliminationType.toLowerCase().includes('direct') ||
    eliminationType.toLowerCase().includes('élimination')
  );
  if (isPoule) {
    return <MatchTablePoule />;
  }
  if (isDirect) {
    return (
      <MatchTableDirect
        matches={matches}
        competitors={competitors}
        rounds={rounds}
        openFormMatchId={openFormMatchId}
        formData={formData}
        loading={loading}
        handleScoreboardClick={handleScoreboardClick}
        handleOpenForm={handleOpenForm}
        handleCloseForm={handleCloseForm}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        isWinnerEditable={isWinnerEditable}
      />
    );
  }
  return <div>Type d'élimination non supporté.</div>;
};

export default MatchesTable;
