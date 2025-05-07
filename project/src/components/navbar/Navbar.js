import React from "react";
import { Link } from "react-router-dom";
import style from "./nav.module.css";
import ProfileIcon from "../ProfileIcon";

const NavBar = () => {
    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>
            <ProfileIcon />

            <ul className={style.menu}>
                <Link to="/"><li>🏠 Accueil</li></Link>
                {/* <li>📅 Tous les Tournois</li> */}
                {/* <li>📊 Score Board</li> */}
                <Link to="/competiteurs"><li>👥 Compétiteurs</li></Link>
                <Link to="/telecommande"><li>🎚️ Telecommande</li></Link>
                <Link to="/scoreboard"><li>📺 Scoarboard</li></Link>

            </ul>
        </div>
    );
};

export default NavBar;
