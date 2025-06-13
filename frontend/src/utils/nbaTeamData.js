// Complete NBA Team Database for Automatic Personalization
// This file contains all 30 NBA teams with automatic template-based data generation

export const NBA_TEAMS = {
  ATL: {
    fullName: "Atlanta Hawks",
    city: "Atlanta",
    founded: 1946,
    championships: 1,
    colors: {
      primary: "from-red-600 to-red-400",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "State Farm Arena",
    conference: "Eastern",
    division: "Southeast",
    rivalries: ["BOS", "MIA", "CHI"],
    historicalAchievements: ["1958 NBA Champions", "Dominique Wilkins Era"],
    keyPlayers: ["Trae Young", "Dejounte Murray"],
    strengths: ["Young core", "High-scoring offense"],
    weaknesses: ["Defensive consistency", "Rebounding"],
  },
  BOS: {
    fullName: "Boston Celtics",
    city: "Boston",
    founded: 1946,
    championships: 17,
    colors: {
      primary: "from-green-600 to-green-400",
      accent: "text-green-400",
      secondary: "text-green-300",
    },
    arena: "TD Garden",
    conference: "Eastern",
    division: "Atlantic",
    rivalries: ["LAL", "NYK", "PHI"],
    historicalAchievements: [
      "17-time NBA Champions",
      "Russell Dynasty",
      "Bird Era",
    ],
    keyPlayers: ["Jayson Tatum", "Jaylen Brown"],
    strengths: ["Championship experience", "Two-way play"],
    weaknesses: ["Depth concerns", "Interior presence"],
  },
  BRK: {
    fullName: "Brooklyn Nets",
    city: "Brooklyn",
    founded: 1967,
    championships: 0,
    colors: {
      primary: "from-gray-800 to-gray-600",
      accent: "text-gray-300",
      secondary: "text-gray-400",
    },
    arena: "Barclays Center",
    conference: "Eastern",
    division: "Atlantic",
    rivalries: ["NYK", "BOS", "PHI"],
    historicalAchievements: ["2x ABA Champions", "Brooklyn since 2012"],
    keyPlayers: ["Mikal Bridges", "Cam Thomas"],
    strengths: ["Young talent", "Modern facility"],
    weaknesses: ["Rebuilding phase", "Chemistry building"],
  },
  CHA: {
    fullName: "Charlotte Hornets",
    city: "Charlotte",
    founded: 1988,
    championships: 0,
    colors: {
      primary: "from-teal-500 to-purple-500",
      accent: "text-teal-400",
      secondary: "text-purple-400",
    },
    arena: "Spectrum Center",
    conference: "Eastern",
    division: "Southeast",
    rivalries: ["ATL", "MIA", "WAS"],
    historicalAchievements: ["Jordan Era", "Kemba Walker Records"],
    keyPlayers: ["LaMelo Ball", "Miles Bridges"],
    strengths: ["Athletic wings", "Fast-paced offense"],
    weaknesses: ["Defensive identity", "Veteran leadership"],
  },
  CHI: {
    fullName: "Chicago Bulls",
    city: "Chicago",
    founded: 1966,
    championships: 6,
    colors: {
      primary: "from-red-700 to-red-500",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "United Center",
    conference: "Eastern",
    division: "Central",
    rivalries: ["DET", "NYK", "MIA"],
    historicalAchievements: [
      "6-time NBA Champions",
      "Jordan Dynasty",
      "Rose MVP",
    ],
    keyPlayers: ["DeMar DeRozan", "Zach LaVine"],
    strengths: ["Scoring ability", "Veteran leadership"],
    weaknesses: ["Three-point shooting", "Defensive rebounding"],
  },
  CLE: {
    fullName: "Cleveland Cavaliers",
    city: "Cleveland",
    founded: 1970,
    championships: 1,
    colors: {
      primary: "from-red-700 to-yellow-500",
      accent: "text-red-400",
      secondary: "text-yellow-400",
    },
    arena: "Rocket Mortgage FieldHouse",
    conference: "Eastern",
    division: "Central",
    rivalries: ["GSW", "BOS", "DET"],
    historicalAchievements: [
      "2016 NBA Champions",
      "LeBron Era",
      "3-1 Comeback",
    ],
    keyPlayers: ["Donovan Mitchell", "Darius Garland"],
    strengths: ["Backcourt scoring", "Young core"],
    weaknesses: ["Frontcourt depth", "Playoff experience"],
  },
  DAL: {
    fullName: "Dallas Mavericks",
    city: "Dallas",
    founded: 1980,
    championships: 1,
    colors: {
      primary: "from-blue-600 to-blue-400",
      accent: "text-blue-400",
      secondary: "text-blue-300",
    },
    arena: "American Airlines Center",
    conference: "Western",
    division: "Southwest",
    rivalries: ["SAS", "HOU", "MIA"],
    historicalAchievements: [
      "2011 NBA Champions",
      "Dirk Era",
      "Cuban Ownership",
    ],
    keyPlayers: ["Luka Dončić", "Kyrie Irving"],
    strengths: ["Elite playmaking", "Clutch performance"],
    weaknesses: ["Defensive consistency", "Frontcourt depth"],
  },
  DEN: {
    fullName: "Denver Nuggets",
    city: "Denver",
    founded: 1967,
    championships: 1,
    colors: {
      primary: "from-blue-500 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "Ball Arena",
    conference: "Western",
    division: "Northwest",
    rivalries: ["LAL", "GSW", "UTA"],
    historicalAchievements: [
      "2023 NBA Champions",
      "Jokić MVPs",
      "High Altitude",
    ],
    keyPlayers: ["Nikola Jokić", "Jamal Murray"],
    strengths: ["Championship experience", "Elite center play"],
    weaknesses: ["Perimeter defense", "Depth concerns"],
  },
  DET: {
    fullName: "Detroit Pistons",
    city: "Detroit",
    founded: 1941,
    championships: 3,
    colors: {
      primary: "from-red-600 to-blue-600",
      accent: "text-red-400",
      secondary: "text-blue-400",
    },
    arena: "Little Caesars Arena",
    conference: "Eastern",
    division: "Central",
    rivalries: ["CHI", "IND", "CLE"],
    historicalAchievements: [
      "3-time NBA Champions",
      "Bad Boys Era",
      "Going to Work",
    ],
    keyPlayers: ["Cade Cunningham", "Isaiah Stewart"],
    strengths: ["Young talent", "Rebuild potential"],
    weaknesses: ["Experience", "Shooting consistency"],
  },
  GSW: {
    fullName: "Golden State Warriors",
    city: "Golden State", //this was done for naming purposes, as the team is known as "Golden State Warriors"
    founded: 1946,
    championships: 7,
    colors: {
      primary: "from-blue-600 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "Chase Center",
    conference: "Western",
    division: "Pacific",
    rivalries: ["LAL", "CLE", "LAC"],
    historicalAchievements: [
      "7-time NBA Champions",
      "Splash Brothers",
      "73-Win Season",
    ],
    keyPlayers: ["Stephen Curry", "Klay Thompson"],
    strengths: ["Three-point shooting", "Championship DNA"],
    weaknesses: ["Aging core", "Bench depth"],
  },
  HOU: {
    fullName: "Houston Rockets",
    city: "Houston",
    founded: 1967,
    championships: 2,
    colors: {
      primary: "from-red-600 to-red-400",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "Toyota Center",
    conference: "Western",
    division: "Southwest",
    rivalries: ["SAS", "DAL", "GSW"],
    historicalAchievements: [
      "2-time NBA Champions",
      "Hakeem Era",
      "Harden Years",
    ],
    keyPlayers: ["Alperen Şengün", "Jalen Green"],
    strengths: ["Young core", "Athletic ability"],
    weaknesses: ["Experience", "Consistency"],
  },
  IND: {
    fullName: "Indiana Pacers",
    city: "Indianapolis",
    founded: 1967,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "Gainbridge Fieldhouse",
    conference: "Eastern",
    division: "Central",
    rivalries: ["DET", "CHI", "MIA"],
    historicalAchievements: [
      "3x ABA Champions",
      "Reggie Miller Era",
      "Malice at Palace",
    ],
    keyPlayers: ["Tyrese Haliburton", "Myles Turner"],
    strengths: ["Balanced roster", "Team chemistry"],
    weaknesses: ["Star power", "Playoff experience"],
  },
  LAC: {
    fullName: "LA Clippers",
    city: "Los Angeles",
    founded: 1970,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-red-600",
      accent: "text-blue-400",
      secondary: "text-red-400",
    },
    arena: "Crypto.com Arena",
    conference: "Western",
    division: "Pacific",
    rivalries: ["LAL", "GSW", "PHX"],
    historicalAchievements: ["Lob City Era", "CP3 Years", "Kawhi Arrival"],
    keyPlayers: ["Kawhi Leonard", "Paul George"],
    strengths: ["Two-way wings", "Depth"],
    weaknesses: ["Health concerns", "Chemistry"],
  },
  LAL: {
    fullName: "Los Angeles Lakers",
    city: "Los Angeles",
    founded: 1947,
    championships: 17,
    colors: {
      primary: "from-purple-600 to-yellow-400",
      accent: "text-purple-400",
      secondary: "text-yellow-400",
    },
    arena: "Crypto.com Arena",
    conference: "Western",
    division: "Pacific",
    rivalries: ["BOS", "GSW", "LAC"],
    historicalAchievements: [
      "17-time NBA Champions",
      "Showtime Era",
      "Kobe Legacy",
    ],
    keyPlayers: ["LeBron James", "Anthony Davis"],
    strengths: ["Superstar talent", "Championship experience"],
    weaknesses: ["Age concerns", "Depth"],
  },
  MEM: {
    fullName: "Memphis Grizzlies",
    city: "Memphis",
    founded: 1995,
    championships: 0,
    colors: {
      primary: "from-blue-500 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "FedExForum",
    conference: "Western",
    division: "Southwest",
    rivalries: ["SAS", "LAL", "GSW"],
    historicalAchievements: [
      "Grit and Grind Era",
      "Ja Morant ROY",
      "Young Core",
    ],
    keyPlayers: ["Ja Morant", "Jaren Jackson Jr."],
    strengths: ["Athletic youth", "Fast pace"],
    weaknesses: ["Three-point shooting", "Experience"],
  },
  MIA: {
    fullName: "Miami Heat",
    city: "Miami",
    founded: 1988,
    championships: 3,
    colors: {
      primary: "from-red-600 to-red-400",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "Kaseya Center",
    conference: "Eastern",
    division: "Southeast",
    rivalries: ["BOS", "NYK", "CHI"],
    historicalAchievements: [
      "3-time NBA Champions",
      "Big Three Era",
      "Heat Culture",
    ],
    keyPlayers: ["Jimmy Butler", "Bam Adebayo"],
    strengths: ["Culture", "Playoff experience"],
    weaknesses: ["Offensive consistency", "Aging stars"],
  },
  MIL: {
    fullName: "Milwaukee Bucks",
    city: "Milwaukee",
    founded: 1968,
    championships: 2,
    colors: {
      primary: "from-green-600 to-green-400",
      accent: "text-green-400",
      secondary: "text-green-300",
    },
    arena: "Fiserv Forum",
    conference: "Eastern",
    division: "Central",
    rivalries: ["CHI", "BOS", "MIA"],
    historicalAchievements: [
      "2-time NBA Champions",
      "Giannis MVPs",
      "2021 Title",
    ],
    keyPlayers: ["Giannis Antetokounmpo", "Damian Lillard"],
    strengths: ["MVP talent", "Length"],
    weaknesses: ["Playoff consistency", "Bench scoring"],
  },
  MIN: {
    fullName: "Minnesota Timberwolves",
    city: "Minneapolis",
    founded: 1989,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-green-500",
      accent: "text-blue-400",
      secondary: "text-green-400",
    },
    arena: "Target Center",
    conference: "Western",
    division: "Northwest",
    rivalries: ["DEN", "UTA", "POR"],
    historicalAchievements: ["KG Era", "Anthony Edwards ROY", "Young Talent"],
    keyPlayers: ["Anthony Edwards", "Karl-Anthony Towns"],
    strengths: ["Young athleticism", "Offensive potential"],
    weaknesses: ["Defensive consistency", "Experience"],
  },
  NOP: {
    fullName: "New Orleans Pelicans",
    city: "New Orleans",
    founded: 1988,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "Smoothie King Center",
    conference: "Western",
    division: "Southwest",
    rivalries: ["LAL", "HOU", "SAS"],
    historicalAchievements: ["CP3 Era", "AD Years", "Zion Potential"],
    keyPlayers: ["Zion Williamson", "Brandon Ingram"],
    strengths: ["Athletic frontcourt", "Scoring ability"],
    weaknesses: ["Health concerns", "Depth"],
  },
  NYK: {
    fullName: "New York Knicks",
    city: "New York",
    founded: 1946,
    championships: 2,
    colors: {
      primary: "from-blue-700 to-orange-500",
      accent: "text-blue-400",
      secondary: "text-orange-400",
    },
    arena: "Madison Square Garden",
    conference: "Eastern",
    division: "Atlantic",
    rivalries: ["BOS", "BRK", "MIA"],
    historicalAchievements: ["2-time NBA Champions", "MSG Legacy", "Ewing Era"],
    keyPlayers: ["Julius Randle", "Jalen Brunson"],
    strengths: ["Home court advantage", "Defensive identity"],
    weaknesses: ["Offensive consistency", "Star power"],
  },
  OKC: {
    fullName: "Oklahoma City Thunder",
    city: "Oklahoma City",
    founded: 1967,
    championships: 1,
    colors: {
      primary: "from-blue-600 to-orange-500",
      accent: "text-blue-400",
      secondary: "text-orange-400",
    },
    arena: "Paycom Center",
    conference: "Western",
    division: "Northwest",
    rivalries: ["GSW", "HOU", "LAL"],
    historicalAchievements: [
      "1979 NBA Champions (as Seattle)",
      "Durant Era",
      "Westbrook Triple-Doubles",
    ],
    keyPlayers: ["Shai Gilgeous-Alexander", "Josh Giddey"],
    strengths: ["Young talent", "Draft capital"],
    weaknesses: ["Experience", "Veteran leadership"],
  },
  ORL: {
    fullName: "Orlando Magic",
    city: "Orlando",
    founded: 1989,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-blue-400",
      accent: "text-blue-400",
      secondary: "text-blue-300",
    },
    arena: "Amway Center",
    conference: "Eastern",
    division: "Southeast",
    rivalries: ["MIA", "ATL", "CHA"],
    historicalAchievements: [
      "Shaq Era",
      "Dwight Howard Years",
      "Finals Appearances",
    ],
    keyPlayers: ["Paolo Banchero", "Franz Wagner"],
    strengths: ["Young core", "Length"],
    weaknesses: ["Shooting", "Experience"],
  },
  PHI: {
    fullName: "Philadelphia 76ers",
    city: "Philadelphia",
    founded: 1963,
    championships: 3,
    colors: {
      primary: "from-blue-700 to-red-600",
      accent: "text-blue-400",
      secondary: "text-red-400",
    },
    arena: "Wells Fargo Center",
    conference: "Eastern",
    division: "Atlantic",
    rivalries: ["BOS", "NYK", "BRK"],
    historicalAchievements: ["3-time NBA Champions", "Dr. J Era", "AI Legacy"],
    keyPlayers: ["Joel Embiid", "Tyrese Maxey"],
    strengths: ["Elite center", "Playoff experience"],
    weaknesses: ["Health concerns", "Depth"],
  },
  PHX: {
    fullName: "Phoenix Suns",
    city: "Phoenix",
    founded: 1968,
    championships: 0,
    colors: {
      primary: "from-orange-600 to-purple-600",
      accent: "text-orange-400",
      secondary: "text-purple-400",
    },
    arena: "Footprint Center",
    conference: "Western",
    division: "Pacific",
    rivalries: ["LAL", "SAS", "GSW"],
    historicalAchievements: ["Nash MVPs", "Barkley Era", "2021 Finals"],
    keyPlayers: ["Devin Booker", "Kevin Durant"],
    strengths: ["Veteran experience", "Offensive firepower"],
    weaknesses: ["Age concerns", "Depth"],
  },
  POR: {
    fullName: "Portland Trail Blazers",
    city: "Portland",
    founded: 1970,
    championships: 1,
    colors: {
      primary: "from-red-600 to-red-400",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "Moda Center",
    conference: "Western",
    division: "Northwest",
    rivalries: ["LAL", "SEA", "GSW"],
    historicalAchievements: ["1977 NBA Champions", "Drexler Era", "Dame Time"],
    keyPlayers: ["Damian Lillard", "Anfernee Simons"],
    strengths: ["Three-point shooting", "Loyalty"],
    weaknesses: ["Defense", "Frontcourt"],
  },
  SAC: {
    fullName: "Sacramento Kings",
    city: "Sacramento",
    founded: 1945,
    championships: 1,
    colors: {
      primary: "from-purple-600 to-purple-400",
      accent: "text-purple-400",
      secondary: "text-purple-300",
    },
    arena: "Golden 1 Center",
    conference: "Western",
    division: "Pacific",
    rivalries: ["LAL", "GSW", "LAC"],
    historicalAchievements: [
      "1951 NBA Champions (as Rochester)",
      "C-Webb Era",
      "Playoff Drought Ended",
    ],
    keyPlayers: ["De'Aaron Fox", "Domantas Sabonis"],
    strengths: ["Fast pace", "Team chemistry"],
    weaknesses: ["Defense", "Playoff experience"],
  },
  SAS: {
    fullName: "San Antonio Spurs",
    city: "San Antonio",
    founded: 1967,
    championships: 5,
    colors: {
      primary: "from-gray-700 to-gray-500",
      accent: "text-gray-400",
      secondary: "text-gray-300",
    },
    arena: "Frost Bank Center",
    conference: "Western",
    division: "Southwest",
    rivalries: ["DAL", "HOU", "LAL"],
    historicalAchievements: [
      "5-time NBA Champions",
      "Popovich Era",
      "Duncan Dynasty",
    ],
    keyPlayers: ["Victor Wembanyama", "Devin Vassell"],
    strengths: ["Coaching", "Development"],
    weaknesses: ["Youth", "Talent level"],
  },
  TOR: {
    fullName: "Toronto Raptors",
    city: "Toronto",
    founded: 1995,
    championships: 1,
    colors: {
      primary: "from-red-600 to-red-400",
      accent: "text-red-400",
      secondary: "text-red-300",
    },
    arena: "Scotiabank Arena",
    conference: "Eastern",
    division: "Atlantic",
    rivalries: ["BOS", "PHI", "MIL"],
    historicalAchievements: [
      "2019 NBA Champions",
      "DeMar Era",
      "Kawhi Finals MVP",
    ],
    keyPlayers: ["Scottie Barnes", "Pascal Siakam"],
    strengths: ["Length", "Development"],
    weaknesses: ["Offensive creation", "Star power"],
  },
  UTA: {
    fullName: "Utah Jazz",
    city: "Utah", //this was done for naming purposes, as the team is known as "Utah Jazz"
    founded: 1974,
    championships: 0,
    colors: {
      primary: "from-blue-600 to-yellow-400",
      accent: "text-blue-400",
      secondary: "text-yellow-400",
    },
    arena: "Delta Center",
    conference: "Western",
    division: "Northwest",
    rivalries: ["LAL", "HOU", "DEN"],
    historicalAchievements: [
      "Stockton-Malone Era",
      "2x Finals Appearances",
      "Mitchell Era",
    ],
    keyPlayers: ["Lauri Markkanen", "Walker Kessler"],
    strengths: ["Shooting", "Team play"],
    weaknesses: ["Star power", "Athleticism"],
  },
  WAS: {
    fullName: "Washington Wizards",
    city: "Washington",
    founded: 1961,
    championships: 1,
    colors: {
      primary: "from-blue-700 to-red-600",
      accent: "text-blue-400",
      secondary: "text-red-400",
    },
    arena: "Capital One Arena",
    conference: "Eastern",
    division: "Southeast",
    rivalries: ["CHI", "CLE", "ATL"],
    historicalAchievements: [
      "1978 NBA Champions",
      "Unseld Era",
      "Wall-Beal Years",
    ],
    keyPlayers: ["Bradley Beal", "Kyle Kuzma"],
    strengths: ["Veteran presence", "Scoring ability"],
    weaknesses: ["Defense", "Consistency"],
  },
};

// Mapping from team abbreviations to team IDs for logo URLs
export const TEAM_ABBR_TO_ID = {
  ATL: 1610612737,
  BOS: 1610612738,
  BRK: 1610612751,
  CHA: 1610612766,
  CHI: 1610612741,
  CLE: 1610612739,
  DAL: 1610612742,
  DEN: 1610612743,
  DET: 1610612765,
  GSW: 1610612744,
  HOU: 1610612745,
  IND: 1610612754,
  LAC: 1610612746,
  LAL: 1610612747,
  MEM: 1610612763,
  MIA: 1610612748,
  MIL: 1610612749,
  MIN: 1610612750,
  NOP: 1610612740,
  NYK: 1610612752,
  OKC: 1610612760,
  ORL: 1610612753,
  PHI: 1610612755,
  PHX: 1610612756,
  POR: 1610612757,
  SAC: 1610612758,
  SAS: 1610612759,
  TOR: 1610612761,
  UTA: 1610612762,
  WAS: 1610612764,
};

// Simple static color generation (no caching needed)
export const generateTeamColors = (teamAbbr) => {
  // Return simple default colors for all teams
  return {
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  };
};

// Simple static message generation - no random data
export const generateTeamMessage = (teamData) => {
  return "";
};

// Simple static team fact generation - no random data
export const generateTeamFact = (teamAbbr) => {
  return "";
};

// Simple static prediction confidence - no random data
export const calculatePredictionConfidence = (teamData) => {
  return 75; // Fixed confidence value
};

// Generate static upcoming games - no random data
export const generateUpcomingGames = (teamData) => {
  if (!teamData?.basic_info?.abbreviation) {
    return [
      {
        date: "JUN 15",
        opp: "LAL",
        time: "8:00 PM",
        home: true,
        difficulty: "MEDIUM",
        prediction: "N/A",
        importance: "MEDIUM",
      },
      {
        date: "JUN 18",
        opp: "BOS",
        time: "7:30 PM",
        home: false,
        difficulty: "HARD",
        prediction: "N/A",
        importance: "HIGH",
      },
      {
        date: "JUN 21",
        opp: "GSW",
        time: "9:00 PM",
        home: true,
        difficulty: "HARD",
        prediction: "N/A",
        importance: "HIGH",
      },
    ];
  }

  const teamAbbr = teamData.basic_info.abbreviation;
  const team = NBA_TEAMS[teamAbbr];

  // Get team's rivals for static opponents
  const rivals = team?.rivalries || ["LAL", "BOS", "GSW"];
  const opponents = rivals.slice(0, 3);

  const games = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const gameDate = new Date(today);
    gameDate.setDate(today.getDate() + (i + 1) * 3); // Every 3 days - static spacing

    const opponent = opponents[i % opponents.length];
    const opponentData = NBA_TEAMS[opponent];
    const isHome = i % 2 === 0; // Alternate home/away - static pattern

    // Determine difficulty based on opponent strength
    let difficulty = "MEDIUM";
    if (opponentData?.championships >= 3) difficulty = "HARD";
    else if (opponentData?.championships === 0) difficulty = "EASY";

    // No random predictions - use static placeholder
    const prediction = "N/A";

    // Importance based on rivalry - no random factor
    const importance = rivals.includes(opponent) ? "HIGH" : "MEDIUM";

    // Static game time based on position
    const times = ["7:00 PM", "7:30 PM", "8:00 PM"];
    const time = times[i % times.length];

    games.push({
      date: gameDate
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase(),
      opp: opponent,
      time: time,
      home: isHome,
      difficulty: difficulty,
      prediction: prediction,
      importance: importance,
    });
  }

  return games;
};

// Generate next matchup analysis with dynamic opponent data
export const generateNextMatchup = (teamData) => {
  if (!teamData?.basic_info?.abbreviation) {
    return {
      opponent: "BOS",
      opponentData: NBA_TEAMS["BOS"],
      isHome: true,
      date: "JUN 12",
      time: "8:00 PM",
      seasonSeries: "1-1",
      lastMeeting: "W 108-102",
      homeRecord: "23-8",
      keyFactors: [
        {
          factor: "PACE_ADVANTAGE",
          team: "TEAM",
          description: "Faster tempo should favor home team",
        },
        {
          factor: "3PT_DEFENSE",
          team: "OPPONENT",
          description: "BOS allows fewer 3-pointers",
        },
        {
          factor: "REST_ADVANTAGE",
          team: "TEAM",
          description: "2 days rest vs 1 day",
        },
      ],
      prediction: "TEAM 112 - 108 BOS",
      confidence: 75,
    };
  }

  const teamAbbr = teamData.basic_info.abbreviation;
  const team = NBA_TEAMS[teamAbbr];
  const upcomingGames = generateUpcomingGames(teamData);
  const nextGame = upcomingGames[0];

  if (!nextGame) {
    return generateNextMatchup(null); // Fallback
  }

  const opponent = nextGame.opp;
  const opponentData = NBA_TEAMS[opponent];

  // No random data generation - return static placeholders
  const seasonSeries = "N/A";
  const lastMeeting = "N/A";
  const homeRecord = "N/A";

  // Generate dynamic key factors based on team strengths
  const keyFactors = [];

  // Pace factor
  if (team?.strengths?.includes("Fast pace")) {
    keyFactors.push({
      factor: "PACE_ADVANTAGE",
      team: "TEAM",
      description: `${teamAbbr} plays at faster tempo`,
    });
  } else {
    keyFactors.push({
      factor: "PACE_CONTROL",
      team: "OPPONENT",
      description: `${opponent} controls game tempo`,
    });
  }

  // Defense factor based on opponent strengths
  if (
    opponentData?.strengths?.includes("Defense") ||
    opponentData?.strengths?.includes("Three-point defense")
  ) {
    keyFactors.push({
      factor: "3PT_DEFENSE",
      team: "OPPONENT",
      description: `${opponent} strong perimeter defense`,
    });
  } else if (team?.strengths?.includes("Three-point shooting")) {
    keyFactors.push({
      factor: "3PT_SHOOTING",
      team: "TEAM",
      description: `${teamAbbr} excellent from beyond arc`,
    });
  } else {
    keyFactors.push({
      factor: "DEFENSIVE_MATCHUP",
      team: "TEAM",
      description: "Interior defense will be key",
    });
  }

  // Rest/experience factor
  if (team?.championships > opponentData?.championships) {
    keyFactors.push({
      factor: "EXPERIENCE",
      team: "TEAM",
      description: `${teamAbbr} has championship experience`,
    });
  } else if (nextGame.home) {
    keyFactors.push({
      factor: "HOME_ADVANTAGE",
      team: "TEAM",
      description: "Home crowd energy advantage",
    });
  } else {
    keyFactors.push({
      factor: "REST_ADVANTAGE",
      team: "TEAM",
      description: "2 days rest vs back-to-back",
    });
  }

  // No random prediction scores - use static placeholders
  const prediction = `${teamAbbr} vs ${opponent}`;

  // Fixed confidence - no random calculation
  let confidence = 75;
  if (nextGame.difficulty === "EASY") confidence += 10;
  else if (nextGame.difficulty === "HARD") confidence -= 10;
  confidence = Math.min(95, Math.max(55, confidence));

  return {
    opponent,
    opponentData,
    isHome: nextGame.home,
    date: nextGame.date,
    time: nextGame.time,
    seasonSeries,
    lastMeeting,
    homeRecord,
    keyFactors,
    prediction,
    confidence,
  };
};

// Simple performance analysis
export const generatePerformanceAnalysis = (teamData) => {
  return {
    strengths: ["Team chemistry", "Work ethic"],
    weaknesses: ["Consistency", "Depth"],
    outlook: "Developing team",
    keyFactor: "Team leadership",
  };
};

// Image preloading optimization
const imageCache = new Map();
const preloadQueue = new Set();

export const preloadTeamLogo = (teamId) => {
  const logoUrl = `https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`;

  if (imageCache.has(logoUrl) || preloadQueue.has(logoUrl)) {
    return Promise.resolve();
  }

  preloadQueue.add(logoUrl);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(logoUrl, true);
      preloadQueue.delete(logoUrl);
      resolve();
    };
    img.onerror = () => {
      preloadQueue.delete(logoUrl);
      resolve(); // Don't fail on image errors
    };
    img.src = logoUrl;
  });
};

// Preload logos for commonly accessed teams
export const preloadCommonLogos = () => {
  const popularTeams = [
    1610612747, // LAL
    1610612738, // BOS
    1610612744, // GSW
    1610612752, // NYK
    1610612748, // MIA
    1610612749, // MIL
    1610612743, // DEN
  ];

  popularTeams.forEach((teamId, index) => {
    setTimeout(() => preloadTeamLogo(teamId), index * 100);
  });
};

export default NBA_TEAMS;
