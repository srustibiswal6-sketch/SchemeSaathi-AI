import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  FileCheck2, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Landmark, 
  CheckCircle2, 
  Lock,
  Search,
  GraduationCap,
  Sprout,
  HeartPulse,
  Home as HomeIcon,
  ShieldAlert,
  Briefcase,
  Bot
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Education',
    title: 'Education & Scholarships',
    description: 'Post-matric aid, merit scholarships, fee waivers & stipends.',
    icon: GraduationCap,
    colorClass: 'cat-education',
    schemeCount: '15+ Schemes',
  },
  {
    id: 'Agriculture',
    title: 'Agriculture & Farmers',
    description: 'Direct income support, seed subsidies, crop insurance & loans.',
    icon: Sprout,
    colorClass: 'cat-agriculture',
    schemeCount: '12+ Schemes',
  },
  {
    id: 'Health',
    title: 'Healthcare & Wellness',
    description: 'Cashless hospital coverage, critical illness & maternal benefits.',
    icon: HeartPulse,
    colorClass: 'cat-health',
    schemeCount: '10+ Schemes',
  },
  {
    id: 'Housing',
    title: 'Housing & Urban Welfare',
    description: 'Affordable pucca housing grants and subsidized home loan interest.',
    icon: HomeIcon,
    colorClass: 'cat-housing',
    schemeCount: '8+ Schemes',
  },
  {
    id: 'Social Security',
    title: 'Pensions & Social Security',
    description: 'Old-age security, widow pensions, unorganized worker benefits.',
    icon: ShieldAlert,
    colorClass: 'cat-social',
    schemeCount: '14+ Schemes',
  },
  {
    id: 'Business',
    title: 'MSME & Self-Employment',
    description: 'Collateral-free micro loans, Stand-Up India & artisan support.',
    icon: Briefcase,
    colorClass: 'cat-business',
    schemeCount: '9+ Schemes',
  },
];

const POPULAR_SEARCHES = [
  'Post-Matric Scholarship',
  'PM-KISAN',
  'Ayushman Bharat',
  'PMAY Housing',
  'Atal Pension',
  'Mudra Loan',
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/schemes?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge-pill">
          <span className="hero-pulse-dot"></span>
          <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
          <span>AI-Powered Citizen Public Benefits Assistant</span>
        </div>

        <h1 className="hero-headline">
          Discover government schemes <br className="hidden-mobile" />
          <span className="hero-headline-highlight">you actually qualify for.</span>
        </h1>

        <p className="hero-supporting-text">
          Zero guesswork. SchemeSaathi compares your profile with published eligibility rules,
          identifies missing documents, and guides you straight to verified official government portals.
        </p>

        {/* Hero Interactive Search Bar */}
        <div className="hero-search-wrapper">
          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <Search className="hero-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, category, or benefit (e.g. scholarship, farmer, housing)..."
              className="hero-search-input"
              aria-label="Search government schemes"
            />
            <button type="submit" className="btn btn-primary hero-search-btn">
              <span>Find Schemes</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          {/* Quick Tag Suggestions */}
          <div className="hero-quick-tags">
            <span className="quick-tags-label">Trending Searches:</span>
            <div className="quick-tags-list">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="quick-tag-chip"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="hero-cta-group">
          <Link to="/profile" className="btn btn-primary btn-hero">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Check My Profile Eligibility</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link to="/chat" className="btn btn-secondary btn-hero">
            <Bot className="w-4 h-4 mr-2 text-sky-700" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>

        {/* Civic Trust Stat Band */}
        <div className="hero-trust-band">
          <div className="trust-stat-card">
            <div className="stat-icon-wrapper bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-title">100% Deterministic Engine</div>
              <div className="stat-desc">Zero LLM hallucinations in eligibility math</div>
            </div>
          </div>

          <div className="trust-stat-card">
            <div className="stat-icon-wrapper bg-sky-50 text-sky-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-title">Zero Biometric Storage</div>
              <div className="stat-desc">Your personal data stays on your device</div>
            </div>
          </div>

          <div className="trust-stat-card">
            <div className="stat-icon-wrapper bg-amber-50 text-amber-700">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-title">Official Portals Only</div>
              <div className="stat-desc">Direct verified government links (*.gov.in)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Welfare Categories */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-eyebrow">EXPLORE WELFARE AREAS</span>
          <h2 className="section-title">Browse schemes across major public sectors</h2>
          <p className="section-subtitle">
            Filter assistance programs tailored for students, farmers, senior citizens, women, and micro-entrepreneurs.
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/schemes?category=${encodeURIComponent(cat.id)}`}
                className="category-card"
              >
                <div className={`category-icon-box ${cat.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="category-content">
                  <div className="category-header-row">
                    <h3 className="category-title">{cat.title}</h3>
                    <span className="category-badge">{cat.schemeCount}</span>
                  </div>
                  <p className="category-desc">{cat.description}</p>
                </div>
                <div className="category-action">
                  <span>Explore Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4-Step Citizen Journey */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">THE CITIZEN JOURNEY</span>
          <h2 className="section-title">Everything you need to navigate public benefits</h2>
          <p className="section-subtitle">
            Designed specifically for Indian citizens to cut through bureaucratic hurdles in four clear steps.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-step-indicator">Step 01</div>
            <div className="feature-icon-wrapper bg-sky-50 text-sky-700">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Create Profile</h3>
            <p className="feature-description">
              Provide basic age, state, and income details. Your information remains strictly private on your browser.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-step-indicator">Step 02</div>
            <div className="feature-icon-wrapper bg-amber-50 text-amber-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Discover Matches</h3>
            <p className="feature-description">
              See why you qualify with transparent rule-by-rule comparisons and zero confusing administrative jargon.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-step-indicator">Step 03</div>
            <div className="feature-icon-wrapper bg-emerald-50 text-emerald-700">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Audit Documents</h3>
            <p className="feature-description">
              Know which certificates you already have and which ones you still need from your Tehsildar before applying.
            </p>
          </div>

          {/* Card 4 */}
          <div className="feature-card">
            <div className="feature-step-indicator">Step 04</div>
            <div className="feature-icon-wrapper bg-indigo-50 text-indigo-700">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="feature-title">Apply on Portal</h3>
            <p className="feature-description">
              Follow step-by-step instructions directly to verified official government portals with zero mediator fees.
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
              <h3 className="trust-title">Dedicated to Transparent Civic Empowerment</h3>
              <p className="trust-desc">
                SchemeSaathi AI is an independent, non-partisan civic platform. We don't take money,
                we don't charge commissions, and we never pretend to be a government authority.
              </p>
            </div>
          </div>

          <div className="trust-qa-grid">
            <div className="trust-qa-item">
              <h4>What schemes can I get?</h4>
              <p>Personalized matching across education, agriculture, health, housing, and micro-entrepreneurship.</p>
            </div>
            <div className="trust-qa-item">
              <h4>Why might I qualify?</h4>
              <p>Clear line-by-line evidence showing exactly which government criteria your profile satisfies.</p>
            </div>
            <div className="trust-qa-item">
              <h4>What documents am I missing?</h4>
              <p>Instant checklist of certificates and bank proofs needed so your application is never rejected.</p>
            </div>
            <div className="trust-qa-item">
              <h4>Where do I submit?</h4>
              <p>Authentic, verified links directly to official portals (*.gov.in / *.nic.in) hosting the scheme.</p>
            </div>
          </div>

          <div className="trust-action-bar">
            <Link to="/profile" className="btn btn-primary">
              <span>Start Free Eligibility Check</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Official Disclaimer Note */}
      <section className="disclaimer-callout-section">
        <div className="disclaimer-callout-box">
          <p>
            <strong>Citizen Guidance Advisory:</strong> SchemeSaathi AI provides informational and advisory guidance based on publicly available notifications. Final eligibility determinations and disbursement approvals are made solely by the respective government ministries and departments.
          </p>
        </div>
      </section>
    </div>
  );
}
