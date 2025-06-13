import React, { useState } from "react";

const StandingsTable = ({ standings }) => {
  const [selectedConference, setSelectedConference] = useState("East");

  // Sort standings by conference rank
  const filteredStandings = standings
    .filter((team) => team.conference === selectedConference)
    .sort((a, b) => (a.conf_rank || 0) - (b.conf_rank || 0));

  // Calculate conference stats
  const eastTeams = standings.filter(team => team.conference === "East");
  const westTeams = standings.filter(team => team.conference === "West");
  const eastWins = eastTeams.reduce((sum, team) => sum + (team.wins || 0), 0);
  const westWins = westTeams.reduce((sum, team) => sum + (team.wins || 0), 0);
  const eastLosses = eastTeams.reduce((sum, team) => sum + (team.losses || 0), 0);
  const westLosses = westTeams.reduce((sum, team) => sum + (team.losses || 0), 0);

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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          LEAGUE_STANDINGS
        </h2>

        <div className="flex space-x-2">
          {["East", "West"].map((conference) => (
            <button
              key={conference}
              onClick={() => setSelectedConference(conference)}
              className={`px-3 py-1 rounded text-sm font-mono font-medium transition-all duration-200 border ${
                selectedConference === conference
                  ? "bg-cyan-400 text-gray-900 border-cyan-400"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:border-cyan-400 hover:text-cyan-400"
              }`}
            >
              {conference.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Conference Summary - Only show for current selected conference */}
      {standings.length > 0 && (
        <div className="mb-4">
          <div className={`border rounded-lg p-3 ${
            selectedConference === "East" 
              ? "bg-cyan-900/20 border-cyan-600" 
              : "bg-red-900/20 border-red-600"
          }`}>
            <div className="text-center">
              <div className={`text-sm font-mono font-semibold ${
                selectedConference === "East" ? "text-cyan-400" : "text-red-400"
              }`}>
                {selectedConference.toUpperCase()} CONFERENCE
              </div>
              <div className="text-xs font-mono text-gray-400 mt-1">
                {selectedConference === "East" ? eastWins : westWins}W - {selectedConference === "East" ? eastLosses : westLosses}L ({selectedConference === "East" ? eastTeams.length : westTeams.length} teams)
              </div>
              <div className={`text-xs font-mono mt-1 ${
                selectedConference === "East" ? "text-cyan-300" : "text-red-300"
              }`}>
                {selectedConference === "East" 
                  ? (eastTeams.length > 0 ? ((eastWins / (eastWins + eastLosses)) * 100).toFixed(1) : 0)
                  : (westTeams.length > 0 ? ((westWins / (westWins + westLosses)) * 100).toFixed(1) : 0)
                }% win rate
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-400">
                RANK
              </th>
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-400">
                TEAM
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">
                W
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">
                L
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">
                PCT
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStandings.map((team, index) => {
              const isPlayoffPosition = (team.conf_rank || 0) <= 10;
              const isTopSeed = (team.conf_rank || 0) <= 6;
              
              return (
                <tr
                  key={team.team_id || index}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-colors duration-150 ${
                    (team.conf_rank || index + 1) === 1 ? 'bg-yellow-900/20' : isTopSeed ? 'bg-green-900/20' : isPlayoffPosition ? 'bg-blue-900/20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <span className={`font-mono font-bold text-lg ${
                        (team.conf_rank || index + 1) === 1 
                          ? 'text-yellow-400' 
                          : isTopSeed 
                          ? 'text-green-400' 
                          : isPlayoffPosition 
                          ? 'text-blue-400' 
                          : 'text-cyan-400'
                      }`}>
                        {team.conf_rank || index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-gray-800 border border-gray-600">
                        <img
                          src={`https://cdn.nba.com/logos/nba/${team.team_id}/global/L/logo.svg`}
                          alt={`${team.team_name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Try ESPN logo source
                            if (e.target.src.includes("cdn.nba.com")) {
                              e.target.src = `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbreviation?.toLowerCase()}.png`;
                            } else if (e.target.src.includes("espncdn.com")) {
                              // Final fallback to abbreviation
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                        <div
                          className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center text-gray-900 text-xs font-mono font-bold"
                          style={{ display: "none" }}
                        >
                          {team.abbreviation ||
                            team.team_name?.substring(0, 3).toUpperCase() ||
                            "NBA"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-mono font-bold text-cyan-400 truncate">
                          {team.city ||
                            team.team_name?.split(" ").slice(0, -1).join(" ") ||
                            `City ${index + 1}`}
                        </div>
                        <div className="text-sm font-mono font-medium text-gray-400 truncate">
                          {team.nickname ||
                            team.team_name?.split(" ").slice(-1)[0] ||
                            "TEAM"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-semibold text-green-400">
                      {team.wins}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-semibold text-red-400">
                      {team.losses}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-semibold text-gray-300">
                      {(team.win_pct || 0).toFixed(3)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredStandings.length === 0 && (
        <div className="text-center py-8 text-gray-500 font-mono">
          NO_STANDINGS_DATA_AVAILABLE
        </div>
      )}

      {filteredStandings.length > 0 && (
        <div className="mt-4 text-xs font-mono text-gray-400 space-y-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-900/30 border border-yellow-400 rounded"></div>
              <span>1st Place</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-900/30 border border-green-400 rounded"></div>
              <span>Top 6 - Guaranteed Playoffs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-900/30 border border-blue-400 rounded"></div>
              <span>7-10 - Play-In Tournament</span>
            </div>
          </div>
          <div className="text-center text-gray-500">
            {selectedConference} Conference standings updated in real-time
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StandingsTable);
