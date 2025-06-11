import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const TeamDetails = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/team/${teamId}`);
      setTeamData(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
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

  if (!teamData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
        <p className="text-gray-600">The requested team could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up">
      {/* Team Header */}
      <div className="card p-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-nba-blue to-nba-red rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {teamData.basic_info?.abbreviation || 'NBA'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {teamData.basic_info?.full_name || 'Team Details'}
            </h1>
            <p className="text-lg text-gray-600">
              {teamData.season_stats?.wins}-{teamData.season_stats?.losses} Record
            </p>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Games Played</h3>
          <p className="text-3xl font-bold text-nba-blue">{teamData.season_stats?.games_played || 0}</p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Points Per Game</h3>
          <p className="text-3xl font-bold text-green-600">{teamData.season_stats?.avg_points || 0}</p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Opp Points Per Game</h3>
          <p className="text-3xl font-bold text-red-600">{teamData.season_stats?.avg_opp_points || 0}</p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Field Goal %</h3>
          <p className="text-3xl font-bold text-purple-600">
            {((teamData.season_stats?.fg_pct || 0) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Games</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matchup</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Result</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Points</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Opp Points</th>
              </tr>
            </thead>
            <tbody>
              {teamData.recent_form?.slice(0, 10).map((game, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{game.GAME_DATE}</td>
                  <td className="py-3 px-4">{game.MATCHUP}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      game.WL === 'W' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {game.WL}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">{game.PTS}</td>
                  <td className="py-3 px-4 text-center font-semibold">{game.OPP_PTS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
