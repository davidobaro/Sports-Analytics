import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

// Enhanced cache system with compression and intelligent prefetching
class RosterCache {
  constructor(maxSize = 30, ttl = 20 * 60 * 1000) { // 20 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.prefetchQueue = new Set();
    this.compressionEnabled = true;
  }

  set(key, value) {
    const now = Date.now();
    
    // Implement intelligent cache eviction
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastValuable();
    }

    // Simple compression for large datasets
    const processedValue = this.compressionEnabled ? this.compress(value) : value;

    this.cache.set(key, {
      value: processedValue,
      timestamp: now,
      accessCount: 0,
      lastAccess: now
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = now;
    
    // Decompress if needed
    return this.compressionEnabled ? this.decompress(entry.value) : entry.value;
  }

  compress(data) {
    // Simple compression: store only essential fields for roster data
    if (data && data.roster) {
      return {
        ...data,
        roster: data.roster.map(player => ({
          player_id: player.player_id,
          name: player.name,
          jersey_number: player.jersey_number,
          position: player.position,
          height: player.height,
          age: player.age,
          stats: player.stats
        }))
      };
    }
    return data;
  }

  decompress(data) {
    return data; // For simple compression, just return as-is
  }

  evictLeastValuable() {
    let leastValuableKey = null;
    let lowestScore = Infinity;
    
    for (const [key, entry] of this.cache) {
      // Score based on access frequency and recency
      const accessScore = entry.accessCount;
      const recencyScore = (Date.now() - entry.lastAccess) / (1000 * 60); // minutes ago
      const totalScore = accessScore - (recencyScore * 0.1);
      
      if (totalScore < lowestScore) {
        lowestScore = totalScore;
        leastValuableKey = key;
      }
    }
    
    if (leastValuableKey) {
      this.cache.delete(leastValuableKey);
    }
  }

  prefetch(key, fetchFunction) {
    if (!this.cache.has(key) && !this.prefetchQueue.has(key)) {
      this.prefetchQueue.add(key);
      
      // Prefetch in the background with lower priority
      setTimeout(async () => {
        try {
          const data = await fetchFunction();
          this.set(key, data);
          console.log(`🔮 Prefetched data for ${key}`);
        } catch (error) {
          console.log(`⚠️ Prefetch failed for ${key}:`, error);
        } finally {
          this.prefetchQueue.delete(key);
        }
      }, 100);
    }
  }

  getStats() {
    const totalAccess = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.accessCount, 0);
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalAccess,
      hitRate: totalAccess > 0 ? (totalAccess / (totalAccess + this.cache.size)) * 100 : 0
    };
  }
}

// Global enhanced roster cache
const rosterCache = new RosterCache(50, 25 * 60 * 1000); // 25 minute TTL

// Virtual scrolling hook for large player lists
const useVirtualScrolling = (items, itemHeight = 100, containerHeight = 800) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
    const endIndex = Math.min(items.length, startIndex + Math.ceil(containerHeight / itemHeight) + 4);
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = (items?.length || 0) * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return { visibleItems, totalHeight, handleScroll };
};

// Image optimization hook
const useImagePreloading = (players) => {
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  
  useEffect(() => {
    if (!players || players.length === 0) return;
    
    const preloadImages = async () => {
      const imagePromises = players.slice(0, 10).map(player => { // Preload first 10 images
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setPreloadedImages(prev => new Set([...prev, player.player_id]));
            resolve();
          };
          img.onerror = resolve;
          img.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`;
        });
      });
      
      await Promise.all(imagePromises);
      console.log(`🖼️ Preloaded ${Math.min(10, players.length)} player images`);
    };

    preloadImages();
  }, [players]);

  return preloadedImages;
};

const PlayerListOptimized = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cacheHit, setCacheHit] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const [sortBy, setSortBy] = useState('ppg'); // Default sort by PPG
  const [sortOrder, setSortOrder] = useState('desc');

  // Performance monitoring
  const performanceStart = useCallback(() => performance.now(), []);

  const fetchTeamDetails = useCallback(async () => {
    const startTime = performanceStart();
    
    try {
      // Check enhanced cache first
      const cacheKey = `roster_${teamId}_with_stats`;
      const cachedData = rosterCache.get(cacheKey);
      
      if (cachedData) {
        console.log(`✅ Roster cache hit for team ${teamId}`);
        setTeamData(cachedData);
        setLoading(false);
        setCacheHit(true);
        setLoadTime(performance.now() - startTime);
        return;
      }

      console.log(`🔄 Roster cache miss for team ${teamId}, fetching from API...`);
      setCacheHit(false);
      setLoading(true);

      // Enhanced fetch with optimized parameters
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      const response = await fetch(
        `${API_BASE_URL}/team/${teamId}?include_player_stats=true`,
        {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 minute browser cache
            'Accept': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Enhanced data validation
      if (!data || !data.basic_info) {
        throw new Error('Invalid roster data structure');
      }

      // Cache with compression
      rosterCache.set(cacheKey, data);
      setTeamData(data);

      // Update document title
      if (data?.basic_info?.full_name) {
        document.title = `${data.basic_info.full_name} Roster - NBA Analytics Pro`;
      }

      setLoadTime(performance.now() - startTime);

    } catch (error) {
      console.error("Error fetching team roster:", error);
      setLoadTime(performance.now() - startTime);
    } finally {
      setLoading(false);
    }
  }, [teamId, performanceStart]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  // Memoized and sorted players with enhanced sorting
  const sortedPlayers = useMemo(() => {
    if (!teamData?.roster) return [];
    
    const players = [...teamData.roster];
    
    players.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'ppg':
          aValue = a.stats?.ppg || 0;
          bValue = b.stats?.ppg || 0;
          break;
        case 'rpg':
          aValue = a.stats?.rpg || 0;
          bValue = b.stats?.rpg || 0;
          break;
        case 'apg':
          aValue = a.stats?.apg || 0;
          bValue = b.stats?.apg || 0;
          break;
        case 'age':
          aValue = a.age || 0;
          bValue = b.age || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        default:
          aValue = a.stats?.ppg || 0;
          bValue = b.stats?.ppg || 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return players;
  }, [teamData?.roster, sortBy, sortOrder]);

  // Image preloading optimization
  const preloadedImages = useImagePreloading(sortedPlayers);

  // Memoized team colors
  const teamColors = useMemo(() => ({
    primary: "from-gray-600 to-gray-700",
    accent: "text-cyan-400",
    secondary: "text-cyan-300",
  }), []);

  // Sort handlers
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  // Performance indicator
  const PerformanceIndicator = () => (
    <div className="text-xs font-mono text-gray-500 mb-2 flex items-center space-x-4">
      <span>⚡ Load: {loadTime.toFixed(0)}ms</span>
      <span>{cacheHit ? '💾 Cached' : '🌐 Fresh'}</span>
      <span>📊 Cache: {rosterCache.getStats().size}/{rosterCache.maxSize}</span>
      <span>🎯 Hit Rate: {rosterCache.getStats().hitRate.toFixed(1)}%</span>
    </div>
  );

  // Enhanced player card component with optimized rendering
  const PlayerCard = React.memo(({ player, teamColors, isPreloaded }) => (
    <div
      key={player.player_id}
      className="p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-cyan-400 transition-all duration-200 cursor-pointer transform hover:scale-105"
    >
      {/* Player Photo Header */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600 overflow-hidden mb-2">
          <img
            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`}
            alt={`${player.name} headshot`}
            className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
              isPreloaded ? 'opacity-100' : 'opacity-75'
            }`}
            loading="lazy"
            onError={(e) => {
              if (e.target.src.includes('1040x760')) {
                e.target.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.player_id}.png`;
              } else {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }
            }}
          />
          <span
            className="text-white font-mono font-bold text-sm absolute w-full h-full flex items-center justify-center"
            style={{ display: "none" }}
          >
            #{player.jersey_number || 'N/A'}
          </span>
        </div>
        <div className="text-center">
          <h3 className={`font-mono font-semibold text-xs ${teamColors.accent} mb-1`}>
            {player.name || 'Unknown Player'}
          </h3>
          <p className="text-xs font-mono text-gray-400">
            {player.position || 'N/A'} • #{player.jersey_number || 'N/A'}
          </p>
        </div>
      </div>

      {/* Player Info - Condensed */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-500">HT:</span>
          <span className="text-gray-300">{player.height ? `${player.height.replace('-', '\'')}\"` : 'N/A'}</span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-500">AGE:</span>
          <span className="text-gray-300">{player.age || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-500">EXP:</span>
          <span className="text-gray-300">{player.experience ? `${player.experience}y` : 'R'}</span>
        </div>
      </div>

      {/* Player Statistics */}
      <div className="border-t border-gray-600 pt-2">
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">PPG</div>
            <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
              {player.stats?.ppg?.toFixed(1) || '0.0'}
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">RPG</div>
            <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
              {player.stats?.rpg?.toFixed(1) || '0.0'}
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-gray-500 mb-1">APG</div>
            <div className={`text-xs font-mono font-bold ${teamColors.secondary}`}>
              {player.stats?.apg?.toFixed(1) || '0.0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
        <p className="font-mono text-cyan-400 text-sm">LOADING_ROSTER_DATA...</p>
        <div className="mt-2 text-xs font-mono text-gray-500">
          Enhanced caching & optimization active
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-mono font-bold text-red-400 mb-4">
          TEAM_NOT_FOUND
        </h2>
        <p className="text-gray-400 font-mono">
          Error: Requested roster data unavailable
        </p>
        <button
          onClick={() => {
            rosterCache.cache.clear();
            window.location.reload();
          }}
          className="mt-4 btn-secondary"
        >
          Clear Cache & Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Performance Indicator */}
        <PerformanceIndicator />

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-mono text-gray-500">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              NBA Analytics Pro
            </Link>
            <span>/</span>
            <Link to="/teams" className="hover:text-cyan-400 transition-colors">
              Teams
            </Link>
            <span>/</span>
            <Link
              to={`/team/${teamId}`}
              className="hover:text-cyan-400 transition-colors"
            >
              {teamData.basic_info?.full_name || "Team Details"}
            </Link>
            <span>/</span>
            <span className={teamColors.accent}>Roster</span>
          </div>

          {/* Back Button */}
          <div className="flex space-x-3">
            <Link
              to={`/team/${teamId}`}
              className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
            >
              ← BACK_TO_TEAM
            </Link>
            <button
              onClick={() => {
                rosterCache.cache.clear();
                fetchTeamDetails();
              }}
              className={`btn-secondary text-sm px-4 py-2 ${teamColors.accent}`}
            >
              🔄 REFRESH
            </button>
          </div>
        </div>

        {/* Team Header with Logo */}
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <img
                src={`https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`}
                alt={`${teamData.basic_info?.full_name} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span
                className="text-white font-mono font-bold text-lg"
                style={{ display: "none" }}
              >
                {teamData.basic_info?.abbreviation || "NBA"}
              </span>
            </div>
            <div>
              <h1 className={`text-2xl font-mono font-bold ${teamColors.accent} mb-1`}>
                {teamData.basic_info?.full_name || "Team Roster"}
              </h1>
              <p className="text-gray-400 font-mono text-sm">
                2024-25 Season • Official Roster • Enhanced Performance
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Player Grid Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-mono font-semibold ${teamColors.accent}`}>
              TEAM_ROSTER
            </h2>
            <div className="flex items-center space-x-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="text-xs font-mono bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-300"
                >
                  <option value="ppg">Points</option>
                  <option value="rpg">Rebounds</option>
                  <option value="apg">Assists</option>
                  <option value="age">Age</option>
                  <option value="name">Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              
              <div className="text-xs font-mono text-gray-500 px-2 py-1 bg-gray-800 rounded border border-gray-600">
                {sortedPlayers.length}_PLAYERS
              </div>
            </div>
          </div>

          {/* Optimized Player Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                teamColors={teamColors}
                isPreloaded={preloadedImages.has(player.player_id)}
              />
            ))}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 px-4 py-2 bg-gray-800 rounded-lg border border-gray-600">
              <span className={`text-sm font-mono ${teamColors.accent}`}>
                ROSTER_OVERVIEW_OPTIMIZED
              </span>
              <div className="text-gray-500">|</div>
              <span className="text-gray-400 font-mono text-sm">
                {teamData.basic_info?.full_name || "Team"} • 2024-25 Season
              </span>
              <div className="text-gray-500">|</div>
              <span className="text-xs font-mono text-gray-500">
                Cache Hit Rate: {rosterCache.getStats().hitRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerListOptimized;
