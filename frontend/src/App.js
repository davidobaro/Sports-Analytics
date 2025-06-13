import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { preloadCommonLogos } from "./utils/nbaTeamData";
import { warmCaches, performanceMonitor } from "./utils/cacheUtils";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LiveGamesBar from "./components/LiveGamesBar";
import Dashboard from "./pages/Dashboard";
import "./index.css";

// Fallback teams data - basic team info only (no performance tiers)
const FALLBACK_TEAMS = [
  // Eastern Conference - Atlantic
  {
    id: 1610612738,
    full_name: "Boston Celtics",
    abbreviation: "BOS",
    city: "Boston",
    nickname: "Celtics",
    conference: "Eastern",
    division: "Atlantic",
    championships: 17,
  },
  {
    id: 1610612751,
    full_name: "Brooklyn Nets",
    abbreviation: "BRK",
    city: "Brooklyn",
    nickname: "Nets",
    conference: "Eastern",
    division: "Atlantic",
    championships: 0,
  },
  {
    id: 1610612752,
    full_name: "New York Knicks",
    abbreviation: "NYK",
    city: "New York",
    nickname: "Knicks",
    conference: "Eastern",
    division: "Atlantic",
    championships: 2,
  },
  {
    id: 1610612755,
    full_name: "Philadelphia 76ers",
    abbreviation: "PHI",
    city: "Philadelphia",
    nickname: "76ers",
    conference: "Eastern",
    division: "Atlantic",
    championships: 3,
  },
  {
    id: 1610612761,
    full_name: "Toronto Raptors",
    abbreviation: "TOR",
    city: "Toronto",
    nickname: "Raptors",
    conference: "Eastern",
    division: "Atlantic",
    championships: 1,
  },

  // Eastern Conference - Central
  {
    id: 1610612741,
    full_name: "Chicago Bulls",
    abbreviation: "CHI",
    city: "Chicago",
    nickname: "Bulls",
    conference: "Eastern",
    division: "Central",
    championships: 6,
  },
  {
    id: 1610612739,
    full_name: "Cleveland Cavaliers",
    abbreviation: "CLE",
    city: "Cleveland",
    nickname: "Cavaliers",
    conference: "Eastern",
    division: "Central",
    championships: 1,
  },
  {
    id: 1610612765,
    full_name: "Detroit Pistons",
    abbreviation: "DET",
    city: "Detroit",
    nickname: "Pistons",
    conference: "Eastern",
    division: "Central",
    championships: 3,
  },
  {
    id: 1610612754,
    full_name: "Indiana Pacers",
    abbreviation: "IND",
    city: "Indianapolis",
    nickname: "Pacers",
    conference: "Eastern",
    division: "Central",
    championships: 0,
  },
  {
    id: 1610612749,
    full_name: "Milwaukee Bucks",
    abbreviation: "MIL",
    city: "Milwaukee",
    nickname: "Bucks",
    conference: "Eastern",
    division: "Central",
    championships: 2,
  },

  // Eastern Conference - Southeast
  {
    id: 1610612737,
    full_name: "Atlanta Hawks",
    abbreviation: "ATL",
    city: "Atlanta",
    nickname: "Hawks",
    conference: "Eastern",
    division: "Southeast",
    championships: 1,
  },
  {
    id: 1610612766,
    full_name: "Charlotte Hornets",
    abbreviation: "CHA",
    city: "Charlotte",
    nickname: "Hornets",
    conference: "Eastern",
    division: "Southeast",
    championships: 0,
  },
  {
    id: 1610612748,
    full_name: "Miami Heat",
    abbreviation: "MIA",
    city: "Miami",
    nickname: "Heat",
    conference: "Eastern",
    division: "Southeast",
    championships: 3,
  },
  {
    id: 1610612753,
    full_name: "Orlando Magic",
    abbreviation: "ORL",
    city: "Orlando",
    nickname: "Magic",
    conference: "Eastern",
    division: "Southeast",
    championships: 0,
  },
  {
    id: 1610612764,
    full_name: "Washington Wizards",
    abbreviation: "WAS",
    city: "Washington",
    nickname: "Wizards",
    conference: "Eastern",
    division: "Southeast",
    championships: 1,
  },

  // Western Conference - Northwest
  {
    id: 1610612743,
    full_name: "Denver Nuggets",
    abbreviation: "DEN",
    city: "Denver",
    nickname: "Nuggets",
    conference: "Western",
    division: "Northwest",
    championships: 1,
  },
  {
    id: 1610612750,
    full_name: "Minnesota Timberwolves",
    abbreviation: "MIN",
    city: "Minneapolis",
    nickname: "Timberwolves",
    conference: "Western",
    division: "Northwest",
    championships: 0,
  },
  {
    id: 1610612760,
    full_name: "Oklahoma City Thunder",
    abbreviation: "OKC",
    city: "Oklahoma City",
    nickname: "Thunder",
    conference: "Western",
    division: "Northwest",
    championships: 1,
  },
  {
    id: 1610612757,
    full_name: "Portland Trail Blazers",
    abbreviation: "POR",
    city: "Portland",
    nickname: "Trail Blazers",
    conference: "Western",
    division: "Northwest",
    championships: 1,
  },
  {
    id: 1610612762,
    full_name: "Utah Jazz",
    abbreviation: "UTA",
    city: "Utah", //this was done for naming purposes, as the team is known as "Utah Jazz"
    nickname: "Jazz",
    conference: "Western",
    division: "Northwest",
    championships: 0,
  },

  // Western Conference - Pacific
  {
    id: 1610612744,
    full_name: "Golden State Warriors",
    abbreviation: "GSW",
    city: "Golden State", //this was done for naming purposes, as the team is known as "Golden State Warriors"
    nickname: "Warriors",
    conference: "Western",
    division: "Pacific",
    championships: 7,
  },
  {
    id: 1610612746,
    full_name: "LA Clippers",
    abbreviation: "LAC",
    city: "Los Angeles",
    nickname: "Clippers",
    conference: "Western",
    division: "Pacific",
    championships: 0,
  },
  {
    id: 1610612747,
    full_name: "Los Angeles Lakers",
    abbreviation: "LAL",
    city: "Los Angeles",
    nickname: "Lakers",
    conference: "Western",
    division: "Pacific",
    championships: 17,
  },
  {
    id: 1610612756,
    full_name: "Phoenix Suns",
    abbreviation: "PHX",
    city: "Phoenix",
    nickname: "Suns",
    conference: "Western",
    division: "Pacific",
    championships: 0,
  },
  {
    id: 1610612758,
    full_name: "Sacramento Kings",
    abbreviation: "SAC",
    city: "Sacramento",
    nickname: "Kings",
    conference: "Western",
    division: "Pacific",
    championships: 1,
  },

  // Western Conference - Southwest
  {
    id: 1610612742,
    full_name: "Dallas Mavericks",
    abbreviation: "DAL",
    city: "Dallas",
    nickname: "Mavericks",
    conference: "Western",
    division: "Southwest",
    championships: 1,
  },
  {
    id: 1610612745,
    full_name: "Houston Rockets",
    abbreviation: "HOU",
    city: "Houston",
    nickname: "Rockets",
    conference: "Western",
    division: "Southwest",
    championships: 2,
  },
  {
    id: 1610612763,
    full_name: "Memphis Grizzlies",
    abbreviation: "MEM",
    city: "Memphis",
    nickname: "Grizzlies",
    conference: "Western",
    division: "Southwest",
    championships: 0,
  },
  {
    id: 1610612740,
    full_name: "New Orleans Pelicans",
    abbreviation: "NOP",
    city: "New Orleans",
    nickname: "Pelicans",
    conference: "Western",
    division: "Southwest",
    championships: 0,
  },
  {
    id: 1610612759,
    full_name: "San Antonio Spurs",
    abbreviation: "SAS",
    city: "San Antonio",
    nickname: "Spurs",
    conference: "Western",
    division: "Southwest",
    championships: 5,
  },
];

// Lazy load components
const TeamDetails = React.lazy(() => import("./pages/TeamDetails"));
const PlayerDetails = React.lazy(() => import("./pages/PlayerDetails"));
const PlayerList = React.lazy(() => import("./pages/PlayerList"));
const AllTeamsDemo = React.lazy(() => import("./pages/AllTeamsDemo"));

// Fallback loading component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
    <p className="font-mono text-cyan-400 text-sm">LOADING_COMPONENTS...</p>
  </div>
);

function App() {
  const [teams, setTeams] = useState([]);
  const [liveGames, setLiveGames] = useState([]);

  // Handle mobile menu click
  const handleMenuClick = () => {
    // Mobile menu functionality can be implemented here
    console.log("Mobile menu clicked");
  };

  useEffect(() => {
    // Enhanced initialization with performance monitoring
    performanceMonitor.start("App initialization");

    fetchData();
    // Preload common team logos for better performance
    preloadCommonLogos();
    // Initialize cache warming for optimal performance
    warmCaches();

    performanceMonitor.end("App initialization");
  }, []);

  const fetchData = async () => {
    try {
      performanceMonitor.start("Initial data fetch");

      // Use fallback teams data directly (no API needed for teams)
      setTeams(FALLBACK_TEAMS);

      // SUSPENDED: Live games API calls per user request
      // try {
      //   const gamesRes = await axios.get(`${API_BASE_URL}/live-games`);
      //   setLiveGames(gamesRes.data.games || []);
      // } catch (gamesError) {
      //   console.log("Live games API not available, using empty array");
      //   setLiveGames([]);
      // }
      setLiveGames([]); // No live games while suspended

      performanceMonitor.end("Initial data fetch");
    } catch (error) {
      console.error("Error in data initialization:", error);
      // Ensure teams are still set even if there's an error
      setTeams(FALLBACK_TEAMS);
      setLiveGames([]);
      performanceMonitor.end("Initial data fetch (error)");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Live Games Bar - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900">
          <LiveGamesBar games={liveGames} />
        </div>

        {/* Fixed Navbar - Directly below live games bar with no gap */}
        <div className="fixed top-12 left-0 right-0 z-40">
          <Navbar onMenuClick={handleMenuClick} />
        </div>

        <div className="flex flex-1 pt-28">
          {/* Adjusted padding for live games bar (12) + navbar (16) = 28 */}
          {/* Fixed Sidebar */}
          <Sidebar teams={teams} />
          {/* Main Content Area */}
          <div className="flex-1 ml-64 flex flex-col">
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
