import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ teams }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`fixed left-0 top-28 h-[calc(100vh-7rem)] bg-gray-900 shadow-2xl border-r border-gray-700 border-t-0 transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top accent bar - removed to make flush with navbar */}

      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gray-800 border border-gray-600">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/1200px-National_Basketball_Association_logo.svg.png"
                alt="NBA Logo"
                className="w-6 h-6 object-contain filter brightness-0 invert"
                onError={(e) => {
                  // Fallback to alternative NBA logo
                  if (e.target.src.includes("wikimedia.org")) {
                    e.target.src = "https://www.nba.com/favicon.ico";
                  } else {
                    // Final fallback to text
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }
                }}
              />
              <div
                className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center text-gray-900 text-sm font-mono font-bold"
                style={{ display: "none" }}
              >
                NBA
              </div>
            </div>
            <span className="text-lg font-mono font-bold text-green-400">
              TEAMS
            </span>
          </div>
        )}
        <button
          onClick={handleCollapseToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600 hover:border-cyan-400"
        >
          <svg
            className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Teams Section */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        {/* Teams List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {teams.map((team, index) => (
              <Link
                key={team.id || index}
                to={`/team/${team.id}`}
                className="block group"
                title={isCollapsed ? team.full_name : ""}
              >
                <div
                  className={`flex items-center rounded-lg hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-600 ${
                    isCollapsed ? "justify-center p-1" : "p-2"
                  }`}
                >
                  {/* Team Logo/Avatar */}
                  <div
                    className={`${
                      isCollapsed ? "w-8 h-8" : "w-8 h-8"
                    } rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-gray-800 border border-gray-600`}
                  >
                    <img
                      src={`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`}
                      alt={`${team.full_name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Try ESPN logo source
                        if (e.target.src.includes("cdn.nba.com")) {
                          e.target.src = `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbreviation?.toLowerCase()}.png`;
                        } else if (e.target.src.includes("espncdn.com")) {
                          // Try Sports Reference logo
                          e.target.src = `https://www.basketball-reference.com/req/202106291/images/logos/${team.abbreviation?.toUpperCase()}.png`;
                        } else {
                          // Final fallback to abbreviation
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                    <div
                      className={`${
                        isCollapsed ? "w-8 h-8" : "w-8 h-8"
                      } bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center text-gray-900 ${
                        isCollapsed ? "text-xs" : "text-xs"
                      } font-mono font-bold`}
                      style={{ display: "none" }}
                    >
                      {team.abbreviation ||
                        team.full_name?.substring(0, 3).toUpperCase() ||
                        "NBA"}
                    </div>
                  </div>

                  {/* Team Info - Hidden when collapsed */}
                  {!isCollapsed && (
                    <div className="flex-1 ml-3">
                      <div className="text-sm font-mono font-bold text-cyan-400 group-hover:text-green-400 transition-colors truncate">
                        {team.city ||
                          team.full_name?.split(" ").slice(0, -1).join(" ") ||
                          `City ${index + 1}`}
                      </div>
                      <div className="text-sm font-mono font-medium text-gray-400 group-hover:text-gray-300 transition-colors truncate">
                        {team.nickname ||
                          team.full_name?.split(" ").slice(-1)[0] ||
                          "TEAM"}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator - only show when not collapsed */}
        {!isCollapsed && teams.length > 10 && (
          <div className="mt-3 flex justify-center">
            <div className="text-xs text-gray-500 font-mono flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              SCROLL_FOR_MORE
            </div>
          </div>
        )}
      </div>

      {/* Footer - only show when not collapsed */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="text-xs text-cyan-400 font-mono text-center">
            NBA_ANALYTICS_PRO_v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
