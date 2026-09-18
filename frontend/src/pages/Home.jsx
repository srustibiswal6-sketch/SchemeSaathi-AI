import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  FileCheck2, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Landmark, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge-pill">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI-Powered Citizen Public Benefits Assistant</span>
        </div>

        <h1 className="hero-headline">
          Find government schemes <br className="hidden-mobile" />
          <span className="hero-headline-highlight">made for you.</span>
        </h1>

        <p className="hero-supporting-text">
          Discover schemes you may be eligible for, understand why you qualify in plain language, 
          identify missing documents, and apply through verified official government channels.
        </p>

        <div className="hero-cta-group">
          <Link to="/profile" className="btn btn-primary btn-hero">
            <span>Find My Schemes</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link to="/schemes" className="btn btn-secondary btn-hero">
            <span>Browse All Schemes</span>
          </Link>
        </div>

        {/* Civic Trust Stat Band */}
        <div className="hero-trust-band">
          <div className="trust-stat-item">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>100% Free & Open Citizen Access</span>
          </div>
          <div className="trust-stat-item">
            <Lock className="w-5 h-5 text-sky-700" />
            <span>No Aadhaar or Sensitive Passwords Saved</span>
          </div>
          <div className="trust-stat-item">
            <Landmark className="w-5 h-5 text-amber-700" />
            <span>Direct Verified Government Portal Links</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">HOW IT HELPS YOU</span>
          <h2 className="section-title">Everything you need to navigate public benefits</h2>
          <p className="section-subtitle">Designed specifically for Indian citizens to cut through bureaucratic confusion.</p>
        </div>

        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-sky-50 text-sky-700">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="feature-title">1. Discover</h3>
            <p className="feature-description">
              Find schemes relevant to your situation based on your age, location, occupation, and economic profile.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-amber-50 text-amber-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="feature-title">2. Understand</h3>
            <p className="feature-description">
              See why you may qualify in simple language, with transparent criteria comparisons and zero confusing jargon.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-emerald-50 text-emerald-700">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="feature-title">3. Check Documents</h3>
            <p className="feature-description">
              Know which documents you have and which ones are missing before you begin your official application.
            </p>
          </div>

          {/* Card 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-indigo-50 text-indigo-700">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="feature-title">4. Apply Officially</h3>
            <p className="feature-description">
              Get directed to verified government application channels with step-by-step guidance from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Civic Section */}
      <section className="trust-section">
        <div className="trust-card">
          <div className="trust-card-header">
            <div className="trust-icon-box">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="trust-title">Built to simplify access to public benefits</h3>
              <p className="trust-desc">
                Millions of eligible citizens miss out on government assistance every year due to complex information silos.
                SchemeSaathi organizes state and central programs into an easy-to-use checklist.
              </p>
            </div>
          </div>

          <div className="trust-qa-grid">
            <div className="trust-qa-item">
              <h4>What scheme can I get?</h4>
              <p>Personalized matching across education, agriculture, health, housing, and entrepreneurship.</p>
            </div>
            <div className="trust-qa-item">
              <h4>Why might I qualify?</h4>
              <p>Clear, line-by-line evidence showing which government criteria you appear to satisfy.</p>
            </div>
            <div className="trust-qa-item">
              <h4>What documents am I missing?</h4>
              <p>Immediate audit of certificates and paperwork needed so your application isn't rejected.</p>
            </div>
            <div className="trust-qa-item">
              <h4>Where exactly do I apply?</h4>
              <p>Authentic, verified links directly to the official government portal hosting the scheme.</p>
            </div>
          </div>

          <div className="trust-action-bar">
            <Link to="/profile" className="btn btn-primary">
              <span>Start Your Free Eligibility Check</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Official Disclaimer Note */}
      <section className="disclaimer-callout-section">
        <div className="disclaimer-callout-box">
          <p>
            <strong>Citizen Guidance Disclaimer:</strong> SchemeSaathi provides guidance based on the information available. 
            Always verify eligibility and application requirements on the official government portal.
          </p>
        </div>
      </section>
    </div>
  );
}
