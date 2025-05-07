import React from "react";
import styles from "./Scoreboard.module.css";

const Scoreboard = () => {
  return (
    <div className={styles.scoreboard}>
      <div className={`${styles.player} ${styles.red}`}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong>Julien WECKERLE</strong>
            <span>Chatenois</span>
          </div>
        </div>
        <div className={styles.score}>1</div>
      </div>

      <div className={`${styles.player} ${styles.white}`}>
        <div className={styles["player-info"]}>
          <div className={styles.flag}></div>
          <div className={styles.names}>
            <strong>Mesut AYSEL</strong>
            <span>Nancy</span>
          </div>
        </div>
        <div className={styles.score}>2</div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.logo}>
          <div className={styles.symbol}></div>
          <div className={styles.text}>
            <strong>NIPPON KEMPO</strong>
            <span>日本拳法</span>
          </div>
        </div>
        <div className={styles.timer}>03:00</div>
      </div>
    </div>
  );
};

export default Scoreboard;
