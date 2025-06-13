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

// Fallback teams data - same as AllTeamsDemo
const FALLBACK_TEAMS = [
  // Eastern Conference - Atlantic
  { id: 1610612738, full_name: "Boston Celtics", abbreviation: "BOS", city: "Boston", nickname: "Celtics", conference: "Eastern", division: "Atlantic", championships: 17 },
  { id: 1610612751, full_name: "Brooklyn Nets", abbreviation: "BRK", city: "Brooklyn", nickname: "Nets", conference: "Eastern", division: "Atlantic", championships: 0 },
  { id: 1610612752, full_name: "New York Knicks", abbreviation: "NYK", city: "New York", nickname: "Knicks", conference: "Eastern", division: "Atlantic", championships: 2 },
  { id: 1610612755, full_name: "Philadelphia 76ers", abbreviation: "PHI", city: "Philadelphia", nickname: "76ers", conference: "Eastern", division: "Atlantic", championships: 3 },
  { id: 1610612761, full_name: "Toronto Raptors", abbreviation: "TOR", city: "Toronto", nickname: "Raptors", conference: "Eastern", division: "Atlantic", championships: 1 },

  // Eastern Conference - Central
  { id: 1610612741, full_name: "Chicago Bulls", abbreviation: "CHI", city: "Chicago", nickname: "Bulls", conference: "Eastern", division: "Central", championships: 6 },
  { id: 1610612739, full_name: "Cleveland Cavaliers", abbreviation: "CLE", city: "Cleveland", nickname: "Cavaliers", conference: "Eastern", division: "Central", championships: 1 },
  { id: 1610612765, full_name: "Detroit Pistons", abbreviation: "DET", city: "Detroit", nickname: "Pistons", conference: "Eastern", division: "Central", championships: 3 },
  { id: 1610612754, full_name: "Indiana Pacers", abbreviation: "IND", city: "Indianapolis", nickname: "Pacers", conference: "Eastern", division: "Central", championships: 0 },
  { id: 1610612749, full_name: "Milwaukee Bucks", abbreviation: "MIL", city: "Milwaukee", nickname: "Bucks", conference: "Eastern", division: "Central", championships: 2 },

  // Eastern Conference - Southeast
  { id: 1610612737, full_name: "Atlanta Hawks", abbreviation: "ATL", city: "Atlanta", nickname: "Hawks", conference: "Eastern", division: "Southeast", championships: 1 },
  { id: 1610612766, full_name: "Charlotte Hornets", abbreviation: "CHA", city: "Charlotte", nickname: "Hornets", conference: "Eastern", division: "Southeast", championships: 0 },
  { id: 1610612748, full_name: "Miami Heat", abbreviation: "MIA", city: "Miami", nickname: "Heat", conference: "Eastern", division: "Southeast", championships: 3 },
  { id: 1610612753, full_name: "Orlando Magic", abbreviation: "ORL", city: "Orlando", nickname: "Magic", conference: "Eastern", division: "Southeast", championships: 0 },
  { id: 1610612764, full_name: "Washington Wizards", abbreviation: "WAS", city: "Washington", nickname: "Wizards", conference: "Eastern", division: "Southeast", championships: 1 },

  // Western Conference - Northwest
  { id: 1610612743, full_name: "Denver Nuggets", abbreviation: "DEN", city: "Denver", nickname: "Nuggets", conference: "Western", division: "Northwest", championships: 1 },
  { id: 1610612750, full_name: "Minnesota Timberwolves", abbreviation: "MIN", city: "Minneapolis", nickname: "Timberwolves", conference: "Western", division: "Northwest", championships: 0 },
  { id: 1610612760, full_name: "Oklahoma City Thunder", abbreviation: "OKC", city: "Oklahoma City", nickname: "Thunder", conference: "Western", division: "Northwest", championships: 1 },
  { id: 1610612757, full_name: "Portland Trail Blazers", abbreviation: "POR", city: "Portland", nickname: "Trail Blazers", conference: "Western", division: "Northwest", championships: 1 },
  { id: 1610612762, full_name: "Utah Jazz", abbreviation: "UTA", city: "Salt Lake City", nickname: "Jazz", conference: "Western", division: "Northwest", championships: 0 },

  // Western Conference - Pacific
  { id: 1610612744, full_name: "Golden State Warriors", abbreviation: "GSW", city: "San Francisco", nickname: "Warriors", conference: "Western", division: "Pacific", championships: 7 },
  { id: 1610612746, full_name: "LA Clippers", abbreviation: "LAC", city: "Los Angeles", nickname: "Clippers", conference: "Western", division: "Pacific", championships: 0 },
  { id: 1610612747, full_name: "Los Angeles Lakers", abbreviation: "LAL", city: "Los Angeles", nickname: "Lakers", conference: "Western", division: "Pacific", championships: 17 },
  { id: 1610612756, full_name: "Phoenix Suns", abbreviation: "PHX", city: "Phoenix", nickname: "Suns", conference: "Western", division: "Pacific", championships: 0 },
  { id: 1610612758, full_name: "Sacramento Kings", abbreviation: "SAC", city: "Sacramento", nickname: "Kings", conference: "Western", division: "Pacific", championships: 1 },

  // Western Conference - Southwest
  { id: 1610612742, full_name: "Dallas Mavericks", abbreviation: "DAL", city: "Dallas", nickname: "Mavericks", conference: "Western", division: "Southwest", championships: 1 },
  { id: 1610612745, full_name: "Houston Rockets", abbreviation: "HOU", city: "Houston", nickname: "Rockets", conference: "Western", division: "Southwest", championships: 2 },
  { id: 1610612763, full_name: "Memphis Grizzlies", abbreviation: "MEM", city: "Memphis", nickname: "Grizzlies", conference: "Western", division: "Southwest", championships: 0 },
  { id: 1610612740, full_name: "New Orleans Pelicans", abbreviation: "NOP", city: "New Orleans", nickname: "Pelicans", conference: "Western", division: "Southwest", championships: 0 },
  { id: 1610612759, full_name: "San Antonio Spurs", abbreviation: "SAS", city: "San Antonio", nickname: "Spurs", conference: "Western", division: "Southwest", championships: 5 },
];

const API_BASE_URL = "http://localhost:8000/api";

// NBA API endpoints for real stats
const NBA_API_BASE = "https://stats.nba.com/stats";

// Helper function to fetch NBA data with proper headers
const fetchNBAData = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': 'stats.nba.com',
        'Pragma': 'no-cache',
        'Referer': 'https://www.nba.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('NBA API failed, falling back to mock data:', error);
    return null;
  }
};

// Function to fetch real team stats from NBA API
const fetchRealTeamStats = async (teamId) => {
  try {
    // Team info summary endpoint
    const teamInfoUrl = `${NBA_API_BASE}/teaminfocommon?TeamID=${teamId}&Season=2024-25&SeasonType=Regular%20Season`;
    const teamStatsUrl = `${NBA_API_BASE}/teamdashboardbygeneralsplits?TeamID=${teamId}&Season=2024-25&SeasonType=Regular%20Season&MeasureType=Base&PerMode=PerGame&PlusMinus=N&PaceAdjust=N&Rank=N&Outcome=&Location=&Month=0&SeasonSegment=&DateFrom=&DateTo=&OpponentTeamID=0&VsConference=&VsDivision=&GameSegment=&Period=0&LastNGames=0`;
    const teamGamesUrl = `${NBA_API_BASE}/teamgamelog?TeamID=${teamId}&Season=2024-25&SeasonType=Regular%20Season`;

    // Fetch team basic stats
    const [teamStatsData, teamGamesData] = await Promise.all([
      fetchNBAData(teamStatsUrl),
      fetchNBAData(teamGamesUrl)
    ]);

    if (teamStatsData && teamStatsData.resultSets && teamStatsData.resultSets[0]) {
      const statsRow = teamStatsData.resultSets[0].rowSet[0];
      const headers = teamStatsData.resultSets[0].headers;
      
      // Map the stats to our structure
      const stats = {};
      headers.forEach((header, index) => {
        stats[header] = statsRow[index];
      });

      // Extract the stats we need
      return {
        wins: stats.W || 0,
        losses: stats.L || 0,
        win_percentage: stats.W / (stats.W + stats.L) || 0,
        points_per_game: stats.PTS || 0,
        opponent_points_per_game: stats.OPP_PTS || 0,
        field_goal_percentage: stats.FG_PCT || 0,
        three_point_percentage: stats.FG3_PCT || 0,
        free_throw_percentage: stats.FT_PCT || 0,
        rebounds_per_game: stats.REB || 0,
        assists_per_game: stats.AST || 0,
        steals_per_game: stats.STL || 0
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching real NBA stats:', error);
    return null;
  }
};

// Simple cache for team data
const teamDataCache = new Map();

const TeamDetails = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsProgress, setStatsProgress] = useState(0);
  const [statsError, setStatsError] = useState(false);

  const fetchTeamDetails = useCallback(async () => {
    try {
      // Check cache first for instant loading
      if (teamDataCache.has(teamId)) {
        setTeamData(teamDataCache.get(teamId));
        setLoading(false);
        return;
      }

      setLoading(true);

      // Find team in fallback data first (instant basic info)
      const team = FALLBACK_TEAMS.find(t => t.id.toString() === teamId);
      
      if (team) {
        // Set basic team info immediately
        const basicTeamData = {
          basic_info: {
            id: team.id,
            full_name: team.full_name,
            abbreviation: team.abbreviation,
            city: team.city,
            nickname: team.nickname,
            conference: team.conference,
            division: team.division,
            championships: team.championships
          },
          stats: null, // Stats will be loaded separately
          recent_games: null
        };

        setTeamData(basicTeamData);
        setLoading(false);

        // Now fetch real stats from NBA API
        setStatsLoading(true);
        setStatsError(false);

        try {
          // Simulate brief loading delay for UX
          await new Promise(resolve => setTimeout(resolve, 500));

          // Try to fetch real NBA stats from API using the correct endpoint
          const response = await fetch(`http://localhost:8000/api/team/${teamId}`);
          
          let finalStats;
          if (response.ok) {
            const apiData = await response.json();
            const seasonStats = apiData.season_stats;
            
            // Map the API data structure to our expected format
            finalStats = {
              wins: seasonStats?.wins || 0,
              losses: seasonStats?.losses || 0,
              win_percentage: seasonStats?.win_pct || 0,
              points_per_game: seasonStats?.offensive_stats?.avg_points || 0,
              opponent_points_per_game: 0, // Not available in current API
              field_goal_percentage: seasonStats?.offensive_stats?.fg_pct || 0,
              three_point_percentage: seasonStats?.offensive_stats?.three_pt_pct || 0,
              free_throw_percentage: seasonStats?.offensive_stats?.free_throw_pct || 0,
              rebounds_per_game: seasonStats?.defensive_stats?.total_rebounds || 0,
              assists_per_game: seasonStats?.offensive_stats?.assists || 0,
              steals_per_game: seasonStats?.defensive_stats?.steals || 0
            };
          } else {
            throw new Error(`API call failed: ${response.status}`);
          }

          // Create complete team data with real API stats
          const completeTeamData = {
            ...basicTeamData,
            stats: finalStats,
            recent_games: [] // No hardcoded games - would come from API if available
          };

          // Cache the complete result
          teamDataCache.set(teamId, completeTeamData);
          setTeamData(completeTeamData);
          setStatsLoading(false);

        } catch (error) {
          console.error("API call failed:", error);
          setStatsLoading(false);
          setStatsError(true);
          
          // No fallback stats - show N/A values when API fails
          const noDataStats = {
            wins: "N/A",
            losses: "N/A", 
            win_percentage: "N/A",
            points_per_game: "N/A",
            opponent_points_per_game: "N/A",
            field_goal_percentage: "N/A",
            three_point_percentage: "N/A",
            free_throw_percentage: "N/A",
            rebounds_per_game: "N/A",
            assists_per_game: "N/A",
            steals_per_game: "N/A"
          };

          const noDataTeamData = {
            ...basicTeamData,
            stats: noDataStats,
            recent_games: [] // No fallback games
          };

          setTeamData(noDataTeamData);
        }

        // Update document title with team name
        document.title = `${team.full_name} - NBA Analytics`;
      } else {
        setTeamData(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading team details:", error);
      setTeamData(null);
      setLoading(false);
      setStatsLoading(false);
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

  // Retry function to refetch stats when API fails
  const retryStats = useCallback(() => {
    // Clear cache for this team and refetch
    teamDataCache.delete(teamId);
    fetchTeamDetails();
  }, [teamId, fetchTeamDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Loading team...</p>
        </div>
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
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            NBA Analytics
          </Link>
          <span>/</span>
          <Link to="/teams" className="hover:text-cyan-400 transition-colors">
            Teams
          </Link>
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
          <button
            className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
          >
            ADVANCED_STATS
          </button>
        </div>
      </div>

      {/* Team Header and Schedule Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TeamCard 
          teamData={teamData} 
          teamId={teamId} 
          teamColors={teamColors}
          statsLoading={statsLoading}
          statsProgress={statsProgress}
          statsError={statsError}
          onRetryStats={retryStats}
        />

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
