import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle, Sparkles } from 'lucide-react';

export default function StatusBadge({ status, size = 'normal', labelCustom }) {
  const normalized = (status || '').toLowerCase().trim();

  let config = {
    label: labelCustom || 'Needs Verification',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <AlertCircle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
  };

  switch (normalized) {
    case 'potentially_eligible':
      config = {
        label: labelCustom || 'Potentially Eligible',
        bg: 'status-badge-eligible',
        icon: <CheckCircle2 className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'likely_match':
      config = {
        label: labelCustom || 'Likely Match',
        bg: 'status-badge-match',
        icon: <Sparkles className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'needs_verification':
      config = {
        label: labelCustom || 'Needs Verification',
        bg: 'status-badge-verification',
        icon: <AlertCircle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'not_eligible':
      config = {
        label: labelCustom || 'Not Eligible',
        bg: 'status-badge-ineligible',
        icon: <XCircle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'passed':
      config = {
        label: labelCustom || 'Requirement appears satisfied',
        bg: 'status-badge-passed',
        icon: <CheckCircle2 className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'failed':
      config = {
        label: labelCustom || 'Requirement not met',
        bg: 'status-badge-failed',
        icon: <XCircle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'available':
      config = {
        label: labelCustom || 'Available',
        bg: 'status-badge-available',
        icon: <CheckCircle2 className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    case 'missing':
      config = {
        label: labelCustom || 'Missing',
        bg: 'status-badge-missing',
        icon: <XCircle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;

    default:
      config = {
        label: labelCustom || status || 'Pending',
        bg: 'status-badge-default',
        icon: <Clock className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />,
      };
      break;
  }

  return (
    <span className={`status-badge ${config.bg} ${size === 'small' ? 'badge-sm' : ''}`}>
      <span className="badge-icon">{config.icon}</span>
      <span className="badge-text">{config.label}</span>
    </span>
  );
}
