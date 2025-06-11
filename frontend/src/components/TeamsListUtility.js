import React, { useMemo } from "react";
import { Link } from "react-router-dom";

// This is a utility component for displaying teams in compact format
// For the full teams page, use AllTeamsDemo instead
const TeamsListUtility = ({ maxTeams = 30, showTitle = true, compact = false }) => {
  // Memoize team data to prevent recalculation
  const allTeams = useMemo(
    () => [
      // Eastern Conference - Atlantic
      { id: 1610612738, abbr: "BOS", name: "Boston Celtics", division: "Atlantic", conference: "Eastern" },
      { id: 1610612751, abbr: "BRK", name: "Brooklyn Nets", division: "Atlantic", conference: "Eastern" },
      { id: 1610612752, abbr: "NYK", name: "New York Knicks", division: "Atlantic", conference: "Eastern" },
      { id: 1610612755, abbr: "PHI", name: "Philadelphia 76ers", division: "Atlantic", conference: "Eastern" },
      { id: 1610612761, abbr: "TOR", name: "Toronto Raptors", division: "Atlantic", conference: "Eastern" },

      // Eastern Conference - Central
      { id: 1610612741, abbr: "CHI", name: "Chicago Bulls", division: "Central", conference: "Eastern" },
      { id: 1610612739, abbr: "CLE", name: "Cleveland Cavaliers", division: "Central", conference: "Eastern" },
      { id: 1610612765, abbr: "DET", name: "Detroit Pistons", division: "Central", conference: "Eastern" },
      { id: 1610612754, abbr: "IND", name: "Indiana Pacers", division: "Central", conference: "Eastern" },
      { id: 1610612749, abbr: "MIL", name: "Milwaukee Bucks", division: "Central", conference: "Eastern" },

      // Eastern Conference - Southeast
      { id: 1610612737, abbr: "ATL", name: "Atlanta Hawks", division: "Southeast", conference: "Eastern" },
      { id: 1610612766, abbr: "CHA", name: "Charlotte Hornets", division: "Southeast", conference: "Eastern" },
      { id: 1610612748, abbr: "MIA", name: "Miami Heat", division: "Southeast", conference: "Eastern" },
      { id: 1610612753, abbr: "ORL", name: "Orlando Magic", division: "Southeast", conference: "Eastern" },
      { id: 1610612764, abbr: "WAS", name: "Washington Wizards", division: "Southeast", conference: "Eastern" },

      // Western Conference - Northwest
      { id: 1610612743, abbr: "DEN", name: "Denver Nuggets", division: "Northwest", conference: "Western" },
      { id: 1610612750, abbr: "MIN", name: "Minnesota Timberwolves", division: "Northwest", conference: "Western" },
      { id: 1610612760, abbr: "OKC", name: "Oklahoma City Thunder", division: "Northwest", conference: "Western" },
      { id: 1610612757, abbr: "POR", name: "Portland Trail Blazers", division: "Northwest", conference: "Western" },
      { id: 1610612762, abbr: "UTA", name: "Utah Jazz", division: "Northwest", conference: "Western" },

      // Western Conference - Pacific
      { id: 1610612744, abbr: "GSW", name: "Golden State Warriors", division: "Pacific", conference: "Western" },
      { id: 1610612746, abbr: "LAC", name: "LA Clippers", division: "Pacific", conference: "Western" },
      { id: 1610612747, abbr: "LAL", name: "Los Angeles Lakers", division: "Pacific", conference: "Western" },
      { id: 1610612756, abbr: "PHX", name: "Phoenix Suns", division: "Pacific", conference: "Western" },
      { id: 1610612758, abbr: "SAC", name: "Sacramento Kings", division: "Pacific", conference: "Western" },

      // Western Conference - Southwest
      { id: 1610612742, abbr: "DAL", name: "Dallas Mavericks", division: "Southwest", conference: "Western" },
      { id: 1610612745, abbr: "HOU", name: "Houston Rockets", division: "Southwest", conference: "Western" },
      { id: 1610612763, abbr: "MEM", name: "Memphis Grizzlies", division: "Southwest", conference: "Western" },
      { id: 1610612740, abbr: "NOP", name: "New Orleans Pelicans", division: "Southwest", conference: "Western" },
      { id: 1610612759, abbr: "SAS", name: "San Antonio Spurs", division: "Southwest", conference: "Western" },
    ],
    []
  );

  // Limit teams if maxTeams is specified
  const displayTeams = maxTeams ? allTeams.slice(0, maxTeams) : allTeams;

  // Optimized team item component
  const TeamItem = React.memo(({ team }) => {
    const teamColors = {
      primary: "from-gray-600 to-gray-700",
      accent: "text-cyan-400",
    };

    if (compact) {
      return (
        <Link to={`/team/${team.id}`} className="group">
          <div className="flex items-center p-2 hover:bg-gray-800 rounded transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-mono font-bold text-xs">
                {team.abbr}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono text-cyan-400">{team.abbr}</p>
              <p className="text-xs text-gray-400 truncate">{team.name}</p>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link to={`/team/${team.id}`} className="group">
        <div className="card p-4 hover:scale-105 transition-all duration-200 hover:border-cyan-400">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${teamColors.primary} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}
          >
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
            <h3
              className={`font-mono font-bold text-sm ${teamColors.accent} mb-1`}
            >
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

  const containerClass = compact 
    ? "space-y-1" 
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4";

  return (
    <div className={compact ? "p-4" : "min-h-screen bg-gray-900 p-6"}>
      <div className={compact ? "" : "max-w-7xl mx-auto"}>
        {showTitle && !compact && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
              ALL_NBA_TEAMS
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Click any team to view personalized analytics and data
            </p>
            <p className="text-gray-500 font-mono text-xs mt-2">
              Use /teams for full division-organized view
            </p>
          </div>
        )}

        <div className={containerClass}>
          {displayTeams.map((team) => (
            <TeamItem key={team.id} team={team} />
          ))}
        </div>

        {!compact && (
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
                {displayTeams.length} TEAMS LOADED
              </span>
              <div className="text-gray-500">|</div>
              <span className="text-purple-400 font-mono text-sm">
                UTILITY_COMPONENT
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsListUtility;
