import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🎰 OpenBets
          </Link>
          <nav className="nav">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
            <Link 
              to="/latest" 
              className={location.pathname === '/latest' ? 'active' : ''}
            >
              Latest Draw
            </Link>
            <Link 
              to="/history" 
              className={location.pathname === '/history' ? 'active' : ''}
            >
              History
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
