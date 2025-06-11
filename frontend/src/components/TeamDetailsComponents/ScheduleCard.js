import React from "react";

const ScheduleCard = ({ teamColors, upcomingGames }) => {
  return (
    <div className="lg:col-span-1 card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-mono font-semibold ${teamColors.accent}`}>
          SCHEDULE
        </h3>
        <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
          L3|N4
        </div>
      </div>

      <div className="space-y-3">
        {/* Previous 3 Games */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-gray-500 mb-2 flex items-center">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
            PREVIOUS
          </h4>
          <div className="space-y-1">
            {[
              { date: "JUN 08", opp: "LAL", result: "W 112-108", home: true },
              { date: "JUN 05", opp: "DEN", result: "L 95-102", home: false },
              { date: "JUN 03", opp: "PHX", result: "W 118-115", home: true },
            ].map((game, index) => (
              <div
                key={index}
                className="p-1.5 bg-gray-800/50 rounded border border-gray-700 hover:border-gray-600 transition-all duration-200 min-h-[48px] flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-mono text-gray-400">
                      {game.date}
                    </span>
                    <span
                      className={`text-xs font-mono px-1 rounded ${
                        game.home ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {game.home ? "vs" : "@"} {game.opp}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold ${
                      game.result.startsWith("W")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {game.result}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  Final Score
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next 4 Games */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-gray-500 mb-2 flex items-center">
            <div className={`w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1`}></div>
            UPCOMING
          </h4>
          <div className="space-y-1">
            {upcomingGames.map((game, index) => (
              <div
                key={index}
                className={`p-1.5 bg-gray-800 rounded border border-gray-600 hover:border-${
                  teamColors.accent.split("-")[1]
                }-400 transition-all duration-200 min-h-[48px] flex flex-col justify-between`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs font-mono ${teamColors.accent}`}>
                      {game.date}
                    </span>
                    <span
                      className={`text-xs font-mono px-1 rounded ${
                        game.home ? teamColors.secondary : "text-yellow-400"
                      }`}
                    >
                      {game.home ? "vs" : "@"} {game.opp}
                    </span>
                    <span
                      className={`text-xs font-mono px-1 rounded text-xs ${
                        game.difficulty === "HARD"
                          ? "text-red-400"
                          : game.difficulty === "MEDIUM"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {game.time}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {game.prediction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
