import React, { useState, useEffect } from "react";

const PredictionsWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock predictions for display
  const mockPredictions = [
    {
      player: "LeBron James",
      team: "Lakers",
      playerId: 2544, // Real NBA player ID
      predictions: {
        points: 28.5,
        rebounds: 7.2,
        assists: 8.1,
        confidence: 0.89,
      },
    },
    {
      player: "Stephen Curry",
      team: "Warriors",
      playerId: 201939, // Real NBA player ID
      predictions: {
        points: 31.2,
        rebounds: 4.8,
        assists: 6.5,
        confidence: 0.92,
      },
    },
    {
      player: "Jayson Tatum",
      team: "Celtics",
      playerId: 1628369, // Real NBA player ID
      predictions: {
        points: 26.8,
        rebounds: 8.1,
        assists: 4.9,
        confidence: 0.85,
      },
    },
  ];

  // Function to get player headshot URL
  const getPlayerHeadshot = (playerId) => {
    // NBA official headshot URL pattern
    return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
  };

  // Auto-scroll through predictions every 5 seconds with progress indicator
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentIndex((prevIndex) =>
              prevIndex === mockPredictions.length - 1 ? 0 : prevIndex + 1
            );
            setIsTransitioning(false);
          }, 300); // Brief transition delay
          return 0;
        }
        return prevProgress + 2; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [mockPredictions.length]);

  // Reset progress when manually changing prediction
  const handleManualChange = (index) => {
    setProgress(0);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const currentPrediction = mockPredictions[currentIndex];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-mono font-semibold text-cyan-400 mb-6 flex items-center justify-between">
        MARKET_PREDICTIONS
        <div className="text-sm text-gray-400">
          {currentIndex + 1}/{mockPredictions.length}
        </div>
      </h2>

      <div className="space-y-4">
        <div
          className={`p-4 bg-gray-800 rounded border border-gray-600 hover:border-cyan-400 transition-all duration-500 transform ${
            isTransitioning ? "scale-95 opacity-75" : "scale-100 opacity-100"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              {/* Player headshot */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                <img
                  src={getPlayerHeadshot(currentPrediction.playerId)}
                  alt={currentPrediction.player}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-green-400 hidden items-center justify-center text-xs font-bold text-gray-900">
                  {currentPrediction.player
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-green-400">
                  {currentPrediction.player}
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  {currentPrediction.team}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-gray-500">CONFIDENCE</div>
              <div
                className={`font-mono font-bold ${
                  currentPrediction.predictions.confidence >= 0.9
                    ? "text-green-400"
                    : currentPrediction.predictions.confidence >= 0.8
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {(currentPrediction.predictions.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-900 border border-gray-600 rounded p-2">
              <div className="text-xs font-mono text-gray-500">PTS</div>
              <div className="font-mono font-bold text-cyan-400">
                {currentPrediction.predictions.points}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-600 rounded p-2">
              <div className="text-xs font-mono text-gray-500">REB</div>
              <div className="font-mono font-bold text-cyan-400">
                {currentPrediction.predictions.rebounds}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-600 rounded p-2">
              <div className="text-xs font-mono text-gray-500">AST</div>
              <div className="font-mono font-bold text-cyan-400">
                {currentPrediction.predictions.assists}
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator dots */}
        <div className="flex justify-center space-x-2">
          {mockPredictions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-cyan-400 scale-125"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Subtle progress indicator */}
        <div className="flex justify-center mt-3">
          <div className="w-16 bg-gray-700 rounded-full h-0.5 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-100 ease-linear opacity-60"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <button className="w-full btn-primary text-center font-mono">
          VIEW_ALL_PREDICTIONS
        </button>
      </div>
    </div>
  );
};

export default PredictionsWidget;
