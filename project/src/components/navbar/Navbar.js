import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./nav.module.css";
import { jwtDecode } from "jwt-decode";

const NavBar = () => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
        if (t) {
            try {
                const decoded = jwtDecode(t);
                setUser(decoded);
            } catch (e) {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>
            <ul className={style.menu}>
                <Link to="/"><li><span className={style.icon}>🏠</span><span className={style.linkText}>Home</span></li></Link>
                <Link to="/tournaments"><li><span className={style.icon}>🏆</span><span className={style.linkText}>Tournoi</span></li></Link>
                
                {/* Affiche ces liens seulement si l'utilisateur a le droit tournamentView */}
                {user && user.rights && user.rights.includes("tournamentView") && (

                    <>
                    <Link to="/competiteurs"><li><span className={style.icon}>👥</span><span className={style.linkText}>Compétiteurs</span></li></Link>
                        <Link to="/telecommande"><li><span className={style.icon}>🎚️</span><span className={style.linkText}>Telecommande</span></li></Link>
                        <Link to="/scoreboard"><li><span className={style.icon}>📺</span><span className={style.linkText}>Scoarboard</span></li></Link>
                    </>
                )}
            </ul>
        </div>
    );
};

export default NavBar;
