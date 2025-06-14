import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8000/api";

const LeagueLeaders = () => {
  const [leaders, setLeaders] = useState({
    scoring: [],
    rebounding: [],
    assists: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("scoring");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagueLeaders();
  }, []);

  const fetchLeagueLeaders = async () => {
    try {
      setLoading(true);
      
      // Fetch data for all three categories from the NBA API
      const [scoringRes, reboundingRes, assistsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/league-leaders?category=PTS`),
        fetch(`${API_BASE_URL}/league-leaders?category=REB`),
        fetch(`${API_BASE_URL}/league-leaders?category=AST`)
      ]);

      const [scoringData, reboundingData, assistsData] = await Promise.all([
        scoringRes.json(),
        reboundingRes.json(),
        assistsRes.json()
      ]);

      // Format data for the frontend
      const formatLeaders = (data, statKey) => {
        if (!data.leaders || data.leaders.length === 0) {
          return [];
        }
        return data.leaders.slice(0, 5).map(player => ({
          name: player.name,
          team: player.team,
          value: Math.round(player[statKey]).toString(),
          rank: player.rank
        }));
      };

      setLeaders({
        scoring: formatLeaders(scoringData, 'points'),
        rebounding: formatLeaders(reboundingData, 'rebounds'),
        assists: formatLeaders(assistsData, 'assists')
      });
      
    } catch (error) {
      console.error("Error fetching league leaders:", error);
      // Fallback to empty arrays if API fails
      setLeaders({
        scoring: [],
        rebounding: [],
        assists: []
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "scoring", label: "SCORING", unit: "PTS", icon: "🏀" },
    { key: "rebounding", label: "REBOUNDING", unit: "REB", icon: "🔄" },
    { key: "assists", label: "ASSISTS", unit: "AST", icon: "🎯" },
  ];

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono font-semibold text-cyan-400 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          LEAGUE_LEADERS
        </h2>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`flex-1 px-3 py-2 rounded text-sm font-mono font-medium transition-all duration-200 ${
              selectedCategory === category.key
                ? "bg-cyan-400 text-gray-900"
                : "text-gray-300 hover:text-cyan-400"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Leaders List */}
      <div className="space-y-2">
        {leaders[selectedCategory]?.map((player, index) => {
          // Check for award winners
          const isMVP = player.name === "Shai Gilgeous-Alexander";
          const isDPOY = player.name === "Evan Mobley";
          const isROY = player.name === "Stephon Castle";
          const is6MOY = player.name === "Payton Pritchard";
          const isMIP = player.name === "Dyson Daniels";
          
          // Determine which award this player has (awards take precedence over position)
          const getAwardInfo = () => {
            if (isMVP) return { type: 'MVP', badge: 'MVP', color: 'purple' };
            if (isDPOY) return { type: 'DPOY', badge: 'DPOY', color: 'red' };
            if (isROY) return { type: 'ROY', badge: 'ROY', color: 'green' };
            if (is6MOY) return { type: '6MOY', badge: '6MOY', color: 'orange' };
            if (isMIP) return { type: 'MIP', badge: 'MIP', color: 'blue' };
            return null;
          };
          
          const awardInfo = getAwardInfo();
          const hasAward = awardInfo !== null;
          
          // Determine position-based styling (awards take precedence)
          const getPositionStyling = () => {
            if (hasAward) {
              const colorMap = {
                purple: {
                  container: "bg-gradient-to-r from-purple-900/60 via-purple-700/70 to-purple-900/60 border-purple-400/80 shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-white drop-shadow-lg",
                  teamText: "text-purple-200",
                  valueText: "text-purple-300 drop-shadow-lg",
                  rankBg: "bg-purple-500"
                },
                red: {
                  container: "bg-gradient-to-r from-red-900/60 via-red-700/70 to-red-900/60 border-red-400/80 shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-white drop-shadow-lg",
                  teamText: "text-red-200",
                  valueText: "text-red-300 drop-shadow-lg",
                  rankBg: "bg-red-500"
                },
                green: {
                  container: "bg-gradient-to-r from-green-900/60 via-green-700/70 to-green-900/60 border-green-400/80 shadow-lg shadow-green-500/40 hover:shadow-xl hover:shadow-green-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-white drop-shadow-lg",
                  teamText: "text-green-200",
                  valueText: "text-green-300 drop-shadow-lg",
                  rankBg: "bg-green-500"
                },
                orange: {
                  container: "bg-gradient-to-r from-orange-900/60 via-orange-700/70 to-orange-900/60 border-orange-400/80 shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-white drop-shadow-lg",
                  teamText: "text-orange-200",
                  valueText: "text-orange-300 drop-shadow-lg",
                  rankBg: "bg-orange-500"
                },
                blue: {
                  container: "bg-gradient-to-r from-blue-900/60 via-blue-700/70 to-blue-900/60 border-blue-400/80 shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-white drop-shadow-lg",
                  teamText: "text-blue-200",
                  valueText: "text-blue-300 drop-shadow-lg",
                  rankBg: "bg-blue-500"
                }
              };
              return colorMap[awardInfo.color];
            }
            
            switch (index) {
              case 0: // 1st place - Gold (keeps glow effects)
                return {
                  container: "bg-gradient-to-r from-yellow-900/60 via-yellow-700/70 to-yellow-900/60 border-yellow-400/80 shadow-lg shadow-yellow-500/40 hover:shadow-xl hover:shadow-yellow-400/60 hover:scale-[1.02] backdrop-blur-sm",
                  nameText: "text-yellow-100 drop-shadow-lg",
                  teamText: "text-yellow-200",
                  valueText: "text-yellow-300 drop-shadow-lg",
                  rankBg: "bg-yellow-500"
                };
              case 1: // 2nd place - Silver (no glow effects)
                return {
                  container: "bg-gradient-to-r from-gray-700/60 via-gray-500/70 to-gray-700/60 border-gray-400/80 hover:border-gray-300 transition-colors duration-200",
                  nameText: "text-gray-100",
                  teamText: "text-gray-200",
                  valueText: "text-gray-300",
                  rankBg: "bg-gray-400"
                };
              case 2: // 3rd place - Bronze (no glow effects)
                return {
                  container: "bg-gradient-to-r from-amber-900/60 via-amber-700/70 to-amber-900/60 border-amber-400/80 hover:border-amber-300 transition-colors duration-200",
                  nameText: "text-amber-100",
                  teamText: "text-amber-200",
                  valueText: "text-amber-300",
                  rankBg: "bg-yellow-600"
                };
              default: // 4th and 5th place - Default
                return {
                  container: "bg-gray-800 border-gray-600 hover:border-gray-500 transition-colors duration-150",
                  nameText: "text-cyan-400",
                  teamText: "text-gray-400",
                  valueText: "text-green-400",
                  rankBg: "bg-gray-700"
                };
            }
          };
          
          const styling = getPositionStyling();

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded border transition-all duration-300 relative ${styling.container}`}
            >
              {/* Award Badges - Shows for any award winner */}
              {hasAward && (
                <div className="absolute -top-3 -right-3 z-20">
                  <div className={`bg-gradient-to-br ${
                    awardInfo.color === 'purple' ? 'from-purple-400 via-purple-300 to-purple-500 hover:from-purple-500 hover:via-purple-400 hover:to-purple-300 shadow-purple-500/50 hover:shadow-purple-400/70' :
                    awardInfo.color === 'red' ? 'from-red-400 via-red-300 to-red-500 hover:from-red-500 hover:via-red-400 hover:to-red-300 shadow-red-500/50 hover:shadow-red-400/70' :
                    awardInfo.color === 'green' ? 'from-green-400 via-green-300 to-green-500 hover:from-green-500 hover:via-green-400 hover:to-green-300 shadow-green-500/50 hover:shadow-green-400/70' :
                    awardInfo.color === 'orange' ? 'from-orange-400 via-orange-300 to-orange-500 hover:from-orange-500 hover:via-orange-400 hover:to-orange-300 shadow-orange-500/50 hover:shadow-orange-400/70' :
                    'from-blue-400 via-blue-300 to-blue-500 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300 shadow-blue-500/50 hover:shadow-blue-400/70'
                  } text-white px-2 py-1 rounded-md text-xs font-mono font-black tracking-wider shadow-lg transition-all duration-300`}>
                    <span className="drop-shadow-md">{awardInfo.badge}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm text-white ${
                    hasAward
                      ? styling.rankBg
                      : index === 0
                      ? "bg-yellow-500 text-gray-900"
                      : index === 1
                      ? "bg-gray-400 text-gray-900"
                      : index === 2
                      ? "bg-yellow-600 text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {player.rank}
                </div>
                <div>
                  <div
                    className={`text-sm font-mono font-semibold ${styling.nameText}`}
                  >
                    {player.name}
                  </div>
                  <div
                    className={`text-xs font-mono ${styling.teamText}`}
                  >
                    {player.team}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg font-mono font-bold ${styling.valueText}`}
                >
                  {player.value}
                </div>
                <div
                  className={`text-xs font-mono ${styling.teamText}`}
                >
                  {categories.find((c) => c.key === selectedCategory)?.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs font-mono text-gray-400">
          Statistical leaders updated nightly
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeagueLeaders);
