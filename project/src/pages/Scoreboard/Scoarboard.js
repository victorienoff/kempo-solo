import React, { useEffect, useState, useRef } from "react";
import styles from "./Scoreboard.module.css";

const Scoreboard = () => {
  const [competitor1, setCompetitor1] = useState({ name: "Julien WECKERLE", club: "Chatenois" });
  const [competitor2, setCompetitor2] = useState({ name: "Mesut AYSEL", club: "Nancy" });
  const [score1, setScore1] = useState(1);
  const [score2, setScore2] = useState(2);
  const [faults1, setFaults1] = useState(0);
  const [faults2, setFaults2] = useState(0);
  const [timer, setTimer] = useState(180); // Valeur par défaut 3:00
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Fonction pour charger depuis le localStorage
  const loadFromStorage = () => {
    const c1 = localStorage.getItem("scoreboard_competitor1");
    const c2 = localStorage.getItem("scoreboard_competitor2");
    const s1 = localStorage.getItem("scoreboard_score1");
    const s2 = localStorage.getItem("scoreboard_score2");
    const f1 = localStorage.getItem("scoreboard_faults1");
    const f2 = localStorage.getItem("scoreboard_faults2");
    const t = localStorage.getItem("scoreboard_timer");
    const running = localStorage.getItem("scoreboard_timer_running");
    if (c1) setCompetitor1(JSON.parse(c1));
    if (c2) setCompetitor2(JSON.parse(c2));
    if (s1 !== null) setScore1(Number(s1));
    if (s2 !== null) setScore2(Number(s2));
    if (f1 !== null) setFaults1(Number(f1));
    if (f2 !== null) setFaults2(Number(f2));
    if (t !== null) setTimer(Number(t));
    if (running !== null) setIsRunning(running === "true");
  };

  useEffect(() => {
    loadFromStorage();
    // Écoute les changements du localStorage
    const onStorage = (e) => {
      if ([
        "scoreboard_competitor1", "scoreboard_competitor2", "scoreboard_score1", "scoreboard_score2", "scoreboard_faults1", "scoreboard_faults2",
        "scoreboard_timer", "scoreboard_timer_running"
      ].includes(e.key)) {
        loadFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    // Ajout : écoute le message pour fermeture
    const onMessage = (e) => {
      if (e.data && e.data.type === 'CLOSE_SCOREBOARD') {
        window.close();
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  // Animation locale du timer si running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) {
            // On décrémente localement, mais on vérifie la valeur du localStorage pour éviter les désyncs
            const t = Number(localStorage.getItem("scoreboard_timer"));
            return t > 0 ? t : 0;
          }
          clearInterval(intervalRef.current);
          return 0;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Format mm:ss
  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2, '0')}:${String(s%60).padStart(2, '0')}`;

  return (
    <div className={styles.scoreboard}>
      {/* Ligne 1 : Rouge */}
      <div className={`${styles.player} ${styles.red}`} style={{position: 'relative', fontWeight: 'bold', fontSize: '2vw', letterSpacing: 1}}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong style={{fontSize: '2vw', fontWeight: 'bold'}}>{competitor1.name}</strong>
            <span style={{fontSize: '1.3vw', fontWeight: 'bold'}}>{competitor1.club}</span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5vw'}}>
          <span className={styles.score} style={{fontFamily: 'DS-Digital, Courier New, monospace', fontSize: '4vw', fontWeight: 'bold'}}>{score1}</span>
          <span style={{fontFamily: 'DS-Digital, Courier New, monospace', fontSize: '1.5vw', fontWeight: 'bold', marginLeft: '0.2vw'}}>{faults1}</span>
        </div>
      </div>

      {/* Ligne 2 : Blanc */}
      <div className={`${styles.player} ${styles.white}`} style={{position: 'relative', fontWeight: 'bold', fontSize: '2vw', letterSpacing: 1}}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong style={{fontSize: '2vw', fontWeight: 'bold'}}>{competitor2.name}</strong>
            <span style={{fontSize: '1.3vw', fontWeight: 'bold'}}>{competitor2.club}</span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5vw'}}>
          <span className={styles.score} style={{fontFamily: 'DS-Digital, Courier New, monospace', fontSize: '4vw', fontWeight: 'bold'}}>{score2}</span>
          <span style={{fontFamily: 'DS-Digital, Courier New, monospace', fontSize: '1.5vw', fontWeight: 'bold', marginLeft: '0.2vw'}}>{faults2}</span>
        </div>
      </div>

      {/* Ligne 3 : Logo et Timer */}
      <div className={styles.bottom} style={{background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '75%'}}>
        <div className={styles.logo}>
          <div className={styles.symbol}></div>
          <div className={styles.text}>
            <strong style={{fontSize: '1.7vw', fontWeight: 'bold'}}>NIPPON KEMPO</strong>
            <span style={{fontSize: '1.5vw', fontWeight: 'bold'}}>日本拳法</span>
          </div>
        </div>
        <div className={styles.timer} style={{fontFamily: 'DS-Digital, Courier New, monospace', fontSize: '3.5vw', fontWeight: 'bold'}}>{formatTime(timer)}</div>
      </div>
    </div>
  );
};

export default Scoreboard;
