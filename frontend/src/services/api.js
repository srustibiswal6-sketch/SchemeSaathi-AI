import axios from 'axios';
import { MOCK_SCHEMES, evaluateAllSchemes } from '../data/mockSchemes';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch scheme recommendations for a citizen profile.
 * Falls back to client-side evaluation on mock data if backend is offline.
 */
export async function getSchemes(profile) {
  try {
    const response = await apiClient.post('/schemes/recommend', { profile });
    if (response.data?.schemes && Array.isArray(response.data.schemes)) {
      // Normalize backend response to frontend schema
      return response.data.schemes.map(normalizeBackendScheme);
    }
  } catch {
    // Graceful fallback
  }
  // Client-side fallback
  return evaluateAllSchemes(MOCK_SCHEMES, profile);
}

/**
 * Fetch a single scheme by its identifier.
 */
export async function getScheme(id, profile) {
  try {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      const response = await apiClient.get(`/schemes/${numId}`);
      if (response.data) {
        return normalizeBackendScheme(response.data);
      }
    }
  } catch {
    // Fallback
  }
  const evaluated = evaluateAllSchemes(MOCK_SCHEMES, profile);
  return evaluated.find((s) => s.id === id) || null;
}

/**
 * Send a chat message to the AI assistant.
 */
export async function sendChatMessage(message, profile, language = 'en') {
  try {
    const response = await apiClient.post('/chat', {
      message,
      profile,
      language,
    });
    return response.data;
  } catch {
    // Demo fallback
    return generateMockChatResponse(message, profile);
  }
}

/**
 * Upload a document to the backend for analysis.
 */
export async function uploadDocumentToBackend(file, profileId, docId, onProgress) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('profile_id', profileId || 1);
    formData.append('document_type', docId || 'Unknown');

    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  } catch {
    return simulateUpload(file, docId, onProgress);
  }
}

/**
 * Legacy upload function — kept for backward compatibility.
 */
export async function uploadDocument(file, docId, onProgress) {
  return uploadDocumentToBackend(file, null, docId, onProgress);
}

/**
 * Check eligibility for a specific scheme.
 */
export async function checkEligibility(profile, schemeId) {
  try {
    const response = await apiClient.post('/eligibility/check', { profile, schemeId });
    if (response.data?.eligibility) return response.data;
  } catch {
    // Fallback
  }
  const evaluated = evaluateAllSchemes(MOCK_SCHEMES, profile);
  const matched = evaluated.find((s) => s.id === schemeId);
  return {
    schemeId,
    status: matched?.status || 'needs_verification',
    criteria: matched?.eligibility || [],
  };
}

// ---------------------------------------------------------------------------
// Normalization helper
// ---------------------------------------------------------------------------

function normalizeBackendScheme(scheme) {
  return {
    id: String(scheme.id),
    name: scheme.name,
    category: scheme.category,
    department: scheme.department || scheme.ministry,
    description: scheme.description,
    purpose: scheme.description,
    benefits: Array.isArray(scheme.benefits)
      ? scheme.benefits
      : [scheme.benefits],
    status: scheme.status || 'potentially_eligible',
    officialUrl: scheme.application_url || '#',
    sourceUrl: scheme.sources?.[0]?.source_url || scheme.application_url || '#',
    lastVerified: scheme.last_verified,
    governmentLevel: scheme.government_level,
    stateApplicable: scheme.state_applicable,
    demoData: scheme.demo_data !== false,
    eligibility: (scheme.matched_rules || []).map((r) => ({
      criterion: r.label || r.field?.replace(/_/g, ' '),
      userValue: String(r.actual ?? ''),
      requiredValue: `${r.operator} ${r.required}`,
      status: 'passed',
      explanation: `Your profile value (${r.actual}) satisfies the requirement (${r.operator} ${r.required}).`,
    })).concat(
      (scheme.failed_rules || []).map((r) => ({
        criterion: r.label || r.field?.replace(/_/g, ' '),
        userValue: String(r.actual ?? ''),
        requiredValue: `${r.operator} ${r.required}`,
        status: 'failed',
        explanation: `Requirement not satisfied: ${r.field} must be ${r.operator} ${r.required}.`,
      }))
    ).concat(
      (scheme.missing_information || []).map((m) => ({
        criterion: m.field?.replace(/_/g, ' '),
        userValue: 'Not provided',
        requiredValue: String(m.required ?? ''),
        status: 'unknown',
        explanation: m.reason || 'This information is missing from your profile.',
      }))
    ),
    documents: [],
    applicationSteps: [],
  };
}

// ---------------------------------------------------------------------------
// Mock fallbacks
// ---------------------------------------------------------------------------

function generateMockChatResponse(message, profile) {
  const name = profile?.name || 'there';
  const q = message.toLowerCase();

  if (q.includes('scheme') || q.includes('eligible') || q.includes('benefit')) {
    const evaluated = evaluateAllSchemes(MOCK_SCHEMES, profile || {});
    const matches = evaluated.filter((s) =>
      s.status === 'potentially_eligible' || s.status === 'likely_match'
    );
    if (matches.length > 0) {
      const names = matches.slice(0, 3).map((s) => s.name).join(', ');
      return {
        response: `Based on your profile, ${name}, I found ${matches.length} scheme(s) that may be relevant to you — including ${names}. Click on any scheme card below for detailed eligibility criteria and application steps.`,
        mode: 'demo_mock',
        matched_schemes: matches.slice(0, 3).map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          status: s.status,
        })),
        grounded_context: {
          eligible_count: matches.length,
          disclaimer: 'Mock response — AI explanation will use Amazon Bedrock when configured.',
        },
      };
    }
    return {
      response: `Based on your current profile, ${name}, I couldn't find strong scheme matches. Try updating your profile with more details like your occupation, income level, or if you're a student or farmer.`,
      mode: 'demo_mock',
      matched_schemes: [],
      grounded_context: null,
    };
  }

  if (q.includes('document') || q.includes('certificate') || q.includes('aadhaar')) {
    return {
      response: `For most government schemes, you'll typically need: Aadhaar Card (identity), Income Certificate (from Tehsildar), Bank Passbook linked with Aadhaar (for DBT), and category-specific documents like Student ID or Land Records. Visit the Document Checklist to track what you have.`,
      mode: 'demo_mock',
      matched_schemes: null,
      grounded_context: null,
    };
  }

  if (q.includes('apply') || q.includes('how') || q.includes('step')) {
    return {
      response: `To apply for a scheme: (1) Confirm your eligibility on the Schemes page, (2) Gather all required documents, (3) Use the Application Guide to go step-by-step, (4) Click "Apply on Official Government Portal" to go directly to the verified application channel. SchemeSaathi never processes applications — we only guide you to official portals.`,
      mode: 'demo_mock',
      matched_schemes: null,
      grounded_context: null,
    };
  }

  return {
    response: `Hello ${name}! I'm SchemeSaathi AI. I can help you find government schemes, understand eligibility criteria, check your documents, and reach official application portals. Try asking: "Which schemes am I eligible for?" or "What documents do I need?"`,
    mode: 'demo_mock',
    matched_schemes: null,
    grounded_context: null,
  };
}

function simulateUpload(file, docId, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) { reject(new Error('No file selected')); return; }
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (onProgress) onProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        resolve({
          success: true,
          docId,
          fileName: file.name,
          fileSize: file.size,
          status: 'available',
          detected_type: detectTypeFromFilename(file.name),
          confidence: 0.88,
          disclaimer: 'Detected from uploaded file — not officially verified.',
          message: 'Document processed successfully.',
        });
      }
    }, 200);
  });
}

function detectTypeFromFilename(filename) {
  const f = filename.toLowerCase();
  if (f.includes('aadhaar') || f.includes('aadhar')) return 'Aadhaar Card';
  if (f.includes('income')) return 'Income Certificate';
  if (f.includes('student') || f.includes('bonafide')) return 'Student ID / Bonafide Certificate';
  if (f.includes('bank') || f.includes('passbook')) return 'Bank Passbook';
  if (f.includes('marksheet') || f.includes('result')) return 'Marksheet / Degree';
  return 'Document';
}

export default apiClient;
