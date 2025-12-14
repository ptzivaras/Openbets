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
              Αρχική
            </Link>
            <Link 
              to="/latest" 
              className={location.pathname === '/latest' ? 'active' : ''}
            >
              Τελευταία Κλήρωση
            </Link>
            <Link 
              to="/history" 
              className={location.pathname === '/history' ? 'active' : ''}
            >
              Ιστορικό
            </Link>
            <Link 
              to="/statistics" 
              className={location.pathname === '/statistics' ? 'active' : ''}
            >
              Στατιστικά
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
