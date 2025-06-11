import React from "react";

const TeamCard = ({ teamData, teamId, teamColors }) => {
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
              {teamData.basic_info?.city ||
                teamData.basic_info?.full_name
                  ?.split(" ")
                  .slice(0, -1)
                  .join(" ") ||
                "CITY"}
            </h1>
            <h2
              className={`text-lg font-mono font-medium ${teamColors.secondary} mb-2`}
            >
              {teamData.basic_info?.nickname ||
                teamData.basic_info?.full_name?.split(" ").slice(-1)[0] ||
                "TEAM"}
            </h2>
            <div className="flex items-center space-x-3">
              <p className="text-sm font-mono text-gray-400">
                <span className={teamColors.secondary}>
                  {teamData.season_stats?.wins || 0}
                </span>
                -
                <span className="text-red-400">
                  {teamData.season_stats?.losses || 0}
                </span>
              </p>
              <div className="text-sm font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
                2024-25
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          {/* Win percentage */}
          <div className="text-sm font-mono text-gray-500">WIN%</div>
          <div className={`text-xl font-mono font-bold ${teamColors.accent}`}>
            {teamData.season_stats?.wins && teamData.season_stats?.losses
              ? (
                  (teamData.season_stats.wins /
                    (teamData.season_stats.wins +
                      teamData.season_stats.losses)) *
                  100
                ).toFixed(1) + "%"
              : "0.0%"}
          </div>
        </div>
      </div>

      {/* Basic Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">GP</div>
          <div className={`text-sm font-mono font-bold ${teamColors.accent}`}>
            {teamData.season_stats?.games_played || 0}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">PPG</div>
          <div
            className={`text-sm font-mono font-bold ${teamColors.secondary}`}
          >
            {teamData.season_stats?.offensive_stats?.avg_points || 0}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">OPP</div>
          <div className="text-sm font-mono font-bold text-red-400">
            {teamData.season_stats?.defensive_stats?.avg_opp_points || "N/A"}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-sm font-mono text-gray-500">FG%</div>
          <div className="text-sm font-mono font-bold text-yellow-400">
            {teamData.season_stats?.offensive_stats?.fg_pct
              ? (teamData.season_stats.offensive_stats.fg_pct * 100).toFixed(
                  1
                ) + "%"
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Performance Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">3PT%</div>
          <div className="text-sm font-mono font-bold text-yellow-400">
            {teamData.season_stats?.offensive_stats?.three_pt_pct
              ? (
                  teamData.season_stats.offensive_stats.three_pt_pct * 100
                ).toFixed(1) + "%"
              : "N/A"}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">AST/TO</div>
          <div
            className={`text-sm font-mono font-bold ${teamColors.secondary}`}
          >
            {teamData.season_stats?.advanced_stats?.assist_to_turnover_ratio ||
              "N/A"}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
          <div className="text-xs font-mono text-gray-500">TS%</div>
          <div className={`text-sm font-mono font-bold ${teamColors.accent}`}>
            {teamData.season_stats?.advanced_stats?.true_shooting_pct
              ? (
                  teamData.season_stats.advanced_stats.true_shooting_pct * 100
                ).toFixed(1) + "%"
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Recent Form Row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-gray-800 rounded border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-500">STREAK</span>
            <div
              className={`w-2 h-2 rounded-full ${
                teamData.recent_form?.[0]?.WL === "W"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            ></div>
          </div>
          <div className="text-sm font-mono font-bold text-gray-300">
            {teamData.recent_form?.[0]?.WL === "W" ? "W" : "L"}1
          </div>
        </div>
        <div className="p-2 bg-gray-800 rounded border border-gray-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-gray-500">L5</span>
            <div className="flex space-x-1">
              {teamData.recent_form?.slice(0, 5).map((game, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    game.WL === "W" ? "bg-green-400" : "bg-red-400"
                  }`}
                  title={`${game.WL} vs ${game.MATCHUP}`}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400">
            {teamData.recent_form?.slice(0, 5).filter((game) => game.WL === "W")
              .length || 0}
            -
            {teamData.recent_form?.slice(0, 5).filter((game) => game.WL === "L")
              .length || 0}
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
              {teamData.season_stats?.defensive_stats?.total_rebounds || "N/A"}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-500">AST/G</div>
            <div className="text-sm font-mono font-bold text-yellow-400">
              {teamData.season_stats?.offensive_stats?.assists || "N/A"}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded border border-gray-600">
            <div className="text-xs font-mono text-gray-500">+/-</div>
            <div
              className={`text-sm font-mono font-bold ${
                (teamData.season_stats?.advanced_stats?.plus_minus || 0) > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {teamData.season_stats?.advanced_stats?.plus_minus
                ? (teamData.season_stats.advanced_stats.plus_minus > 0
                    ? "+"
                    : "") + teamData.season_stats.advanced_stats.plus_minus
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
