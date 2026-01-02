import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/country-quiz" className="nav-link">
              Destination Finder
            </Link>
            <Link to="/scholarships" className="nav-link">
              Scholarships
            </Link>
            <Link to="/chatbot" className="nav-link">
              AI Chatbot
            </Link>
            {user && (
              <>
                <Link to="/profile" className="nav-link">
                  My Profile
                </Link>
                <Link to="/sop-cv" className="nav-link">
                  SOP Assistant
                </Link>
                <Link to="/professor-finder" className="nav-link">
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
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/country-quiz" className="mobile-nav-link" onClick={closeMobileMenu}>
              Country Quiz
            </Link>
            <Link to="/scholarships" className="mobile-nav-link" onClick={closeMobileMenu}>
              Scholarships
            </Link>
            <Link to="/chatbot" className="mobile-nav-link" onClick={closeMobileMenu}>
              AI Chatbot
            </Link>
            {user && (
              <>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                  My Profile
                </Link>
                <Link to="/sop-cv" className="mobile-nav-link" onClick={closeMobileMenu}>
                  SOP Assistant
                </Link>
                <Link to="/professor-finder" className="mobile-nav-link" onClick={closeMobileMenu}>
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
