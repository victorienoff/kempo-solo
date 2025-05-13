import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home';
import Tournaments from './pages/Tournaments/Tournaments'
import Competitors from "./pages/Competitors/Competitors";
import TournoiDetails from "./pages/TournoiDetails/ToutnoiDetails"
import Telecommande from "./pages/Telecommande/components/Telecommande";
import Scoreboard from "./pages/Scoreboard/Scoarboard";
import AddCompetitorsToCategory from "./pages/TournoiDetails/Components/addCompetitorsToCategory";
import MatchesTable from "./pages/Matches/Components/MatchesTable";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import AuthButtons from "./components/AuthButtons";
import Signup from "./pages/Signup/Signup";
import PasswordReset from "./pages/PasswordReset/PasswordReset";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/telecommande' element={<div className='content'><Telecommande /></div>}></Route>
        <Route path='/scoreboard' element={<div className='content'><Scoreboard /></div>}></Route>
        {/* Pages sans navbar ni auth */}
        <Route path='/' element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Home /></div></div></>}></Route>
        <Route path='/tournaments' element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Tournaments /></div></div></>}></Route>
        <Route path='/competiteurs' element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Competitors /></div></div></>}></Route>
        <Route path='/tournoiDetails/:id' element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><TournoiDetails /></div></div></>}></Route>
        <Route path="/tournoiDetails/:id/ajouter-competiteurs" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><AddCompetitorsToCategory /></div></div></>}/>
        <Route path="/matches/:categoryId" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><MatchesTable /></div></div></>}/>
        <Route path="/login" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Login /></div></div></>}></Route>
        <Route path="/profile" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Profile /></div></div></>}/>
        <Route path="/signup" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><Signup /></div></div></>}/>
        <Route path="/passwordreset/:token" element={<><AuthButtons /><div className='App'><NavBar /><div className='contentWithNav'><PasswordReset /></div></div></>}/>
      </Routes>
    </Router>
  );
}

export default App;
