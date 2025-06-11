import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LiveGamesBar from './components/LiveGamesBar';
import Dashboard from './pages/Dashboard';
import TeamDetails from './pages/TeamDetails';
import PlayerDetails from './pages/PlayerDetails';
import './index.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [teams, setTeams] = useState([]);
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, gamesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/teams`),
        axios.get(`${API_BASE_URL}/live-games`)
      ]);
      
      setTeams(teamsRes.data.teams || []);
      setLiveGames(gamesRes.data.games || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Live Games Bar - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
          <LiveGamesBar games={liveGames} />
        </div>
        
        <div className="flex flex-1 pt-16"> {/* Reduced padding for smaller live games bar */}
          {/* Fixed Sidebar */}
          <Sidebar teams={teams} />
          
          {/* Main Content Area */}
          <div className="flex-1 ml-64 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team/:teamId" element={<TeamDetails />} />
                <Route path="/player/:playerId" element={<PlayerDetails />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
