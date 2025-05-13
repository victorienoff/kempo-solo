import React, { useState, useEffect, useRef } from "react";
import styles from "./Telecommande.module.css";

// Chargement initial synchrone des données du localStorage AVANT le rendu (pour éviter le flash des valeurs par défaut)
const getInitialCompetitor = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};
const getInitialNumber = (key, fallback) => {
  const val = localStorage.getItem(key);
  return val !== null ? Number(val) : fallback;
};

const Telecommande = () => {
  const [competitor1, setCompetitor1] = useState(() => getInitialCompetitor("scoreboard_competitor1", { name: "Julien WECKERLE", club: "Chatenois" }));
  const [competitor2, setCompetitor2] = useState(() => getInitialCompetitor("scoreboard_competitor2", { name: "Mesut AYSEL", club: "Nancy" }));
  const [score1, setScore1] = useState(() => getInitialNumber("scoreboard_score1", 1));
  const [score2, setScore2] = useState(() => getInitialNumber("scoreboard_score2", 2));
  const [faults1, setFaults1] = useState(() => getInitialNumber("scoreboard_faults1", 0));
  const [faults2, setFaults2] = useState(() => getInitialNumber("scoreboard_faults2", 0));
  const [timer, setTimer] = useState(() => getInitialNumber("scoreboard_timer", 180));
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Réinitialise les scores à 0 si l'URL contient ?reset (ex: ouverture depuis la navbar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('reset')) {
      setScore1(0);
      setScore2(0);
      setFaults1(0);
      setFaults2(0);
      setTimer(180);
      setCompetitor1({ name: '', club: '' });
      setCompetitor2({ name: '', club: '' });
      localStorage.setItem('scoreboard_score1', 0);
      localStorage.setItem('scoreboard_score2', 0);
      localStorage.setItem('scoreboard_faults1', 0);
      localStorage.setItem('scoreboard_faults2', 0);
      localStorage.setItem('scoreboard_timer', 180);
      localStorage.setItem('scoreboard_competitor1', JSON.stringify({ name: '', club: '' }));
      localStorage.setItem('scoreboard_competitor2', JSON.stringify({ name: '', club: '' }));
    }
  }, []);

  // Sauvegarde dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("scoreboard_competitor1", JSON.stringify(competitor1));
  }, [competitor1]);
  useEffect(() => {
    localStorage.setItem("scoreboard_competitor2", JSON.stringify(competitor2));
  }, [competitor2]);
  useEffect(() => {
    localStorage.setItem("scoreboard_score1", score1);
  }, [score1]);
  useEffect(() => {
    localStorage.setItem("scoreboard_score2", score2);
  }, [score2]);
  useEffect(() => {
    localStorage.setItem("scoreboard_faults1", faults1);
  }, [faults1]);
  useEffect(() => {
    localStorage.setItem("scoreboard_faults2", faults2);
  }, [faults2]);
  useEffect(() => {
    localStorage.setItem("scoreboard_timer", timer);
    localStorage.setItem("scoreboard_timer_running", isRunning);
  }, [timer, isRunning]);

  // Ouvre la fenêtre scoreboard si besoin et garde la référence
  useEffect(() => {
    if (window.location.pathname.includes('scoreboard') || window.location.search.includes('reload')) return;
    const channel = new BroadcastChannel('scoreboard_channel');
    let dejaOuvertRecu = false;
    let ouvertureAutorisee = true;
    let verrouPose = false;
    const VERROU_KEY = 'scoreboard_open_lock';
    const VERROU_TTL = 5000; // 5 secondes
    const now = Date.now();

    // Handler unique pour tous les messages
    channel.onmessage = (event) => {
      if (event.data === 'deja_ouvert' || event.data === 'ouvert') {
        dejaOuvertRecu = true;
        ouvertureAutorisee = false;
      }
      if (event.data === 'demande_ouverture' && localStorage.getItem('scoreboard_opened') === 'true') {
        channel.postMessage('deja_ouvert');
      }
    };

    channel.postMessage('demande_ouverture');

    setTimeout(() => {
      // Vérification du verrou atomique
      const verrou = localStorage.getItem(VERROU_KEY);
      if (!verrou || now - Number(verrou) > VERROU_TTL) {
        // Pose le verrou
        localStorage.setItem(VERROU_KEY, String(now));
        verrouPose = true;
      }
      // Relit le verrou pour voir qui l'a posé en premier
      const verrouFinal = localStorage.getItem(VERROU_KEY);
      if (verrouPose && String(now) === verrouFinal && ouvertureAutorisee && !dejaOuvertRecu) {
        if (!window.scoreboardWindow || window.scoreboardWindow.closed) {
          try {
            window.scoreboardWindow = window.open(
              window.location.origin + '/scoreboard',
              '_blank',
              'noopener,noreferrer,width=1000,height=700,left=950,top=100'
            );
            if (!window.scoreboardWindow) {
            } else {
              localStorage.setItem('scoreboard_opened', 'true');
              channel.postMessage('ouvert');
              const timer = setInterval(() => {
                if (window.scoreboardWindow && window.scoreboardWindow.closed) {
                  localStorage.setItem('scoreboard_opened', 'false');
                  channel.postMessage('ferme');
                  clearInterval(timer);
                  // Libère le verrou
                  localStorage.removeItem(VERROU_KEY);
                }
              }, 1000);
            }
          } catch (e) {
            alert('Erreur lors de l\'ouverture de la fenêtre scoreboard : ' + e.message);
          }
        }
      }
    }, 200);

    return () => {
      channel.close();
    };
  }, []);

  // Gestion du timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) return prev - 1;
          setIsRunning(false);
          // Joue le son quand le timer atteint zéro
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
          return 0;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Contrôles du timer
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => { setTimer(180); setIsRunning(false); };

  // Fermer les deux fenêtres (télécommande et scoreboard)
  const handleEnd = async () => {
    // Sauvegarde API si on vient d'un match (scoreboard_match_id présent)
    const matchId = localStorage.getItem('scoreboard_match_id');
    if (matchId) {
      try {
        const token = localStorage.getItem('token');
        // On tente de retrouver l'id du gagnant (pas juste le nom)
        let winner = '';
        if (score1 > score2) winner = localStorage.getItem('scoreboard_competitor1_id') || '';
        else if (score2 > score1) winner = localStorage.getItem('scoreboard_competitor2_id') || '';
        // Si pas d'id, fallback sur le nom
        if (!winner) {
          winner = score1 > score2 ? competitor1.name : (score2 > score1 ? competitor2.name : '');
        }
        const body = {
          score1: score1,
          score2: score2,
          winner: winner,
          keikuka1: faults1,
          keikuka2: faults2,
        };
        await fetch(`http://localhost:3000/api/matches/${matchId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(body),
          }
        );
      } catch (e) {
        alert('Erreur lors de la sauvegarde du match !');
      }
    }
    if (window.scoreboardWindow && !window.scoreboardWindow.closed) {
      window.scoreboardWindow.close();
      localStorage.setItem('scoreboard_opened', 'false');
    }
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({ type: 'CLOSE_SCOREBOARD' }, '*');
        window.opener.location.reload(); // Actualise la page parent
      } catch (e) {}
    }
    window.close();
  };

  // Format mm:ss
  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2, '0')}:${String(s%60).padStart(2, '0')}`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.competitor}>
          <input
            type="text"
            value={competitor1.name}
            onChange={e => setCompetitor1({ ...competitor1, name: e.target.value })}
            style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 4 }}
            placeholder="Nom du compétiteur"
          />
          <label style={{fontSize: '0.95rem', marginTop: 2, marginBottom: 0, color: '#aaa'}}>Club</label>
          <input
            type="text"
            value={competitor1.club}
            onChange={e => setCompetitor1({ ...competitor1, club: e.target.value })}
            style={{ fontSize: '1rem' }}
            placeholder="Nom du club"
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', margin: '8px 0 4px 0', gap: 80}}>
          <div style={{textAlign: 'center', position: 'relative', minWidth: 120}}>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>Ippon</span>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 4}}>
              <button className={styles.btn} style={{position: 'absolute', left: -40, zIndex: 2}} onClick={() => setScore1(Math.max(0, score1 - 1))}>-</button>
              <div className={styles.score} style={{margin: '0 8px'}}>{score1}</div>
              <button className={styles.btn} onClick={() => setScore1(score1 + 1)}>+</button>
            </div>
          </div>
          <div style={{textAlign: 'center', position: 'relative', minWidth: 120}}>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>Keikuka</span>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 4}}>
              <button className={styles.btn} style={{position: 'absolute', left: -40, zIndex: 2}} onClick={() => setFaults1(Math.max(0, faults1 - 1))}>-</button>
              <div className={styles.score} style={{margin: '0 8px'}}>{faults1}</div>
              <button className={styles.btn} onClick={() => setFaults1(faults1 + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.competitor}>
          <input
            type="text"
            value={competitor2.name}
            onChange={e => setCompetitor2({ ...competitor2, name: e.target.value })}
            style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 4 }}
            placeholder="Nom du compétiteur"
          />
          <label style={{fontSize: '0.95rem', marginTop: 2, marginBottom: 0, color: '#aaa'}}>Club</label>
          <input
            type="text"
            value={competitor2.club}
            onChange={e => setCompetitor2({ ...competitor2, club: e.target.value })}
            style={{ fontSize: '1rem' }}
            placeholder="Nom du club"
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', margin: '8px 0 4px 0', gap: 80}}>
          <div style={{textAlign: 'center', position: 'relative', minWidth: 120}}>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>Ippon</span>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 4}}>
              <button className={styles.btn} style={{position: 'absolute', left: -40, zIndex: 2}} onClick={() => setScore2(Math.max(0, score2 - 1))}>-</button>
              <div className={styles.score} style={{margin: '0 8px'}}>{score2}</div>
              <button className={styles.btn} onClick={() => setScore2(score2 + 1)}>+</button>
            </div>
          </div>
          <div style={{textAlign: 'center', position: 'relative', minWidth: 120}}>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>Keikuka</span>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 4}}>
              <button className={styles.btn} style={{position: 'absolute', left: -40, zIndex: 2}} onClick={() => setFaults2(Math.max(0, faults2 - 1))}>-</button>
              <div className={styles.score} style={{margin: '0 8px'}}>{faults2}</div>
              <button className={styles.btn} onClick={() => setFaults2(faults2 + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer} style={{fontSize: '3.5vw'}}>{formatTime(timer)}</div>
        <div className={styles.timerControls}>
          <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button>
          <button className={`${styles.ctrlBtn} ${styles.start}`} onClick={handleStart}>START</button>
          <button className={`${styles.ctrlBtn} ${styles.pause}`} onClick={handlePause}>PAUSE</button>
          <button className={`${styles.ctrlBtn} ${styles.reset}`} onClick={handleReset}>RESET</button>
          <button className={`${styles.ctrlBtn} ${styles.end}`} onClick={handleEnd}>END</button>
        </div>
      </div>
      <audio ref={audioRef} src={process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/finalSound.ogg' : '/finalSound.ogg'} preload="auto" />
    </div>
  );
};

export default Telecommande;
