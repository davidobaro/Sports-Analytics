import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

// Simple cache for team data
const teamDataCache = new Map();

const PlayerList = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetails = useCallback(async () => {
    try {
      // Check cache first for instant loading
      if (teamDataCache.has(teamId)) {
        setTeamData(teamDataCache.get(teamId));
        setLoading(false);
        return;
      }

      setLoading(true);

      // Use fetch instead of axios for better performance with player stats
      const response = await fetch(`${API_BASE_URL}/team/${teamId}?include_player_stats=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      teamDataCache.set(teamId, data);
      setTeamData(data);

      // Update document title with team name
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

  // Simple static values for team colors
  const teamColors = {
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  };

  // Extract real players from API data and sort by PPG (highest first)
  const players = (teamData?.roster || []).sort((a, b) => {
    const aPpg = a.stats?.ppg || 0;
    const bPpg = b.stats?.ppg || 0;
    return bPpg - aPpg; // Sort in descending order (highest PPG first)
  });
  
  console.log('Team data:', teamData); // Debug log to see API structure
  console.log('Roster players sorted by PPG:', players); // Debug log to see player data

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="font-mono text-cyan-400 text-sm">
          LOADING_ROSTER_DATA...
        </p>
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
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              NBA Analytics
            </Link>
            <span>/</span>
            <Link to="/teams" className="hover:text-cyan-400 transition-colors">
              Teams
            </Link>
            <span>/</span>
            <Link
              to={`/team/${teamId}`}
              className="hover:text-cyan-400 transition-colors"
            >
              {teamData.basic_info?.full_name || "Team Details"}
            </Link>
            <span>/</span>
            <span className={teamColors.accent}>Roster</span>
          </div>

          {/* Back Button */}
          <Link
            to={`/team/${teamId}`}
            className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
          >
            ← BACK_TO_TEAM
          </Link>
        </div>

        {/* Team Header with Logo */}
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
              <h1
                className={`text-2xl font-mono font-bold ${teamColors.accent} mb-1`}
              >
                {teamData.basic_info?.full_name || "Team Roster"}
              </h1>
              <p className="text-gray-400 font-mono text-sm">
                2024-25 Season • Official Roster
              </p>
            </div>
          </div>
        </div>

        {/* Player Grid Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-mono font-semibold ${teamColors.accent}`}
            >
              TEAM_ROSTER
            </h2>
            <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
              {players.length}_PLAYERS
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
            {players.map((player) => (
              <div
                key={player.player_id}
                className="p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-200 cursor-pointer"
              >
                {/* Player Photo Header */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600 overflow-hidden mb-2">
                    <img
                      src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`}
                      alt={`${player.name} headshot`}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Try alternative NBA headshot URL
                        if (e.target.src.includes('1040x760')) {
                          e.target.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.player_id}.png`;
                        } else {
                          // If both fail, hide image and show jersey number
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                    <span
                      className="text-white font-mono font-bold text-sm absolute w-full h-full flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      #{player.jersey_number || 'N/A'}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3
                      className={`font-mono font-semibold text-xs ${teamColors.accent} mb-1`}
                    >
                      {player.name || 'Unknown Player'}
                    </h3>
                    <p className="text-xs font-mono text-gray-400">
                      {player.position || 'N/A'} • #{player.jersey_number || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Player Info - Condensed */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">HT:</span>
                    <span className="text-gray-300">{player.height ? `${player.height.replace('-', '\'')}\"` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">AGE:</span>
                    <span className="text-gray-300">{player.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">EXP:</span>
                    <span className="text-gray-300">{player.experience ? `${player.experience}y` : 'R'}</span>
                  </div>
                </div>

                {/* Player Statistics */}
                <div className="border-t border-gray-600 pt-2">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                      <div className="text-xs font-mono text-gray-500 mb-1">PPG</div>
                      <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats?.ppg?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-gray-500 mb-1">RPG</div>
                      <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats?.rpg?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-gray-500 mb-1">APG</div>
                      <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
                        {player.stats?.apg?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
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
