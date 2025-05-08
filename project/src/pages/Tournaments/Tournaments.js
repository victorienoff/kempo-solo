import styles from "./Tournaments.module.css"
import TournoiTable from "./components/TournamentTable";
import AuthButtons from "../../components/AuthButtons";

function Tournaments(){
    return(
    <div className="">
      <AuthButtons />
      <h1 className = {styles.title}>Liste des Tournois</h1>
      
      <TournoiTable />

    </div>
    )
}
export default Tournaments