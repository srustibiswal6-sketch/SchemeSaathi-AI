import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { getScheme } from '../services/api';
import Loading from '../components/Loading';
import { 
  Building2, 
  ArrowLeft, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';

const APPLICATION_STEPS = [
  {
    step: 1,
    title: 'Prepare your documents',
    description: 'Ensure your Aadhaar, bank passbook, and scheme-specific certificates (income/caste/student) are scanned in PDF or JPEG format under 200KB-500KB as required.'
  },
  {
    step: 2,
    title: 'Visit the official government portal',
    description: 'Access the authorized government portal directly using the verified link provided below. Never use unverified third-party intermediate portals.'
  },
  {
    step: 3,
    title: 'Register or log in',
    description: 'Create a new citizen registration using your mobile number and Aadhaar OTP verification, or log in with your existing credentials (or DigiLocker/MeriPehchaan).'
  },
  {
    step: 4,
    title: 'Fill out the application',
    description: 'Enter your personal demographics, communication address, bank details (IFSC and Account Number for DBT), and eligibility information accurately.'
  },
  {
    step: 5,
    title: 'Upload the required documents',
    description: 'Attach the digital scanned copies of each required document in the designated upload fields. Ensure document text is clear and readable.'
  },
  {
    step: 6,
    title: 'Review your information',
    description: 'Thoroughly verify all entered data in the preview summary before submitting. Check your name spelling against your Aadhaar and bank passbook.'
  },
  {
    step: 7,
    title: 'Submit the application',
    description: 'Finalize and submit your application online. You will receive an instant confirmation SMS with your unique application submission code.'
  },
  {
    step: 8,
    title: 'Save your application/reference number',
    description: 'Download the printable PDF acknowledgement receipt and preserve your Application/Reference ID for tracking approval status and DBT disbursements.'
  }
];

export default function ApplicationGuide() {
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
      <div className="page-application-container">
        <Loading
          message="Preparing application guide..."
          subtext="Fetching step-by-step instructions and verified portal channels"
        />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="page-application-container">
        <div className="scheme-not-found-card">
          <h2>Application Guide Not Found</h2>
          <p>We could not find the application steps for scheme ID: {id}</p>
          <Link to="/schemes" className="btn btn-primary mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Schemes</span>
          </Link>
        </div>
      </div>
    );
  }

  const requiredDocs = scheme.documents || [];
  const missingDocs = requiredDocs.filter(
    (doc) => (storedDocs[doc.id]?.status || doc.status) !== 'available'
  );

  return (
    <div className="page-application-container">
      {/* Breadcrumb Navigation */}
      <div className="details-nav-bar">
        <Link to={`/scheme/${scheme.id}`} className="details-back-link">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Scheme Details</span>
        </Link>
        <span className="details-crumb-separator">/</span>
        <span className="details-crumb-current">Application Guide</span>
      </div>

      {/* Guide Header Banner */}
      <header className="guide-header-card">
        <div className="guide-header-meta">
          <span className="scheme-category-tag">{scheme.category}</span>
          <span className="guide-official-badge">
            <Building2 className="w-3.5 h-3.5 mr-1 inline" />
            Official Government Application Channel
          </span>
        </div>

        <h1 className="guide-title">How to Apply: {scheme.name}</h1>
        <p className="guide-dept">{scheme.department}</p>
        <p className="guide-lead-text">
          Follow this structured timeline to complete your application smoothly on the official government website.
        </p>
      </header>

      {/* Pre-flight Document Warning if any missing */}
      {missingDocs.length > 0 && (
        <div className="preflight-warning-card">
          <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
          <div className="preflight-warning-body">
            <h4 className="preflight-warning-title">
              Attention: You have {missingDocs.length} document{missingDocs.length > 1 ? 's' : ''} to verify
            </h4>
            <p className="preflight-warning-desc">
              Having your documents ready beforehand prevents application timeouts on government servers.
            </p>
            <div className="missing-docs-tags">
              {missingDocs.map((doc) => (
                <span key={doc.id} className="missing-doc-pill">
                  {doc.name}
                </span>
              ))}
            </div>
            <Link to={`/documents?schemeId=${scheme.id}`} className="preflight-link">
              <span>Audit documents in checklist</span>
              <ArrowLeft className="w-3.5 h-3.5 ml-1 rotate-180 inline" />
            </Link>
          </div>
        </div>
      )}

      {/* 8-Step Timeline */}
      <section className="timeline-section">
        <div className="timeline-header">
          <h2 className="timeline-section-title">8-Step Application Process</h2>
          <span className="timeline-section-sub">From document prep to receiving your reference code</span>
        </div>

        <div className="timeline-list">
          {APPLICATION_STEPS.map((item) => (
            <div key={item.step} className="timeline-step-item">
              <div className="timeline-indicator-col">
                <div className="timeline-step-badge">{item.step}</div>
                {item.step < APPLICATION_STEPS.length && <div className="timeline-line"></div>}
              </div>

              <div className="timeline-content-card">
                <h3 className="timeline-step-heading">{item.title}</h3>
                <p className="timeline-step-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Callout: Distinguish SchemeSaathi from Government */}
      <section className="guide-trust-callout">
        <div className="guide-trust-inner">
          <ShieldCheck className="w-6 h-6 text-sky-700 mr-3 shrink-0" />
          <div>
            <h4 className="trust-callout-heading">Important Note on Submission</h4>
            <p className="trust-callout-text">
              <strong>SchemeSaathi AI does not process your application or make benefit decisions.</strong> 
              When you click the button below, you will be taken directly to the verified government portal 
              administered by {scheme.department}. Never pay anyone for submission assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section className="ready-to-apply-banner">
        <div className="ready-to-apply-content">
          <span className="ready-eyebrow">FINAL STEP</span>
          <h2 className="ready-title">Ready to apply?</h2>
          <p className="ready-subtitle">
            You will be redirected directly to the official government portal to submit your form.
          </p>

          <div className="ready-actions">
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-apply-portal"
            >
              <span>Apply on Official Government Portal</span>
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>

            <div className="verified-url-display">
              <span className="text-xs text-slate-500">Verified official domain:</span>
              <code className="url-code">{scheme.officialUrl}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
