// Enhanced Cache Utilities for NBA Analytics Pro
// Comprehensive caching system with compression, prefetching, and performance monitoring

export class EnhancedCache {
  constructor(maxSize = 100, ttl = 30 * 60 * 1000) { // 30 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.prefetchQueue = new Set();
    this.compressionEnabled = true;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  set(key, value, customTTL = null) {
    const now = Date.now();
    
    // Implement intelligent cache eviction
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastValuable();
      this.stats.evictions++;
    }

    // Simple compression for large datasets
    const processedValue = this.compressionEnabled ? this.compress(value) : value;

    this.cache.set(key, {
      value: processedValue,
      timestamp: now,
      ttl: customTTL || this.ttl,
      accessCount: 0,
      lastAccess: now,
      size: this.estimateSize(processedValue)
    });

    this.stats.sets++;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = now;
    this.stats.hits++;
    
    // Decompress if needed
    return this.compressionEnabled ? this.decompress(entry.value) : entry.value;
  }

  compress(data) {
    // Intelligent compression based on data type
    if (!data) return data;

    if (data.roster) {
      // Compress roster data by keeping only essential fields
      return {
        ...data,
        roster: data.roster.map(player => ({
          player_id: player.player_id,
          name: player.name,
          jersey_number: player.jersey_number,
          position: player.position,
          height: player.height,
          age: player.age,
          stats: player.stats ? {
            ppg: player.stats.ppg,
            rpg: player.stats.rpg,
            apg: player.stats.apg
          } : null
        })),
        _compressed: true
      };
    }

    if (data.teams && Array.isArray(data.teams)) {
      // Compress team lists
      return {
        ...data,
        teams: data.teams.map(team => ({
          id: team.id,
          full_name: team.full_name,
          abbreviation: team.abbreviation,
          city: team.city,
          conference: team.conference,
          division: team.division
        })),
        _compressed: true
      };
    }

    return data;
  }

  decompress(data) {
    if (data && data._compressed) {
      delete data._compressed;
    }
    return data;
  }

  estimateSize(obj) {
    // Rough estimation of object size in bytes
    const jsonString = JSON.stringify(obj);
    return new Blob([jsonString]).size;
  }

  evictLeastValuable() {
    let leastValuableKey = null;
    let lowestScore = Infinity;
    
    for (const [key, entry] of this.cache) {
      // Score based on access frequency, recency, and size
      const accessScore = entry.accessCount;
      const recencyScore = (Date.now() - entry.lastAccess) / (1000 * 60); // minutes ago
      const sizeScore = entry.size / 1024; // KB
      const totalScore = accessScore - (recencyScore * 0.1) - (sizeScore * 0.01);
      
      if (totalScore < lowestScore) {
        lowestScore = totalScore;
        leastValuableKey = key;
      }
    }
    
    if (leastValuableKey) {
      this.cache.delete(leastValuableKey);
    }
  }

  prefetch(key, fetchFunction, priority = 'low') {
    if (!this.cache.has(key) && !this.prefetchQueue.has(key)) {
      this.prefetchQueue.add(key);
      
      const delay = priority === 'high' ? 10 : priority === 'medium' ? 100 : 300;
      
      setTimeout(async () => {
        try {
          const data = await fetchFunction();
          this.set(key, data);
          console.log(`🔮 Prefetched ${priority} priority data for ${key}`);
        } catch (error) {
          console.log(`⚠️ Prefetch failed for ${key}:`, error.message);
        } finally {
          this.prefetchQueue.delete(key);
        }
      }, delay);
    }
  }

  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    const totalSize = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: Math.round(hitRate * 10) / 10,
      totalSize: Math.round(totalSize / 1024), // KB
      totalRequests,
      ...this.stats
    };
  }

  clear() {
    this.cache.clear();
    this.prefetchQueue.clear();
    this.stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };
  }

  // Advanced cache warming for frequently accessed data
  warmCache(warmingData) {
    warmingData.forEach(({ key, fetchFunction, priority = 'medium' }) => {
      this.prefetch(key, fetchFunction, priority);
    });
  }
}

// Image preloading utility
export class ImagePreloader {
  constructor() {
    this.preloadedImages = new Set();
    this.failedImages = new Set();
    this.loadingPromises = new Map();
  }

  async preloadImage(src, player_id) {
    if (this.preloadedImages.has(player_id) || this.failedImages.has(player_id)) {
      return this.preloadedImages.has(player_id);
    }

    if (this.loadingPromises.has(player_id)) {
      return this.loadingPromises.get(player_id);
    }

    const promise = new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(player_id);
        this.loadingPromises.delete(player_id);
        resolve(true);
      };
      
      img.onerror = () => {
        // Try alternative URL
        const altImg = new Image();
        altImg.onload = () => {
          this.preloadedImages.add(player_id);
          this.loadingPromises.delete(player_id);
          resolve(true);
        };
        altImg.onerror = () => {
          this.failedImages.add(player_id);
          this.loadingPromises.delete(player_id);
          resolve(false);
        };
        altImg.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player_id}.png`;
      };
      
      img.src = src;
    });

    this.loadingPromises.set(player_id, promise);
    return promise;
  }

  async preloadPlayerImages(players, maxConcurrent = 5) {
    const chunks = [];
    for (let i = 0; i < players.length; i += maxConcurrent) {
      chunks.push(players.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      const promises = chunk.map(player => 
        this.preloadImage(
          `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`,
          player.player_id
        )
      );
      
      await Promise.all(promises);
    }

    console.log(`🖼️ Preloaded ${this.preloadedImages.size} player images, ${this.failedImages.size} failed`);
  }

  isPreloaded(player_id) {
    return this.preloadedImages.has(player_id);
  }

  hasFailed(player_id) {
    return this.failedImages.has(player_id);
  }

  getStats() {
    return {
      preloaded: this.preloadedImages.size,
      failed: this.failedImages.size,
      loading: this.loadingPromises.size
    };
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  constructor() {
    this.measurements = new Map();
    this.enabled = process.env.NODE_ENV === 'development';
  }

  start(label) {
    if (!this.enabled) return;
    this.measurements.set(label, performance.now());
  }

  end(label) {
    if (!this.enabled) return null;
    
    const startTime = this.measurements.get(label);
    if (!startTime) return null;
    
    const duration = performance.now() - startTime;
    this.measurements.delete(label);
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  measure(label, fn) {
    if (!this.enabled) return fn();
    
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  async measureAsync(label, fn) {
    if (!this.enabled) return fn();
    
    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
  }
}

// Global instances
export const teamCache = new EnhancedCache(50, 25 * 60 * 1000); // 25 minutes
export const rosterCache = new EnhancedCache(30, 20 * 60 * 1000); // 20 minutes
export const playerCache = new EnhancedCache(200, 15 * 60 * 1000); // 15 minutes
export const imagePreloader = new ImagePreloader();
export const performanceMonitor = new PerformanceMonitor();

// Cache warming strategy
export const warmCaches = () => {
  // Warm team cache with most popular teams
  const popularTeams = [
    1610612747, // Lakers
    1610612738, // Celtics
    1610612744, // Warriors
    1610612752, // Knicks
    1610612748  // Heat
  ];

  popularTeams.forEach(teamId => {
    teamCache.prefetch(`team_${teamId}`, () => 
      fetch(`http://localhost:8000/api/team/${teamId}`).then(r => r.json())
    );
  });

  console.log('🔥 Cache warming initiated for popular teams');
};
