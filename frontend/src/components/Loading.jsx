import React from 'react';
import { Loader2, Landmark } from 'lucide-react';

export default function Loading({ message = 'Finding schemes for you...', subtext = 'Analyzing criteria against verified public benefit databases' }) {
  return (
    <div className="loading-state-container" role="status" aria-live="polite">
      <div className="loading-state-card">
        <div className="loading-icon-wrapper">
          <div className="loading-pulse-ring"></div>
          <Landmark className="loading-landmark-icon" />
          <Loader2 className="loading-spinner-overlay animate-spin" />
        </div>
        <h3 className="loading-message">{message}</h3>
        {subtext && <p className="loading-subtext">{subtext}</p>}
      </div>
    </div>
  );
}
