import React, { useState, useEffect, useCallback, useRef } from "react";
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

  // 🚀 NEW: AbortController for request cancellation
  const abortControllerRef = useRef(new AbortController());

  const fetchTeamDetails = useCallback(async () => {
    const currentTeamId = teamId; // Capture current teamId
    console.log("🚀 Starting fetch for team:", currentTeamId);

    try {
      // Check cache first for instant loading
      if (teamDataCache.has(teamId)) {
        setTeamData(teamDataCache.get(teamId));
        setLoading(false);
        return;
      }

      setLoading(true);
      setFailedPlayers([]);

      // 🚀 ENHANCED: Log request start with team info
      console.log(
        "🌐 Making API request to:",
        `${API_BASE_URL}/team/${teamId}`
      );

      // First, get basic team info without player stats to avoid total failure
      // 🚀 ENHANCED: Add abort signal to prevent unnecessary requests
      const basicResponse = await fetch(`${API_BASE_URL}/team/${teamId}`, {
        signal: abortControllerRef.current.signal,
      });

      // Check if request was cancelled after fetch
      if (abortControllerRef.current.signal.aborted) {
        console.log(
          "🚫 Request was cancelled during basic team fetch for:",
          currentTeamId
        );
        return;
      }

      if (!basicResponse.ok) {
        throw new Error(`HTTP error! status: ${basicResponse.status}`);
      }

      const basicData = await basicResponse.json();

      // Set basic team data immediately
      setTeamData({
        ...basicData,
        roster: [], // Start with empty roster
      });
      setLoading(false);

      // Now try to get player stats separately and more resiliently
      setPlayersLoading(true);

      try {
        // 🚀 ENHANCED: Log player stats request
        console.log("🌐 Making player stats request for team:", currentTeamId);

        // 🚀 ENHANCED: Add abort signal to player stats request
        const playerResponse = await fetch(
          `${API_BASE_URL}/team/${teamId}?include_player_stats=true`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        // Check if request was cancelled after fetch
        if (abortControllerRef.current.signal.aborted) {
          console.log(
            "🚫 Request was cancelled during player stats fetch for:",
            currentTeamId
          );
          setPlayersLoading(false);
          return;
        }

        if (playerResponse.ok) {
          const playerData = await playerResponse.json();

          // Validate each player's data and filter out problematic ones
          const validPlayers = [];
          const invalidPlayers = [];

          (playerData.roster || []).forEach((player) => {
            try {
              // Basic validation - ensure essential fields exist
              if (player && (player.name || player.player_id)) {
                // Sanitize player stats to prevent rendering errors
                const sanitizedPlayer = {
                  ...player,
                  stats: {
                    ppg:
                      typeof player.stats?.ppg === "number"
                        ? player.stats.ppg
                        : 0,
                    rpg:
                      typeof player.stats?.rpg === "number"
                        ? player.stats.rpg
                        : 0,
                    apg:
                      typeof player.stats?.apg === "number"
                        ? player.stats.apg
                        : 0,
                    fg_pct:
                      typeof player.stats?.fg_pct === "number"
                        ? player.stats.fg_pct
                        : 0,
                    three_pt_pct:
                      typeof player.stats?.three_pt_pct === "number"
                        ? player.stats.three_pt_pct
                        : 0,
                    ...player.stats,
                  },
                };
                validPlayers.push(sanitizedPlayer);
              } else {
                invalidPlayers.push(
                  player?.name ||
                    `Player ID: ${player?.player_id}` ||
                    "Unknown Player"
                );
              }
            } catch (playerError) {
              console.warn("Error processing player:", player, playerError);
              invalidPlayers.push(
                player?.name ||
                  `Player ID: ${player?.player_id}` ||
                  "Unknown Player"
              );
            }
          });

          // Update team data with valid players
          const completeData = {
            ...basicData,
            roster: validPlayers,
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
          console.warn("Player stats API failed, showing team with no roster");
          setFailedPlayers([
            "All player data unavailable due to server issues",
          ]);
        }
      } catch (playerError) {
        // 🚀 ENHANCED: Handle cancelled requests gracefully
        if (playerError.name === "AbortError") {
          console.log(
            "🚫 Player stats request cancelled - user navigated away"
          );
          return; // Don't set error states for cancelled requests
        }
        console.error("Error fetching player stats:", playerError);
        setFailedPlayers(["All player data unavailable due to server issues"]);
      } finally {
        setPlayersLoading(false);
      }
    } catch (error) {
      // 🚀 ENHANCED: Handle cancelled requests gracefully
      if (error.name === "AbortError") {
        console.log("🚫 Team details request cancelled - user navigated away");
        return; // Don't set error states for cancelled requests
      }
      console.error("Error fetching team details:", error);
      setTeamData(null);
      setLoading(false);
      setPlayersLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    // 🚀 ENHANCED: Cancel any existing requests immediately when teamId changes
    abortControllerRef.current.abort();
    console.log("🚫 Cancelling previous requests - teamId changed to:", teamId);

    // Create new AbortController for new requests
    abortControllerRef.current = new AbortController();

    fetchTeamDetails();

    // Cleanup function to cancel requests on unmount
    return () => {
      console.log(
        "🚫 Component cleanup - cancelling requests for teamId:",
        teamId
      );
      abortControllerRef.current.abort();
    };
  }, [fetchTeamDetails, teamId]);

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

  // Three-Point Threat Score calculation: PPG × 3P%
  // This formula combines scoring volume with three-point efficiency
  const calculateThreePointThreatScore = (player) => {
    const ppg = player.stats?.ppg || 0;
    const threePtPct = player.stats?.three_pt_pct || 0;
    return ppg * threePtPct;
  };

  // Badge Tier System - Bronze/Silver/Gold tiers

  // BUCKET Badge Tiers: Bronze → Silver → Gold → Diamond
  const getBucketTier = (player) => {
    const ppg = player.stats?.ppg || 0;
    if (ppg >= 30) return 4; // Diamond BUCKET
    if (ppg >= 25) return 3; // Gold BUCKET
    if (ppg >= 22) return 2; // Silver BUCKET
    if (ppg >= 18) return 1; // Bronze BUCKET
    return 0; // No badge
  };

  // GLASSMASTER Badge Tiers: Bronze → Silver → Gold → Diamond
  const getGlassTier = (player) => {
    const rpg = player.stats?.rpg || 0;
    if (rpg >= 14) return 4; // Diamond GLASSMASTER
    if (rpg >= 11) return 3; // Gold GLASSMASTER
    if (rpg >= 8) return 2; // Silver GLASSMASTER
    if (rpg >= 5) return 1; // Bronze GLASSMASTER
    return 0; // No badge
  };

  // FLOORGENERAL Badge Tiers: Bronze → Silver → Gold → Diamond
  const getFloorTier = (player) => {
    const apg = player.stats?.apg || 0;
    if (apg >= 10) return 4; // Diamond FLOORGENERAL
    if (apg >= 8) return 3; // Gold FLOORGENERAL
    if (apg >= 6) return 2; // Silver FLOORGENERAL
    if (apg >= 4) return 1; // Bronze FLOORGENERAL
    return 0; // No badge
  };

  // SNIPER Badge Tiers: Bronze → Silver → Gold → Diamond
  const getSniperTier = (player) => {
    const threePtPct = player.stats?.three_pt_pct || 0;
    const ppg = player.stats?.ppg || 0;

    if (threePtPct >= 0.37 && ppg >= 23) return 4; // Diamond SNIPER
    if (threePtPct >= 0.35 && ppg >= 16) return 3; // Gold SNIPER
    if (threePtPct >= 0.33 && ppg >= 14) return 2; // Silver SNIPER
    if (threePtPct >= 0.32 && ppg >= 10) return 1; // Bronze SNIPER
    return 0; // No badge
  };

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
          <div className="flex items-center space-x-4">
            {/* 🚀 NEW: Request Cancellation Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-900/30 border border-green-600/50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-xs">
                REQUEST_CANCELLATION_ACTIVE
              </span>
            </div>
            <Link
              to={`/team/${teamId}`}
              className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
            >
              ← BACK_TO_TEAM
            </Link>
          </div>
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
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-mono font-semibold text-yellow-400 mb-2">
                    ROSTER_DATA_INCOMPLETE
                  </h3>
                  <p className="text-sm font-mono text-yellow-200 mb-2">
                    {failedPlayers.length === 1 &&
                    failedPlayers[0] ===
                      "All player data unavailable due to server issues"
                      ? "Player roster data is currently unavailable due to server issues. Only basic team information is shown."
                      : `${failedPlayers.length} player${
                          failedPlayers.length > 1 ? "s have" : " has"
                        } been omitted from the roster due to data loading issues:`}
                  </p>
                  {failedPlayers.length > 1 ||
                  failedPlayers[0] !==
                    "All player data unavailable due to server issues" ? (
                    <ul className="text-xs font-mono text-yellow-300 space-y-1">
                      {failedPlayers.slice(0, 5).map((playerName, index) => (
                        <li key={index}>• {playerName}</li>
                      ))}
                      {failedPlayers.length > 5 && (
                        <li>
                          • ...and {failedPlayers.length - 5} more players
                        </li>
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
                    <div
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">
                    Loading players
                  </span>
                </div>
              )}
              <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
                {players.length}_PLAYERS
                {failedPlayers.length > 0 &&
                  failedPlayers[0] !==
                    "All player data unavailable due to server issues" && (
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
                PERFORMANCE_BADGES_TIER_SYSTEM
              </h3>
              
              {/* Universal Tier System */}
              <div className="mb-4 p-3 bg-gray-700/30 rounded border border-gray-600/30">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 rounded border border-amber-500 shadow-lg shadow-amber-500/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-mono text-amber-400">Novice</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 rounded border border-slate-300 shadow-lg shadow-slate-300/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-300">Tested</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 rounded border border-yellow-300 shadow-lg shadow-yellow-300/40 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-mono text-yellow-400">Dominant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-400 rounded border border-cyan-300 shadow-lg shadow-cyan-300/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">Elite</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Scoring Badge */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🔥</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-red-400 font-bold">BUCKET</div>
                    <div className="text-xs font-mono text-gray-400">High Scoring</div>
                  </div>
                </div>

                {/* Rebounding Badge */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🛡️</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-blue-400 font-bold">GLASSMASTER</div>
                    <div className="text-xs font-mono text-gray-400">Rebounding</div>
                  </div>
                </div>

                {/* Playmaking Badge */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🧠</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-green-400 font-bold">FLOORGENERAL</div>
                    <div className="text-xs font-mono text-gray-400">Playmaking</div>
                  </div>
                </div>

                {/* Shooting Badge */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🎯</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-yellow-400 font-bold">SNIPER</div>
                    <div className="text-xs font-mono text-gray-400">3-Point Shooting</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player Grid */}
          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              {players.map((player) => {
                // Check for award winners
                const isMVP = player.name === "Shai Gilgeous-Alexander";
                const isDPOY = player.name === "Evan Mobley";
                const isROY = player.name === "Stephon Castle";
                const is6MOY = player.name === "Payton Pritchard";
                const isMIP = player.name === "Dyson Daniels";

                // Determine which award this player has (priority order)
                const award = isMVP
                  ? "MVP"
                  : isDPOY
                  ? "DPOY"
                  : isROY
                  ? "ROY"
                  : is6MOY
                  ? "6MOY"
                  : isMIP
                  ? "MIP"
                  : null;
                const isAwardWinner = award !== null;

                // Award-specific styling
                const getAwardStyling = () => {
                  switch (award) {
                    case "MVP":
                      return {
                        card: "bg-gradient-to-r from-purple-900/60 via-purple-700/70 to-purple-900/60 border-purple-400/80 shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-[1.02] backdrop-blur-sm",
                        badge:
                          "bg-gradient-to-br from-purple-400 via-purple-300 to-purple-500 hover:bg-gradient-to-br hover:from-purple-500 hover:via-purple-400 hover:to-purple-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70",
                      };
                    case "DPOY":
                      return {
                        card: "bg-gradient-to-r from-emerald-900/60 via-emerald-700/70 to-emerald-900/60 border-emerald-400/80 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-400/60 hover:scale-[1.02] backdrop-blur-sm",
                        badge:
                          "bg-gradient-to-br from-emerald-400 via-emerald-300 to-emerald-500 hover:bg-gradient-to-br hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/70",
                      };
                    case "ROY":
                      return {
                        card: "bg-gradient-to-r from-amber-900/60 via-amber-700/70 to-amber-900/60 border-amber-400/80 shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-400/60 hover:scale-[1.02] backdrop-blur-sm",
                        badge:
                          "bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:via-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/50 hover:shadow-amber-400/70",
                      };
                    case "6MOY":
                      return {
                        card: "bg-gradient-to-r from-indigo-900/60 via-indigo-700/70 to-indigo-900/60 border-indigo-400/80 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-400/60 hover:scale-[1.02] backdrop-blur-sm",
                        badge:
                          "bg-gradient-to-br from-indigo-400 via-indigo-300 to-indigo-500 hover:bg-gradient-to-br hover:from-indigo-500 hover:via-indigo-400 hover:to-indigo-300 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-400/70",
                      };
                    case "MIP":
                      return {
                        card: "bg-gradient-to-r from-rose-900/60 via-rose-700/70 to-rose-900/60 border-rose-400/80 shadow-lg shadow-rose-500/40 hover:shadow-xl hover:shadow-rose-400/60 hover:scale-[1.02] backdrop-blur-sm",
                        badge:
                          "bg-gradient-to-br from-rose-400 via-rose-300 to-rose-500 hover:bg-gradient-to-br hover:from-rose-500 hover:via-rose-400 hover:to-rose-300 shadow-lg shadow-rose-500/50 hover:shadow-rose-400/70",
                      };
                    default:
                      return { card: "", badge: "" };
                  }
                };

                const awardStyling = getAwardStyling();

                return (
                  <div
                    key={player.player_id}
                    className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer relative ${
                      isAwardWinner
                        ? awardStyling.card
                        : "bg-gray-800 border-gray-600 hover:border-cyan-400 transition-colors duration-200"
                    }`}
                  >
                    {/* Award Badge */}
                    {isAwardWinner && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <div
                          className={`${awardStyling.badge} text-white px-2 py-1 rounded-md text-xs font-mono font-black tracking-wider transition-all duration-300`}
                        >
                          <span className="drop-shadow-md">{award}</span>
                        </div>
                      </div>
                    )}

                    {/* Player Photo Header with Badges */}
                    <div className="flex flex-col items-center mb-3">
                      {/* Badge Layout: [ ] [ ] headshot [ ] [ ] */}
                      <div className="flex items-center space-x-1 mb-2">
                        {/* Badge Slot 1 - SCORING TIERS */}
                        {(() => {
                          const bucketTier = getBucketTier(player);
                          const bucketStyles = [
                            {
                              bg: "bg-gray-700 opacity-30",
                              icon: "•",
                              numeral: "",
                            }, // No badge
                            {
                              bg: "bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 relative overflow-hidden",
                              icon: "🔥",
                              numeral: "IV",
                            }, // Bronze BUCKET
                            {
                              bg: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 shadow-lg shadow-slate-300/30 relative overflow-hidden",
                              icon: "🔥",
                              numeral: "III",
                            }, // Silver BUCKET
                            {
                              bg: "bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 relative overflow-hidden",
                              icon: "🔥",
                              numeral: "II",
                            }, // Gold BUCKET
                            {
                              bg: "bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-400 shadow-lg shadow-cyan-300/50 relative overflow-hidden",
                              icon: "🔥",
                              numeral: "I",
                            }, // Diamond BUCKET
                          ];
                          return (
                            <div className="flex flex-col items-center h-8">
                              <div className="h-3 flex items-center justify-center">
                                {bucketTier > 0 ? (
                                  <span
                                    className={`font-mono font-bold drop-shadow-md leading-none ${
                                      bucketTier === 4
                                        ? "text-[#4EE2EC]" // Diamond
                                        : bucketTier === 3
                                        ? "text-yellow-400" // Gold
                                        : bucketTier === 2
                                        ? "text-gray-300" // Silver
                                        : "text-amber-400" // Bronze
                                    }`}
                                    style={{ fontSize: "6px" }}
                                  >
                                    {bucketStyles[bucketTier].numeral}
                                  </span>
                                ) : (
                                  <span
                                    className="opacity-0"
                                    style={{ fontSize: "6px" }}
                                  >
                                    I
                                  </span>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 shadow-lg ${bucketStyles[bucketTier].bg} ${
                                  bucketTier === 4
                                    ? "border-cyan-300" // Diamond
                                    : bucketTier === 3
                                    ? "border-yellow-300" // Gold
                                    : bucketTier === 2
                                    ? "border-slate-300" // Silver
                                    : bucketTier === 1
                                    ? "border-amber-500" // Bronze
                                    : "border-gray-800" // No badge
                                }`}
                              >
                                {bucketTier > 0 && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                                )}
                                <span className="text-white text-xs font-bold relative z-10">
                                  {bucketStyles[bucketTier].icon}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Badge Slot 2 - REBOUNDING TIERS */}
                        {(() => {
                          const glassTier = getGlassTier(player);
                          const glassStyles = [
                            {
                              bg: "bg-gray-700 opacity-30",
                              icon: "•",
                              numeral: "",
                            }, // No badge
                            {
                              bg: "bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 relative overflow-hidden",
                              icon: "🛡️",
                              numeral: "IV",
                            }, // Bronze GLASSMASTER
                            {
                              bg: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 shadow-lg shadow-slate-300/30 relative overflow-hidden",
                              icon: "🛡️",
                              numeral: "III",
                            }, // Silver GLASSMASTER
                            {
                              bg: "bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 relative overflow-hidden",
                              icon: "🛡️",
                              numeral: "II",
                            }, // Gold GLASSMASTER
                            {
                              bg: "bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-400 shadow-lg shadow-cyan-300/50 relative overflow-hidden",
                              icon: "🛡️",
                              numeral: "I",
                            }, // Diamond GLASSMASTER
                          ];
                          return (
                            <div className="flex flex-col items-center h-8">
                              <div className="h-3 flex items-center justify-center">
                                {glassTier > 0 ? (
                                  <span
                                    className={`font-mono font-bold drop-shadow-md leading-none ${
                                      glassTier === 4
                                        ? "text-[#4EE2EC]" // Diamond
                                        : glassTier === 3
                                        ? "text-yellow-400" // Gold
                                        : glassTier === 2
                                        ? "text-gray-300" // Silver
                                        : "text-amber-400" // Bronze
                                    }`}
                                    style={{ fontSize: "6px" }}
                                  >
                                    {glassStyles[glassTier].numeral}
                                  </span>
                                ) : (
                                  <span
                                    className="opacity-0"
                                    style={{ fontSize: "6px" }}
                                  >
                                    I
                                  </span>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 shadow-lg ${
                                  glassStyles[glassTier].bg
                                } ${
                                  glassTier === 4
                                    ? "border-cyan-300" // Diamond
                                    : glassTier === 3
                                    ? "border-yellow-300" // Gold
                                    : glassTier === 2
                                    ? "border-slate-300" // Silver
                                    : glassTier === 1
                                    ? "border-amber-500" // Bronze
                                    : "border-gray-800" // No badge
                                }`}
                              >
                                {glassTier > 0 && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                                )}
                                <span className="text-white text-xs font-bold relative z-10">
                                  {glassStyles[glassTier].icon}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

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

                        {/* Badge Slot 3 - PLAYMAKING TIERS */}
                        {(() => {
                          const floorTier = getFloorTier(player);
                          const floorStyles = [
                            {
                              bg: "bg-gray-700 opacity-30",
                              icon: "•",
                              numeral: "",
                            }, // No badge
                            {
                              bg: "bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 relative overflow-hidden",
                              icon: "🧠",
                              numeral: "IV",
                            }, // Bronze FLOORGENERAL
                            {
                              bg: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 shadow-lg shadow-slate-300/30 relative overflow-hidden",
                              icon: "🧠",
                              numeral: "III",
                            }, // Silver FLOORGENERAL
                            {
                              bg: "bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 relative overflow-hidden",
                              icon: "🧠",
                              numeral: "II",
                            }, // Gold FLOORGENERAL
                            {
                              bg: "bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-400 shadow-lg shadow-cyan-300/50 relative overflow-hidden",
                              icon: "🧠",
                              numeral: "I",
                            }, // Diamond FLOORGENERAL
                          ];
                          return (
                            <div className="flex flex-col items-center h-8">
                              <div className="h-3 flex items-center justify-center">
                                {floorTier > 0 ? (
                                  <span
                                    className={`font-mono font-bold drop-shadow-md leading-none ${
                                      floorTier === 4
                                        ? "text-[#4EE2EC]" // Diamond
                                        : floorTier === 3
                                        ? "text-yellow-400" // Gold
                                        : floorTier === 2
                                        ? "text-gray-300" // Silver
                                        : "text-amber-400" // Bronze
                                    }`}
                                    style={{ fontSize: "6px" }}
                                  >
                                    {floorStyles[floorTier].numeral}
                                  </span>
                                ) : (
                                  <span
                                    className="opacity-0"
                                    style={{ fontSize: "6px" }}
                                  >
                                    I
                                  </span>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 shadow-lg ${
                                  floorStyles[floorTier].bg
                                } ${
                                  floorTier === 4
                                    ? "border-cyan-300" // Diamond
                                    : floorTier === 3
                                    ? "border-yellow-300" // Gold
                                    : floorTier === 2
                                    ? "border-slate-300" // Silver
                                    : floorTier === 1
                                    ? "border-amber-500" // Bronze
                                    : "border-gray-800" // No badge
                                }`}
                              >
                                {floorTier > 0 && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                                )}
                                <span className="text-white text-xs font-bold relative z-10">
                                  {floorStyles[floorTier].icon}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Badge Slot 4 - SHOOTING TIERS */}
                        {(() => {
                          const sniperTier = getSniperTier(player);
                          const sniperStyles = [
                            {
                              bg: "bg-gray-700 opacity-30",
                              icon: "•",
                              numeral: "",
                            }, // No badge
                            {
                              bg: "bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 relative overflow-hidden",
                              icon: "🎯",
                              numeral: "IV",
                            }, // Bronze SNIPER
                            {
                              bg: "bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 shadow-lg shadow-slate-300/30 relative overflow-hidden",
                              icon: "🎯",
                              numeral: "III",
                            }, // Silver SNIPER
                            {
                              bg: "bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 relative overflow-hidden",
                              icon: "🎯",
                              numeral: "II",
                            }, // Gold SNIPER
                            {
                              bg: "bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-400 shadow-lg shadow-cyan-300/50 relative overflow-hidden",
                              icon: "🎯",
                              numeral: "I",
                            }, // Diamond SNIPER
                          ];
                          return (
                            <div className="flex flex-col items-center h-8">
                              <div className="h-3 flex items-center justify-center">
                                {sniperTier > 0 ? (
                                  <span
                                    className={`font-mono font-bold drop-shadow-md leading-none ${
                                      sniperTier === 4
                                        ? "text-[#4EE2EC]" // Diamond
                                        : sniperTier === 3
                                        ? "text-yellow-400" // Gold
                                        : sniperTier === 2
                                        ? "text-gray-300" // Silver
                                        : "text-amber-400" // Bronze
                                    }`}
                                    style={{ fontSize: "6px" }}
                                  >
                                    {sniperStyles[sniperTier].numeral}
                                  </span>
                                ) : (
                                  <span
                                    className="opacity-0"
                                    style={{ fontSize: "6px" }}
                                  >
                                    I
                                  </span>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center border-2 shadow-lg ${
                                  sniperStyles[sniperTier].bg
                                } ${
                                  sniperTier === 4
                                    ? "border-cyan-300" // Diamond
                                    : sniperTier === 3
                                    ? "border-yellow-300" // Gold
                                    : sniperTier === 2
                                    ? "border-slate-300" // Silver
                                    : sniperTier === 1
                                    ? "border-amber-500" // Bronze
                                    : "border-gray-800" // No badge
                                }`}
                              >
                                {sniperTier > 0 && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                                )}
                                <span className="text-white text-xs font-bold relative z-10">
                                  {sniperStyles[sniperTier].icon}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="text-center mt-2">
                        <h3
                          className={`font-mono font-semibold text-xs mb-1 ${
                            isMVP
                              ? "text-white drop-shadow-lg"
                              : teamColors.accent
                          }`}
                        >
                          {player.name || "Unknown Player"}
                        </h3>
                        <p
                          className={`text-xs font-mono ${
                            isMVP
                              ? "text-purple-200 drop-shadow-md"
                              : "text-gray-400"
                          }`}
                        >
                          {player.position || "N/A"} • #
                          {player.jersey_number || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Player Info - Condensed */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs font-mono">
                        <span
                          className={
                            isMVP ? "text-purple-200" : "text-gray-500"
                          }
                        >
                          HT:
                        </span>
                        <span
                          className={
                            isMVP
                              ? "text-white drop-shadow-md"
                              : "text-gray-300"
                          }
                        >
                          {player.height
                            ? `${player.height.replace("-", "'")}"`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span
                          className={
                            isMVP ? "text-purple-200" : "text-gray-500"
                          }
                        >
                          AGE:
                        </span>
                        <span
                          className={
                            isMVP
                              ? "text-white drop-shadow-md"
                              : "text-gray-300"
                          }
                        >
                          {player.age || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span
                          className={
                            isMVP ? "text-purple-200" : "text-gray-500"
                          }
                        >
                          EXP:
                        </span>
                        <span
                          className={
                            isMVP
                              ? "text-white drop-shadow-md"
                              : "text-gray-300"
                          }
                        >
                          {player.experience ? `${player.experience}y` : "R"}
                        </span>
                      </div>
                    </div>

                    {/* Player Statistics */}
                    <div
                      className={`border-t pt-2 ${
                        isMVP ? "border-purple-300" : "border-gray-600"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1 text-center">
                        <div>
                          <div
                            className={`text-xs font-mono mb-1 ${
                              isMVP ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            PPG
                          </div>
                          <div
                            className={`text-xs font-mono font-bold ${(() => {
                              const bucketTier = getBucketTier(player);
                              if (bucketTier === 4)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-[#4EE2EC]"; // Diamond BUCKET
                              if (bucketTier === 3)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-yellow-400"; // Gold BUCKET
                              if (bucketTier === 2)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-gray-300"; // Silver BUCKET
                              if (bucketTier === 1)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-amber-400"; // Bronze BUCKET
                              return isMVP
                                ? "text-white drop-shadow-md"
                                : teamColors.secondary;
                            })()}`}
                          >
                            {player.stats?.ppg?.toFixed(1) || "0.0"}
                          </div>
                        </div>
                        <div>
                          <div
                            className={`text-xs font-mono mb-1 ${
                              isMVP ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            RPG
                          </div>
                          <div
                            className={`text-xs font-mono font-bold ${(() => {
                              const glassTier = getGlassTier(player);
                              if (glassTier === 4)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-[#4EE2EC]"; // Diamond GLASSMASTER
                              if (glassTier === 3)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-yellow-400"; // Gold GLASSMASTER
                              if (glassTier === 2)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-gray-300"; // Silver GLASSMASTER
                              if (glassTier === 1)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-amber-400"; // Bronze GLASSMASTER
                              return isMVP
                                ? "text-white drop-shadow-md"
                                : teamColors.secondary;
                            })()}`}
                          >
                            {player.stats?.rpg?.toFixed(1) || "0.0"}
                          </div>
                        </div>
                        <div>
                          <div
                            className={`text-xs font-mono mb-1 ${
                              isMVP ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            APG
                          </div>
                          <div
                            className={`text-xs font-mono font-bold ${(() => {
                              const floorTier = getFloorTier(player);
                              if (floorTier === 4)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-[#4EE2EC]"; // Diamond FLOORGENERAL
                              if (floorTier === 3)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-yellow-400"; // Gold FLOORGENERAL
                              if (floorTier === 2)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-gray-300"; // Silver FLOORGENERAL
                              if (floorTier === 1)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-amber-400"; // Bronze FLOORGENERAL
                              return isMVP
                                ? "text-white drop-shadow-md"
                                : teamColors.secondary;
                            })()}`}
                          >
                            {player.stats?.apg?.toFixed(1) || "0.0"}
                          </div>
                        </div>
                        <div>
                          <div
                            className={`text-xs font-mono mb-1 ${
                              isMVP ? "text-purple-200" : "text-gray-500"
                            }`}
                          >
                            3FG%
                          </div>
                          <div
                            className={`text-xs font-mono font-bold ${(() => {
                              const sniperTier = getSniperTier(player);
                              if (sniperTier === 4)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-[#4EE2EC]"; // Diamond SNIPER
                              if (sniperTier === 3)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-yellow-400"; // Gold SNIPER
                              if (sniperTier === 2)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-gray-300"; // Silver SNIPER
                              if (sniperTier === 1)
                                return isMVP
                                  ? "text-white drop-shadow-lg"
                                  : "text-amber-400"; // Bronze SNIPER
                              return isMVP
                                ? "text-white drop-shadow-md"
                                : teamColors.secondary;
                            })()}`}
                          >
                            {player.stats?.three_pt_pct
                              ? (player.stats.three_pt_pct * 100).toFixed(1) +
                                "%"
                              : "0.0%"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-mono font-semibold ${teamColors.accent} mb-2`}
              >
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
                    {failedPlayers.length > 1 ||
                    failedPlayers[0] !==
                      "All player data unavailable due to server issues"
                      ? `${failedPlayers.length} PLAYERS OMITTED`
                      : "ROSTER UNAVAILABLE"}
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
