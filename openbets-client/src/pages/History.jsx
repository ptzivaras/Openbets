import { useState, useEffect } from 'react';
import { winningColumnsApi } from '../services/api';
import WinningNumbers from '../components/WinningNumbers';
import Loading from '../components/Loading';

function History() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await winningColumnsApi.getAll(null, page, pageSize);
      setColumns(response.data);
      setTotalCount(parseInt(response.headers['x-total-count'] || '0'));
    } catch (err) {
      setError('Failed to load history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && page === 1) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Draw History</h1>
      
      {error && <div className="error">{error}</div>}
      
      {columns.map(column => (
        <WinningNumbers key={column.id} column={column} />
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
