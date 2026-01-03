import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">UniVerse</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/application-guidance" className={`nav-link ${location.pathname === '/application-guidance' ? 'active' : ''}`}>
              Application Guide
            </Link>
            <Link to="/scholarships" className={`nav-link ${location.pathname === '/scholarships' ? 'active' : ''}`}>
              Scholarships
            </Link>
            <Link to="/chatbot" className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}>
              AI Chatbot
            </Link>
            {user && (
              <>
                <Link to="/country-quiz" className={`nav-link ${location.pathname === '/country-quiz' ? 'active' : ''}`}>
                  Destination Finder
                </Link>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  My Profile
                </Link>
                <Link to="/university-recommendations" className={`nav-link ${location.pathname === '/university-recommendations' ? 'active' : ''}`}>
                  University Finder
                </Link>
                <Link to="/sop-cv" className={`nav-link ${location.pathname === '/sop-cv' || location.pathname === '/sop-helper' ? 'active' : ''}`}>
                  SOP Assistant
                </Link>
                <Link to="/professor-finder" className={`nav-link ${location.pathname === '/professor-finder' ? 'active' : ''}`}>
                  Professor Finder
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="auth-buttons">
            {user ? (
              <>
                <span className="user-greeting">Hello, {user.name}!</span>
                <button onClick={handleLogout} className="login-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="login-btn">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="signup-btn">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <svg className="mobile-menu-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="mobile-menu-icon" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-links">
            <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/application-guidance" className={`mobile-nav-link ${location.pathname === '/application-guidance' ? 'active' : ''}`} onClick={closeMobileMenu}>
              Application Guide
            </Link>
            <Link to="/scholarships" className={`mobile-nav-link ${location.pathname === '/scholarships' ? 'active' : ''}`} onClick={closeMobileMenu}>
              Scholarships
            </Link>
            <Link to="/chatbot" className={`mobile-nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`} onClick={closeMobileMenu}>
              AI Chatbot
            </Link>
            {user && (
              <>
                <Link to="/country-quiz" className={`mobile-nav-link ${location.pathname === '/country-quiz' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Destination Finder
                </Link>
                <Link to="/profile" className={`mobile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  My Profile
                </Link>
                <Link to="/university-recommendations" className={`mobile-nav-link ${location.pathname === '/university-recommendations' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  University Finder
                </Link>
                <Link to="/sop-cv" className={`mobile-nav-link ${location.pathname === '/sop-cv' || location.pathname === '/sop-helper' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  SOP Assistant
                </Link>
                <Link to="/professor-finder" className={`mobile-nav-link ${location.pathname === '/professor-finder' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Professor Finder
                </Link>
              </>
            )}
          </div>
          
          <div className="mobile-auth-section">
            {user ? (
              <>
                <span className="mobile-user-greeting">Hello, {user.name}!</span>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="mobile-login-btn">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <button className="mobile-signup-btn">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
