from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import uvicorn
from datetime import datetime, date
import pandas as pd
import numpy as np
from typing import List, Dict, Optional
import json

# Custom JSON encoder for numpy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

def convert_numpy_types(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif pd.isna(obj):
        return None
    return obj

# NBA API imports
from nba_api.stats.endpoints import (
    leaguegamelog, teamgamelog, playergamelog, 
    leaguestandings, scoreboard, teamdetails,
    playerdashboardbyyearoveryear, commonplayerinfo,
    commonteamroster, teamdashboardbygeneralsplits
)
from nba_api.stats.static import teams, players

# Import hardcoded team database
from nba_teams_database import NBA_TEAMS_DATA

# ML imports
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

app = FastAPI(
    title="NBA Analytics & Predictions API",
    description="Interactive NBA Web App with ML-powered predictions",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for caching
teams_cache = None
players_cache = None
ml_models = {}

# Enhanced caching system
from functools import lru_cache
from datetime import datetime, timedelta
import asyncio

# In-memory cache with TTL
class TTLCache:
    def __init__(self, ttl_seconds=300):  # 5 minutes default
        self.cache = {}
        self.ttl = ttl_seconds
    
    def set(self, key, value):
        self.cache[key] = {
            'value': value,
            'timestamp': datetime.now()
        }
    
    def get(self, key):
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() - entry['timestamp'] < timedelta(seconds=self.ttl):
                return entry['value']
            else:
                del self.cache[key]
        return None
    
    def clear_expired(self):
        current_time = datetime.now()
        expired_keys = [
            key for key, entry in self.cache.items()
            if current_time - entry['timestamp'] >= timedelta(seconds=self.ttl)
        ]
        for key in expired_keys:
            del self.cache[key]

# Cache instances
team_cache = TTLCache(ttl_seconds=600)  # 10 minutes for team data
player_cache = TTLCache(ttl_seconds=900)  # 15 minutes for player data
roster_cache = TTLCache(ttl_seconds=1800)  # 30 minutes for roster data

@app.on_event("startup")
async def startup_event():
    """Initialize data and models on startup"""
    global teams_cache, players_cache
    
    # Cache teams and players data
    teams_cache = teams.get_teams()
    players_cache = players.get_players()
    
    print("✅ NBA Analytics API Started Successfully!")
    print(f"📊 Loaded {len(teams_cache)} teams and {len(players_cache)} players")

@app.get("/")
async def root():
    return {
        "message": "NBA Analytics & Predictions API", 
        "version": "1.0.0",
        "description": "Complete NBA analytics platform with real-time data, team rosters, and player statistics",
        "endpoints": {
            "teams": "/api/teams",
            "live_games": "/api/live-games", 
            "standings": "/api/standings",
            "team_details": "/api/team/{team_id}",
            "player_details": "/api/player/{player_id}",
            "player_predictions": "/api/predictions/player/{player_id}",
            "nba_teams": "/api/nba-teams",
            "news": "/api/news"
        },
        "team_api_features": {
            "description": "Comprehensive team information including stats and full roster",
            "data_includes": [
                "Basic team info (name, city, abbreviation)",
                "Season statistics (games, wins, losses, PPG, FG%)",
                "Recent game results (last 10 games)",
                "Complete roster with player details",
                "Performance analysis and team strengths/weaknesses"
            ],
            "roster_details": [
                "Player ID, name, jersey number, position",
                "Height, weight, age, experience",
                "Birth date and school"
            ]
        },
        "player_api_features": {
            "description": "Detailed player information and performance data",
            "data_includes": [
                "Basic player info (name, team, position, physical stats)",
                "Current season statistics (games, PPG, RPG, APG, FG%, 3PT%)",
                "Performance predictions and projections",
                "Player analysis (strengths, areas for improvement)"
            ],
            "stats_calculated": "Per-game averages calculated from season totals"
        },
        "data_sources": {
            "primary": "NBA Official API (nba_api)",
            "fallback": "Mock data when API is rate limited",
            "roster_data": "Real-time NBA roster information",
            "team_stats": "Current season team performance data"
        }
    }

@app.get("/api/teams")
async def get_all_teams():
    """Get all NBA teams using hardcoded team names"""
    try:
        # Use hardcoded team data to ensure correct team names
        teams_list = []
        for team_id, team_data in NBA_TEAMS_DATA.items():
            basic_info = team_data["basic_info"]
            teams_list.append({
                "id": team_id,
                "full_name": basic_info["full_name"],
                "abbreviation": basic_info["abbreviation"], 
                "city": basic_info["city"],
                "nickname": basic_info["nickname"]
            })
        
        # Sort by full name for consistency
        teams_list.sort(key=lambda x: x["full_name"])
        
        return {
            "teams": teams_list,
            "count": len(teams_list)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# SUSPENDED: Live games API endpoint
# @app.get("/api/live-games")
# async def get_live_games():
#     """Get today's NBA games with live scores - SUSPENDED"""
#     # API calls suspended as requested
#     return {
#         "games": [],
#         "date": date.today().strftime("%m/%d/%Y"),
#         "note": "Live games API suspended"
#     }

@app.get("/api/standings")
async def get_league_standings():
    """Get current NBA standings with real NBA API data"""
    try:
        # Get standings from NBA API
        standings_data = leaguestandings.LeagueStandings()
        standings_df = standings_data.get_data_frames()[0]
        
        # Get team info from NBA API static data
        nba_teams = teams.get_teams()
        team_dict = {team['id']: team for team in nba_teams}
        
        # Process standings data
        standings = []
        for _, team in standings_df.iterrows():
            team_id = int(team['TeamID'])
            team_info = team_dict.get(team_id, {})
            
            # Get team city and name from NBA API
            city = team['TeamCity']
            nickname = team['TeamName']
            full_name = f"{city} {nickname}"
            
            # Calculate games behind leader for each conference
            conference = team['Conference']
            games_behind = float(team.get('ConferenceGamesBack', 0)) if team.get('ConferenceGamesBack') is not None else 0.0
            
            standings.append({
                "team_id": team_id,
                "team_name": full_name,
                "abbreviation": team_info.get('abbreviation', nickname[:3].upper()),
                "city": city,
                "nickname": nickname,
                "wins": int(team['WINS']),
                "losses": int(team['LOSSES']),
                "win_pct": round(float(team['WinPCT']), 3),
                "conf_rank": int(team['PlayoffRank']) if team['PlayoffRank'] else 99,
                "division_rank": int(team['DivisionRank']) if team['DivisionRank'] else 99,
                "conference": conference,
                "games_behind": games_behind,
                "last_10": team.get('L10', 'N/A').strip(),
                "streak": team.get('strCurrentStreak', 'N/A').strip()
            })
        
        # Sort by conference and then by wins (descending)
        standings.sort(key=lambda x: (x['conference'], -x['wins']))
        
        # Convert numpy types to native Python types
        standings = convert_numpy_types(standings)
        
        return {"standings": standings}
        
    except Exception as e:
        print(f"Error fetching standings from NBA API: {e}")
        # If NBA API fails, return a message explaining the issue
        return {
            "standings": [],
            "error": "Unable to fetch current standings from NBA API",
            "message": "NBA API may be temporarily unavailable or rate limited. Please try again later.",
            "note": "This endpoint now uses only real NBA API data - no mock data fallback"
        }

@app.get("/api/league-leaders")
async def get_league_leaders(category: str = "PTS"):
    """Get NBA league leaders for different statistical categories"""
    try:
        # Import the league leaders endpoint
        from nba_api.stats.endpoints import leagueleaders
        
        # Validate category parameter
        valid_categories = [
            'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG_PCT', 'FG3_PCT', 
            'FT_PCT', 'MIN', 'FGM', 'FG3M', 'EFF'
        ]
        
        if category not in valid_categories:
            category = 'PTS'  # Default to points if invalid category
        
        # Get league leaders data from NBA API
        leaders_data = leagueleaders.LeagueLeaders(
            stat_category_abbreviation=category,
            season='2024-25',
            season_type_all_star='Regular Season',
            per_mode48='Totals'
        )
        
        # Get the dataframe
        df = leaders_data.get_data_frames()[0]
        
        # Take top 10 players
        top_players = df.head(10)
        
        # Format the data for frontend consumption
        leaders_list = []
        for _, player in top_players.iterrows():
            player_data = {
                "player_id": int(player['PLAYER_ID']),
                "rank": int(player['RANK']),
                "name": player['PLAYER'],
                "team_id": int(player['TEAM_ID']),
                "team": player['TEAM'],
                "games_played": int(player['GP']),
                "minutes": float(player['MIN']),
                "points": float(player['PTS']),
                "rebounds": float(player['REB']),
                "assists": float(player['AST']),
                "steals": float(player['STL']),
                "blocks": float(player['BLK']),
                "field_goal_pct": float(player['FG_PCT']),
                "three_point_pct": float(player['FG3_PCT']) if player['FG3_PCT'] else 0.0,
                "free_throw_pct": float(player['FT_PCT']),
                "efficiency": float(player['EFF']),
                "category_value": float(player[category])  # The specific stat being ranked by
            }
            leaders_list.append(player_data)
        
        # Convert numpy types to native Python types
        leaders_list = convert_numpy_types(leaders_list)
        
        return {
            "category": category,
            "leaders": leaders_list,
            "total_players": len(df),
            "season": "2024-25"
        }
        
    except Exception as e:
        print(f"Error fetching league leaders from NBA API: {e}")
        # Return error message if NBA API fails
        return {
            "category": category,
            "leaders": [],
            "error": "Unable to fetch league leaders from NBA API",
            "message": "NBA API may be temporarily unavailable or rate limited. Please try again later.",
            "note": "This endpoint uses real NBA API data only"
        }

@app.get("/api/team/{team_id}")
async def get_team_details(team_id: int, include_player_stats: bool = False, request: Request = None):
    """Get detailed information for a specific team with hardcoded names but real NBA API stats"""
    
    # 🚀 ENHANCED: Log request received
    print(f"🌐 Backend received request for team {team_id} (include_player_stats={include_player_stats})")
    
    try:
        # Check if client disconnected
        if request and await request.is_disconnected():
            print(f"🔌 Client disconnected for team {team_id} request")
            return
            
        # Get basic team info from our hardcoded database for correct names
        if team_id not in NBA_TEAMS_DATA:
            print(f"❌ Team {team_id} not found in database")
            raise HTTPException(status_code=404, detail="Team not found")
        
        print(f"✅ Found team {team_id} in database, processing...")
        team_info = NBA_TEAMS_DATA[team_id]["basic_info"]
        
        # Initialize team data with hardcoded basic info
        team_data = {
            "basic_info": {
                "id": team_id,
                "full_name": team_info['full_name'],
                "abbreviation": team_info['abbreviation'],
                "city": team_info['city'],
                "nickname": team_info['nickname']
            },
            "team_id": team_id
        }
        
        # Try to add real team stats from NBA API
        try:
            # Check if client disconnected before expensive API call
            if request and await request.is_disconnected():
                print(f"🔌 Client disconnected during team stats fetch for team {team_id}")
                return
                
            team_stats_data = teamdashboardbygeneralsplits.TeamDashboardByGeneralSplits(team_id=team_id)
            team_stats_df = team_stats_data.get_data_frames()[0]
            
            if not team_stats_df.empty:
                team_stats = team_stats_df.iloc[0]
                games_played = int(team_stats['GP']) if pd.notna(team_stats['GP']) else 0
                
                if games_played:  # Only proceed if we have real data
                    enhanced_stats = {
                        "games_played": games_played,
                        "wins": int(team_stats['W']) if pd.notna(team_stats['W']) else None,
                        "losses": int(team_stats['L']) if pd.notna(team_stats['L']) else None,
                        "win_pct": round(float(team_stats['W_PCT']), 3) if pd.notna(team_stats['W_PCT']) else None,
                        
                        # Offensive Stats (Per Game)
                        "offensive_stats": {
                            "avg_points": round(float(team_stats['PTS']) / games_played, 1) if pd.notna(team_stats['PTS']) else None,
                            "fg_made": round(float(team_stats['FGM']) / games_played, 1) if pd.notna(team_stats['FGM']) else None,
                            "fg_attempted": round(float(team_stats['FGA']) / games_played, 1) if pd.notna(team_stats['FGA']) else None,
                            "fg_pct": round(float(team_stats['FG_PCT']), 3) if pd.notna(team_stats['FG_PCT']) else None,
                            "three_pt_made": round(float(team_stats['FG3M']) / games_played, 1) if pd.notna(team_stats['FG3M']) else None,
                            "three_pt_attempted": round(float(team_stats['FG3A']) / games_played, 1) if pd.notna(team_stats['FG3A']) else None,
                            "three_pt_pct": round(float(team_stats['FG3_PCT']), 3) if pd.notna(team_stats['FG3_PCT']) else None,
                            "free_throws_made": round(float(team_stats['FTM']) / games_played, 1) if pd.notna(team_stats['FTM']) else None,
                            "free_throws_attempted": round(float(team_stats['FTA']) / games_played, 1) if pd.notna(team_stats['FTA']) else None,
                            "free_throw_pct": round(float(team_stats['FT_PCT']), 3) if pd.notna(team_stats['FT_PCT']) else None,
                            "assists": round(float(team_stats['AST']) / games_played, 1) if pd.notna(team_stats['AST']) else None,
                            "turnovers": round(float(team_stats['TOV']) / games_played, 1) if pd.notna(team_stats['TOV']) else None,
                            "offensive_rebounds": round(float(team_stats['OREB']) / games_played, 1) if pd.notna(team_stats['OREB']) else None
                        },
                        
                        # Defensive Stats (Per Game)
                        "defensive_stats": {
                            "defensive_rebounds": round(float(team_stats['DREB']) / games_played, 1) if pd.notna(team_stats['DREB']) else None,
                            "total_rebounds": round(float(team_stats['REB']) / games_played, 1) if pd.notna(team_stats['REB']) else None,
                            "steals": round(float(team_stats['STL']) / games_played, 1) if pd.notna(team_stats['STL']) else None,
                            "blocks": round(float(team_stats['BLK']) / games_played, 1) if pd.notna(team_stats['BLK']) else None,
                            "personal_fouls": round(float(team_stats['PF']) / games_played, 1) if pd.notna(team_stats['PF']) else None
                        },
                        
                        # Advanced Stats
                        "advanced_stats": {
                            "plus_minus": round(float(team_stats['PLUS_MINUS']), 1) if pd.notna(team_stats['PLUS_MINUS']) else None,
                            "true_shooting_pct": round(
                                float(team_stats['PTS']) / (2 * (float(team_stats['FGA']) + 0.44 * float(team_stats['FTA']))), 3
                            ) if pd.notna(team_stats['PTS']) and pd.notna(team_stats['FGA']) and pd.notna(team_stats['FTA']) else None,
                            "effective_fg_pct": round(
                                (float(team_stats['FGM']) + 0.5 * float(team_stats['FG3M'])) / float(team_stats['FGA']), 3
                            ) if pd.notna(team_stats['FGM']) and pd.notna(team_stats['FG3M']) and pd.notna(team_stats['FGA']) else None,
                            "assist_to_turnover_ratio": round(
                                float(team_stats['AST']) / float(team_stats['TOV']), 2
                            ) if pd.notna(team_stats['AST']) and pd.notna(team_stats['TOV']) and float(team_stats['TOV']) > 0 else None
                        }
                    }
                    
                    # Convert numpy types and update team data
                    enhanced_stats = convert_numpy_types(enhanced_stats)
                    team_data["season_stats"] = enhanced_stats
                
        except Exception as stats_error:
            print(f"Could not fetch team stats for team {team_id}: {stats_error}")
            team_data["note"] = "NBA API stats temporarily unavailable"
        
        # Try to add real roster data from NBA API
        try:
            # Check if client disconnected before roster API call
            if request and await request.is_disconnected():
                print(f"🔌 Client disconnected during roster fetch for team {team_id}")
                return
                
            roster_data = commonteamroster.CommonTeamRoster(team_id=team_id)
            roster_df = roster_data.get_data_frames()[0]
            
            if not roster_df.empty:
                roster = []
                for _, player in roster_df.iterrows():
                    player_data = {
                        "player_id": int(player['PLAYER_ID']) if pd.notna(player['PLAYER_ID']) else None,
                        "name": str(player['PLAYER']) if pd.notna(player['PLAYER']) else "N/A",
                        "jersey_number": str(player['NUM']) if pd.notna(player['NUM']) else "N/A",
                        "position": str(player['POSITION']) if pd.notna(player['POSITION']) else "N/A",
                        "height": str(player['HEIGHT']) if pd.notna(player['HEIGHT']) else "N/A",
                        "weight": str(player['WEIGHT']) if pd.notna(player['WEIGHT']) else "N/A",
                        "birth_date": str(player['BIRTH_DATE']) if pd.notna(player['BIRTH_DATE']) else "N/A",
                        "age": int(player['AGE']) if pd.notna(player['AGE']) else 0,
                        "experience": str(player['EXP']) if pd.notna(player['EXP']) else "R",
                        "school": str(player['SCHOOL']) if pd.notna(player['SCHOOL']) else "N/A"
                    }
                    
                    # Add player statistics if requested
                    if include_player_stats and player_data["player_id"]:
                        try:
                            # Check if client disconnected before player stats API call
                            if request and await request.is_disconnected():
                                print(f"🔌 Client disconnected during player stats fetch for {player_data['name']}")
                                return
                                
                            player_stats = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
                                player_id=player_data["player_id"]
                            )
                            season_stats = player_stats.get_data_frames()[1]  # ByYearPlayerDashboard
                            
                            if not season_stats.empty:
                                current_season = season_stats.iloc[0]
                                player_data["stats"] = {
                                    "games": int(current_season['GP']) if pd.notna(current_season['GP']) else 0,
                                    "ppg": round(float(current_season['PTS']) / max(int(current_season['GP']), 1), 1) if pd.notna(current_season['PTS']) and pd.notna(current_season['GP']) else 0.0,
                                    "rpg": round(float(current_season['REB']) / max(int(current_season['GP']), 1), 1) if pd.notna(current_season['REB']) and pd.notna(current_season['GP']) else 0.0,
                                    "apg": round(float(current_season['AST']) / max(int(current_season['GP']), 1), 1) if pd.notna(current_season['AST']) and pd.notna(current_season['GP']) else 0.0,
                                    "fg_pct": round(float(current_season['FG_PCT']), 3) if pd.notna(current_season['FG_PCT']) else 0.0,
                                    "three_pt_pct": round(float(current_season['FG3_PCT']), 3) if pd.notna(current_season['FG3_PCT']) else 0.0
                                }
                                print(f"✅ Fetched stats for {player_data['name']}: {player_data['stats']['ppg']} PPG")
                            else:
                                player_data["stats"] = {
                                    "games": 0, "ppg": 0.0, "rpg": 0.0, "apg": 0.0, "fg_pct": 0.0, "three_pt_pct": 0.0
                                }
                        except Exception as player_stats_error:
                            print(f"❌ Could not fetch stats for {player_data['name']} ({player_data['player_id']}): {player_stats_error}")
                            player_data["stats"] = {
                                "games": 0, "ppg": 0.0, "rpg": 0.0, "apg": 0.0, "fg_pct": 0.0, "three_pt_pct": 0.0
                            }
                    
                    roster.append(player_data)
                
                # Convert numpy types and add roster to team data
                roster = convert_numpy_types(roster)
                team_data["roster"] = roster
                team_data["roster_count"] = len(roster)
                
        except Exception as roster_error:
            print(f"Could not fetch roster for team {team_id}: {roster_error}")
            team_data["roster_note"] = "NBA API roster temporarily unavailable"
            team_data["roster"] = []  # Ensure roster exists as empty array
            team_data["roster_count"] = 0
        
        print(f"✅ Successfully processed team {team_id} request")
        return convert_numpy_types(team_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching team data for {team_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching team data")

@app.get("/api/player/{player_id}")
async def get_player_details(player_id: int, request: Request = None):
    """Get detailed information for a specific player"""
    try:
        # Check if client disconnected
        if request and await request.is_disconnected():
            print(f"🔌 Client disconnected for player {player_id} request")
            return
            
        # Get player basic info
        player_info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        player_data = player_info.get_data_frames()[0].iloc[0]
        
        # Check if client disconnected before additional API call
        if request and await request.is_disconnected():
            print(f"🔌 Client disconnected during player stats fetch for player {player_id}")
            return
            
        # Get player season stats
        player_stats = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id
        )
        season_stats = player_stats.get_data_frames()[1]  # ByYearPlayerDashboard
        
        current_season = season_stats.iloc[0] if not season_stats.empty else None
        
        player_details = {
            "basic_info": {
                "player_id": int(player_id),
                "name": f"{player_data['FIRST_NAME']} {player_data['LAST_NAME']}",
                "team": str(player_data['TEAM_NAME']) if pd.notna(player_data['TEAM_NAME']) else "Free Agent",
                "position": str(player_data['POSITION']) if pd.notna(player_data['POSITION']) else "N/A",
                "height": str(player_data['HEIGHT']) if pd.notna(player_data['HEIGHT']) else "N/A",
                "weight": str(player_data['WEIGHT']) if pd.notna(player_data['WEIGHT']) else "N/A",
                "experience": int(player_data['SEASON_EXP']) if pd.notna(player_data['SEASON_EXP']) else 0
            },
            "current_season": {
                "games": int(current_season['GP']) if current_season is not None and pd.notna(current_season['GP']) else 0,
                "ppg": round(float(current_season['PTS']) / max(int(current_season['GP']), 1), 1) if current_season is not None and pd.notna(current_season['PTS']) and pd.notna(current_season['GP']) else 0.0,
                "rpg": round(float(current_season['REB']) / max(int(current_season['GP']), 1), 1) if current_season is not None and pd.notna(current_season['REB']) and pd.notna(current_season['GP']) else 0.0,
                "apg": round(float(current_season['AST']) / max(int(current_season['GP']), 1), 1) if current_season is not None and pd.notna(current_season['AST']) and pd.notna(current_season['GP']) else 0.0,
                "fg_pct": round(float(current_season['FG_PCT']), 3) if current_season is not None and pd.notna(current_season['FG_PCT']) else 0.0,
                "three_pt_pct": round(float(current_season['FG3_PCT']), 3) if current_season is not None and pd.notna(current_season['FG3_PCT']) else 0.0
            }
        }
        
        # Convert numpy types to native Python types
        player_details = convert_numpy_types(player_details)
        
        return player_details
        
    except Exception as e:
        # Return mock player data
        return {
            "basic_info": {
                "player_id": player_id,
                "name": "Sample Player",
                "team": "Sample Team",
                "position": "Guard",
                "height": "6-3",
                "weight": "190",
                "experience": 5
            },
            "current_season": {
                "games": 65,
                "ppg": 22.4,
                "rpg": 5.8,
                "apg": 7.2,
                "fg_pct": 0.458,
                "three_pt_pct": 0.367
            },
            "note": "Using mock data - NBA API may be rate limited"
        }

@app.get("/api/predictions/player/{player_id}")
async def predict_player_stats(player_id: int):
    """Get predictions for player performance based on current season stats"""
    try:
        player_data = await get_player_details(player_id)
        current_stats = player_data["current_season"]
        
        # Use player_id as seed for consistent predictions
        np.random.seed(player_id)
        
        # Calculate predictions based on current stats with realistic variance
        next_game_variance = 0.15  # 15% variance for next game
        season_variance = 0.05     # 5% variance for season projection
        
        # Next game predictions (higher variance)
        points_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * next_game_variance
        rebounds_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * next_game_variance
        assists_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * next_game_variance
        
        # Season projections (lower variance)
        season_points_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * season_variance
        season_rebounds_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * season_variance
        season_assists_multiplier = 1.0 + (np.random.random() - 0.5) * 2 * season_variance
        
        predictions = {
            "next_game": {
                "predicted_points": round(current_stats["ppg"] * points_multiplier, 1),
                "predicted_rebounds": round(current_stats["rpg"] * rebounds_multiplier, 1),
                "predicted_assists": round(current_stats["apg"] * assists_multiplier, 1),
                "confidence": round(0.75 + (current_stats["games"] / 100) * 0.15, 2)  # Higher confidence with more games played
            },
            "season_projection": {
                "projected_ppg": round(current_stats["ppg"] * season_points_multiplier, 1),
                "projected_rpg": round(current_stats["rpg"] * season_rebounds_multiplier, 1),
                "projected_apg": round(current_stats["apg"] * season_assists_multiplier, 1)
            },
            "analysis": {
                "trending": "up" if points_multiplier > 1.05 else "down" if points_multiplier < 0.95 else "stable",
                "key_strengths": [],
                "areas_for_improvement": []
            }
        }
        
        # Add contextual analysis based on stats
        if current_stats["ppg"] > 25:
            predictions["analysis"]["key_strengths"].append("Elite scorer")
        if current_stats["rpg"] > 8:
            predictions["analysis"]["key_strengths"].append("Strong rebounder")
        if current_stats["apg"] > 7:
            predictions["analysis"]["key_strengths"].append("Excellent playmaker")
        if current_stats["fg_pct"] > 0.50:
            predictions["analysis"]["key_strengths"].append("Efficient shooter")
        if current_stats["three_pt_pct"] > 0.35:
            predictions["analysis"]["key_strengths"].append("Good 3-point shooter")
            
        # Areas for improvement
        if current_stats["fg_pct"] < 0.45:
            predictions["analysis"]["areas_for_improvement"].append("Field goal efficiency")
        if current_stats["three_pt_pct"] < 0.30:
            predictions["analysis"]["areas_for_improvement"].append("3-point shooting")
        
        return predictions
        
    except Exception as e:
        # Return mock predictions if API fails
        return {
            "next_game": {
                "predicted_points": 20.5,
                "predicted_rebounds": 5.2,
                "predicted_assists": 4.8,
                "confidence": 0.75
            },
            "season_projection": {
                "projected_ppg": 21.2,
                "projected_rpg": 5.5,
                "projected_apg": 5.1
            },
            "analysis": {
                "trending": "stable",
                "key_strengths": ["Consistent performer"],
                "areas_for_improvement": ["Efficiency"]
            },
            "note": "Using mock predictions - player data may be unavailable"
        }

# SUSPENDED: News API endpoint
# @app.get("/api/news")
# async def get_nba_news():
#     """Get latest NBA news - SUSPENDED"""
#     # API calls suspended as requested
#     return {
#         "articles": [],
#         "note": "News API suspended"
#     }

@app.get("/api/nba-teams")
async def get_nba_teams():
    """Get all 30 NBA teams with their IDs and basic info"""
    try:
        # Get teams from NBA API static data
        nba_teams_static = teams.get_teams()
        
        nba_teams = []
        for team in nba_teams_static:
            nba_teams.append({
                "id": team["id"],
                "full_name": team["full_name"],
                "abbreviation": team["abbreviation"],
                "city": team["city"],
                "nickname": team["nickname"]
            })
        
        # Sort by full name
        nba_teams.sort(key=lambda x: x["full_name"])
        
        # Organize by conference (basic organization)
        eastern_teams = nba_teams[:15]  # First 15 alphabetically (rough approximation)
        western_teams = nba_teams[15:]  # Last 15 alphabetically
        
        return {
            "teams": nba_teams,
            "count": len(nba_teams),
            "eastern_conference": eastern_teams,
            "western_conference": western_teams
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
