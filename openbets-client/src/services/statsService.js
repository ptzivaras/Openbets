// Statistics calculation service
class StatsService {
  /**
   * Calculate number frequency (how many times each number appeared)
   */
  calculateNumberFrequency(draws) {
    const frequency = {};
    
    // Initialize all numbers 1-45
    for (let i = 1; i <= 45; i++) {
      frequency[i] = { number: i, count: 0, lastSeen: null };
    }
    
    draws.forEach(draw => {
      draw.numbers?.forEach(num => {
        if (frequency[num]) {
          frequency[num].count++;
          if (!frequency[num].lastSeen || draw.drawTime > frequency[num].lastSeen) {
            frequency[num].lastSeen = draw.drawTime;
          }
        }
      });
    });
    
    return Object.values(frequency).sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate joker frequency (1-20)
   */
  calculateJokerFrequency(draws) {
    const frequency = {};
    
    // Initialize all jokers 1-20
    for (let i = 1; i <= 20; i++) {
      frequency[i] = { joker: i, count: 0, lastSeen: null };
    }
    
    draws.forEach(draw => {
      const joker = draw.joker;
      if (joker && frequency[joker]) {
        frequency[joker].count++;
        if (!frequency[joker].lastSeen || draw.drawTime > frequency[joker].lastSeen) {
          frequency[joker].lastSeen = draw.drawTime;
        }
      }
    });
    
    return Object.values(frequency).sort((a, b) => b.count - a.count);
  }

  /**
   * Get hot numbers (most frequent)
   */
  getHotNumbers(draws, limit = 10) {
    const frequency = this.calculateNumberFrequency(draws);
    return frequency.slice(0, limit);
  }

  /**
   * Get cold numbers (least frequent)
   */
  getColdNumbers(draws, limit = 10) {
    const frequency = this.calculateNumberFrequency(draws);
    return frequency.slice(-limit).reverse();
  }

  /**
   * Get numbers that haven't appeared in N draws
   */
  getOverdueNumbers(draws, drawCount = 10) {
    const recentDraws = draws.slice(0, drawCount);
    const recentNumbers = new Set();
    
    recentDraws.forEach(draw => {
      draw.numbers?.forEach(num => recentNumbers.add(num));
    });
    
    const overdue = [];
    for (let i = 1; i <= 45; i++) {
      if (!recentNumbers.has(i)) {
        overdue.push(i);
      }
    }
    
    return overdue;
  }

  /**
   * Calculate even/odd distribution
   */
  calculateEvenOddStats(draws) {
    let evenCount = 0;
    let oddCount = 0;
    
    draws.forEach(draw => {
      draw.numbers?.forEach(num => {
        if (num % 2 === 0) evenCount++;
        else oddCount++;
      });
    });
    
    const total = evenCount + oddCount;
    return {
      even: { count: evenCount, percentage: total > 0 ? (evenCount / total * 100).toFixed(1) : 0 },
      odd: { count: oddCount, percentage: total > 0 ? (oddCount / total * 100).toFixed(1) : 0 }
    };
  }

  /**
   * Calculate sum ranges distribution
   */
  calculateSumRanges(draws) {
    const ranges = {
      '50-99': 0,
      '100-149': 0,
      '150-199': 0,
      '200-249': 0,
      '250+': 0
    };
    
    draws.forEach(draw => {
      const sum = draw.numbers?.reduce((acc, num) => acc + num, 0) || 0;
      
      if (sum >= 50 && sum < 100) ranges['50-99']++;
      else if (sum >= 100 && sum < 150) ranges['100-149']++;
      else if (sum >= 150 && sum < 200) ranges['150-199']++;
      else if (sum >= 200 && sum < 250) ranges['200-249']++;
      else if (sum >= 250) ranges['250+']++;
    });
    
    return ranges;
  }

  /**
   * Get draws by month
   */
  getDrawsByMonth(draws) {
    const byMonth = {};
    
    draws.forEach(draw => {
      const date = new Date(draw.drawTime);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!byMonth[key]) {
        byMonth[key] = {
          month: key,
          count: 0,
          draws: []
        };
      }
      
      byMonth[key].count++;
      byMonth[key].draws.push(draw);
    });
    
    return Object.values(byMonth).sort((a, b) => b.month.localeCompare(a.month));
  }

  /**
   * Calculate consecutive numbers patterns
   */
  calculateConsecutivePatterns(draws) {
    let withConsecutive = 0;
    let withoutConsecutive = 0;
    
    draws.forEach(draw => {
      const sorted = [...(draw.numbers || [])].sort((a, b) => a - b);
      let hasConsecutive = false;
      
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) {
          hasConsecutive = true;
          break;
        }
      }
      
      if (hasConsecutive) withConsecutive++;
      else withoutConsecutive++;
    });
    
    const total = withConsecutive + withoutConsecutive;
    return {
      withConsecutive: { 
        count: withConsecutive, 
        percentage: total > 0 ? (withConsecutive / total * 100).toFixed(1) : 0 
      },
      withoutConsecutive: { 
        count: withoutConsecutive, 
        percentage: total > 0 ? (withoutConsecutive / total * 100).toFixed(1) : 0 
      }
    };
  }
}

export default new StatsService();
