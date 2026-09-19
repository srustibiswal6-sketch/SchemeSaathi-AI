/**
 * SchemeSaathi AI — Formatting Utilities
 */

/**
 * Format a number as Indian currency string.
 * e.g. 180000 → "₹1,80,000"
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '₹—';
  const num = Number(amount);
  if (isNaN(num)) return '₹—';
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Format a date string to readable format.
 * e.g. "2025-01-01" → "January 1, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Not specified';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Get human-readable label for eligibility status.
 */
export function getStatusLabel(status) {
  const map = {
    potentially_eligible: 'Potentially Eligible',
    needs_more_information: 'Needs Verification',
    not_currently_matching: 'Not Currently Matching',
    eligible: 'Potentially Eligible',
    ineligible: 'Not Matching',
    likely_match: 'Strong Match',
    needs_verification: 'Needs Verification',
    available: 'Available',
    missing: 'Missing',
    needs_verification_doc: 'Needs Verification',
    uploaded: 'Uploaded',
    processed: 'Processed',
  };
  return map[status] || status?.replace(/_/g, ' ') || 'Unknown';
}

/**
 * Get CSS class suffix for a status.
 */
export function getStatusClass(status) {
  if (['potentially_eligible', 'eligible', 'likely_match', 'available'].includes(status)) return 'success';
  if (['needs_more_information', 'needs_verification', 'needs_verification_doc', 'uploaded'].includes(status)) return 'warning';
  if (['not_currently_matching', 'ineligible', 'missing', 'failed'].includes(status)) return 'danger';
  return 'neutral';
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Parse multiline text — split by newlines and bullet characters.
 */
export function parseLines(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text;
  return text.split(/\n|•/).map((line) => line.trim()).filter(Boolean);
}
