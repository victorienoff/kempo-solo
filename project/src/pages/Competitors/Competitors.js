import styles from './Competitors.module.css'
import Filter from './Components/Filter';
import CompetiteursTable from './Components/CompetitorsTable';
import AuthButtons from "../../components/AuthButtons";

function Competitors(){
    return (
        <div className={styles.competitorsContainer}>
        <AuthButtons />
        <h1 className={styles.title}>Liste des Compétiteurs</h1>

        <CompetiteursTable />
    </div>
    )
}

export default Competitors