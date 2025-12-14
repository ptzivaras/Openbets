function WinningNumbers({ column }) {
  if (!column) return null;

  return (
    <div className="card">
      <div className="card-header">
        Draw #{column.drawId} - {new Date(column.drawTime).toLocaleDateString('el-GR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      <div className="numbers-container">
        <div className="number-ball">{column.n1}</div>
        <div className="number-ball">{column.n2}</div>
        <div className="number-ball">{column.n3}</div>
        <div className="number-ball">{column.n4}</div>
        <div className="number-ball">{column.n5}</div>
        <span style={{ fontSize: '1.5rem', margin: '0 0.5rem' }}>+</span>
        <div className="number-ball joker">{column.j1}</div>
      </div>
    </div>
  );
}

export default WinningNumbers;
