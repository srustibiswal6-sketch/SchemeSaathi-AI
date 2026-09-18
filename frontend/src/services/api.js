import axios from 'axios';
import { MOCK_SCHEMES, evaluateAllSchemes } from '../data/mockSchemes';

// Configure Axios instance using VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch schemes recommendations tailored to citizen's profile.
 * Gracefully falls back to dynamic client evaluation on mock data if backend is offline.
 */
export async function getSchemes(profile) {
  try {
    const response = await apiClient.post('/schemes/recommend', { profile });
    if (response.data && Array.isArray(response.data.schemes)) {
      return response.data.schemes;
    }
  } catch {
    // Graceful fallback for offline / mock mode
  }

  // Fallback: evaluate mock data using current profile
  return evaluateAllSchemes(MOCK_SCHEMES, profile);
}

/**
 * Fetch a single scheme by its unique identifier.
 */
export async function getScheme(id, profile) {
  try {
    const response = await apiClient.get(`/schemes/${id}`, { params: { profile } });
    if (response.data && response.data.scheme) {
      return response.data.scheme;
    }
  } catch {
    // Graceful fallback for offline / mock mode
  }

  const evaluated = evaluateAllSchemes(MOCK_SCHEMES, profile);
  return evaluated.find((s) => s.id === id) || null;
}

/**
 * Perform detailed eligibility verification on a scheme.
 */
export async function checkEligibility(profile, schemeId) {
  try {
    const response = await apiClient.post('/eligibility/check', { profile, schemeId });
    if (response.data && response.data.eligibility) {
      return response.data;
    }
  } catch {
    // Fallback: return mock eligibility
  }

  const evaluated = evaluateAllSchemes(MOCK_SCHEMES, profile);
  const matched = evaluated.find((s) => s.id === schemeId);
  return {
    schemeId,
    status: matched?.status || 'needs_verification',
    criteria: matched?.eligibility || []
  };
}

/**
 * Upload a citizen document for processing.
 * Simulates network upload with progress callbacks for frontend testing
 * before AWS / OCR backend integration.
 */
export async function uploadDocument(file, docId, onProgress) {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('docId', docId);

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
    // Graceful local simulation when backend endpoint is not yet connected
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 25;
        if (onProgress) onProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          resolve({
            success: true,
            docId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
            status: 'available',
            message: 'Document stored locally for verification review.'
          });
        }
      }, 150);
    });
  }
}

export default apiClient;
