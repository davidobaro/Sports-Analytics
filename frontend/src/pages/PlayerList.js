import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

const teamDataCache = new Map();

const PlayerList = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetails = useCallback(async () => {
    try {
      if (teamDataCache.has(teamId)) {
        setTeamData(teamDataCache.get(teamId));
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/team/${teamId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      teamDataCache.set(teamId, data);
      setTeamData(data);
      
      if (data?.basic_info?.full_name) {
        document.title = `${data.basic_info.full_name} Roster - NBA Analytics`;
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  const teamColors = {
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  };

  const mockPlayers = [
    {
      id: 1,
      name: "LeBron James",
      position: "SF",
      number: 23,
      height: "6'9\"",
      weight: "250 lbs",
      age: 40,
      stats: { ppg: 25.3, rpg: 7.3, apg: 7.5 }
    },
    {
      id: 2,
      name: "Anthony Davis",
      position: "PF/C",
      number: 3,
      height: "6'10\"",
      weight: "253 lbs",
      age: 31,
      stats: { ppg: 24.1, rpg: 12.6, apg: 3.5 }
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="font-mono text-cyan-400 text-sm">LOADING_ROSTER_DATA...</p>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-mono font-bold text-red-400 mb-4">
          TEAM_NOT_FOUND
        </h2>
        <p className="text-gray-400 font-mono">
          Error: Requested team data unavailable
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 btn-secondary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <img
                src={`https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`}
                alt={`${teamData.basic_info?.full_name} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span
                className="text-white font-mono font-bold text-lg"
                style={{ display: "none" }}
              >
                {teamData.basic_info?.abbreviation || "NBA"}
              </span>
            </div>
            <div>
              <h1 className={`text-2xl font-mono font-bold ${teamColors.accent} mb-1`}>
                {teamData.basic_info?.full_name || "Team Roster"}
              </h1>
              <p className="text-gray-400 font-mono text-sm">
                2024-25 Season • Official Roster
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
            <Link to="/" className="hover:text-cyan-400 transition-colors">NBA Analytics</Link>
            <span>/</span>
            <Link to="/teams" className="hover:text-cyan-400 transition-colors">Teams</Link>
            <span>/</span>
            <Link to={`/team/${teamId}`} className="hover:text-cyan-400 transition-colors">
              {teamData.basic_info?.full_name || "Team Details"}
            </Link>
            <span>/</span>
            <span className={teamColors.accent}>Roster</span>
          </div>
          
          <Link 
            to={`/team/${teamId}`}
            className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
          >
            ← BACK_TO_TEAM
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-mono font-semibold ${teamColors.accent}`}>
              TEAM_ROSTER
            </h2>
            <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
              {mockPlayers.length}_PLAYERS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockPlayers.map((player) => (
              <div
                key={player.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                      <span className="text-white font-mono font-bold text-sm">
                        #{player.number}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-mono font-semibold text-sm ${teamColors.accent}`}>
                        {player.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        {player.position}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">HEIGHT:</span>
                    <span className="text-gray-300">{player.height}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">WEIGHT:</span>
                    <span className="text-gray-300">{player.weight}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">AGE:</span>
                    <span className="text-gray-300">{player.age}</span>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs font-mono text-gray-500">PPG</div>
                      <div className={`text-sm font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats.ppg}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-gray-500">RPG</div>
                      <div className={`text-sm font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats.rpg}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-gray-500">APG</div>
                      <div className={`text-sm font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats.apg}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 px-4 py-2 bg-gray-800 rounded-lg border border-gray-600">
              <span className={`text-sm font-mono ${teamColors.accent}`}>
                ROSTER_OVERVIEW
              </span>
              <div className="text-gray-500">|</div>
              <span className="text-gray-400 font-mono text-sm">
                {teamData.basic_info?.full_name || "Team"} • 2024-25 Season
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
