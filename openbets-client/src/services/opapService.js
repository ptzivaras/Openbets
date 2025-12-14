// Direct OPAP API service (no backend needed!)
const OPAP_API_BASE = 'https://api.opap.gr/draws/v3.0';
const GAME_ID = 5104; // Tzoker

class OpapService {
  /**
   * Fetch latest draw info to get current drawId
   */
  async getLatestDrawInfo() {
    try {
      const response = await fetch(`${OPAP_API_BASE}/${GAME_ID}/last-result-and-active`);
      if (!response.ok) throw new Error('Failed to fetch latest draw info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest draw info:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific draw by ID
   */
  async getDraw(drawId) {
    try {
      const response = await fetch(`${OPAP_API_BASE}/${GAME_ID}/${drawId}`);
      if (!response.ok) throw new Error(`Failed to fetch draw ${drawId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching draw ${drawId}:`, error);
      return null;
    }
  }

  /**
   * Fetch multiple draws in a range
   */
  async getDrawRange(fromDrawId, toDrawId) {
    const draws = [];
    const promises = [];

    for (let id = fromDrawId; id <= toDrawId; id++) {
      promises.push(
        this.getDraw(id).then(draw => {
          if (draw) draws.push(draw);
        })
      );
    }

    await Promise.all(promises);
    return draws.sort((a, b) => b.drawId - a.drawId); // Sort by drawId descending
  }

  /**
   * Fetch the last N draws
   */
  async getLatestDraws(count = 50) {
    try {
      const info = await this.getLatestDrawInfo();
      const latestDrawId = info.last?.drawId;
      
      if (!latestDrawId) throw new Error('Could not determine latest draw ID');

      const fromDrawId = Math.max(1, latestDrawId - count + 1);
      return await this.getDrawRange(fromDrawId, latestDrawId);
    } catch (error) {
      console.error('Error fetching latest draws:', error);
      throw error;
    }
  }

  /**
   * Transform OPAP draw data to our format
   */
  transformDraw(opapDraw) {
    return {
      gameId: opapDraw.gameId,
      drawId: opapDraw.drawId,
      drawTime: new Date(opapDraw.drawTime),
      numbers: opapDraw.winningNumbers?.list || [],
      joker: opapDraw.winningNumbers?.bonus?.[0] || 0,
      prizeCategories: opapDraw.prizeCategories?.map(cat => ({
        id: cat.id,
        winners: cat.winners || 0,
        divident: cat.divident || 0,
        distributed: cat.distributed || 0
      })) || []
    };
  }
}

export default new OpapService();
