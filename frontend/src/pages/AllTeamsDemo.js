import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DivisionSection from "../components/DivisionSection";

const API_BASE_URL = "http://localhost:8000/api";

const AllTeamsDemo = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTeams();
  }, []);

  const fetchAllTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nba-teams`);
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
            <Link to="/" className="hover:text-cyan-400 transition-colors">NBA Analytics</Link>
            <span>/</span>
            <span className="text-cyan-400">Teams</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
            ALL_NBA_TEAMS
          </h1>
        </div>

        {/* Two-column layout for conferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Western Conference - Left Side */}
          <div>
            <h2 className="text-2xl font-mono font-bold text-red-400 mb-6 text-center">
              WESTERN CONFERENCE
            </h2>
            
            <DivisionSection
              title="NORTHWEST DIVISION"
              teams={teams}
              conference="Western"
              division="Northwest"
              titleColor="text-red-300"
            />

            <DivisionSection
              title="PACIFIC DIVISION"
              teams={teams}
              conference="Western"
              division="Pacific"
              titleColor="text-red-300"
            />

            <DivisionSection
              title="SOUTHWEST DIVISION"
              teams={teams}
              conference="Western"
              division="Southwest"
              titleColor="text-red-300"
            />
          </div>

          {/* Eastern Conference - Right Side */}
          <div>
            <h2 className="text-2xl font-mono font-bold text-green-400 mb-6 text-center">
              EASTERN CONFERENCE
            </h2>
            
            <DivisionSection
              title="ATLANTIC DIVISION"
              teams={teams}
              conference="Eastern"
              division="Atlantic"
              titleColor="text-green-300"
            />

            <DivisionSection
              title="CENTRAL DIVISION"
              teams={teams}
              conference="Eastern"
              division="Central"
              titleColor="text-green-300"
            />

            <DivisionSection
              title="SOUTHEAST DIVISION"
              teams={teams}
              conference="Eastern"
              division="Southeast"
              titleColor="text-green-300"
            />
          </div>
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
            AUTO_PERSONALIZATION: ONNN
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AllTeamsDemo;
