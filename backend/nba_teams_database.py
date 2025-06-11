# Complete NBA Teams Database for Backend Automatic Generation
# This file contains comprehensive data for all 30 NBA teams

NBA_TEAMS_DATA = {
    # Eastern Conference - Atlantic Division
    1610612738: {  # Boston Celtics
        "basic_info": {"id": 1610612738, "full_name": "Boston Celtics", "abbreviation": "BOS", "city": "Boston", "nickname": "Celtics"},
        "performance_tier": "championship", "championships": 17, "conference": "Eastern", "division": "Atlantic",
        "rivalries": [1610612747, 1610612752, 1610612755],  # LAL, NYK, PHI
        "strengths": ["Championship experience", "Two-way play"], "weaknesses": ["Depth concerns", "Interior presence"]
    },
    1610612751: {  # Brooklyn Nets
        "basic_info": {"id": 1610612751, "full_name": "Brooklyn Nets", "abbreviation": "BRK", "city": "Brooklyn", "nickname": "Nets"},
        "performance_tier": "developing", "championships": 0, "conference": "Eastern", "division": "Atlantic",
        "rivalries": [1610612752, 1610612738, 1610612755],  # NYK, BOS, PHI
        "strengths": ["Young talent", "Modern facility"], "weaknesses": ["Rebuilding phase", "Chemistry building"]
    },
    1610612752: {  # New York Knicks
        "basic_info": {"id": 1610612752, "full_name": "New York Knicks", "abbreviation": "NYK", "city": "New York", "nickname": "Knicks"},
        "performance_tier": "playoff", "championships": 2, "conference": "Eastern", "division": "Atlantic",
        "rivalries": [1610612738, 1610612751, 1610612748],  # BOS, BRK, MIA
        "strengths": ["Home court advantage", "Defensive identity"], "weaknesses": ["Offensive consistency", "Star power"]
    },
    1610612755: {  # Philadelphia 76ers
        "basic_info": {"id": 1610612755, "full_name": "Philadelphia 76ers", "abbreviation": "PHI", "city": "Philadelphia", "nickname": "76ers"},
        "performance_tier": "playoff", "championships": 3, "conference": "Eastern", "division": "Atlantic",
        "rivalries": [1610612738, 1610612752, 1610612751],  # BOS, NYK, BRK
        "strengths": ["Elite center", "Playoff experience"], "weaknesses": ["Health concerns", "Depth"]
    },
    1610612761: {  # Toronto Raptors
        "basic_info": {"id": 1610612761, "full_name": "Toronto Raptors", "abbreviation": "TOR", "city": "Toronto", "nickname": "Raptors"},
        "performance_tier": "developing", "championships": 1, "conference": "Eastern", "division": "Atlantic",
        "rivalries": [1610612738, 1610612755, 1610612749],  # BOS, PHI, MIL
        "strengths": ["Length", "Development"], "weaknesses": ["Offensive creation", "Star power"]
    },

    # Eastern Conference - Central Division
    1610612741: {  # Chicago Bulls
        "basic_info": {"id": 1610612741, "full_name": "Chicago Bulls", "abbreviation": "CHI", "city": "Chicago", "nickname": "Bulls"},
        "performance_tier": "developing", "championships": 6, "conference": "Eastern", "division": "Central",
        "rivalries": [1610612765, 1610612752, 1610612748],  # DET, NYK, MIA
        "strengths": ["Scoring ability", "Veteran leadership"], "weaknesses": ["Three-point shooting", "Defensive rebounding"]
    },
    1610612739: {  # Cleveland Cavaliers
        "basic_info": {"id": 1610612739, "full_name": "Cleveland Cavaliers", "abbreviation": "CLE", "city": "Cleveland", "nickname": "Cavaliers"},
        "performance_tier": "playoff", "championships": 1, "conference": "Eastern", "division": "Central",
        "rivalries": [1610612744, 1610612738, 1610612765],  # GSW, BOS, DET
        "strengths": ["Backcourt scoring", "Young core"], "weaknesses": ["Frontcourt depth", "Playoff experience"]
    },
    1610612765: {  # Detroit Pistons
        "basic_info": {"id": 1610612765, "full_name": "Detroit Pistons", "abbreviation": "DET", "city": "Detroit", "nickname": "Pistons"},
        "performance_tier": "rebuilding", "championships": 3, "conference": "Eastern", "division": "Central",
        "rivalries": [1610612741, 1610612754, 1610612739],  # CHI, IND, CLE
        "strengths": ["Young talent", "Rebuild potential"], "weaknesses": ["Experience", "Shooting consistency"]
    },
    1610612754: {  # Indiana Pacers
        "basic_info": {"id": 1610612754, "full_name": "Indiana Pacers", "abbreviation": "IND", "city": "Indianapolis", "nickname": "Pacers"},
        "performance_tier": "playoff", "championships": 0, "conference": "Eastern", "division": "Central",
        "rivalries": [1610612765, 1610612741, 1610612748],  # DET, CHI, MIA
        "strengths": ["Balanced roster", "Team chemistry"], "weaknesses": ["Star power", "Playoff experience"]
    },
    1610612749: {  # Milwaukee Bucks
        "basic_info": {"id": 1610612749, "full_name": "Milwaukee Bucks", "abbreviation": "MIL", "city": "Milwaukee", "nickname": "Bucks"},
        "performance_tier": "elite", "championships": 2, "conference": "Eastern", "division": "Central",
        "rivalries": [1610612741, 1610612738, 1610612748],  # CHI, BOS, MIA
        "strengths": ["MVP talent", "Length"], "weaknesses": ["Playoff consistency", "Bench scoring"]
    },

    # Eastern Conference - Southeast Division
    1610612737: {  # Atlanta Hawks
        "basic_info": {"id": 1610612737, "full_name": "Atlanta Hawks", "abbreviation": "ATL", "city": "Atlanta", "nickname": "Hawks"},
        "performance_tier": "developing", "championships": 1, "conference": "Eastern", "division": "Southeast",
        "rivalries": [1610612738, 1610612748, 1610612741],  # BOS, MIA, CHI
        "strengths": ["Young core", "High-scoring offense"], "weaknesses": ["Defensive consistency", "Rebounding"]
    },
    1610612766: {  # Charlotte Hornets
        "basic_info": {"id": 1610612766, "full_name": "Charlotte Hornets", "abbreviation": "CHA", "city": "Charlotte", "nickname": "Hornets"},
        "performance_tier": "developing", "championships": 0, "conference": "Eastern", "division": "Southeast",
        "rivalries": [1610612737, 1610612748, 1610612764],  # ATL, MIA, WAS
        "strengths": ["Athletic wings", "Fast-paced offense"], "weaknesses": ["Defensive identity", "Veteran leadership"]
    },
    1610612748: {  # Miami Heat
        "basic_info": {"id": 1610612748, "full_name": "Miami Heat", "abbreviation": "MIA", "city": "Miami", "nickname": "Heat"},
        "performance_tier": "playoff", "championships": 3, "conference": "Eastern", "division": "Southeast",
        "rivalries": [1610612738, 1610612752, 1610612741],  # BOS, NYK, CHI
        "strengths": ["Culture", "Playoff experience"], "weaknesses": ["Offensive consistency", "Aging stars"]
    },
    1610612753: {  # Orlando Magic
        "basic_info": {"id": 1610612753, "full_name": "Orlando Magic", "abbreviation": "ORL", "city": "Orlando", "nickname": "Magic"},
        "performance_tier": "developing", "championships": 0, "conference": "Eastern", "division": "Southeast",
        "rivalries": [1610612748, 1610612737, 1610612766],  # MIA, ATL, CHA
        "strengths": ["Young core", "Length"], "weaknesses": ["Shooting", "Experience"]
    },
    1610612764: {  # Washington Wizards
        "basic_info": {"id": 1610612764, "full_name": "Washington Wizards", "abbreviation": "WAS", "city": "Washington", "nickname": "Wizards"},
        "performance_tier": "rebuilding", "championships": 1, "conference": "Eastern", "division": "Southeast",
        "rivalries": [1610612741, 1610612739, 1610612737],  # CHI, CLE, ATL
        "strengths": ["Veteran presence", "Scoring ability"], "weaknesses": ["Defense", "Consistency"]
    },

    # Western Conference - Northwest Division
    1610612743: {  # Denver Nuggets
        "basic_info": {"id": 1610612743, "full_name": "Denver Nuggets", "abbreviation": "DEN", "city": "Denver", "nickname": "Nuggets"},
        "performance_tier": "championship", "championships": 1, "conference": "Western", "division": "Northwest",
        "rivalries": [1610612747, 1610612744, 1610612762],  # LAL, GSW, UTA
        "strengths": ["Championship experience", "Elite center play"], "weaknesses": ["Perimeter defense", "Depth concerns"]
    },
    1610612750: {  # Minnesota Timberwolves
        "basic_info": {"id": 1610612750, "full_name": "Minnesota Timberwolves", "abbreviation": "MIN", "city": "Minneapolis", "nickname": "Timberwolves"},
        "performance_tier": "developing", "championships": 0, "conference": "Western", "division": "Northwest",
        "rivalries": [1610612743, 1610612762, 1610612757],  # DEN, UTA, POR
        "strengths": ["Young athleticism", "Offensive potential"], "weaknesses": ["Defensive consistency", "Experience"]
    },
    1610612760: {  # Oklahoma City Thunder
        "basic_info": {"id": 1610612760, "full_name": "Oklahoma City Thunder", "abbreviation": "OKC", "city": "Oklahoma City", "nickname": "Thunder"},
        "performance_tier": "developing", "championships": 1, "conference": "Western", "division": "Northwest",
        "rivalries": [1610612744, 1610612745, 1610612747],  # GSW, HOU, LAL
        "strengths": ["Young talent", "Draft capital"], "weaknesses": ["Experience", "Veteran leadership"]
    },
    1610612757: {  # Portland Trail Blazers
        "basic_info": {"id": 1610612757, "full_name": "Portland Trail Blazers", "abbreviation": "POR", "city": "Portland", "nickname": "Trail Blazers"},
        "performance_tier": "rebuilding", "championships": 1, "conference": "Western", "division": "Northwest",
        "rivalries": [1610612747, 1610612744],  # LAL, GSW
        "strengths": ["Three-point shooting", "Loyalty"], "weaknesses": ["Defense", "Frontcourt"]
    },
    1610612762: {  # Utah Jazz
        "basic_info": {"id": 1610612762, "full_name": "Utah Jazz", "abbreviation": "UTA", "city": "Salt Lake City", "nickname": "Jazz"},
        "performance_tier": "rebuilding", "championships": 0, "conference": "Western", "division": "Northwest",
        "rivalries": [1610612747, 1610612745, 1610612743],  # LAL, HOU, DEN
        "strengths": ["Shooting", "Team play"], "weaknesses": ["Star power", "Athleticism"]
    },

    # Western Conference - Pacific Division
    1610612744: {  # Golden State Warriors
        "basic_info": {"id": 1610612744, "full_name": "Golden State Warriors", "abbreviation": "GSW", "city": "Golden State", "nickname": "Warriors"},
        "performance_tier": "elite", "championships": 7, "conference": "Western", "division": "Pacific",
        "rivalries": [1610612747, 1610612739, 1610612746],  # LAL, CLE, LAC
        "strengths": ["Three-point shooting", "Championship DNA"], "weaknesses": ["Aging core", "Bench depth"]
    },
    1610612746: {  # LA Clippers
        "basic_info": {"id": 1610612746, "full_name": "LA Clippers", "abbreviation": "LAC", "city": "Los Angeles", "nickname": "Clippers"},
        "performance_tier": "playoff", "championships": 0, "conference": "Western", "division": "Pacific",
        "rivalries": [1610612747, 1610612744, 1610612756],  # LAL, GSW, PHX
        "strengths": ["Two-way wings", "Depth"], "weaknesses": ["Health concerns", "Chemistry"]
    },
    1610612747: {  # Los Angeles Lakers
        "basic_info": {"id": 1610612747, "full_name": "Los Angeles Lakers", "abbreviation": "LAL", "city": "Los Angeles", "nickname": "Lakers"},
        "performance_tier": "elite", "championships": 17, "conference": "Western", "division": "Pacific",
        "rivalries": [1610612738, 1610612744, 1610612746],  # BOS, GSW, LAC
        "strengths": ["Superstar talent", "Championship experience"], "weaknesses": ["Age concerns", "Depth"]
    },
    1610612756: {  # Phoenix Suns
        "basic_info": {"id": 1610612756, "full_name": "Phoenix Suns", "abbreviation": "PHX", "city": "Phoenix", "nickname": "Suns"},
        "performance_tier": "playoff", "championships": 0, "conference": "Western", "division": "Pacific",
        "rivalries": [1610612747, 1610612759, 1610612744],  # LAL, SAS, GSW
        "strengths": ["Veteran experience", "Offensive firepower"], "weaknesses": ["Age concerns", "Depth"]
    },
    1610612758: {  # Sacramento Kings
        "basic_info": {"id": 1610612758, "full_name": "Sacramento Kings", "abbreviation": "SAC", "city": "Sacramento", "nickname": "Kings"},
        "performance_tier": "developing", "championships": 1, "conference": "Western", "division": "Pacific",
        "rivalries": [1610612747, 1610612744, 1610612746],  # LAL, GSW, LAC
        "strengths": ["Fast pace", "Team chemistry"], "weaknesses": ["Defense", "Playoff experience"]
    },

    # Western Conference - Southwest Division
    1610612742: {  # Dallas Mavericks
        "basic_info": {"id": 1610612742, "full_name": "Dallas Mavericks", "abbreviation": "DAL", "city": "Dallas", "nickname": "Mavericks"},
        "performance_tier": "playoff", "championships": 1, "conference": "Western", "division": "Southwest",
        "rivalries": [1610612759, 1610612745, 1610612748],  # SAS, HOU, MIA
        "strengths": ["Elite playmaking", "Clutch performance"], "weaknesses": ["Defensive consistency", "Frontcourt depth"]
    },
    1610612745: {  # Houston Rockets
        "basic_info": {"id": 1610612745, "full_name": "Houston Rockets", "abbreviation": "HOU", "city": "Houston", "nickname": "Rockets"},
        "performance_tier": "rebuilding", "championships": 2, "conference": "Western", "division": "Southwest",
        "rivalries": [1610612759, 1610612742, 1610612744],  # SAS, DAL, GSW
        "strengths": ["Young core", "Athletic ability"], "weaknesses": ["Experience", "Consistency"]
    },
    1610612763: {  # Memphis Grizzlies
        "basic_info": {"id": 1610612763, "full_name": "Memphis Grizzlies", "abbreviation": "MEM", "city": "Memphis", "nickname": "Grizzlies"},
        "performance_tier": "developing", "championships": 0, "conference": "Western", "division": "Southwest",
        "rivalries": [1610612759, 1610612747, 1610612744],  # SAS, LAL, GSW
        "strengths": ["Athletic youth", "Fast pace"], "weaknesses": ["Three-point shooting", "Experience"]
    },
    1610612740: {  # New Orleans Pelicans
        "basic_info": {"id": 1610612740, "full_name": "New Orleans Pelicans", "abbreviation": "NOP", "city": "New Orleans", "nickname": "Pelicans"},
        "performance_tier": "developing", "championships": 0, "conference": "Western", "division": "Southwest",
        "rivalries": [1610612747, 1610612745, 1610612759],  # LAL, HOU, SAS
        "strengths": ["Athletic frontcourt", "Scoring ability"], "weaknesses": ["Health concerns", "Depth"]
    },
    1610612759: {  # San Antonio Spurs
        "basic_info": {"id": 1610612759, "full_name": "San Antonio Spurs", "abbreviation": "SAS", "city": "San Antonio", "nickname": "Spurs"},
        "performance_tier": "rebuilding", "championships": 5, "conference": "Western", "division": "Southwest",
        "rivalries": [1610612742, 1610612745, 1610612747],  # DAL, HOU, LAL
        "strengths": ["Coaching", "Development"], "weaknesses": ["Youth", "Talent level"]
    }
}

def generate_automatic_team_data(team_id: int):
    """Generate comprehensive team data automatically for all 30 NBA teams"""
    import random
    from datetime import datetime, timedelta
    
    # Get team info from database
    team_info = NBA_TEAMS_DATA.get(team_id)
    if not team_info:
        # Fallback for unknown teams
        return generate_fallback_team_data(team_id)
    
    # Performance tier probabilities for season stats
    performance_stats = {
        "championship": {"win_pct": (0.70, 0.80), "ppg": (115, 125), "opp_ppg": (105, 112), "fg_pct": (0.480, 0.520), "three_pct": (0.370, 0.420)},
        "elite": {"win_pct": (0.60, 0.70), "ppg": (112, 120), "opp_ppg": (108, 115), "fg_pct": (0.460, 0.490), "three_pct": (0.350, 0.380)},
        "playoff": {"win_pct": (0.50, 0.60), "ppg": (108, 116), "opp_ppg": (110, 118), "fg_pct": (0.440, 0.470), "three_pct": (0.330, 0.360)},
        "developing": {"win_pct": (0.40, 0.50), "ppg": (105, 112), "opp_ppg": (112, 120), "fg_pct": (0.420, 0.450), "three_pct": (0.310, 0.340)},
        "rebuilding": {"win_pct": (0.25, 0.40), "ppg": (100, 108), "opp_ppg": (115, 125), "fg_pct": (0.400, 0.430), "three_pct": (0.290, 0.320)}
    }
    
    tier = team_info["performance_tier"]
    stats_range = performance_stats[tier]
    
    # Generate realistic season stats
    games_played = random.randint(60, 70)
    win_pct = random.uniform(*stats_range["win_pct"])
    wins = int(games_played * win_pct)
    losses = games_played - wins
    
    season_stats = {
        "games_played": games_played,
        "wins": wins,
        "losses": losses,
        "avg_points": round(random.uniform(*stats_range["ppg"]), 1),
        "avg_opp_points": round(random.uniform(*stats_range["opp_ppg"]), 1),
        "fg_pct": round(random.uniform(*stats_range["fg_pct"]), 3),
        "three_pt_pct": round(random.uniform(*stats_range["three_pct"]), 3)
    }
    
    # Generate recent form based on performance tier
    recent_form = generate_recent_form_advanced(tier, team_info)
    
    return {
        "basic_info": team_info["basic_info"],
        "season_stats": season_stats,
        "recent_form": recent_form,
        "team_id": team_id,
        "performance_analysis": {
            "tier": tier,
            "strengths": team_info["strengths"],
            "weaknesses": team_info["weaknesses"],
            "championship_count": team_info["championships"],
            "conference": team_info["conference"],
            "division": team_info["division"]
        }
    }

def generate_recent_form_advanced(tier: str, team_info: dict):
    """Generate advanced recent form with rivalry considerations"""
    import random
    from datetime import datetime, timedelta
    
    # Win probabilities by tier
    win_probabilities = {
        "championship": 0.75,
        "elite": 0.65,
        "playoff": 0.55,
        "developing": 0.45,
        "rebuilding": 0.30
    }
    
    win_prob = win_probabilities[tier]
    recent_games = []
    
    # All NBA team abbreviations for realistic opponents
    all_teams = [data["basic_info"]["abbreviation"] for data in NBA_TEAMS_DATA.values()]
    current_team = team_info["basic_info"]["abbreviation"]
    
    # Remove current team from opponents
    opponents = [team for team in all_teams if team != current_team]
    
    for i in range(10):
        date = (datetime.now() - timedelta(days=i*3)).strftime("%Y-%m-%d")
        opponent = random.choice(opponents)
        
        # Higher chance of playing rivals
        if random.random() < 0.3 and team_info.get("rivalries"):
            rival_ids = team_info["rivalries"]
            rival_teams = [NBA_TEAMS_DATA[rid]["basic_info"]["abbreviation"] for rid in rival_ids if rid in NBA_TEAMS_DATA]
            if rival_teams:
                opponent = random.choice(rival_teams)
        
        is_home = random.choice([True, False])
        matchup = f"vs {opponent}" if is_home else f"@ {opponent}"
        
        # Determine win/loss with some variance
        won = random.random() < win_prob
        
        # Generate realistic scores based on team strength
        base_score = {
            "championship": (115, 125),
            "elite": (110, 120),
            "playoff": (105, 115),
            "developing": (100, 110),
            "rebuilding": (95, 105)
        }[tier]
        
        if won:
            team_pts = random.randint(*base_score)
            opp_pts = random.randint(max(90, team_pts-15), team_pts-1)
        else:
            opp_pts = random.randint(*base_score)
            team_pts = random.randint(max(90, opp_pts-15), opp_pts-1)
        
        recent_games.append({
            "GAME_DATE": date,
            "MATCHUP": matchup,
            "WL": "W" if won else "L",
            "PTS": team_pts,
            "OPP_PTS": opp_pts
        })
    
    return recent_games

def generate_fallback_team_data(team_id: int):
    """Generate basic fallback data for unknown team IDs"""
    return {
        "basic_info": {
            "id": team_id,
            "full_name": f"NBA Team {team_id}",
            "abbreviation": "NBA",
            "city": "City",
            "nickname": "Team"
        },
        "season_stats": {
            "games_played": 60,
            "wins": 30,
            "losses": 30,
            "avg_points": 110.0,
            "avg_opp_points": 110.0,
            "fg_pct": 0.450,
            "three_pt_pct": 0.350
        },
        "recent_form": generate_recent_form_advanced("developing", {
            "basic_info": {"abbreviation": "NBA"},
            "rivalries": []
        }),
        "team_id": team_id,
        "performance_analysis": {
            "tier": "developing",
            "strengths": ["Team chemistry", "Work ethic"],
            "weaknesses": ["Consistency", "Experience"],
            "championship_count": 0,
            "conference": "Unknown",
            "division": "Unknown"
        }
    }
