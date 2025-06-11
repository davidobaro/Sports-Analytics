# NBA Analytics API Documentation

## Overview

The NBA Analytics API provides comprehensive NBA team and player data, including real-time statistics, complete team rosters, and performance predictions.

**Base URL:** `http://localhost:8000`  
**Version:** 1.0.0  
**Data Source:** NBA Official API (nba_api) with intelligent fallbacks

---

## 🏀 Team APIs

### 1. Get Team Details with Full Roster

**Endpoint:** `GET /api/team/{team_id}`

**Description:** Returns comprehensive team information including season stats, recent games, and complete roster.

**Parameters:**

- `team_id` (int): NBA team ID (e.g., 1610612747 for Lakers)

**Response Structure:**

```json
{
  "basic_info": {
    "id": 1610612747,
    "full_name": "Los Angeles Lakers",
    "abbreviation": "LAL",
    "city": "Los Angeles",
    "nickname": "Lakers"
  },
  "season_stats": {
    "games_played": 64,
    "wins": 43,
    "losses": 21,
    "avg_points": 119.3,
    "avg_opp_points": 108.6,
    "fg_pct": 0.484,
    "three_pt_pct": 0.361
  },
  "roster": [
    {
      "player_id": 1629020,
      "name": "Jarred Vanderbilt",
      "jersey_number": "2",
      "position": "F",
      "height": "6-8",
      "weight": "214",
      "birth_date": "APR 03, 1999",
      "age": 26,
      "experience": "6",
      "school": "Kentucky"
    }
  ],
  "roster_count": 17,
  "recent_form": [
    {
      "GAME_DATE": "2025-06-11",
      "MATCHUP": "@ POR",
      "WL": "W",
      "PTS": 115,
      "OPP_PTS": 102
    }
  ],
  "performance_analysis": {
    "tier": "elite",
    "strengths": ["Superstar talent", "Championship experience"],
    "weaknesses": ["Age concerns", "Depth"],
    "championship_count": 17,
    "conference": "Western",
    "division": "Pacific"
  }
}
```

**Features:**

- ✅ Real NBA roster data from official API
- ✅ Current season team statistics
- ✅ Last 10 games with scores and results
- ✅ Complete player roster with detailed info
- ✅ Performance analysis and team tier classification
- ✅ Fallback to mock data if API is unavailable

### 2. Get All NBA Teams

**Endpoint:** `GET /api/nba-teams`

**Description:** Returns all 30 NBA teams organized by conference and division.

**Response Structure:**

```json
{
  "teams": [
    {
      "id": 1610612747,
      "full_name": "Los Angeles Lakers",
      "abbreviation": "LAL",
      "city": "Los Angeles",
      "nickname": "Lakers",
      "conference": "Western",
      "division": "Pacific",
      "championships": 17,
      "performance_tier": "elite"
    }
  ],
  "count": 30,
  "eastern_conference": [...],
  "western_conference": [...]
}
```

---

## 🏃‍♂️ Player APIs

### 1. Get Player Details

**Endpoint:** `GET /api/player/{player_id}`

**Description:** Returns comprehensive player information including basic info and current season statistics.

**Parameters:**

- `player_id` (int): NBA player ID (e.g., 201939 for Stephen Curry)

**Response Structure:**

```json
{
  "basic_info": {
    "player_id": 201939,
    "name": "Stephen Curry",
    "team": "Warriors",
    "position": "Guard",
    "height": "6-2",
    "weight": "185",
    "experience": 15
  },
  "current_season": {
    "games": 70,
    "ppg": 24.5,
    "rpg": 4.4,
    "apg": 6.0,
    "fg_pct": 0.448,
    "three_pt_pct": 0.397
  }
}
```

**Key Features:**

- ✅ Real NBA player data from official API
- ✅ Per-game averages calculated from season totals
- ✅ Current team and position information
- ✅ Physical attributes and experience level
- ✅ Accurate shooting percentages

### 2. Get Player Predictions

**Endpoint:** `GET /api/predictions/player/{player_id}`

**Description:** Returns performance predictions and analysis based on current season data.

**Parameters:**

- `player_id` (int): NBA player ID

**Response Structure:**

```json
{
  "next_game": {
    "predicted_points": 28.1,
    "predicted_rebounds": 5.2,
    "predicted_assists": 5.5,
    "confidence": 0.77
  },
  "season_projection": {
    "projected_ppg": 24.1,
    "projected_rpg": 4.5,
    "projected_apg": 5.9
  },
  "analysis": {
    "trending": "up",
    "key_strengths": ["Elite scorer", "Good 3-point shooter"],
    "areas_for_improvement": ["Field goal efficiency"]
  }
}
```

**Prediction Features:**

- ✅ Next game performance predictions with confidence scores
- ✅ Season-long projections based on current form
- ✅ Intelligent analysis of player strengths and weaknesses
- ✅ Trending analysis (up/down/stable performance)

---

## 📊 Other APIs

### Live Games

**Endpoint:** `GET /api/live-games`

- Returns today's NBA games with live scores
- Game status and real-time updates

### League Standings

**Endpoint:** `GET /api/standings`

- Current NBA standings by conference
- Win/loss records and playoff positioning

### NBA News

**Endpoint:** `GET /api/news`

- Latest NBA news and updates
- League headlines and developments

---

## 🛠️ Technical Details

### Data Sources

- **Primary:** NBA Official API (nba_api library)
- **Roster Data:** Real-time team roster information
- **Statistics:** Current season performance data
- **Fallback:** Mock data when API is rate limited

### Error Handling

- Graceful fallbacks to mock data when APIs are unavailable
- Proper error messages and status codes
- Consistent response formats

### Performance Features

- Numpy type conversion for JSON serialization
- Efficient data processing and caching
- Optimized API response times

### Data Accuracy

- **Team Stats:** Real season performance data
- **Player Stats:** Per-game averages calculated correctly
- **Roster Data:** Current team rosters with accurate player information
- **Predictions:** Based on actual performance metrics

---

## 🚀 Usage Examples

### Get Lakers Team Info with Roster

```bash
curl -X GET "http://localhost:8000/api/team/1610612747"
```

### Get Stephen Curry Player Details

```bash
curl -X GET "http://localhost:8000/api/player/201939"
```

### Get LeBron James Predictions

```bash
curl -X GET "http://localhost:8000/api/predictions/player/2544"
```

### Get All NBA Teams

```bash
curl -X GET "http://localhost:8000/api/nba-teams"
```

---

## ✅ API Status

| Endpoint                       | Status     | Features                |
| ------------------------------ | ---------- | ----------------------- |
| `/api/team/{id}`               | ✅ Working | Stats + Full Roster     |
| `/api/player/{id}`             | ✅ Working | Real Player Data        |
| `/api/predictions/player/{id}` | ✅ Working | Performance Predictions |
| `/api/nba-teams`               | ✅ Working | All 30 Teams            |
| `/api/live-games`              | ✅ Working | Live Scores             |
| `/api/standings`               | ✅ Working | League Standings        |

**Last Updated:** June 11, 2025  
**API Version:** 1.0.0  
**Server Status:** Running on port 8000
