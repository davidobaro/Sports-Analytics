import React, { useState, useEffect } from "react";
import axios from "axios";
import StandingsTable from "../components/StandingsTable";
import NewsSection from "../components/NewsSection";
import PredictionsWidget from "../components/PredictionsWidget";

const API_BASE_URL = "http://localhost:8000/api";

const Dashboard = () => {
  const [standings, setStandings] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [standingsRes, newsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/standings`),
        axios.get(`${API_BASE_URL}/news`),
      ]);

      setStandings(standingsRes.data.standings || []);
      setNews(newsRes.data.articles || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-cyan-400 border-t-transparent"></div>
          <div className="text-cyan-400 font-mono text-sm">
            LOADING_LEAGUE_DATA...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up bg-gray-900 min-h-screen text-gray-300">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Predictions Widget - Increased Width */}
          <div className="w-full">
            <PredictionsWidget />
          </div>

          {/* News Section */}
          <NewsSection articles={news} />
        </div>

        {/* Right Sidebar - Standings & Highlights - Wider */}
        <div className="lg:col-span-2 space-y-6">
          {/* Standings Table */}
          <StandingsTable standings={standings} />

          {/* Quick Stats Card */}
          <div className="card p-6">
            <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-4 flex items-center">
              MARKET_INDICATORS
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-600">
                <span className="text-sm font-mono font-medium text-gray-300">
                  NEWS_ARTICLES
                </span>
                <span className="text-xl font-mono font-bold text-green-400">
                  {news.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-600">
                <span className="text-sm font-mono font-medium text-gray-300">
                  ACTIVE_TEAMS
                </span>
                <span className="text-xl font-mono font-bold text-cyan-400">
                  30
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-600">
                <span className="text-sm font-mono font-medium text-gray-300">
                  ML_MODELS
                </span>
                <span className="text-xl font-mono font-bold text-purple-400">
                  5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-6">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gray-800 border border-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-2">
            REAL_TIME_ANALYTICS
          </h3>
          <p className="text-gray-400 font-mono text-sm">
            Live game data and performance metrics updated in real-time
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gray-800 border border-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-mono font-semibold text-green-400 mb-2">
            ML_PREDICTIONS
          </h3>
          <p className="text-gray-400 font-mono text-sm">
            Advanced machine learning models for player and game predictions
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gray-800 border border-purple-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-mono font-semibold text-purple-400 mb-2">
            INTERACTIVE_CHARTS
          </h3>
          <p className="text-gray-400 font-mono text-sm">
            Beautiful visualizations and interactive data exploration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
