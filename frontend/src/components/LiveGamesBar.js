import React from "react";

const LiveGamesBar = ({ games }) => {
  if (!games || games.length === 0) {
    return (
      <div className="px-4 py-1 bg-gray-900 border-b border-gray-700 h-12">
        <div className="flex items-center justify-center text-gray-400 h-full">
          <span className="text-xs font-mono">● NO LIVE GAMES TODAY</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-1 bg-gray-900 border-b border-gray-700 overflow-hidden h-12">
      <div className="flex overflow-x-auto space-x-4 py-1 scrollbar-hide items-center h-full">
        {/* Live Indicator */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-mono text-xs font-bold">LIVE</span>
        </div>

        {games.map((game, index) => {
          // Calculate score difference for "change" indicator
          const scoreDiff = game.home_score - game.away_score;
          const isHomeWinning = scoreDiff > 0;
          const isAwayWinning = scoreDiff < 0;

          return (
            <div
              key={index}
              className="flex-shrink-0 bg-gray-800 border border-gray-600 rounded px-2 py-1 hover:bg-gray-700 transition-colors duration-200 min-w-[140px]"
            >
              <div className="flex items-center justify-between">
                {/* Teams and Score */}
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <div
                      className={`text-xs font-mono font-medium ${
                        isAwayWinning ? "text-green-400" : "text-gray-300"
                      }`}
                    >
                      {game.away_team}
                    </div>
                    <div
                      className={`text-sm font-mono font-bold ${
                        isAwayWinning ? "text-green-400" : "text-white"
                      }`}
                    >
                      {game.away_score}
                    </div>
                  </div>

                  <div className="text-gray-500 font-mono text-xs">vs</div>

                  <div className="text-center">
                    <div
                      className={`text-xs font-mono font-medium ${
                        isHomeWinning ? "text-green-400" : "text-gray-300"
                      }`}
                    >
                      {game.home_team}
                    </div>
                    <div
                      className={`text-sm font-mono font-bold ${
                        isHomeWinning ? "text-green-400" : "text-white"
                      }`}
                    >
                      {game.home_score}
                    </div>
                  </div>
                </div>

                {/* Score Change Indicator */}
                <div className="flex flex-col items-end ml-2">
                  <div
                    className={`text-xs font-mono px-1 py-0.5 rounded ${
                      scoreDiff > 0
                        ? "bg-green-900 text-green-400"
                        : scoreDiff < 0
                        ? "bg-red-900 text-red-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {scoreDiff > 0
                      ? `+${scoreDiff}`
                      : scoreDiff < 0
                      ? `${scoreDiff}`
                      : "TIE"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveGamesBar;
