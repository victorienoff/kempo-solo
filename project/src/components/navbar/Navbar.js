import React from "react";
import { Link } from "react-router-dom";
import style from "./nav.module.css";

const NavBar = () => {
    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>
            <ul className={style.menu}>
                <Link to="/"><li><span className={style.icon}>🏠</span><span className={style.linkText}>Home</span></li></Link>
                <Link to="/tournaments"><li><span className={style.icon}>🏆</span><span className={style.linkText}>Tournoi</span></li></Link>
                <Link to="/competiteurs"><li><span className={style.icon}>👥</span><span className={style.linkText}>Compétiteurs</span></li></Link>
                <Link to="/telecommande"><li><span className={style.icon}>🎚️</span><span className={style.linkText}>Telecommande</span></li></Link>
                <Link to="/scoreboard"><li><span className={style.icon}>📺</span><span className={style.linkText}>Scoarboard</span></li></Link>
            </ul>
        </div>
    );
};

export default NavBar;
