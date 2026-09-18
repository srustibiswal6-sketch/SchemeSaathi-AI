import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EligibilityCard({ criterion }) {
  if (!criterion) return null;

  const isPassed = criterion.status === 'passed';
  const isFailed = criterion.status === 'failed';
  const isVerification = !isPassed && !isFailed;

  return (
    <div className={`eligibility-criterion-card ${
      isPassed ? 'card-passed' : isFailed ? 'card-failed' : 'card-verification'
    }`}>
      <div className="criterion-header">
        <div className="criterion-title-wrap">
          <div className="criterion-status-icon">
            {isPassed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {isFailed && <XCircle className="w-5 h-5 text-rose-600" />}
            {isVerification && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          </div>
          <h4 className="criterion-name">{criterion.criterion}</h4>
        </div>
        <StatusBadge
          status={criterion.status}
          size="small"
          labelCustom={
            isPassed
              ? 'Requirement appears satisfied'
              : isFailed
              ? 'Requirement not met'
              : 'Needs verification'
          }
        />
      </div>

      <div className="criterion-comparison-grid">
        <div className="comparison-col">
          <span className="comparison-label">Your details / profile:</span>
          <span className="comparison-value user-val">{criterion.userValue || 'Not specified'}</span>
        </div>

        <div className="comparison-col">
          <span className="comparison-label">Required guideline:</span>
          <span className="comparison-value req-val">{criterion.requiredValue}</span>
        </div>
      </div>

      {criterion.explanation && (
        <div className="criterion-explanation">
          <Info className="w-4 h-4 text-slate-500 mr-1.5 shrink-0 mt-0.5" />
          <p className="explanation-text">{criterion.explanation}</p>
        </div>
      )}
    </div>
  );
}
