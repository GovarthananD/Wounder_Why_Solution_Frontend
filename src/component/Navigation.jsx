import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ✊✋✌️ Stone Paper Scissors
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">New Game</Link>
          <Link className="nav-link" to="/history">Game History</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;