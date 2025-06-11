import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { teamCache, performanceMonitor, warmCaches } from "../utils/cacheUtils";
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

const TeamDetailsOptimized = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cacheHit, setCacheHit] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  // Optimized fetch function with enhanced caching
  const fetchTeamDetails = useCallback(async () => {
    const startTime = performance.now();
    
    try {
      // Check enhanced cache first
      const cacheKey = `team_details_${teamId}`;
      const cachedData = teamCache.get(cacheKey);
      
      if (cachedData) {
        console.log(`✅ Enhanced cache hit for team ${teamId}`);
        setTeamData(cachedData);
        setLoading(false);
        setCacheHit(true);
        setLoadTime(performance.now() - startTime);
        return;
      }

      console.log(`🔄 Enhanced cache miss for team ${teamId}, fetching from API...`);
      setCacheHit(false);
      setLoading(true);

      // Enhanced fetch with performance monitoring
      const data = await performanceMonitor.measureAsync(`team_fetch_${teamId}`, async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(`${API_BASE_URL}/team/${teamId}`, {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=300',
              'Accept': 'application/json',
            }
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return await response.json();
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      });

      // Validate data structure
      if (!data || !data.basic_info) {
        throw new Error('Invalid team data structure received');
      }

      // Cache with intelligent TTL
      const customTTL = data.season_stats ? 20 * 60 * 1000 : 10 * 60 * 1000;
      teamCache.set(cacheKey, data, customTTL);
      
      setTeamData(data);
      setLoadTime(performance.now() - startTime);

      // Update document title
      document.title = `${data.basic_info.full_name} - NBA Analytics Pro`;

    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      setLoadTime(performance.now() - startTime);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  // Memoized team colors to prevent recalculations
  const teamColors = useMemo(() => ({
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  }), []);

  // Memoized upcoming games calculation
  const upcomingGames = useMemo(() => {
    if (!teamData) {
      return [
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
    }
    return generateUpcomingGames(teamData);
  }, [teamData]);

  // Memoized next matchup calculation
  const nextMatchup = useMemo(() => {
    return teamData ? generateNextMatchup(teamData) : null;
  }, [teamData]);

  // Memoized helper functions
  const predictionConfidence = useMemo(() => 75, []);
  const getPredictionConfidence = useCallback(() => 
    nextMatchup?.confidence || predictionConfidence, [nextMatchup, predictionConfidence]);
  const getUpcomingGames = useCallback(() => upcomingGames, [upcomingGames]);

  // Performance indicator component
  const PerformanceIndicator = React.memo(() => (
    <div className="text-xs font-mono text-gray-500 mb-4 flex items-center space-x-4 p-2 bg-gray-800 rounded">
      <span>⚡ {loadTime.toFixed(0)}ms</span>
      <span>{cacheHit ? '💾 Cached' : '🌐 Live'}</span>
      <span>📊 {teamCache.getStats().size}/{teamCache.maxSize}</span>
      <span>🎯 {teamCache.getStats().hitRate.toFixed(1)}%</span>
    </div>
  ));

  // Initialize cache warming
  useEffect(() => {
    warmCaches();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="font-mono text-cyan-400 text-sm">LOADING_TEAM_DATA...</p>
        <div className="mt-2 text-xs font-mono text-gray-500">
          Enhanced caching system active
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
          onClick={() => {
            teamCache.clear();
            window.location.reload();
          }}
          className="mt-4 btn-secondary"
        >
          Clear Cache & Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Performance Indicator */}
      <PerformanceIndicator />

      {/* Personalized Breadcrumb with Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
          <Link to="/" className="hover:text-cyan-400 transition-colors">NBA Analytics Pro</Link>
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
          <button 
            className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
            onClick={() => {
              teamCache.clear();
              fetchTeamDetails();
            }}
          >
            🔄 REFRESH_DATA
          </button>
        </div>
      </div>

      {/* Team Header and Schedule Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TeamCard teamData={teamData} teamId={teamId} teamColors={teamColors} />
        <ScheduleCard teamColors={teamColors} upcomingGames={getUpcomingGames()} />
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

export default TeamDetailsOptimized;
