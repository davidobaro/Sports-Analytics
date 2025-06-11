import React from "react";

const RecentGamesTable = ({ teamData, teamColors }) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-mono font-semibold ${teamColors.accent}`}>
          RECENT_GAMES
        </h2>
        <div className="text-sm font-mono text-gray-400">LAST_10_GAMES</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-500">
                DATE
              </th>
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-500">
                MATCHUP
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-500">
                RESULT
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-500">
                PTS
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-500">
                OPP_PTS
              </th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-500">
                DIFF
              </th>
            </tr>
          </thead>
          <tbody>
            {teamData.recent_form?.slice(0, 10).map((game, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
              >
                <td className="py-3 px-4 font-mono text-gray-400">
                  {game.GAME_DATE}
                </td>
                <td className="py-3 px-4 font-mono text-gray-300">
                  {game.MATCHUP}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded font-mono text-xs font-bold border ${
                      game.WL === "W"
                        ? "bg-green-900/30 text-green-400 border-green-600"
                        : "bg-red-900/30 text-red-400 border-red-600"
                    }`}
                  >
                    {game.WL}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-center font-mono font-bold ${teamColors.accent}`}
                >
                  {game.PTS}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-gray-400">
                  {game.OPP_PTS}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span
                    className={`${
                      game.PTS - game.OPP_PTS > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {game.PTS - game.OPP_PTS > 0 ? "+" : ""}
                    {game.PTS - game.OPP_PTS}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentGamesTable;
