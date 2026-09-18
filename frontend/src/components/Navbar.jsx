import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      {/* Top subtle civic accent bar */}
      <div className="civic-top-bar" aria-hidden="true">
        <span className="accent-saffron"></span>
        <span className="accent-white"></span>
        <span className="accent-green"></span>
      </div>

      <nav className="navbar-content">
        {/* Brand Logo & Title */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon-wrapper">
            <Landmark className="brand-icon" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">SchemeSaathi <span className="brand-ai">AI</span></span>
            <span className="brand-subtitle">Citizen Public Benefit Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/schemes"
            className={`nav-link ${isActive('/schemes') ? 'active' : ''}`}
          >
            Find Schemes
          </Link>
          <Link
            to="/documents"
            className={`nav-link ${isActive('/documents') ? 'active' : ''}`}
          >
            Documents
          </Link>
        </div>

        {/* Primary CTA Button */}
        <div className="navbar-actions">
          <Link to="/profile" className="btn btn-primary btn-nav">
            <span>Find My Schemes</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/schemes"
              className={`mobile-nav-link ${isActive('/schemes') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Find Schemes
            </Link>
            <Link
              to="/documents"
              className={`mobile-nav-link ${isActive('/documents') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Document Checklist
            </Link>
            <Link
              to="/profile"
              className="btn btn-primary btn-mobile-cta"
              onClick={closeMenu}
            >
              Find My Schemes
            </Link>
          </div>
          <div className="mobile-menu-footer">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2 inline" />
            <span>Guiding citizens to official government portals</span>
          </div>
        </div>
      )}
    </header>
  );
}
