function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1rem' }}>Welcome to OpenBets</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Track and analyze lottery draw results
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/latest" className="btn btn-primary">View Latest Draw</a>
          <a href="/history" className="btn btn-secondary">View History</a>
        </div>
      </div>

      <div className="grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">📊 Statistics</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            View detailed statistics and analysis of past draws
          </p>
        </div>
        <div className="card">
          <div className="card-header">🎯 Latest Results</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Check the most recent lottery draw results
          </p>
        </div>
        <div className="card">
          <div className="card-header">📈 Trends</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Analyze number frequency and patterns
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
