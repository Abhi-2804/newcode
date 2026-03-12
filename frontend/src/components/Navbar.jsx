import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const links = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/resume', label: '📄 Resume' },
    { path: '/analysis', label: '🚀 Deep Analysis' },
    { path: '/interview', label: '🎯 Interview' },
    { path: '/career', label: '🗺️ Career' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <span>VidyaMitra</span>
        </Link>

        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          {userName && <span className="navbar-user">Hi, {userName}</span>}
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
