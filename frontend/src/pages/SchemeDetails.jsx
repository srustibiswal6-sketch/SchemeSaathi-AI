import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { getScheme } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import EligibilityCard from '../components/EligibilityCard';
import Loading from '../components/Loading';
import { 
  Building2, 
  Tag, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ListOrdered, 
  ExternalLink,
  Gift,
  Sparkles
} from 'lucide-react';

export default function SchemeDetails() {
  const { id } = useParams();
  const { profile, documents: storedDocs } = useProfile();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getScheme(id, profile)
      .then((data) => {
        if (isMounted) {
          setScheme(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, profile]);

  if (loading) {
    return (
      <div className="page-scheme-details-container">
        <Loading
          message="Loading scheme details..."
          subtext="Fetching criteria rules, document requirements, and verified benefits"
        />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="page-scheme-details-container">
        <div className="scheme-not-found-card">
          <h2>Scheme Not Found</h2>
          <p>We couldn’t find details for the requested scheme ID: {id}</p>
          <Link to="/schemes" className="btn btn-primary mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Schemes List</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate document readiness for this specific scheme
  const requiredDocs = scheme.documents || [];
  const readyDocsCount = requiredDocs.filter(
    (doc) => (storedDocs[doc.id]?.status || doc.status) === 'available'
  ).length;

  return (
    <div className="page-scheme-details-container">
      {/* Breadcrumb & Navigation */}
      <div className="details-nav-bar">
        <Link to="/schemes" className="details-back-link">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Schemes</span>
        </Link>
        <span className="details-crumb-separator">/</span>
        <span className="details-crumb-current">{scheme.name}</span>
      </div>

      {/* Main Header Banner */}
      <header className="scheme-details-header">
        <div className="header-meta-row">
          <span className="scheme-category-tag">
            <Tag className="w-3.5 h-3.5 mr-1 inline" />
            {scheme.category}
          </span>
          <StatusBadge status={scheme.status} size="normal" />
        </div>

        <h1 className="scheme-details-title">{scheme.name}</h1>

        <div className="scheme-details-dept">
          <Building2 className="w-4 h-4 text-slate-500 mr-2 shrink-0 mt-0.5" />
          <span>{scheme.department}</span>
        </div>

        <p className="scheme-summary-lead">{scheme.description}</p>
      </header>

      {/* Dual Column Layout: Left Details / Right Actions & Summary */}
      <div className="scheme-details-layout">
        <main className="scheme-details-main">
          {/* Section: Purpose */}
          <section className="details-section-card">
            <h2 className="section-title-with-icon">
              <Sparkles className="w-5 h-5 text-amber-600 mr-2" />
              <span>Scheme Purpose & Objectives</span>
            </h2>
            <p className="section-text-content">{scheme.purpose}</p>
          </section>

          {/* Section: Benefits */}
          <section className="details-section-card">
            <h2 className="section-title-with-icon">
              <Gift className="w-5 h-5 text-emerald-600 mr-2" />
              <span>Assistance & Entitlements Provided</span>
            </h2>
            <ul className="benefits-checklist">
              {scheme.benefits?.map((benefit, idx) => (
                <li key={idx} className="benefit-item">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Why this scheme matches you (Evidence-based) */}
          <section className="details-section-card highlight-card">
            <div className="why-matches-header">
              <div>
                <span className="why-matches-eyebrow">CITIZEN PROFILE EVALUATION</span>
                <h2 className="why-matches-title">Why this scheme matches you</h2>
                <p className="why-matches-subtitle">
                  We compared the verified requirements against the details you provided.
                </p>
              </div>
              <div className="why-matches-badge">
                <StatusBadge status={scheme.status} />
              </div>
            </div>

            <div className="criteria-list">
              {scheme.eligibility?.map((criterion, idx) => (
                <EligibilityCard key={idx} criterion={criterion} />
              ))}
            </div>
          </section>

          {/* Section: Required Documents Overview */}
          <section className="details-section-card">
            <div className="docs-section-header">
              <div>
                <h2 className="section-title-with-icon">
                  <FileText className="w-5 h-5 text-sky-700 mr-2" />
                  <span>Required Documents Overview</span>
                </h2>
                <p className="section-subtitle">
                  You currently have <strong>{readyDocsCount} of {requiredDocs.length}</strong> required documents ready.
                </p>
              </div>
              <Link to={`/documents?schemeId=${scheme.id}`} className="btn btn-secondary btn-sm">
                <span>Open Document Checklist</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="docs-preview-table">
              {requiredDocs.map((doc) => {
                const currentStatus = storedDocs[doc.id]?.status || doc.status || 'missing';
                return (
                  <div key={doc.id} className="doc-preview-row">
                    <div className="doc-preview-info">
                      <span className="doc-preview-name">{doc.name}</span>
                      <span className="doc-preview-desc">{doc.description}</span>
                    </div>
                    <StatusBadge status={currentStatus} size="small" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official Source Attribution */}
          <section className="details-section-card official-source-card">
            <div className="official-source-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mr-3 shrink-0" />
              <div>
                <h4 className="official-source-title">Official Government Source Verification</h4>
                <p className="official-source-desc">
                  This scheme is administered directly by <strong>{scheme.department}</strong>. 
                  Applications must be filed directly on the official government website.
                </p>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="official-portal-link"
                >
                  <span>Visit Official Portal ({scheme.officialUrl.replace('https://', '')})</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Right Sidebar / Quick Action Card */}
        <aside className="scheme-details-sidebar">
          <div className="sidebar-action-card sticky-sidebar">
            <h3 className="sidebar-card-title">Next Steps for this Scheme</h3>
            
            <div className="sidebar-status-box">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Your Match Status</span>
              <div className="mt-1">
                <StatusBadge status={scheme.status} />
              </div>
            </div>

            <div className="sidebar-doc-readiness">
              <div className="flex justify-between text-sm mb-1">
                <span>Document Readiness:</span>
                <strong>{readyDocsCount}/{requiredDocs.length} Ready</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill progress-emerald"
                  style={{ width: `${Math.round((readyDocsCount / (requiredDocs.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="sidebar-actions-stack">
              <Link to={`/documents?schemeId=${scheme.id}`} className="btn btn-secondary w-full">
                <FileText className="w-4 h-4 mr-2" />
                <span>Verify & Upload Documents</span>
              </Link>

              <Link to={`/application/${scheme.id}`} className="btn btn-primary w-full">
                <ListOrdered className="w-4 h-4 mr-2" />
                <span>View Application Guide</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-official w-full"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="sidebar-trust-reminder">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>SchemeSaathi never charges fees or takes application commissions.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
