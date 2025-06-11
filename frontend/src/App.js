import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { preloadCommonLogos } from "./utils/nbaTeamData";
import { warmCaches, performanceMonitor } from "./utils/cacheUtils";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LiveGamesBar from "./components/LiveGamesBar";
import Dashboard from "./pages/Dashboard";
// Lazy load optimized components for better performance
const TeamDetails = React.lazy(() => import("./pages/TeamDetailsOptimized"));
const PlayerDetails = React.lazy(() => import("./pages/PlayerDetails"));
const PlayerList = React.lazy(() => import("./pages/PlayerListOptimized"));
const AllTeamsDemo = React.lazy(() => import("./pages/AllTeamsDemo"));

// Fallback loading component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
    <p className="font-mono text-cyan-400 text-sm">LOADING_OPTIMIZED_COMPONENTS...</p>
  </div>
);
import "./index.css";

const API_BASE_URL = "http://localhost:8000/api";

function App() {
  const [teams, setTeams] = useState([]);
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    // Enhanced initialization with performance monitoring
    performanceMonitor.start('App initialization');
    
    fetchData();
    // Preload common team logos for better performance
    preloadCommonLogos();
    // Initialize cache warming for optimal performance
    warmCaches();
    
    performanceMonitor.end('App initialization');
  }, []);

  const fetchData = async () => {
    try {
      performanceMonitor.start('Initial data fetch');
      
      const [teamsRes, gamesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/teams`),
        axios.get(`${API_BASE_URL}/live-games`),
      ]);

      setTeams(teamsRes.data.teams || []);
      setLiveGames(gamesRes.data.games || []);
      
      performanceMonitor.end('Initial data fetch');
    } catch (error) {
      console.error("Error fetching data:", error);
      performanceMonitor.end('Initial data fetch (error)');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Live Games Bar - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
          <LiveGamesBar games={liveGames} />
        </div>

        <div className="flex flex-1 pt-16">
          {" "}
          {/* Reduced padding for smaller live games bar */}
          {/* Fixed Sidebar */}
          <Sidebar teams={teams} />
          {/* Main Content Area */}
          <div className="flex-1 ml-64 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/teams" element={<AllTeamsDemo />} />
                  <Route path="/team/:teamId" element={<TeamDetails />} />
                  <Route path="/team/:teamId/roster" element={<PlayerList />} />
                  <Route path="/player/:playerId" element={<PlayerDetails />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
