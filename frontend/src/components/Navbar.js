import React, { useState } from "react";
import { Link } from "react-router-dom";
import betDaddyLogo from "../assets/images/betDaddy.png";

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-2xl border-b border-gray-700 border-l-0">
      {/* Top accent bar */}
      <div className="h-px bg-gray-600"></div>

      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Logo and App Name - Hidden on mobile */}
          <Link to="/" className="hidden lg:flex items-center space-x-3">
            <img
              src={betDaddyLogo}
              alt="BetDaddy Logo"
              className="w-14 h-14 object-contain"
            />
            <span className="text-2xl font-mono font-bold gradient-text">
              BET
              <span className="italic">DADDY </span>
            </span>
          </Link>
          {/* Mobile Logo - Only visible on mobile */}
          <Link to="/" className="lg:hidden flex items-center">
            <img
              src={betDaddyLogo}
              alt="BetDaddy Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search teams, players, stats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-green-400 bg-gray-800 border border-gray-600 rounded font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30"
              />
              <div className="absolute left-3 top-2.5">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          </div>
          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-cyan-400 font-mono font-medium transition-colors duration-200 px-3 py-1 rounded border border-transparent hover:border-gray-600"
            >
              DASHBOARD
            </Link>
            <Link
              to="/teams"
              className="text-gray-300 hover:text-cyan-400 font-mono font-medium transition-colors duration-200 px-3 py-1 rounded border border-transparent hover:border-gray-600"
            >
              ALL_TEAMS
            </Link>
            <Link
              to="/predictions"
              className="text-gray-300 hover:text-cyan-400 font-mono font-medium transition-colors duration-200 px-3 py-1 rounded border border-transparent hover:border-gray-600"
            >
              PREDICTIONS
            </Link>
            <button className="btn-primary">HIDDEN_GEMS</button>
          </div>
          {/* Mobile Action Button */}
          <div className="lg:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors border border-gray-600">
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
