import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Landmark, ExternalLink, Heart, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container">
      {/* Official Disclaimer Banner */}
      <div className="footer-disclaimer-band">
        <div className="footer-disclaimer-content">
          <div className="disclaimer-icon-col">
            <AlertTriangle className="disclaimer-icon" />
          </div>
          <div className="disclaimer-text-col">
            <strong>Important Citizen Advisory & Disclaimer:</strong>
            <p>
              SchemeSaathi provides advisory guidance based on publicly available government notifications and citizen-provided criteria. 
              <strong> SchemeSaathi is an independent civic assistance platform and is not a government agency or department.</strong> Always verify definitive eligibility, guidelines, and document requirements directly on the respective official government portal before making applications.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <Landmark className="footer-brand-icon" />
            <span className="footer-brand-title">SchemeSaathi AI</span>
          </div>
          <p className="footer-tagline">
            An open civic-tech initiative to bridge the gap between Indian welfare policies and the citizens who need them.
          </p>
          <div className="trust-badge-pill">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Built to simplify access to public benefits</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Citizen Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/profile">Create / Update Profile</Link></li>
            <li><Link to="/schemes">Scheme Recommendations</Link></li>
            <li><Link to="/documents">Document Readiness Audit</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Major Portals</h4>
          <ul className="footer-links">
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="external-link">
                <span>National Portal of India</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="external-link">
                <span>National Scholarship Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="external-link">
                <span>PM-KISAN Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a href="https://beneficiary.nha.gov.in" target="_blank" rel="noopener noreferrer" className="external-link">
                <span>Ayushman Bharat PM-JAY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Civic Principles</h4>
          <ul className="footer-principles">
            <li>✓ Free citizen access forever</li>
            <li>✓ No biometric/aadhaar credentials stored</li>
            <li>✓ Direct links to official portals only</li>
            <li>✓ Plain language, transparent rules</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">
          SchemeSaathi AI • Dedicated to empowering every Indian citizen with timely information.
        </p>
        <p className="credit-text">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 inline" /> for Digital India & Public Good.
        </p>
      </div>
    </footer>
  );
}
