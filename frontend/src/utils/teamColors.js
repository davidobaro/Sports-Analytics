// NBA Team Colors Utility
export const NBA_TEAM_COLORS = {
  // Atlantic Division
  1610612738: {
    // Boston Celtics
    primary: "#007A33",
    secondary: "#BA9653",
    gradient: "from-green-600 to-green-800",
    accent: "text-green-400",
  },
  1610612751: {
    // Brooklyn Nets
    primary: "#000000",
    secondary: "#FFFFFF",
    gradient: "from-gray-900 to-black",
    accent: "text-gray-300",
  },
  1610612752: {
    // New York Knicks
    primary: "#006BB6",
    secondary: "#F58426",
    gradient: "from-blue-600 to-orange-500",
    accent: "text-blue-400",
  },
  1610612755: {
    // Philadelphia 76ers
    primary: "#006BB6",
    secondary: "#ED174C",
    gradient: "from-blue-600 to-red-600",
    accent: "text-blue-400",
  },
  1610612761: {
    // Toronto Raptors
    primary: "#CE1141",
    secondary: "#000000",
    gradient: "from-red-600 to-black",
    accent: "text-red-400",
  },

  // Central Division
  1610612741: {
    // Chicago Bulls
    primary: "#CE1141",
    secondary: "#000000",
    gradient: "from-red-600 to-black",
    accent: "text-red-400",
  },
  1610612739: {
    // Cleveland Cavaliers
    primary: "#860038",
    secondary: "#FDBB30",
    gradient: "from-red-800 to-yellow-500",
    accent: "text-red-400",
  },
  1610612765: {
    // Detroit Pistons
    primary: "#C8102E",
    secondary: "#006BB6",
    gradient: "from-red-600 to-blue-600",
    accent: "text-red-400",
  },
  1610612754: {
    // Indiana Pacers
    primary: "#002D62",
    secondary: "#FDBB30",
    gradient: "from-blue-900 to-yellow-500",
    accent: "text-blue-400",
  },
  1610612749: {
    // Milwaukee Bucks
    primary: "#00471B",
    secondary: "#EEE1C6",
    gradient: "from-green-800 to-green-600",
    accent: "text-green-400",
  },

  // Southeast Division
  1610612737: {
    // Atlanta Hawks
    primary: "#E03A3E",
    secondary: "#C1D32F",
    gradient: "from-red-500 to-lime-500",
    accent: "text-red-400",
  },
  1610612766: {
    // Charlotte Hornets
    primary: "#1D1160",
    secondary: "#00788C",
    gradient: "from-purple-800 to-teal-600",
    accent: "text-purple-400",
  },
  1610612748: {
    // Miami Heat
    primary: "#98002E",
    secondary: "#F9A01B",
    gradient: "from-red-800 to-orange-500",
    accent: "text-red-400",
  },
  1610612753: {
    // Orlando Magic
    primary: "#0077C0",
    secondary: "#C4CED4",
    gradient: "from-blue-600 to-gray-400",
    accent: "text-blue-400",
  },
  1610612764: {
    // Washington Wizards
    primary: "#002B5C",
    secondary: "#E31837",
    gradient: "from-blue-900 to-red-600",
    accent: "text-blue-400",
  },

  // Northwest Division
  1610612743: {
    // Denver Nuggets
    primary: "#0E2240",
    secondary: "#FEC524",
    gradient: "from-blue-900 to-yellow-500",
    accent: "text-blue-400",
  },
  1610612750: {
    // Minnesota Timberwolves
    primary: "#0C2340",
    secondary: "#236192",
    gradient: "from-blue-900 to-blue-600",
    accent: "text-blue-400",
  },
  1610612760: {
    // Oklahoma City Thunder
    primary: "#007AC1",
    secondary: "#EF3B24",
    gradient: "from-blue-600 to-orange-600",
    accent: "text-blue-400",
  },
  1610612757: {
    // Portland Trail Blazers
    primary: "#E03A3E",
    secondary: "#000000",
    gradient: "from-red-600 to-black",
    accent: "text-red-400",
  },
  1610612762: {
    // Utah Jazz
    primary: "#002B5C",
    secondary: "#F9A01B",
    gradient: "from-blue-900 to-orange-500",
    accent: "text-blue-400",
  },

  // Pacific Division
  1610612744: {
    // Golden State Warriors
    primary: "#1D428A",
    secondary: "#FFC72C",
    gradient: "from-blue-700 to-yellow-500",
    accent: "text-blue-400",
  },
  1610612746: {
    // Los Angeles Clippers
    primary: "#C8102E",
    secondary: "#1D428A",
    gradient: "from-red-600 to-blue-700",
    accent: "text-red-400",
  },
  1610612747: {
    // Los Angeles Lakers
    primary: "#552583",
    secondary: "#FDB927",
    gradient: "from-purple-700 to-yellow-500",
    accent: "text-purple-400",
  },
  1610612756: {
    // Phoenix Suns
    primary: "#E56020",
    secondary: "#1D1160",
    gradient: "from-orange-600 to-purple-800",
    accent: "text-orange-400",
  },
  1610612758: {
    // Sacramento Kings
    primary: "#5A2D81",
    secondary: "#63727A",
    gradient: "from-purple-700 to-gray-600",
    accent: "text-purple-400",
  },

  // Southwest Division
  1610612742: {
    // Dallas Mavericks
    primary: "#00538C",
    secondary: "#002F5F",
    gradient: "from-blue-700 to-blue-900",
    accent: "text-blue-400",
  },
  1610612745: {
    // Houston Rockets
    primary: "#CE1141",
    secondary: "#000000",
    gradient: "from-red-600 to-black",
    accent: "text-red-400",
  },
  1610612763: {
    // Memphis Grizzlies
    primary: "#5D76A9",
    secondary: "#12173F",
    gradient: "from-blue-600 to-blue-900",
    accent: "text-blue-400",
  },
  1610612740: {
    // New Orleans Pelicans
    primary: "#0C2340",
    secondary: "#C8102E",
    gradient: "from-blue-900 to-red-600",
    accent: "text-blue-400",
  },
  1610612759: {
    // San Antonio Spurs
    primary: "#C4CED4",
    secondary: "#000000",
    gradient: "from-gray-400 to-black",
    accent: "text-gray-300",
  },
};

// Helper function to get team colors
export const getTeamColors = (teamId) => {
  const colors = NBA_TEAM_COLORS[teamId];
  if (!colors) {
    // Default colors for unknown teams
    return {
      primary: "#374151",
      secondary: "#6B7280",
      gradient: "from-gray-600 to-gray-700",
      accent: "text-cyan-400",
    };
  }
  return colors;
};

// Helper function to get team gradient class
export const getTeamGradient = (teamId) => {
  const colors = getTeamColors(teamId);
  return colors.gradient;
};

// Helper function to get team accent class
export const getTeamAccent = (teamId) => {
  const colors = getTeamColors(teamId);
  return colors.accent;
};
