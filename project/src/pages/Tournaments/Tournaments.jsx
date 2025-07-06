import React, { useEffect, useState } from "react";
import styles from "./Tournaments.module.css"
import TournoiTable from "./components/TournamentTable";
import AuthButtons from "../../components/AuthButtons";
import CreateTournament from "./components/CreateTournament";

function Tournaments(){
    const [canCreate, setCanCreate] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setCanCreate(Array.isArray(decoded.rights) && decoded.rights.includes("tournamentCreate"));
            } catch (e) {
                setCanCreate(false);
            }
        } else {
            setCanCreate(false);
        }
    }, []);
    return(
    <div className="">
      <AuthButtons />
      <h1 className = {styles.title}>Liste des Tournois</h1>
      {canCreate && <CreateTournament />}
      <TournoiTable />
    </div>
    )
}
export default Tournaments