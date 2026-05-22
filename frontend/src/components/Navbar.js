import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import sanrakshan from '../assets/sanrakshan-logo.svg';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
            <img src={sanrakshan} alt="Sanrakshan Logo" className="logo-image" />
            Sanrakshan
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/know-your-rights" onClick={() => setIsMenuOpen(false)}>Rights</Link></li>
            <li><Link to="/reports" onClick={() => setIsMenuOpen(false)}>Report</Link></li>

            {/* Show Emergency Contact only for regular users */}
            {user && !isAdmin() && (
              <>
                <li><Link to="/emergency-contact" onClick={() => setIsMenuOpen(false)}>Contacts</Link></li>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
              </>
            )}

            {/* Show Admin only for admin users */}
            {user && isAdmin() && (
              <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
            )}

            {/* Show Login/Register button only when not logged in */}
            {!user && (
              <>
                <li>
                  <button
                    className="btn-login-nav"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    User Login / Register
                  </button>
                </li>
                <li>
                  <Link 
                    to="/admin-login" 
                    className="btn-admin-nav"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔐 Admin Login
                  </Link>
                </li>
              </>
            )}

            {/* Show Logout only when logged in */}
            {user && (
              <li className="user-info">
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default Navbar;
