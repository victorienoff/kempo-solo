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

    // Toujours décoder le token JWT pour obtenir les droits
    let rights = [];
    const t = localStorage.getItem("token");
    if (t) {
        try {
            const decoded = jwtDecode(t);
            if (decoded && decoded.rights) rights = decoded.rights;
        } catch {}
    }

    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <img src="/logo.png" alt="Tournament Logo" className={style.logo} />
            </div>
            <ul className={style.menu}>
                <Link to="/"><li><span className={style.icon}>🏠</span><span className={style.linkText}>Home</span></li></Link>
                <Link to="/tournaments"><li><span className={style.icon}>🏆</span><span className={style.linkText}>Tournoi</span></li></Link>
                
                {/* Affiche ces liens seulement si l'utilisateur a le droit userDelete */}
                {rights.includes("userDelete") && (
                    <>
                        <Link to="/competiteurs"><li><span className={style.icon}>👥</span><span className={style.linkText}>Compétiteurs</span></li></Link>
                    </>
                )}

                {/* Affiche le bouton Scoreboard seulement si l'utilisateur a le droit tournamentUpdate */}
                {rights.includes("tournamentUpdate") && (
                    <li
                        onClick={() => {
                            window.open(window.location.origin + '/telecommande?reset', '_blank', 'noopener,noreferrer,width=800,height=600,left=100,top=100');
                        }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <span className={style.icon}>📺</span>
                        <span className={style.linkText}>Scoreboard</span>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NavBar;
