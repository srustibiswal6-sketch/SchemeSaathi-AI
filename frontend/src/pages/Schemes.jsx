import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { getSchemes } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import Loading from '../components/Loading';
import { 
  Search, 
  UserCheck, 
  RefreshCw, 
  Edit3, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Health', 'Business', 'Housing'];

export default function Schemes() {
  const { profile } = useProfile();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    getSchemes(profile)
      .then((data) => {
        if (isMounted) {
          setSchemes(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  // Filter schemes by category and search query
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory =
      selectedCategory === 'All' || scheme.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const potentiallyEligibleCount = schemes.filter(
    (s) => s.status === 'potentially_eligible' || s.status === 'likely_match'
  ).length;

  return (
    <div className="page-schemes-container">
      {/* Header Section */}
      <div className="schemes-header-band">
        <div className="schemes-header-content">
          <span className="schemes-eyebrow">
            <Sparkles className="w-4 h-4 text-amber-500 mr-1.5 inline" />
            AI BENEFIT DISCOVERY
          </span>
          <h1 className="schemes-title">Schemes you may be eligible for</h1>
          <p className="schemes-subtext">
            Based on the personal, economic, and demographic information you provided.
          </p>

          {/* Active Citizen Profile Snapshot */}
          <div className="profile-snapshot-bar">
            <div className="snapshot-left">
              <UserCheck className="w-4 h-4 text-sky-700 mr-1.5 shrink-0" />
              <span className="snapshot-label">Active Citizen Profile:</span>
              <span className="snapshot-value">
                Age {profile.age || '—'} • {profile.gender || '—'} • {profile.state || 'India'} • ₹
                {Number(profile.annualIncome || 0).toLocaleString('en-IN')}/yr
                {profile.isStudent ? ' • Student' : ''}
                {profile.isFarmer ? ' • Farmer' : ''}
                {profile.isBusinessOwner ? ' • Business' : ''}
                {profile.isWoman ? ' • Woman' : ''}
              </span>
            </div>
            <Link to="/profile" className="btn btn-snapshot-edit">
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              <span>Modify Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="schemes-content-wrapper">
        {/* Controls: Category Filter and Search */}
        <div className="schemes-controls-row">
          {/* Category Tabs */}
          <div className="category-pill-list" role="tablist" aria-label="Scheme Categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search scheme name or ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search schemes"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Summary */}
        <div className="schemes-count-row">
          <p className="count-summary">
            Found <strong>{filteredSchemes.length}</strong> potentially relevant schemes
            {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
          </p>
          <span className="count-tip">
            {potentiallyEligibleCount} schemes show strong criteria matches
          </span>
        </div>

        {/* Dynamic State: Loading, Empty, or Cards Grid */}
        {loading ? (
          <Loading
            message="Finding schemes for you..."
            subtext="Cross-referencing your profile data with state and central government portals"
          />
        ) : filteredSchemes.length > 0 ? (
          <div className="schemes-grid">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="schemes-empty-state">
            <AlertCircle className="w-12 h-12 text-slate-400 mb-3" />
            <h3 className="empty-title">We couldn't find a matching scheme based on the information provided.</h3>
            <p className="empty-desc">
              Try adjusting your category filter, clearing your search query, or updating your citizen profile details.
            </p>
            <div className="empty-actions">
              {selectedCategory !== 'All' || searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  <span>Reset Filters</span>
                </button>
              ) : null}
              <Link to="/profile" className="btn btn-primary">
                <Edit3 className="w-4 h-4 mr-1.5" />
                <span>Update Profile Details</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
