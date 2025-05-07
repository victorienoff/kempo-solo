import styles from "./home.module.css"
import TournoiTable from "./components/TournamentTable";

function Home(){
    return(
    <div className="">
      <h1 className = {styles.title}>Liste des Tournois</h1>
      
      <TournoiTable />

    </div>
    )
}
export default Home