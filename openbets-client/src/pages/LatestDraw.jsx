import { useState, useEffect } from 'react';
import { winningColumnsApi } from '../services/api';
import WinningNumbers from '../components/WinningNumbers';
import Loading from '../components/Loading';

function LatestDraw() {
  const [column, setColumn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLatestDraw();
  }, []);

  const loadLatestDraw = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await winningColumnsApi.getLatest();
      setColumn(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load latest draw');
      console.error('Error loading latest draw:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><Loading /></div>;
  
  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Latest Draw</h1>
      <WinningNumbers column={column} />
    </div>
  );
}

export default LatestDraw;
