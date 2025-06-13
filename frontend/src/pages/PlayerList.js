import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

// Simple cache for team data
const teamDataCache = new Map();

const PlayerList = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failedPlayers, setFailedPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);

  const fetchTeamDetails = useCallback(async () => {
    try {
      // Check cache first for instant loading
      if (teamDataCache.has(teamId)) {
        setTeamData(teamDataCache.get(teamId));
        setLoading(false);
        return;
      }

      setLoading(true);
      setFailedPlayers([]);

      // First, get basic team info without player stats to avoid total failure
      const basicResponse = await fetch(`${API_BASE_URL}/team/${teamId}`);
      
      if (!basicResponse.ok) {
        throw new Error(`HTTP error! status: ${basicResponse.status}`);
      }

      const basicData = await basicResponse.json();
      
      // Set basic team data immediately
      setTeamData({
        ...basicData,
        roster: [] // Start with empty roster
      });
      setLoading(false);

      // Now try to get player stats separately and more resiliently
      setPlayersLoading(true);
      
      try {
        const playerResponse = await fetch(
          `${API_BASE_URL}/team/${teamId}?include_player_stats=true`
        );

        if (playerResponse.ok) {
          const playerData = await playerResponse.json();
          
          // Validate each player's data and filter out problematic ones
          const validPlayers = [];
          const invalidPlayers = [];
          
          (playerData.roster || []).forEach(player => {
            try {
              // Basic validation - ensure essential fields exist
              if (player && (player.name || player.player_id)) {
                // Sanitize player stats to prevent rendering errors
                const sanitizedPlayer = {
                  ...player,
                  stats: {
                    ppg: typeof player.stats?.ppg === 'number' ? player.stats.ppg : 0,
                    rpg: typeof player.stats?.rpg === 'number' ? player.stats.rpg : 0,
                    apg: typeof player.stats?.apg === 'number' ? player.stats.apg : 0,
                    fg_pct: typeof player.stats?.fg_pct === 'number' ? player.stats.fg_pct : 0,
                    three_pt_pct: typeof player.stats?.three_pt_pct === 'number' ? player.stats.three_pt_pct : 0,
                    ...player.stats
                  }
                };
                validPlayers.push(sanitizedPlayer);
              } else {
                invalidPlayers.push(player?.name || `Player ID: ${player?.player_id}` || 'Unknown Player');
              }
            } catch (playerError) {
              console.warn('Error processing player:', player, playerError);
              invalidPlayers.push(player?.name || `Player ID: ${player?.player_id}` || 'Unknown Player');
            }
          });

          // Update team data with valid players
          const completeData = {
            ...basicData,
            roster: validPlayers
          };

          // Cache the result
          teamDataCache.set(teamId, completeData);
          setTeamData(completeData);
          setFailedPlayers(invalidPlayers);

          // Update document title with team name
          if (basicData?.basic_info?.full_name) {
            document.title = `${basicData.basic_info.full_name} Roster - NBA Analytics`;
          }
        } else {
          // Player stats API failed, but we still have basic team info
          console.warn('Player stats API failed, showing team with no roster');
          setFailedPlayers(['All player data unavailable due to server issues']);
        }
      } catch (playerError) {
        console.error("Error fetching player stats:", playerError);
        setFailedPlayers(['All player data unavailable due to server issues']);
      } finally {
        setPlayersLoading(false);
      }

    } catch (error) {
      console.error("Error fetching team details:", error);
      setTeamData(null);
      setLoading(false);
      setPlayersLoading(false);
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

  console.log("Team data:", teamData); // Debug log to see API structure
  console.log("Roster players sorted by PPG:", players); // Debug log to see player data

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
          {/* Failed Players Alert */}
          {failedPlayers.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-yellow-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-mono font-semibold text-yellow-400 mb-2">
                    ROSTER_DATA_INCOMPLETE
                  </h3>
                  <p className="text-sm font-mono text-yellow-200 mb-2">
                    {failedPlayers.length === 1 && failedPlayers[0] === 'All player data unavailable due to server issues'
                      ? 'Player roster data is currently unavailable due to server issues. Only basic team information is shown.'
                      : `${failedPlayers.length} player${failedPlayers.length > 1 ? 's have' : ' has'} been omitted from the roster due to data loading issues:`
                    }
                  </p>
                  {failedPlayers.length > 1 || failedPlayers[0] !== 'All player data unavailable due to server issues' ? (
                    <ul className="text-xs font-mono text-yellow-300 space-y-1">
                      {failedPlayers.slice(0, 5).map((playerName, index) => (
                        <li key={index}>• {playerName}</li>
                      ))}
                      {failedPlayers.length > 5 && (
                        <li>• ...and {failedPlayers.length - 5} more players</li>
                      )}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-mono font-semibold ${teamColors.accent}`}
            >
              TEAM_ROSTER
            </h2>
            <div className="flex items-center space-x-3">
              {playersLoading && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded border border-gray-600/50">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">Loading players</span>
                </div>
              )}
              <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
                {players.length}_PLAYERS
                {failedPlayers.length > 0 && failedPlayers[0] !== 'All player data unavailable due to server issues' && (
                  <span className="text-yellow-400 ml-1">
                    ({failedPlayers.length}_OMITTED)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Performance Badges Legend */}
          {players.length > 0 && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
              <h3 className="text-sm font-mono font-semibold text-gray-400 mb-3">
                PERFORMANCE_BADGES_LEGEND
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔥</span>
                  </div>
                  <span className="text-xs font-mono text-gray-300">
                    <span className="text-red-400 font-bold">SHARPSHOOTER</span> • 24+ PPG
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💪</span>
                  </div>
                  <span className="text-xs font-mono text-gray-300">
                    <span className="text-blue-400 font-bold">GLASSMASTER</span> • 10+ RPG
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🧠</span>
                  </div>
                  <span className="text-xs font-mono text-gray-300">
                    <span className="text-green-400 font-bold">FLOORGENERAL</span> • 8+ APG
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🎯</span>
                  </div>
                  <span className="text-xs font-mono text-gray-300">
                    <span className="text-yellow-400 font-bold">SNIPER</span> • 40%+ 3FG
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Player Grid */}
          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              {players.map((player) => (
                <div
                  key={player.player_id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-200 cursor-pointer"
                >
                  {/* Player Photo Header with Badges */}
                  <div className="flex flex-col items-center mb-3">
                    {/* Badge Layout: [ ] [ ] headshot [ ] [ ] */}
                    <div className="flex items-center space-x-1 mb-2">
                      {/* Badge Slot 1 - SHARPSHOOTER (24+ PPG) */}
                      <div className={`w-5 h-6 rounded flex items-center justify-center border-2 border-gray-800 shadow-lg ${
                        player.stats?.ppg >= 24 
                          ? 'bg-red-500' 
                          : 'bg-gray-700 opacity-30'
                      }`}>
                        <span className="text-white text-xs">
                          {player.stats?.ppg >= 24 ? '🔥' : '•'}
                        </span>
                      </div>

                      {/* Badge Slot 2 - GLASSMASTER (10+ RPG) */}
                      <div className={`w-5 h-6 rounded flex items-center justify-center border-2 border-gray-800 shadow-lg ${
                        player.stats?.rpg >= 10 
                          ? 'bg-blue-500' 
                          : 'bg-gray-700 opacity-30'
                      }`}>
                        <span className="text-white text-xs">
                          {player.stats?.rpg >= 10 ? '💪' : '•'}
                        </span>
                      </div>

                      {/* Player Photo - Center */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600 overflow-hidden mx-2">
                        <img
                          src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`}
                          alt={`${player.name} headshot`}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            // Try alternative NBA headshot URL
                            if (e.target.src.includes("1040x760")) {
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
                          #{player.jersey_number || "N/A"}
                        </span>
                      </div>

                      {/* Badge Slot 3 - FLOORGENERAL (8+ APG) */}
                      <div className={`w-5 h-6 rounded flex items-center justify-center border-2 border-gray-800 shadow-lg ${
                        player.stats?.apg >= 8 
                          ? 'bg-green-500' 
                          : 'bg-gray-700 opacity-30'
                      }`}>
                        <span className="text-white text-xs">
                          {player.stats?.apg >= 8 ? '🧠' : '•'}
                        </span>
                      </div>

                      {/* Badge Slot 4 - SNIPER (40%+ 3FG) */}
                      <div className={`w-5 h-6 rounded flex items-center justify-center border-2 border-gray-800 shadow-lg ${
                        player.stats?.three_pt_pct >= 0.40 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-700 opacity-30'
                      }`}>
                        <span className="text-white text-xs">
                          {player.stats?.three_pt_pct >= 0.40 ? '🎯' : '•'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-2">
                      <h3
                        className={`font-mono font-semibold text-xs ${teamColors.accent} mb-1`}
                      >
                        {player.name || "Unknown Player"}
                      </h3>
                      <p className="text-xs font-mono text-gray-400">
                        {player.position || "N/A"} • #
                        {player.jersey_number || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Player Info - Condensed */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">HT:</span>
                      <span className="text-gray-300">
                        {player.height
                          ? `${player.height.replace("-", "'")}"`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">AGE:</span>
                      <span className="text-gray-300">{player.age || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">EXP:</span>
                      <span className="text-gray-300">
                        {player.experience ? `${player.experience}y` : "R"}
                      </span>
                    </div>
                  </div>

                  {/* Player Statistics */}
                  <div className="border-t border-gray-600 pt-2">
                    <div className="grid grid-cols-2 gap-1 text-center">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">
                          PPG
                        </div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            player.stats?.ppg >= 24 ? 'text-red-400' : teamColors.secondary
                          }`}
                        >
                          {player.stats?.ppg?.toFixed(1) || "0.0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">
                          RPG
                        </div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            player.stats?.rpg >= 10 ? 'text-blue-400' : teamColors.secondary
                          }`}
                        >
                          {player.stats?.rpg?.toFixed(1) || "0.0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">
                          APG
                        </div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            player.stats?.apg >= 8 ? 'text-green-400' : teamColors.secondary
                          }`}
                        >
                          {player.stats?.apg?.toFixed(1) || "0.0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">
                          3FG%
                        </div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            player.stats?.three_pt_pct >= 0.40 ? 'text-yellow-400' : teamColors.secondary
                          }`}
                        >
                          {player.stats?.three_pt_pct ? (player.stats.three_pt_pct * 100).toFixed(1) + '%' : "0.0%"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-mono font-semibold ${teamColors.accent} mb-2`}>
                NO_PLAYER_DATA_AVAILABLE
              </h3>
              <p className="text-gray-400 font-mono text-sm mb-4">
                {playersLoading 
                  ? "Loading player roster data..." 
                  : "Player roster data is currently unavailable."}
              </p>
              {!playersLoading && (
                <button
                  onClick={() => fetchTeamDetails()}
                  className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
                >
                  RETRY_LOADING_ROSTER
                </button>
              )}
            </div>
          )}

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
              {failedPlayers.length > 0 && (
                <>
                  <div className="text-gray-500">|</div>
                  <span className="text-yellow-400 font-mono text-sm">
                    {failedPlayers.length > 1 || failedPlayers[0] !== 'All player data unavailable due to server issues'
                      ? `${failedPlayers.length} PLAYERS OMITTED`
                      : 'ROSTER UNAVAILABLE'
                    }
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
