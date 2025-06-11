import React, { useState, useEffect } from "react";
import axios from "axios";

const PredictionsWidget = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock predictions for display
  const mockPredictions = [
    {
      player: "LeBron James",
      team: "Lakers",
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
      predictions: {
        points: 26.8,
        rebounds: 8.1,
        assists: 4.9,
        confidence: 0.85,
      },
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-mono font-semibold text-cyan-400 mb-6 flex items-center">
        
        MARKET_PREDICTIONS
      </h2>

      <div className="space-y-4">
        {mockPredictions.map((pred, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded border border-gray-600 hover:border-cyan-400 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-mono font-semibold text-green-400">{pred.player}</h3>
                <p className="text-sm font-mono text-gray-400">{pred.team}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-gray-500">CONFIDENCE</div>
                <div
                  className={`font-mono font-bold ${
                    pred.predictions.confidence >= 0.9
                      ? "text-green-400"
                      : pred.predictions.confidence >= 0.8
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {(pred.predictions.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-900 border border-gray-600 rounded p-2">
                <div className="text-xs font-mono text-gray-500">PTS</div>
                <div className="font-mono font-bold text-cyan-400">
                  {pred.predictions.points}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-600 rounded p-2">
                <div className="text-xs font-mono text-gray-500">REB</div>
                <div className="font-mono font-bold text-cyan-400">
                  {pred.predictions.rebounds}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-600 rounded p-2">
                <div className="text-xs font-mono text-gray-500">AST</div>
                <div className="font-mono font-bold text-cyan-400">
                  {pred.predictions.assists}
                </div>
              </div>
            </div>
          </div>
        ))}
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
