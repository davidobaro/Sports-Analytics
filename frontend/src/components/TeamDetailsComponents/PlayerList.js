import React from "react";

const PlayerList = ({ teamData, teamColors }) => {
  // Mock player data - will be replaced with real data from API
  const mockPlayers = [
    {
      id: 1,
      name: "LeBron James",
      position: "SF",
      number: 23,
      height: "6'9\"",
      weight: "250 lbs",
      age: 40,
      stats: { ppg: 25.3, rpg: 7.3, apg: 7.5 },
    },
    {
      id: 2,
      name: "Anthony Davis",
      position: "PF/C",
      number: 3,
      height: "6'10\"",
      weight: "253 lbs",
      age: 31,
      stats: { ppg: 24.1, rpg: 12.6, apg: 3.5 },
    },
    {
      id: 3,
      name: "Russell Westbrook",
      position: "PG",
      number: 0,
      height: "6'3\"",
      weight: "200 lbs",
      age: 36,
      stats: { ppg: 15.8, rpg: 6.2, apg: 7.5 },
    },
    {
      id: 4,
      name: "Austin Reaves",
      position: "SG",
      number: 15,
      height: "6'5\"",
      weight: "197 lbs",
      age: 26,
      stats: { ppg: 15.9, rpg: 4.4, apg: 5.5 },
    },
    {
      id: 5,
      name: "D'Angelo Russell",
      position: "PG",
      number: 1,
      height: "6'4\"",
      weight: "193 lbs",
      age: 29,
      stats: { ppg: 18.0, rpg: 3.1, apg: 6.3 },
    },
    {
      id: 6,
      name: "Rui Hachimura",
      position: "PF",
      number: 28,
      height: "6'8\"",
      weight: "230 lbs",
      age: 26,
      stats: { ppg: 13.6, rpg: 4.3, apg: 1.2 },
    },
    {
      id: 7,
      name: "Jarred Vanderbilt",
      position: "PF",
      number: 2,
      height: "6'9\"",
      weight: "214 lbs",
      age: 25,
      stats: { ppg: 5.2, rpg: 4.8, apg: 1.2 },
    },
    {
      id: 8,
      name: "Christian Wood",
      position: "C",
      number: 35,
      height: "6'10\"",
      weight: "214 lbs",
      age: 29,
      stats: { ppg: 6.9, rpg: 5.1, apg: 1.0 },
    },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-mono font-semibold ${teamColors.accent}`}>
          TEAM_ROSTER
        </h2>
        <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
          {mockPlayers.length}_PLAYERS
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockPlayers.map((player) => (
          <div
            key={player.id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors duration-200 cursor-pointer"
          >
            {/* Player Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Player Photo Placeholder */}
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                  <span className="text-white font-mono font-bold text-sm">
                    #{player.number}
                  </span>
                </div>
                <div>
                  <h3
                    className={`font-mono font-semibold text-sm ${teamColors.accent}`}
                  >
                    {player.name}
                  </h3>
                  <p className="text-xs font-mono text-gray-400">
                    {player.position}
                  </p>
                </div>
              </div>
            </div>

            {/* Player Info */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">HEIGHT:</span>
                <span className="text-gray-300">{player.height}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">WEIGHT:</span>
                <span className="text-gray-300">{player.weight}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">AGE:</span>
                <span className="text-gray-300">{player.age}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-600 pt-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs font-mono text-gray-500">PPG</div>
                  <div
                    className={`text-sm font-mono font-bold ${teamColors.secondary}`}
                  >
                    {player.stats.ppg}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-gray-500">RPG</div>
                  <div
                    className={`text-sm font-mono font-bold ${teamColors.secondary}`}
                  >
                    {player.stats.rpg}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-gray-500">APG</div>
                  <div
                    className={`text-sm font-mono font-bold ${teamColors.secondary}`}
                  >
                    {player.stats.apg}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
