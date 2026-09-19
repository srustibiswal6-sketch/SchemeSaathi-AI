import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, XCircle, ArrowRight, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function SchemeMatchCard({ scheme, compact = false }) {
  if (!scheme) return null;

  const passedCount = scheme.eligibility?.filter((e) => e.status === 'passed').length || 0;
  const failedCount = scheme.eligibility?.filter((e) => e.status === 'failed').length || 0;
  const unknownCount = scheme.eligibility?.filter((e) => e.status === 'unknown').length || 0;

  return (
    <div className={`scheme-match-card ${compact ? 'scheme-match-compact' : ''}`}>
      <div className="scheme-match-header">
        <div className="scheme-match-meta">
          <span className="scheme-match-category">
            <Tag className="w-3 h-3 mr-1 inline" />{scheme.category}
          </span>
          {scheme.demoData && (
            <span className="demo-data-badge">DEMO</span>
          )}
        </div>
        <StatusBadge status={scheme.status} size="small" />
      </div>

      <h3 className="scheme-match-name">{scheme.name}</h3>
      <p className="scheme-match-dept">{scheme.department}</p>

      {!compact && (
        <div className="scheme-match-criteria-row">
          {passedCount > 0 && (
            <span className="criteria-chip criteria-pass">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />{passedCount} criteria satisfied
            </span>
          )}
          {unknownCount > 0 && (
            <span className="criteria-chip criteria-warn">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />{unknownCount} needs verification
            </span>
          )}
          {failedCount > 0 && (
            <span className="criteria-chip criteria-fail">
              <XCircle className="w-3.5 h-3.5 mr-1" />{failedCount} not satisfied
            </span>
          )}
        </div>
      )}

      <div className="scheme-match-footer">
        <Link to={`/scheme/${scheme.id}`} className="btn btn-secondary btn-sm scheme-match-cta">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
