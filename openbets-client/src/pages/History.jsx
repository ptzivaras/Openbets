import { useState, useEffect } from 'react';
import storageService from '../services/storageService';
import opapService from '../services/opapService';
import WinningNumbers from '../components/WinningNumbers';
import Loading from '../components/Loading';
import './History.css';

function History() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = () => {
    setLoading(true);
    const allDraws = storageService.getDraws();
    const totalCount = allDraws.length;
    setTotalPages(Math.ceil(totalCount / pageSize));
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDraws(allDraws.slice(startIndex, endIndex));
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const latestDraws = await opapService.getLatestDraws(100);
      const transformed = latestDraws.map(d => opapService.transformDraw(d));
      storageService.addDraws(transformed);
      setPage(1);
      loadHistory();
    } catch (err) {
      console.error('Error refreshing data:', err);
      alert('Σφάλμα κατά την ανανέωση δεδομένων');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  if (draws.length === 0 && page === 1) {
    return (
      <div className="container">
        <h1>Ιστορικό Κληρώσεων</h1>
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
    <div className="container">
      <div className="history-header">
        <h1>Ιστορικό Κληρώσεων</h1>
        <button onClick={refreshData} disabled={refreshing} className="refresh-btn">
          {refreshing ? '⏳ Φόρτωση...' : '🔄 Ανανέωση'}
        </button>
      </div>
      
      {draws.map((draw) => (
        <div key={draw.drawId} className="draw-card">
          <div className="draw-header">
            <span className="draw-id">Κλήρωση #{draw.drawId}</span>
            <span className="draw-date">
              {new Date(draw.drawTime).toLocaleDateString('el-GR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="numbers-container">
            <div className="main-numbers">
              {draw.numbers?.map((num, idx) => (
                <div key={idx} className="number-ball main">{num}</div>
              ))}
            </div>
            <div className="joker-number">
              <div className="number-ball joker">{draw.joker}</div>
              <span className="joker-label">Joker</span>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          marginTop: '2rem' 
        }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          <span style={{ 
            padding: '0.625rem 1rem',
            color: 'var(--text-secondary)' 
          }}>
            Page {page} of {totalPages}
          </span>
          <button 
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}

      {loading && page > 1 && (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default History;
