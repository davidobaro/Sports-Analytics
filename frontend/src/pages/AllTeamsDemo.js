import React from "react";
import { Link } from "react-router-dom";
import DivisionSection from "../components/DivisionSection";
import { NBA_TEAMS, TEAM_ABBR_TO_ID } from "../utils/nbaTeamData";

// ⚠️ CRITICAL NOTE: AllTeamsDemo should NEVER call APIs or fetch data
// It should ONLY use static data from nbaTeamData.js
// This component demonstrates the UI with static data already in the codebase
// DO NOT add useEffect, useState for loading, or any fetch calls to this component
// Convert NBA_TEAMS object to array format with conference and division info
const convertNBATeamsToArray = () => {
  return Object.entries(NBA_TEAMS).map(([abbreviation, teamData]) => ({
    id: TEAM_ABBR_TO_ID[abbreviation], // Use proper NBA team ID
    full_name: teamData.fullName,
    abbreviation: abbreviation,
    nickname: teamData.fullName.split(' ').pop(), // Extract nickname from full name
    city: teamData.city,
    conference: teamData.conference,
    division: teamData.division
  }));
};

const AllTeamsDemo = () => {
  // ⚠️ NEVER add useState for loading, error, or teams - use static data only
  // ⚠️ NEVER add useEffect to fetch data - this component uses static data
  const teams = convertNBATeamsToArray();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              NBA Analytics
            </Link>
            <span>/</span>
            <span className="text-cyan-400">Teams</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
            ALL_NBA_TEAMS
          </h1>
          {/* ⚠️ STATIC DATA DEMO - No API calls, uses nbaTeamData.js only */}
          <p className="text-sm font-mono text-gray-500">
            STATIC_DATA_DEMO // Using built-in team data
          </p>
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
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 font-mono text-sm">
                STATIC_DATA_MODE: ACTIVE
              </span>
            </div>
            <div className="text-gray-500">|</div>
            <span className="text-cyan-400 font-mono text-sm">
              {teams.length} TEAMS LOADED
            </span>
            <div className="text-gray-500">|</div>
            <span className="text-purple-400 font-mono text-sm">
              NO_API_CALLS: TRUE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTeamsDemo;
