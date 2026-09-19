import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Menu, X, ArrowRight, ShieldCheck, Bot, Info, UserCheck } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const hasProfile = Boolean(profile?.age && profile?.state);

  return (
    <header className="navbar-container">
      {/* Indian Tricolor Accent Band */}
      <div className="civic-top-bar" aria-hidden="true">
        <span className="accent-saffron"></span>
        <span className="accent-white"></span>
        <span className="accent-green"></span>
      </div>

      <nav className="navbar-content">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon-wrapper">
            <Landmark className="brand-icon" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-title">SchemeSaathi</span>
              <span className="brand-ai-badge">AI</span>
              <span className="brand-civic-tag">CIVIC TECH</span>
            </div>
            <span className="brand-subtitle">Citizen Public Benefit & Welfare Portal</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/schemes" className={`nav-link ${isActive('/schemes') ? 'active' : ''}`}>
            Find Schemes
          </Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
            <Bot className="w-3.5 h-3.5 mr-1.5 inline" />
            AI Chat
          </Link>
          <Link to="/documents" className={`nav-link ${isActive('/documents') ? 'active' : ''}`}>
            Documents
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            <Info className="w-3.5 h-3.5 mr-1.5 inline" />
            About
          </Link>
        </div>

        {/* Navbar Actions (Profile Pill + CTA + Mobile Toggle) */}
        <div className="navbar-actions">
          {hasProfile && (
            <Link to="/profile" className="nav-profile-pill" title="Active Citizen Profile">
              <span className="profile-pill-dot"></span>
              <span className="profile-pill-text">
                {profile.state} • Age {profile.age}
                {profile.isStudent ? ' • Student' : ''}
                {profile.isFarmer ? ' • Farmer' : ''}
              </span>
            </Link>
          )}

          <Link to="/profile" className="btn btn-primary btn-nav">
            <span>{hasProfile ? 'Edit Profile' : 'Find My Schemes'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            {hasProfile && (
              <div className="mobile-profile-card">
                <UserCheck className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Active Profile: {profile.state} • Age {profile.age} • ₹{Number(profile.annualIncome || 0).toLocaleString('en-IN')}/yr</span>
              </div>
            )}
            <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
            <Link to="/schemes" className={`mobile-nav-link ${isActive('/schemes') ? 'active' : ''}`} onClick={closeMenu}>Find Schemes</Link>
            <Link to="/chat" className={`mobile-nav-link ${isActive('/chat') ? 'active' : ''}`} onClick={closeMenu}>
              <Bot className="w-4 h-4 mr-2 inline" />AI Chat Assistant
            </Link>
            <Link to="/documents" className={`mobile-nav-link ${isActive('/documents') ? 'active' : ''}`} onClick={closeMenu}>Document Checklist</Link>
            <Link to="/about" className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>About / How It Works</Link>
            <Link to="/profile" className="btn btn-primary btn-mobile-cta" onClick={closeMenu}>
              {hasProfile ? 'Modify Profile' : 'Find My Schemes'}
            </Link>
          </div>
          <div className="mobile-menu-footer">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2 inline" />
            <span>Guiding citizens exclusively to official government portals</span>
          </div>
        </div>
      )}
    </header>
  );
}

