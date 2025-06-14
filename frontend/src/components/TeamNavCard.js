import React from "react";
import { useNavigate } from "react-router-dom";

const TeamNavCard = ({ team }) => {
  const navigate = useNavigate();

  const handleTeamDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/team/${team.id}`);
  };

  const handlePlayerListClick = (e) => {
    e.stopPropagation();
    navigate(`/team/${team.id}/roster`);
  };

  return (
    <div className="card p-4 hover:scale-105 transition-transform cursor-pointer hover:border-cyan-400">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
          <img
            src={`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`}
            alt={`${team.full_name || team.nickname} logo`}
            className="w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <span
            className="text-white font-mono font-bold text-sm"
            style={{ display: "none" }}
          >
            {team.abbreviation}
          </span>
        </div>
        <div>
          <h4 className="font-mono font-bold text-white">
            {team.city ||
              team.full_name?.split(" ").slice(0, -1).join(" ") ||
              "City"}
          </h4>
          <p className="text-sm text-gray-400 font-mono">
            {team.nickname || team.full_name?.split(" ").slice(-1)[0] || "Team"}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleTeamDetailsClick}
          className="px-3 py-1 text-gray-300 hover:text-white text-xs font-mono border border-gray-600 hover:border-gray-400 rounded transition-colors duration-200"
        >
          View stats
        </button>
        <button
          onClick={handlePlayerListClick}
          className="px-3 py-1 text-gray-300 hover:text-white text-xs font-mono border border-gray-600 hover:border-gray-400 rounded transition-colors duration-200"
        >
          View Roster
        </button>
      </div>
    </div>
  );
};

export default TeamNavCard;
