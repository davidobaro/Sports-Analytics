import React from 'react';
import { Link } from 'react-router-dom';

const VerticalTeamsBar = ({ teams }) => {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          
          NBA Teams
        </h2>
        <span className="text-sm text-gray-500">
          {teams.length} teams
        </span>
      </div>
      
      {/* Vertical scrollable teams container */}
      <div className="overflow-y-auto max-h-96">
        <div className="space-y-3">
          {teams.map((team, index) => (
            <Link
              key={team.id || index}
              to={`/team/${team.id}`}
              className="block group"
            >
              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-nba-blue hover:shadow-md transition-all duration-200 bg-white">
                {/* Team Logo/Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-nba-blue to-nba-red rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 group-hover:scale-105 transition-transform duration-200">
                  {team.abbreviation || team.full_name?.substring(0, 3).toUpperCase() || 'NBA'}
                </div>
                
                {/* Team Info */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-nba-blue transition-colors">
                    {team.full_name || team.city + ' ' + team.nickname || `Team ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {team.city || 'NBA Team'}
                  </div>
                </div>
                
                {/* Rank indicator */}
                <div className="text-right">
                  <div className="text-xs text-gray-400">#{index + 1}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="mt-2 flex justify-center">
        <div className="text-xs text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Scroll to see all teams
        </div>
      </div>
    </div>
  );
};

export default VerticalTeamsBar;
