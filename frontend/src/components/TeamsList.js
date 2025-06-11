import React from 'react';
import { Link } from 'react-router-dom';

const TeamsList = ({ teams }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        
        NBA Teams
      </h2>
      
      <div className="space-y-3">
        {teams.map((team, index) => (
          <Link
            key={team.id || index}
            to={`/team/${team.id}`}
            className="block p-4 rounded-lg border border-gray-200 hover:border-nba-blue hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-nba-blue to-nba-red rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {team.abbreviation || team.full_name?.substring(0, 3).toUpperCase() || 'NBA'}
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-nba-blue transition-colors">
                    {team.full_name || team.name || `Team ${index + 1}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {team.city || 'NBA Team'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">Rank</div>
                <div className="font-semibold text-gray-700">#{index + 1}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link 
          to="/teams" 
          className="block text-center text-nba-blue hover:text-nba-red font-medium transition-colors duration-200"
        >
          View All Teams →
        </Link>
      </div>
    </div>
  );
};

export default TeamsList;
