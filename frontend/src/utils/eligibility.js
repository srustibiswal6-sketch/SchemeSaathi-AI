/**
 * SchemeSaathi AI — Client-side Eligibility Utilities
 * Mirrors the backend deterministic engine for mock/fallback use.
 */

export function evaluateRule(profileValue, operator, ruleValue) {
  if (profileValue === null || profileValue === undefined) return 'unknown';

  // Boolean rules
  if (typeof ruleValue === 'boolean' || ruleValue === true || ruleValue === false) {
    const actual = Boolean(profileValue);
    const required = typeof ruleValue === 'boolean' ? ruleValue : ruleValue === 'true';
    if (operator === '==') return actual === required ? 'passed' : 'failed';
    if (operator === '!=') return actual !== required ? 'passed' : 'failed';
    return 'unknown';
  }

  // Numeric rules
  const numActual = Number(profileValue);
  const numRequired = Number(ruleValue);
  if (!isNaN(numActual) && !isNaN(numRequired)) {
    const ops = { '==': numActual === numRequired, '!=': numActual !== numRequired,
      '>': numActual > numRequired, '>=': numActual >= numRequired,
      '<': numActual < numRequired, '<=': numActual <= numRequired };
    return ops[operator] !== undefined ? (ops[operator] ? 'passed' : 'failed') : 'unknown';
  }

  // String rules
  const strActual = String(profileValue).toLowerCase().trim();
  const strRequired = String(ruleValue).toLowerCase().trim();
  if (operator === '==') return strActual === strRequired ? 'passed' : 'failed';
  if (operator === '!=') return strActual !== strRequired ? 'passed' : 'failed';
  return 'unknown';
}

export function getOverallStatus(passed, failed, unknown) {
  if (failed > 0) return 'not_currently_matching';
  if (unknown > 0) return 'needs_more_information';
  return 'potentially_eligible';
}
