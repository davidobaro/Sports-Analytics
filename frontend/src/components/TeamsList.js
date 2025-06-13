import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const TeamsList = () => {
  // Memoize team data to prevent recalculation
  const allTeams = useMemo(
    () => [
      // Eastern Conference - Atlantic
      { id: 1610612738, abbr: "BOS", name: "Boston Celtics" },
      { id: 1610612751, abbr: "BRK", name: "Brooklyn Nets" },
      { id: 1610612752, abbr: "NYK", name: "New York Knicks" },
      { id: 1610612755, abbr: "PHI", name: "Philadelphia 76ers" },
      { id: 1610612761, abbr: "TOR", name: "Toronto Raptors" },

      // Eastern Conference - Central
      { id: 1610612741, abbr: "CHI", name: "Chicago Bulls" },
      { id: 1610612739, abbr: "CLE", name: "Cleveland Cavaliers" },
      { id: 1610612765, abbr: "DET", name: "Detroit Pistons" },
      { id: 1610612754, abbr: "IND", name: "Indiana Pacers" },
      { id: 1610612749, abbr: "MIL", name: "Milwaukee Bucks" },

      // Eastern Conference - Southeast
      { id: 1610612737, abbr: "ATL", name: "Atlanta Hawks" },
      { id: 1610612766, abbr: "CHA", name: "Charlotte Hornets" },
      { id: 1610612748, abbr: "MIA", name: "Miami Heat" },
      { id: 1610612753, abbr: "ORL", name: "Orlando Magic" },
      { id: 1610612764, abbr: "WAS", name: "Washington Wizards" },

      // Western Conference - Northwest
      { id: 1610612743, abbr: "DEN", name: "Denver Nuggets" },
      { id: 1610612750, abbr: "MIN", name: "Minnesota Timberwolves" },
      { id: 1610612760, abbr: "OKC", name: "Oklahoma City Thunder" },
      { id: 1610612757, abbr: "POR", name: "Portland Trail Blazers" },
      { id: 1610612762, abbr: "UTA", name: "Utah Jazz" },

      // Western Conference - Pacific
      { id: 1610612744, abbr: "GSW", name: "Golden State Warriors" },
      { id: 1610612746, abbr: "LAC", name: "LA Clippers" },
      { id: 1610612747, abbr: "LAL", name: "Los Angeles Lakers" },
      { id: 1610612756, abbr: "PHX", name: "Phoenix Suns" },
      { id: 1610612758, abbr: "SAC", name: "Sacramento Kings" },

      // Western Conference - Southwest
      { id: 1610612742, abbr: "DAL", name: "Dallas Mavericks" },
      { id: 1610612745, abbr: "HOU", name: "Houston Rockets" },
      { id: 1610612763, abbr: "MEM", name: "Memphis Grizzlies" },
      { id: 1610612740, abbr: "NOP", name: "New Orleans Pelicans" },
      { id: 1610612759, abbr: "SAS", name: "San Antonio Spurs" },
    ],
    []
  );

  // Optimized team item component
  const TeamItem = React.memo(({ team }) => {
    return (
      <Link to={`/team/${team.id}`} className="group">
        <div className="card p-4 hover:scale-105 transition-all duration-200 hover:border-cyan-400">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden bg-gray-800 border border-gray-600">
            {/* Lazy loaded images with better fallback */}
            <img
              src={`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`}
              alt={`${team.name} logo`}
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
              {team.abbr}
            </span>
          </div>

          <div className="text-center">
            <h3 className="font-mono font-bold text-sm text-cyan-400 mb-1">
              {team.abbr}
            </h3>
            <p className="text-gray-400 font-mono text-xs leading-tight">
              {team.name}
            </p>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
            ALL_NBA_TEAMS
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allTeams.map((team) => (
            <TeamItem key={team.id} team={team} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gray-800 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-sm">
                SYSTEM_STATUS: ACTIVE
              </span>
            </div>
            <div className="text-gray-500">|</div>
            <span className="text-cyan-400 font-mono text-sm">
              30 TEAMS LOADED
            </span>
            <div className="text-gray-500">|</div>
            <span className="text-purple-400 font-mono text-sm">
              AUTO_PERSONALIZATION: ON
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsList;
