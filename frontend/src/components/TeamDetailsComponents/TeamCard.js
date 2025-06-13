import React from "react";

const TeamCard = ({
  teamData,
  teamId,
  teamColors,
  statsLoading = false,
  statsProgress = 0,
  statsError = false,
  onRetryStats,
}) => {
  // Use the new stats structure from TeamDetails
  const stats = teamData?.stats;

  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 1) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toFixed(decimals);
    }
    return "...";
  };

  // Helper function to format percentages
  const formatPercentage = (value, decimals = 1) => {
    if (typeof value === "number" && !isNaN(value)) {
      return (value * 100).toFixed(decimals) + "%";
    }
    return "...";
  };

  return (
    <div className="lg:col-span-2 card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Team logo */}
          <div
            className={`w-16 h-16 bg-gradient-to-br ${teamColors.primary} rounded-full flex items-center justify-center border border-gray-600 shadow-lg`}
          >
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
              className="text-gray-900 font-mono font-bold text-lg"
              style={{ display: "none" }}
            >
              {teamData.basic_info?.abbreviation || "NBA"}
            </span>
          </div>
          <div>
            {/* Team name - stacked format */}
            <h1
              className={`text-2xl font-mono font-bold ${teamColors.accent} mb-1`}
            >
              {teamData.basic_info?.city || "CITY"}
            </h1>
            <h2
              className={`text-lg font-mono font-medium ${teamColors.secondary} mb-2`}
            >
              {teamData.basic_info?.nickname || "TEAM"}
            </h2>
            <div className="flex items-center space-x-3">
              <p className="text-sm font-mono text-gray-400">
                <span className={teamColors.secondary}>
                  {stats?.wins !== undefined ? stats.wins : "..."}
                </span>
                -
                <span className="text-red-400">
                  {stats?.losses !== undefined ? stats.losses : "..."}
                </span>
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
                  2024-25
                </div>
                {/* Loading Dots - Same height as season indicator */}
                {statsLoading && (
                  <div className="flex items-center space-x-2 px-2 py-1 bg-gray-800/50 rounded border border-gray-600/50">
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
                    <span className="text-xs font-mono text-cyan-400 ml-1">
                      Loading stats
                    </span>
                  </div>
                )}
                {/* Error State with Retry Button */}
                {statsError && !statsLoading && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onRetryStats}
                      className="flex items-center space-x-1 px-2 py-1 bg-red-900/50 hover:bg-red-800/50 rounded border border-red-600/50 transition-colors"
                      title="Retry loading stats"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs font-mono text-red-400">
                        RETRY
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          {/* Win percentage */}
          <div className="text-sm font-mono text-gray-500">WIN%</div>
          <div className={`text-xl font-mono font-bold ${teamColors.accent}`}>
            {stats?.win_percentage !== undefined
              ? formatPercentage(stats.win_percentage)
              : "..."}
          </div>
        </div>
      </div>

      {/* Basic Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">GP</div>
          <div className={`text-sm font-mono font-bold ${teamColors.accent}`}>
            {stats?.wins !== undefined && stats?.losses !== undefined
              ? stats.wins + stats.losses
              : "..."}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">PPG</div>
          <div
            className={`text-sm font-mono font-bold ${teamColors.secondary}`}
          >
            {stats?.points_per_game
              ? formatNumber(stats.points_per_game)
              : "..."}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">OPP</div>
          <div className="text-sm font-mono font-bold text-red-400">
            {stats?.opponent_points_per_game
              ? formatNumber(stats.opponent_points_per_game)
              : "..."}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">FG%</div>
          <div className="text-sm font-mono font-bold text-yellow-400">
            {stats?.field_goal_percentage
              ? formatPercentage(stats.field_goal_percentage)
              : "..."}
          </div>
        </div>
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">3PT%</div>
          <div className="text-sm font-mono font-bold text-yellow-400">
            {stats?.three_point_percentage
              ? formatPercentage(stats.three_point_percentage)
              : "..."}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">FT%</div>
          <div
            className={`text-sm font-mono font-bold ${teamColors.secondary}`}
          >
            {stats?.free_throw_percentage
              ? formatPercentage(stats.free_throw_percentage)
              : "..."}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">+/-</div>
          <div className={`text-sm font-mono font-bold ${teamColors.accent}`}>
            {stats?.plus_minus
              ? stats.plus_minus > 0
                ? `+${formatNumber(stats.plus_minus)}`
                : formatNumber(stats.plus_minus)
              : "..."}
          </div>
        </div>
      </div>

      {/* Recent Form Row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-gray-800 rounded border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-500">STREAK</span>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div className="text-sm font-mono font-bold text-gray-300">
            {stats?.current_streak ? stats.current_streak : "..."}
          </div>
        </div>
        <div className="p-2 bg-gray-800 rounded border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-500">L5</span>
            <div className="flex space-x-1">
              {statsLoading ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                </>
              ) : stats?.last_5_games ? (
                stats.last_5_games.map((result, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      result === "W" ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                ))
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </>
              )}
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400">
            {stats?.last_5_record ? stats.last_5_record : "..."}
          </div>
        </div>
      </div>

      {/* Season Outlook */}
      <div className="border-t border-gray-600 pt-4">
        <h4
          className={`text-sm font-mono font-semibold ${teamColors.accent} mb-3`}
        >
          TEAM_STATS
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-500">REB/G</div>
            <div
              className={`text-sm font-mono font-bold ${teamColors.secondary}`}
            >
              {stats?.rebounds_per_game
                ? formatNumber(stats.rebounds_per_game)
                : "..."}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-500">AST/G</div>
            <div className="text-sm font-mono font-bold text-yellow-400">
              {stats?.assists_per_game
                ? formatNumber(stats.assists_per_game)
                : "..."}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-500">STL/G</div>
            <div className="text-sm font-mono font-bold text-green-400">
              {stats?.steals_per_game
                ? formatNumber(stats.steals_per_game)
                : "..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
