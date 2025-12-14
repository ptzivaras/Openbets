import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import storageService from '../services/storageService';
import statsService from '../services/statsService';
import opapService from '../services/opapService';
import Loading from '../components/Loading';
import './Statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedDraws = storageService.getDraws();
    if (savedDraws.length > 0) {
      setDraws(savedDraws);
      calculateStats(savedDraws);
    }
    setLoading(false);
  };

  const calculateStats = (drawsData) => {
    const numberFreq = statsService.calculateNumberFrequency(drawsData);
    const jokerFreq = statsService.calculateJokerFrequency(drawsData);
    const hotNumbers = statsService.getHotNumbers(drawsData, 15);
    const coldNumbers = statsService.getColdNumbers(drawsData, 15);
    const evenOdd = statsService.calculateEvenOddStats(drawsData);
    const consecutive = statsService.calculateConsecutivePatterns(drawsData);

    setStats({
      numberFreq,
      jokerFreq,
      hotNumbers,
      coldNumbers,
      evenOdd,
      consecutive
    });
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const latestDraws = await opapService.getLatestDraws(100);
      const transformed = latestDraws.map(d => opapService.transformDraw(d));
      storageService.addDraws(transformed);
      setDraws(transformed);
      calculateStats(transformed);
    } catch (error) {
      alert('Σφάλμα κατά την ανανέωση δεδομένων: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Loading />;

  if (draws.length === 0) {
    return (
      <div className="statistics-page">
        <div className="empty-state">
          <h2>Δεν υπάρχουν δεδομένα</h2>
          <p>Πατήστε "Ανανέωση" για να κατεβάσετε τα τελευταία draws από OPAP</p>
          <button onClick={refreshData} disabled={refreshing}>
            {refreshing ? 'Φόρτωση...' : 'Ανανέωση Δεδομένων'}
          </button>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const hotNumbersChart = {
    labels: stats?.hotNumbers.map(n => n.number) || [],
    datasets: [{
      label: 'Εμφανίσεις',
      data: stats?.hotNumbers.map(n => n.count) || [],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  const coldNumbersChart = {
    labels: stats?.coldNumbers.map(n => n.number) || [],
    datasets: [{
      label: 'Εμφανίσεις',
      data: stats?.coldNumbers.map(n => n.count) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const jokerChart = {
    labels: stats?.jokerFreq.slice(0, 10).map(j => j.joker) || [],
    datasets: [{
      label: 'Εμφανίσεις Joker',
      data: stats?.jokerFreq.slice(0, 10).map(j => j.count) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="statistics-page">
      <div className="stats-header">
        <h1>📊 Στατιστικά Tzoker</h1>
        <div className="stats-info">
          <span>Σύνολο Κληρώσεων: <strong>{draws.length}</strong></span>
          <button onClick={refreshData} disabled={refreshing} className="refresh-btn">
            {refreshing ? '⏳ Φόρτωση...' : '🔄 Ανανέωση'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {/* Hot Numbers */}
        <div className="stat-card">
          <h2>🔥 Top 15 Θερμοί Αριθμοί</h2>
          <div className="chart-container">
            <Bar data={hotNumbersChart} options={chartOptions} />
          </div>
        </div>

        {/* Cold Numbers */}
        <div className="stat-card">
          <h2>❄️ Top 15 Ψυχροί Αριθμοί</h2>
          <div className="chart-container">
            <Bar data={coldNumbersChart} options={chartOptions} />
          </div>
        </div>

        {/* Joker Frequency */}
        <div className="stat-card">
          <h2>🃏 Top 10 Joker</h2>
          <div className="chart-container">
            <Bar data={jokerChart} options={chartOptions} />
          </div>
        </div>

        {/* Even/Odd Stats */}
        <div className="stat-card">
          <h2>⚖️ Άρτιοι / Περιττοί</h2>
          <div className="stat-details">
            <div className="stat-row">
              <span>Άρτιοι:</span>
              <strong>{stats?.evenOdd.even.count} ({stats?.evenOdd.even.percentage}%)</strong>
            </div>
            <div className="stat-row">
              <span>Περιττοί:</span>
              <strong>{stats?.evenOdd.odd.count} ({stats?.evenOdd.odd.percentage}%)</strong>
            </div>
          </div>
        </div>

        {/* Consecutive Numbers */}
        <div className="stat-card">
          <h2>🔢 Συνεχόμενοι Αριθμοί</h2>
          <div className="stat-details">
            <div className="stat-row">
              <span>Με συνεχόμενους:</span>
              <strong>{stats?.consecutive.withConsecutive.count} ({stats?.consecutive.withConsecutive.percentage}%)</strong>
            </div>
            <div className="stat-row">
              <span>Χωρίς συνεχόμενους:</span>
              <strong>{stats?.consecutive.withoutConsecutive.count} ({stats?.consecutive.withoutConsecutive.percentage}%)</strong>
            </div>
          </div>
        </div>

        {/* Number Frequency Table */}
        <div className="stat-card full-width">
          <h2>📋 Πίνακας Συχνοτήτων (Όλοι οι Αριθμοί)</h2>
          <div className="frequency-grid">
            {stats?.numberFreq.map(item => (
              <div key={item.number} className="frequency-item">
                <div className="number-badge">{item.number}</div>
                <div className="frequency-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
