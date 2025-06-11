from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime, date
import pandas as pd
import numpy as np
from typing import List, Dict, Optional
import json

# NBA API imports
from nba_api.stats.endpoints import (
    leaguegamelog, teamgamelog, playergamelog, 
    leaguestandings, scoreboard, teamdetails,
    playerdashboardbyyearoveryear, commonplayerinfo
)
from nba_api.stats.static import teams, players

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
        "endpoints": {
            "teams": "/api/teams",
            "live_games": "/api/live-games", 
            "standings": "/api/standings",
            "team_details": "/api/team/{team_id}",
            "player_details": "/api/player/{player_id}",
            "predictions": "/api/predictions"
        }
    }

@app.get("/api/teams")
async def get_all_teams():
    """Get all NBA teams"""
    try:
        if not teams_cache:
            return JSONResponse(
                status_code=500,
                content={"error": "Teams data not loaded"}
            )
        
        return {
            "teams": teams_cache,
            "count": len(teams_cache)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-games")
async def get_live_games():
    """Get today's NBA games with live scores"""
    try:
        today = date.today().strftime("%m/%d/%Y")
        scoreboard_data = scoreboard.Scoreboard(game_date=today)
        
        games = scoreboard_data.get_data_frames()[0]  # GameHeader
        line_score = scoreboard_data.get_data_frames()[1]  # LineScore
        
        live_games = []
        for _, game in games.iterrows():
            game_id = game['GAME_ID']
            
            # Get team scores from line score
            game_scores = line_score[line_score['GAME_ID'] == game_id]
            
            home_team_score = 0
            away_team_score = 0
            
            if not game_scores.empty:
                home_team_score = game_scores[game_scores['TEAM_ID'] == game['HOME_TEAM_ID']]['PTS'].iloc[0] if len(game_scores[game_scores['TEAM_ID'] == game['HOME_TEAM_ID']]) > 0 else 0
                away_team_score = game_scores[game_scores['TEAM_ID'] == game['VISITOR_TEAM_ID']]['PTS'].iloc[0] if len(game_scores[game_scores['TEAM_ID'] == game['VISITOR_TEAM_ID']]) > 0 else 0
            
            live_games.append({
                "game_id": game_id,
                "home_team": game['HOME_TEAM_ID'],
                "away_team": game['VISITOR_TEAM_ID'], 
                "home_score": int(home_team_score) if pd.notna(home_team_score) else 0,
                "away_score": int(away_team_score) if pd.notna(away_team_score) else 0,
                "game_status": game['GAME_STATUS_TEXT'],
                "game_time": game['GAME_DATE_EST']
            })
        
        return {"games": live_games, "date": today}
        
    except Exception as e:
        # Return mock data if API fails
        return {
            "games": [
                {
                    "game_id": 1,
                    "home_team": "Lakers", 
                    "away_team": "Warriors",
                    "home_score": 108,
                    "away_score": 112,
                    "game_status": "Final",
                    "game_time": "2025-06-10T20:00:00"
                },
                {
                    "game_id": 2,
                    "home_team": "Celtics",
                    "away_team": "Heat", 
                    "home_score": 95,
                    "away_score": 89,
                    "game_status": "Q3 8:42",
                    "game_time": "2025-06-10T20:30:00"
                }
            ],
            "date": date.today().strftime("%m/%d/%Y"),
            "note": "Using mock data - NBA API may be rate limited"
        }

@app.get("/api/standings")
async def get_league_standings():
    """Get current NBA standings"""
    try:
        standings_data = leaguestandings.LeagueStandings()
        standings_df = standings_data.get_data_frames()[0]
        
        # Process standings data
        standings = []
        for _, team in standings_df.iterrows():
            standings.append({
                "team_id": team['TeamID'],
                "team_name": team['TeamName'],
                "wins": team['WINS'],
                "losses": team['LOSSES'],
                "win_pct": round(team['WinPCT'], 3),
                "conf_rank": team['ConferenceRank'],
                "division_rank": team['DivisionRank'],
                "conference": team['Conference']
            })
        
        return {"standings": standings}
        
    except Exception as e:
        # Return mock standings data
        return {
            "standings": [
                {"team_id": 1610612738, "team_name": "Boston Celtics", "wins": 45, "losses": 20, "win_pct": 0.692, "conf_rank": 1, "division_rank": 1, "conference": "East"},
                {"team_id": 1610612744, "team_name": "Golden State Warriors", "wins": 42, "losses": 23, "win_pct": 0.646, "conf_rank": 2, "division_rank": 1, "conference": "West"},
                {"team_id": 1610612747, "team_name": "Los Angeles Lakers", "wins": 40, "losses": 25, "win_pct": 0.615, "conf_rank": 3, "division_rank": 2, "conference": "West"},
            ],
            "note": "Using mock data - NBA API may be rate limited"
        }

@app.get("/api/team/{team_id}")
async def get_team_details(team_id: int):
    """Get detailed information for a specific team"""
    try:
        # Get team basic info
        team_info = next((team for team in teams_cache if team['id'] == team_id), None)
        if not team_info:
            raise HTTPException(status_code=404, detail="Team not found")
        
        # Get team game log for current season
        team_games = teamgamelog.TeamGameLog(team_id=team_id, season='2024-25')
        games_df = team_games.get_data_frames()[0]
        
        # Calculate team stats
        recent_games = games_df.head(10)  # Last 10 games
        
        team_stats = {
            "basic_info": team_info,
            "season_stats": {
                "games_played": len(games_df),
                "wins": len(games_df[games_df['WL'] == 'W']),
                "losses": len(games_df[games_df['WL'] == 'L']),
                "avg_points": round(games_df['PTS'].mean(), 1),
                "avg_opp_points": round(games_df['OPP_PTS'].mean(), 1),
                "fg_pct": round(games_df['FG_PCT'].mean(), 3),
                "three_pt_pct": round(games_df['FG3_PCT'].mean(), 3)
            },
            "recent_form": recent_games[['GAME_DATE', 'MATCHUP', 'WL', 'PTS', 'OPP_PTS']].to_dict('records')
        }
        
        return team_stats
        
    except Exception as e:
        # Return mock team data
        return {
            "basic_info": {"id": team_id, "full_name": "Sample Team", "abbreviation": "SAM"},
            "season_stats": {
                "games_played": 65,
                "wins": 42,
                "losses": 23,
                "avg_points": 112.5,
                "avg_opp_points": 108.2,
                "fg_pct": 0.467,
                "three_pt_pct": 0.356
            },
            "recent_form": [
                {"GAME_DATE": "2025-06-09", "MATCHUP": "vs. OPP", "WL": "W", "PTS": 115, "OPP_PTS": 108}
            ],
            "note": "Using mock data - NBA API may be rate limited"
        }

@app.get("/api/player/{player_id}")
async def get_player_details(player_id: int):
    """Get detailed information for a specific player"""
    try:
        # Get player basic info
        player_info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
        player_data = player_info.get_data_frames()[0].iloc[0]
        
        # Get player season stats
        player_stats = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id
        )
        season_stats = player_stats.get_data_frames()[1]  # ByYearPlayerDashboard
        
        current_season = season_stats.iloc[0] if not season_stats.empty else None
        
        player_details = {
            "basic_info": {
                "player_id": player_id,
                "name": f"{player_data['FIRST_NAME']} {player_data['LAST_NAME']}",
                "team": player_data['TEAM_NAME'],
                "position": player_data['POSITION'],
                "height": player_data['HEIGHT'],
                "weight": player_data['WEIGHT'],
                "experience": player_data['SEASON_EXP']
            },
            "current_season": {
                "games": current_season['GP'] if current_season is not None else 0,
                "ppg": round(current_season['PTS'], 1) if current_season is not None else 0,
                "rpg": round(current_season['REB'], 1) if current_season is not None else 0,
                "apg": round(current_season['AST'], 1) if current_season is not None else 0,
                "fg_pct": round(current_season['FG_PCT'], 3) if current_season is not None else 0,
                "three_pt_pct": round(current_season['FG3_PCT'], 3) if current_season is not None else 0
            }
        }
        
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
    """Get ML predictions for player performance"""
    try:
        # This is a simplified ML prediction - in production you'd have trained models
        # For now, we'll return mock predictions based on current averages
        
        player_data = await get_player_details(player_id)
        current_stats = player_data["current_season"]
        
        # Simple prediction logic (add some variance)
        predictions = {
            "next_game": {
                "predicted_points": round(current_stats["ppg"] * np.random.uniform(0.8, 1.2), 1),
                "predicted_rebounds": round(current_stats["rpg"] * np.random.uniform(0.8, 1.2), 1),
                "predicted_assists": round(current_stats["apg"] * np.random.uniform(0.8, 1.2), 1),
                "confidence": round(np.random.uniform(0.7, 0.95), 2)
            },
            "season_projection": {
                "projected_ppg": round(current_stats["ppg"] * np.random.uniform(0.95, 1.05), 1),
                "projected_rpg": round(current_stats["rpg"] * np.random.uniform(0.95, 1.05), 1),
                "projected_apg": round(current_stats["apg"] * np.random.uniform(0.95, 1.05), 1)
            }
        }
        
        return predictions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news")
async def get_nba_news():
    """Get latest NBA news (mock for now)"""
    return {
        "articles": [
            {
                "title": "MVP Race Intensifies as Season Enters Final Stretch",
                "summary": "Three players emerge as frontrunners for the Most Valuable Player award",
                "published_at": "2025-06-10T10:00:00Z",
                "source": "ESPN",
                "url": "#"
            },
            {
                "title": "Trade Deadline Moves Reshape Championship Odds",
                "summary": "Recent trades have significantly impacted the playoff picture",
                "published_at": "2025-06-10T08:30:00Z", 
                "source": "The Athletic",
                "url": "#"
            },
            {
                "title": "Rookie of the Year Battle Heating Up",
                "summary": "Close competition between top rookies for the prestigious award",
                "published_at": "2025-06-10T07:15:00Z",
                "source": "NBA.com", 
                "url": "#"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
