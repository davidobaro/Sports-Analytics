import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  generateUpcomingGames,
  generateNextMatchup,
} from "../utils/nbaTeamData";
import {
  TeamCard,
  ScheduleCard,
  NextMatchupAnalysis,
  TeamTrendsAndLeaders,
  RecentGamesTable,
} from "../components/TeamDetailsComponents";

const API_BASE_URL = "http://localhost:8000/api";

// Simple cache for team data
const teamDataCache = new Map();

const TeamDetails = () => {
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

      // Use fetch instead of axios for better performance
      const response = await fetch(`${API_BASE_URL}/team/${teamId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      teamDataCache.set(teamId, data);
      setTeamData(data);

      // Update document title with team name
      if (data?.basic_info?.full_name) {
        document.title = `${data.basic_info.full_name} - NBA Analytics`;
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

  // Simple static values instead of complex calculations
  const teamColors = {
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  };

  const predictionConfidence = 75;

  // Use dynamic functions if teamData is available, fallback to static
  const upcomingGames = teamData
    ? generateUpcomingGames(teamData)
    : [
        {
          date: "JUN 15",
          opp: "LAL",
          time: "8:00 PM",
          home: true,
          difficulty: "MEDIUM",
          prediction: "Pick em",
          importance: "MEDIUM",
        },
        {
          date: "JUN 18",
          opp: "BOS",
          time: "7:30 PM",
          home: false,
          difficulty: "HARD",
          prediction: "Underdog +3",
          importance: "HIGH",
        },
        {
          date: "JUN 21",
          opp: "GSW",
          time: "9:00 PM",
          home: true,
          difficulty: "HARD",
          prediction: "Favored -2",
          importance: "HIGH",
        },
      ];

  const nextMatchup = teamData ? generateNextMatchup(teamData) : null;

  // Simple helper functions
  const getPredictionConfidence = () =>
    nextMatchup?.confidence || predictionConfidence;
  const getUpcomingGames = () => upcomingGames;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="font-mono text-cyan-400 text-sm">LOADING_TEAM_DATA...</p>
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
    <div className="space-y-6 fade-in-up">
      {/* Personalized Breadcrumb with Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
          <Link to="/" className="hover:text-cyan-400 transition-colors">NBA Analytics</Link>
          <span>/</span>
          <Link to="/teams" className="hover:text-cyan-400 transition-colors">Teams</Link>
          <span>/</span>
          <span className={teamColors.accent}>
            {teamData.basic_info?.full_name || "Team Details"}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            to={`/team/${teamId}/roster`}
            className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
          >
            VIEW_{teamData.basic_info?.abbreviation || "TEAM"}_ROSTER
          </Link>
          <button className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}>
            ADVANCED_STATS
          </button>
        </div>
      </div>

      {/* Team Header and Schedule Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TeamCard teamData={teamData} teamId={teamId} teamColors={teamColors} />

        <ScheduleCard
          teamColors={teamColors}
          upcomingGames={getUpcomingGames()}
        />
      </div>

      {/* Layout with Matchup Analysis aligned with Team Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NextMatchupAnalysis
          teamData={teamData}
          teamId={teamId}
          teamColors={teamColors}
          nextMatchup={nextMatchup}
          getPredictionConfidence={getPredictionConfidence}
        />

        <TeamTrendsAndLeaders teamData={teamData} teamColors={teamColors} />
      </div>

      <RecentGamesTable teamData={teamData} teamColors={teamColors} />
    </div>
  );
};

export default TeamDetails;
