import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home'
import Competitors from "./pages/Competitors/Competitors";
import TournoiDetails from "./pages/TournoiDetails/ToutnoiDetails"
import Telecommande from "./pages/Telecommande/components/Telecommande";
import Scoreboard from "./pages/Scoreboard/Scoarboard";
import AddCompetitorsToCategory from "./pages/TournoiDetails/Components/addCompetitorsToCategory";
import MatchesTable from "./pages/Matches/Components/MatchesTable";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<div className='content'><Home /></div>}></Route>
          <Route path='/competiteurs' element={<div className='content'><Competitors /></div>}></Route>
          <Route path='/telecommande' element={<div className='content'><Telecommande /></div>}></Route>
          <Route path='/scoreboard' element={<div className='content'><Scoreboard /></div>}></Route>
          <Route path='/tournoiDetails/:id' element={<TournoiDetails />}></Route>
          <Route path="/tournoiDetails/:id/ajouter-competiteurs" element={<AddCompetitorsToCategory />} />
          <Route path="/matches/:categoryId" element={<MatchesTable />} />
          <Route path="/login" element={<div className='content'><Login /></div>}></Route>
          <Route path="/profile" element={<div className='content'><Profile /></div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
