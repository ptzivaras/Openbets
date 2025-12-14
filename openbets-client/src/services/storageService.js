// LocalStorage manager for persistent data
const STORAGE_KEYS = {
  DRAWS: 'tzoker_draws',
  STATS: 'tzoker_stats',
  LAST_UPDATE: 'tzoker_last_update',
  SETTINGS: 'tzoker_settings'
};

class StorageService {
  /**
   * Save draws to localStorage
   */
  saveDraws(draws) {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(draws));
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error saving draws to localStorage:', error);
      return false;
    }
  }

  /**
   * Get draws from localStorage
   */
  getDraws() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAWS);
      if (!data) return [];
      
      const draws = JSON.parse(data);
      // Convert date strings back to Date objects
      return draws.map(draw => ({
        ...draw,
        drawTime: new Date(draw.drawTime)
      }));
    } catch (error) {
      console.error('Error loading draws from localStorage:', error);
      return [];
    }
  }

  /**
   * Add or update a draw
   */
  addDraw(draw) {
    const draws = this.getDraws();
    const existingIndex = draws.findIndex(d => d.drawId === draw.drawId);
    
    if (existingIndex >= 0) {
      draws[existingIndex] = draw;
    } else {
      draws.push(draw);
    }
    
    // Sort by drawId descending
    draws.sort((a, b) => b.drawId - a.drawId);
    
    return this.saveDraws(draws);
  }

  /**
   * Add multiple draws
   */
  addDraws(newDraws) {
    const existingDraws = this.getDraws();
    const drawMap = new Map(existingDraws.map(d => [d.drawId, d]));
    
    // Merge new draws
    newDraws.forEach(draw => {
      drawMap.set(draw.drawId, draw);
    });
    
    const mergedDraws = Array.from(drawMap.values())
      .sort((a, b) => b.drawId - a.drawId);
    
    return this.saveDraws(mergedDraws);
  }

  /**
   * Get last update timestamp
   */
  getLastUpdate() {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    return timestamp ? new Date(timestamp) : null;
  }

  /**
   * Save user settings
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  /**
   * Get user settings
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  /**
   * Clear all data
   */
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Get storage info
   */
  getStorageInfo() {
    const draws = this.getDraws();
    const lastUpdate = this.getLastUpdate();
    
    return {
      totalDraws: draws.length,
      oldestDraw: draws.length > 0 ? draws[draws.length - 1] : null,
      newestDraw: draws.length > 0 ? draws[0] : null,
      lastUpdate
    };
  }
}

export default new StorageService();
