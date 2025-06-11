# NBA Analytics Pro: Interactive Analytics & Predictions Platform

A modern, comprehensive NBA Web App that combines real-time NBA data with machine learning-driven predictions, delivering both insightful current state information and predictive insights about future player and team performances.

## 🏀 Core Features

### 1️⃣ Real-time Data Visualization
- **Live Games Bar**: Real-time display of live NBA games with scores and status
- **Team Dashboard**: Complete team analytics including standings, recent results, upcoming fixtures, and performance heat maps
- **Player Dashboard**: Comprehensive player profiles with career stats, current season performance, and game logs
- **Interactive Charts**: Beautiful data visualizations and trend analysis

### 2️⃣ Predictive Analytics (ML Models)
- **Player Stats Predictions**: Projected PPG, assists, rebounds, 3-pointers, and fantasy scores
- **Game Outcome Predictions**: Win probability, total points, margin of victory, and individual player matchup predictions
- **Advanced ML Models**: Trained using historical NBA data with iterative improvements

### 3️⃣ News & Engagement
- **NBA News Feed**: Curated headlines and stories from trusted basketball news sources
- **Plays of the Week**: Integration with highlight reels and top plays
- **User Dashboard**: Customizable content with favorite players, teams, and stat types

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
- **React.js**: Modern component-based frontend framework
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing for seamless navigation
- **Recharts**: Interactive charts and data visualizations

### Backend (FastAPI + Python)
- **FastAPI**: High-performance Python web framework
- **nba_api**: Official NBA statistics API integration
- **Pandas/NumPy**: Data processing and feature engineering
- **Scikit-learn/XGBoost/LightGBM**: Machine learning models
- **Joblib**: Model persistence for fast inference

## 📦 Project Structure

```
Sports-Analytics/
├── README.md
├── requirements.txt                 # Python dependencies
├── backend/
│   └── main.py                     # FastAPI server with NBA API integration
└── frontend/
    ├── package.json                # React dependencies
    ├── tailwind.config.js          # Tailwind CSS configuration
    ├── postcss.config.js           # PostCSS configuration
    ├── public/
    │   └── index.html              # HTML template
    └── src/
        ├── App.js                  # Main React application
        ├── index.js                # React entry point
        ├── index.css               # Global styles with Tailwind
        ├── components/             # Reusable React components
        │   ├── LiveGamesBar.js     # Live games display
        │   ├── Navbar.js           # Navigation bar with search
        │   ├── NewsSection.js      # NBA news feed
        │   ├── PredictionsWidget.js # ML predictions display
        │   ├── StandingsTable.js   # League standings
        │   └── TeamsList.js        # Teams sidebar
        └── pages/                  # Page components
            ├── Dashboard.js        # Main dashboard
            ├── TeamDetails.js      # Individual team pages
            └── PlayerDetails.js    # Individual player pages
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Install Python Dependencies
```bash
cd Sports-Analytics
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Start the Backend Server
```bash
cd backend
python main.py
```
The FastAPI server will run on `http://localhost:8000`

### 4. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The React app will run on `http://localhost:3000`

### 5. Open Your Browser
Navigate to `http://localhost:3000` to see the NBA Analytics Pro dashboard!

## 🔌 API Endpoints

- `GET /` - API information and available endpoints
- `GET /api/teams` - Get all NBA teams
- `GET /api/live-games` - Get today's live games with scores
- `GET /api/standings` - Get current league standings
- `GET /api/team/{team_id}` - Get detailed team information
- `GET /api/player/{player_id}` - Get detailed player information
- `GET /api/predictions/player/{player_id}` - Get ML predictions for a player
- `GET /api/news` - Get latest NBA news

## 🧠 Machine Learning Features

The app includes several ML models for predictions:

- **Player Performance Prediction**: Uses historical data to predict next game stats
- **Season Projections**: Long-term player performance forecasting
- **Game Outcome Models**: Win probability and scoring predictions
- **Confidence Scoring**: ML model confidence levels for all predictions

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with NBA branding
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live data refresh without page reload
- **Interactive Elements**: Hover effects, smooth animations, and transitions
- **Dark/Light Theme**: Customizable appearance (coming soon)

## 🔧 Customization

### Adding New Data Sources
1. Modify the FastAPI endpoints in `backend/main.py`
2. Update the React components to fetch new data
3. Add new visualization components as needed

### Extending ML Models
1. Add new model training scripts
2. Implement new prediction endpoints
3. Update the frontend to display new predictions

### UI Customization
- Modify `tailwind.config.js` for custom themes
- Update component styles in individual React files
- Add new components in the `components/` directory

## 🚧 Future Enhancements

- [ ] Real NBA API integration (currently uses mock data for demo)
- [ ] User authentication and personalized dashboards
- [ ] Advanced betting analytics and odds integration
- [ ] Mobile app using React Native
- [ ] WebSocket connections for real-time updates
- [ ] Historical data analysis and trend visualization
- [ ] Fantasy basketball integration
- [ ] Social features and user interactions

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.