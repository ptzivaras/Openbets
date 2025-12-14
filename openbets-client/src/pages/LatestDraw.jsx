import { useState, useEffect } from 'react';
import storageService from '../services/storageService';
import opapService from '../services/opapService';
import Loading from '../components/Loading';
import './LatestDraw.css';

function LatestDraw() {
  const [draw, setDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLatestDraw();
  }, []);

  const loadLatestDraw = () => {
    setLoading(true);
    const draws = storageService.getDraws();
    if (draws.length > 0) {
      setDraw(draws[0]); // First one is the latest (sorted desc)
    }
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const latestDraws = await opapService.getLatestDraws(50);
      const transformed = latestDraws.map(d => opapService.transformDraw(d));
      storageService.addDraws(transformed);
      loadLatestDraw();
    } catch (err) {
      console.error('Error refreshing data:', err);
      alert('Σφάλμα κατά την ανανέωση δεδομένων');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <div className="container"><Loading /></div>;
  
  if (!draw) {
    return (
      <div className="container">
        <h1>Τελευταία Κλήρωση</h1>
        <div className="empty-state">
          <p>Δεν υπάρχουν αποθηκευμένες κληρώσεις</p>
          <button onClick={refreshData} disabled={refreshing}>
            {refreshing ? 'Φόρτωση...' : 'Φόρτωση Δεδομένων από OPAP'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container latest-draw-page">
      <div className="latest-header">
        <h1>Τελευταία Κλήρωση</h1>
        <button onClick={refreshData} disabled={refreshing} className="refresh-btn">
          {refreshing ? '⏳ Φόρτωση...' : '🔄 Ανανέωση'}
        </button>
      </div>

      <div className="latest-card">
        <div className="draw-info">
          <div className="draw-id">Κλήρωση #{draw.drawId}</div>
          <div className="draw-date">
            {new Date(draw.drawTime).toLocaleDateString('el-GR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className="numbers-display">
          <div className="main-numbers">
            <h3>Κύριοι Αριθμοί</h3>
            <div className="numbers-row">
              {draw.numbers?.map((num, idx) => (
                <div key={idx} className="number-ball main large">{num}</div>
              ))}
            </div>
          </div>

          <div className="joker-display">
            <h3>Joker</h3>
            <div className="number-ball joker large">{draw.joker}</div>
          </div>
        </div>

        {draw.prizeCategories && draw.prizeCategories.length > 0 && (
          <div className="prizes-section">
            <h3>Κατηγορίες Κερδών</h3>
            <div className="prizes-table">
              {draw.prizeCategories.map((prize, idx) => (
                <div key={idx} className="prize-row">
                  <span className="prize-category">Κατηγορία {prize.id}</span>
                  <span className="prize-winners">{prize.winners} Νικητές</span>
                  <span className="prize-amount">€{prize.divident?.toLocaleString('el-GR', {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LatestDraw;
