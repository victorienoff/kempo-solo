import React from "react";
import styles from "./Telecommande.module.css";

const Telecommande = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>Julien WECKERLE</strong>
          <span>Chatenois</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn}>+</button>
          <div className={styles.score}>1</div>
          <button className={styles.btn}>-</button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.competitor}>
          <strong>Mesut AYSEL</strong>
          <span>Nancy</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.btn}>+</button>
          <div className={styles.score}>2</div>
          <button className={styles.btn}>-</button>
        </div>
      </div>

      <div className={`${styles.card} ${styles.timerCard}`}>
        <div className={styles.timer}>03:00</div>
        <div className={styles.timerControls}>
          <button className={`${styles.ctrlBtn} ${styles.select}`}>SELECT</button>
          <button className={`${styles.ctrlBtn} ${styles.start}`}>START</button>
          <button className={`${styles.ctrlBtn} ${styles.pause}`}>PAUSE</button>
          <button className={`${styles.ctrlBtn} ${styles.reset}`}>RESET</button>
          <button className={`${styles.ctrlBtn} ${styles.end}`}>END</button>
        </div>
      </div>
    </div>
  );
};

export default Telecommande;
