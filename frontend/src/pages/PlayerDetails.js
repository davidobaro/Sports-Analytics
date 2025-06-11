import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const PlayerDetails = () => {
  const { playerId } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const [playerRes, predictionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/player/${playerId}`),
        axios.get(`${API_BASE_URL}/predictions/player/${playerId}`)
      ]);
      
      setPlayerData(playerRes.data);
      setPredictions(predictionsRes.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nba-blue"></div>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Player Not Found</h2>
        <p className="text-gray-600">The requested player could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      {/* Player Header */}
      <div className="card p-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-nba-blue to-nba-red rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {playerData.basic_info?.name?.split(' ').map(n => n[0]).join('') || 'NBA'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {playerData.basic_info?.name || 'Player Details'}
            </h1>
            <p className="text-lg text-gray-600">
              {playerData.basic_info?.team} • {playerData.basic_info?.position}
            </p>
            <p className="text-sm text-gray-500">
              {playerData.basic_info?.height} • {playerData.basic_info?.weight} lbs • 
              {playerData.basic_info?.experience} years experience
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Season Stats */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Season Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Points Per Game</h3>
              <p className="text-2xl font-bold text-nba-blue">{playerData.current_season?.ppg || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Rebounds Per Game</h3>
              <p className="text-2xl font-bold text-green-600">{playerData.current_season?.rpg || 0}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Assists Per Game</h3>
              <p className="text-2xl font-bold text-purple-600">{playerData.current_season?.apg || 0}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Games Played</h3>
              <p className="text-2xl font-bold text-yellow-600">{playerData.current_season?.games || 0}</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Field Goal %</h3>
              <p className="text-xl font-bold text-gray-700">
                {((playerData.current_season?.fg_pct || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">3-Point %</h3>
              <p className="text-xl font-bold text-gray-700">
                {((playerData.current_season?.three_pt_pct || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* ML Predictions */}
        {predictions && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Predictions</h2>
            
            {/* Next Game Prediction */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Next Game Prediction</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Points</div>
                  <div className="text-xl font-bold text-nba-blue">
                    {predictions.next_game?.predicted_points || 0}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Rebounds</div>
                  <div className="text-xl font-bold text-green-600">
                    {predictions.next_game?.predicted_rebounds || 0}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Assists</div>
                  <div className="text-xl font-bold text-purple-600">
                    {predictions.next_game?.predicted_assists || 0}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">Confidence: </span>
                <span className={`font-semibold ${
                  (predictions.next_game?.confidence || 0) >= 0.9 ? 'text-green-600' :
                  (predictions.next_game?.confidence || 0) >= 0.8 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {((predictions.next_game?.confidence || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Season Projection */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Season Projection</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Projected PPG</span>
                  <span className="font-bold text-nba-blue">
                    {predictions.season_projection?.projected_ppg || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Projected RPG</span>
                  <span className="font-bold text-green-600">
                    {predictions.season_projection?.projected_rpg || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Projected APG</span>
                  <span className="font-bold text-purple-600">
                    {predictions.season_projection?.projected_apg || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails;
