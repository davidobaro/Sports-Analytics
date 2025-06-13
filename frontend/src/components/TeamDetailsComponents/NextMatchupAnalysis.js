import React from "react";
import { TEAM_ABBR_TO_ID } from "../../utils/nbaTeamData";

const NextMatchupAnalysis = ({
  teamData,
  teamId,
  teamColors,
  nextMatchup,
  getPredictionConfidence,
}) => {
  return (
    <div className="lg:col-span-2 card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-mono font-semibold ${teamColors.accent}`}>
          NEXT_MATCHUP_ANALYSIS
        </h2>
        <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
          {nextMatchup
            ? `${nextMatchup.date}_${nextMatchup.time}`
            : "JUN_12_8:00_PM"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team vs Opponent Comparison */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-8">
              {/* Current Team */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 mx-auto mb-2 shadow-lg">
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
                    className="text-gray-300 font-mono font-bold text-xl"
                    style={{ display: "none" }}
                  >
                    {teamData.basic_info?.abbreviation || "NBA"}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-300">
                  {teamData.basic_info?.full_name || "Team"}
                </div>
                <div className="font-mono text-xs text-gray-500">
                  {teamData.season_stats?.wins || 0}-
                  {teamData.season_stats?.losses || 0}
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="text-xl font-mono font-bold text-red-400">
                  VS
                </div>
                <div className="text-xs font-mono text-gray-500">
                  {nextMatchup?.isHome ? "HOME" : "AWAY"}
                </div>
              </div>

              {/* Opponent */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 mx-auto mb-2 shadow-lg">
                  <img
                    src={`https://cdn.nba.com/logos/nba/${
                      TEAM_ABBR_TO_ID[nextMatchup?.opponent] ||
                      TEAM_ABBR_TO_ID["BOS"]
                    }/global/L/logo.svg`}
                    alt={`${
                      nextMatchup?.opponentData?.fullName || "Boston Celtics"
                    } logo`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <span
                    className="text-gray-300 font-mono font-bold text-xl"
                    style={{ display: "none" }}
                  >
                    {nextMatchup?.opponent || "BOS"}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-300">
                  {nextMatchup?.opponentData?.fullName || "Boston Celtics"}
                </div>
                <div className="font-mono text-xs text-gray-500">
                  {nextMatchup?.opponentData
                    ? "N/A"
                    : "48-17"}
                </div>
              </div>
            </div>
          </div>

          {/* Head-to-Head Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-800 rounded border border-gray-600">
              <div className="text-xs font-mono text-gray-500 mb-1">
                SEASON_SERIES
              </div>
              <div
                className={`text-lg font-mono font-bold ${teamColors.accent}`}
              >
                {nextMatchup?.seasonSeries || "1-1"}
              </div>
              <div className="text-xs font-mono text-gray-600">
                {nextMatchup?.seasonSeries === "1-1"
                  ? "TIED"
                  : nextMatchup?.seasonSeries?.split("-")[0] >
                    nextMatchup?.seasonSeries?.split("-")[1]
                  ? "LEADING"
                  : "TRAILING"}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded border border-gray-600">
              <div className="text-xs font-mono text-gray-500 mb-1">
                LAST_MEETING
              </div>
              <div
                className={`text-lg font-mono font-bold ${
                  nextMatchup?.lastMeeting?.startsWith("W")
                    ? teamColors.secondary
                    : "text-red-400"
                }`}
              >
                {nextMatchup?.lastMeeting || "W 108-102"}
              </div>
              <div className="text-xs font-mono text-gray-600">
                {new Date()
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                  .replace(" ", "_")
                  .toUpperCase()}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded border border-gray-600">
              <div className="text-xs font-mono text-gray-500 mb-1">
                HOME_RECORD
              </div>
              <div className="text-lg font-mono font-bold text-yellow-400">
                {nextMatchup?.homeRecord || "23-8"}
              </div>
              <div className="text-xs font-mono text-gray-600">THIS_SEASON</div>
            </div>
          </div>
        </div>

        {/* Key Matchup Factors */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-mono font-semibold text-gray-400 mb-4">
            KEY_FACTORS
          </h3>
          <div className="space-y-3">
            {nextMatchup?.keyFactors?.map((factor, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800 rounded border border-gray-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-500">
                    {factor.factor}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      factor.team === "TEAM"
                        ? teamColors.secondary
                        : "text-red-400"
                    }`}
                  >
                    {factor.team}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {factor.description}
                </div>
              </div>
            )) || [
              // Fallback static factors
              <div
                key="pace"
                className="p-3 bg-gray-800 rounded border border-gray-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-500">
                    PACE_ADVANTAGE
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${teamColors.secondary}`}
                  >
                    TEAM
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  Faster tempo should favor home team
                </div>
              </div>,
              <div
                key="defense"
                className="p-3 bg-gray-800 rounded border border-gray-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-500">
                    3PT_DEFENSE
                  </span>
                  <span className="text-xs font-mono font-bold text-red-400">
                    OPPONENT
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  BOS allows fewer 3-pointers
                </div>
              </div>,
              <div
                key="rest"
                className="p-3 bg-gray-800 rounded border border-gray-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-500">
                    REST_ADVANTAGE
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${teamColors.secondary}`}
                  >
                    TEAM
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  2 days rest vs 1 day
                </div>
              </div>,
            ]}
          </div>
        </div>
      </div>

      {/* AI Prediction */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-gray-400">AI_PREDICTION</div>
            <div
              className={`text-lg font-mono font-bold ${teamColors.secondary}`}
            >
              {nextMatchup?.prediction ||
                `${teamData.basic_info?.abbreviation || "TEAM"} 112 - 108 BOS`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-gray-400">CONFIDENCE</div>
            <div className="text-lg font-mono font-bold text-yellow-400">
              {getPredictionConfidence()}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextMatchupAnalysis;
