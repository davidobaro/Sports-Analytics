import React, { useState } from 'react';

const StandingsTable = ({ standings }) => {
  const [selectedConference, setSelectedConference] = useState('All');

  const filteredStandings = standings.filter(team => 
    selectedConference === 'All' || team.conference === selectedConference
  );

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono font-semibold text-cyan-400 flex items-center">
          
          LEAGUE_STANDINGS
        </h2>
        
        <div className="flex space-x-2">
          {['All', 'East', 'West'].map((conference) => (
            <button
              key={conference}
              onClick={() => setSelectedConference(conference)}
              className={`px-3 py-1 rounded text-sm font-mono font-medium transition-all duration-200 border ${
                selectedConference === conference
                  ? 'bg-cyan-400 text-gray-900 border-cyan-400'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-cyan-400 hover:text-cyan-400'
              }`}
            >
              {conference.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-400">RANK</th>
              <th className="text-left py-3 px-4 font-mono font-semibold text-gray-400">TEAM</th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">W</th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">L</th>
              <th className="text-center py-3 px-4 font-mono font-semibold text-gray-400">CONF</th>
            </tr>
          </thead>
          <tbody>
            {filteredStandings.map((team, index) => (
              <tr 
                key={team.team_id || index}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="py-3 px-4">
                  <span className="font-mono font-medium text-cyan-400">#{team.conf_rank || index + 1}</span>
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
                        {team.abbreviation || team.team_name?.substring(0, 3).toUpperCase() || 'NBA'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-mono font-bold text-cyan-400 truncate">
                        {team.city || team.team_name?.split(' ').slice(0, -1).join(' ') || `City ${index + 1}`}
                      </div>
                      <div className="text-sm font-mono font-medium text-gray-400 truncate">
                        {team.nickname || team.team_name?.split(' ').slice(-1)[0] || 'TEAM'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-mono font-semibold text-green-400">{team.wins}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-mono font-semibold text-red-400">{team.losses}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded font-mono text-xs font-medium border ${
                    team.conference === 'East' 
                      ? 'bg-cyan-900 text-cyan-400 border-cyan-600' 
                      : 'bg-red-900 text-red-400 border-red-600'
                  }`}>
                    {team.conference?.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStandings.length === 0 && (
        <div className="text-center py-8 text-gray-500 font-mono">
          NO_STANDINGS_DATA_AVAILABLE
        </div>
      )}
    </div>
  );
};

export default StandingsTable;
