import React from "react";

const SeasonOutlook = ({ teamData, teamColors }) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Team Trends */}
      <div className="card p-4">
        <h3
          className={`text-sm font-mono font-semibold ${teamColors.accent} mb-4`}
        >
          TRENDS
        </h3>
        <div className="space-y-2">
          <div className="text-xs font-mono text-gray-400">
            ↗ 3PT% improving (5 games)
          </div>
          <div className="text-xs font-mono text-gray-400">
            {teamData.season_stats?.avg_points > 115
              ? "↗ High-powered offense"
              : "→ Balanced scoring"}
          </div>
          <div className="text-xs font-mono text-gray-400">
            {teamData.season_stats?.wins /
              (teamData.season_stats?.wins + teamData.season_stats?.losses) >
            0.6
              ? "↗ Strong at home"
              : "→ Developing chemistry"}
          </div>
          <div className="text-xs font-mono text-gray-400">
            {teamData.recent_form?.slice(0, 3).filter((game) => game.WL === "W")
              .length >= 2
              ? "↗ Hot streak"
              : "→ Staying competitive"}
          </div>
        </div>
      </div>

      {/* Team Leaders */}
      <div className="card p-4">
        <h3
          className={`text-sm font-mono font-semibold ${teamColors.accent} mb-4`}
        >
          TEAM_LEADERS
        </h3>
        <div className="space-y-3">
          {/* Placeholder content - will be populated later */}
          <div
            className={`text-center text-xs font-mono ${teamColors.accent} py-4`}
          >
            LOADING_LEADERS_DATA...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonOutlook;
