import React from "react";
import styles from "./MatchesTable.module.css";
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

// Fonctions utilitaires copiées depuis MatchesTable.js
function buildBracketMatches(matches, competitors) {
  if (!matches || matches.length === 0) return [];
  const roundNames = Array.from(new Set(matches.map(m => m._roundName || m.pool_number))).sort((a, b) => {
    const numA = a && a.match(/\d+/) ? parseInt(a.match(/\d+/)[0], 10) : 0;
    const numB = b && b.match(/\d+/) ? parseInt(b.match(/\d+/)[0], 10) : 0;
    return numA - numB;
  });
  const roundLabels = roundNames.map((_, idx) => `Tour ${idx + 1}`);
  return matches.map(m => {
    let roundIdx = roundNames.indexOf(m._roundName || m.pool_number);
    let roundText = m._displayRound || (roundIdx !== -1 ? roundLabels[roundIdx] : '');
    return {
      id: m.id,
      name: '',
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

const CustomMatch = (props) => {
  const { match } = props;
  const matchWithoutId = {
    ...match,
    name: '',
    participants: match.participants.map(p => ({ ...p, id: '', name: p.name })),
  };
  return <Match {...props} match={matchWithoutId} />;
};

const CustomSVGViewer = (props) => (
  <SVGViewer {...props} initialScale={0.15} />
);

const FrenchRoundTitle = ({ title }) => (
  <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff', margin: '12px 0' }}>{title}</div>
);

const MatchTableDirect = ({
  matches,
  competitors,
  rounds,
  openFormMatchId,
  formData,
  loading,
  handleScoreboardClick,
  handleOpenForm,
  handleCloseForm,
  handleFormChange,
  handleFormSubmit,
  isWinnerEditable
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Matchs (Élimination directe)</h2>
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
                <th>Fini</th>
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
                        <td>{m.winner ? '✅' : '❌'}</td>
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
                          <td colSpan={8}>
                            <form onSubmit={(e) => handleFormSubmit(e, m)} className={styles.formRow}>
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

export default MatchTableDirect;
