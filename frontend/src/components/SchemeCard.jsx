import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Building2, Tag, ExternalLink, Gift } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function SchemeCard({ scheme }) {
  if (!scheme) return null;

  // Extract top matching criteria explanations or passed criteria
  const passedCriteria = (scheme.eligibility || [])
    .filter((c) => c.status === 'passed')
    .slice(0, 3);

  const displayCriteria = passedCriteria.length >= 2 
    ? passedCriteria 
    : (scheme.eligibility || []).slice(0, 3);

  const primaryBenefit = Array.isArray(scheme.benefits) 
    ? scheme.benefits[0] 
    : (scheme.benefits || null);

  const officialUrl = scheme.officialUrl || scheme.application_url;

  return (
    <article className="scheme-card">
      <div className="scheme-card-header">
        <div className="scheme-card-meta">
          <span className="scheme-category-tag">
            <Tag className="w-3.5 h-3.5 mr-1 inline" />
            {scheme.category}
          </span>
          <StatusBadge status={scheme.status} size="small" />
        </div>
        <h3 className="scheme-card-title">{scheme.name}</h3>
        <p className="scheme-department">
          <Building2 className="w-3.5 h-3.5 mr-1 inline shrink-0 text-slate-400" />
          <span>{scheme.department}</span>
        </p>
      </div>

      <div className="scheme-card-body">
        {/* Benefit Highlight Ribbon */}
        {primaryBenefit && (
          <div className="scheme-benefit-ribbon">
            <Gift className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
            <span className="benefit-text">{primaryBenefit}</span>
          </div>
        )}

        <p className="scheme-card-desc">{scheme.description}</p>

        {/* Key matching criteria bullet points */}
        <div className="scheme-criteria-preview">
          <span className="criteria-preview-heading">Criteria Evaluation:</span>
          <ul className="criteria-preview-list">
            {displayCriteria.map((crit, idx) => (
              <li key={idx} className={`criteria-preview-item ${crit.status === 'passed' ? 'item-passed' : 'item-pending'}`}>
                <span className="crit-icon">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="crit-text">
                  <strong>{crit.criterion}</strong>: {crit.status === 'passed' ? 'Satisfied' : 'Verification Needed'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="scheme-card-footer">
        <Link to={`/scheme/${scheme.id}`} className="btn btn-outline btn-scheme-details">
          <span>View Rules & Checklist</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>

        {officialUrl && officialUrl !== '#' && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-scheme-portal"
            title="Open official government portal in new tab"
          >
            <span>Portal</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
          </a>
        )}
      </div>
    </article>
  );
}

