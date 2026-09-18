import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  age: '22',
  gender: 'Female',
  state: 'Odisha',
  district: 'Khordha',
  areaType: 'Rural',
  annualIncome: '180000',
  occupation: 'Student / Part-time',
  employmentStatus: 'Student',
  isStudent: true,
  isFarmer: false,
  isDisability: false,
  isSenior: false,
  isBusinessOwner: false,
  isWoman: true,
  isVeteran: false,
};

const DEFAULT_DOCUMENTS = {
  'aadhaar': { status: 'available', fileName: 'aadhaar_verified_uidai.pdf', uploadedAt: '2026-02-10' },
  'bank-passbook': { status: 'available', fileName: 'sbi_dbt_passbook.pdf', uploadedAt: '2026-02-11' },
  'student-id': { status: 'available', fileName: 'bonafide_cert_2025_26.pdf', uploadedAt: '2026-02-12' },
  'income-cert': { status: 'missing', fileName: null, uploadedAt: null },
  'land-record': { status: 'missing', fileName: null, uploadedAt: null },
  'ration-card': { status: 'missing', fileName: null, uploadedAt: null },
  'business-proof': { status: 'missing', fileName: null, uploadedAt: null },
  'job-card': { status: 'missing', fileName: null, uploadedAt: null },
  'project-report': { status: 'missing', fileName: null, uploadedAt: null },
  'previous-marksheet': { status: 'needs_verification', fileName: 'semester_marksheet.pdf', uploadedAt: '2026-02-14' },
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('schemesaathi_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('schemesaathi_documents');
      return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('schemesaathi_profile', JSON.stringify(profile));
    } catch {
      // Ignore write errors
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('schemesaathi_documents', JSON.stringify(documents));
    } catch {
      // Ignore write errors
    }
  }, [documents]);

  const updateProfile = (fields) => {
    setProfile((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    setDocuments(DEFAULT_DOCUMENTS);
  };

  const setDocumentStatus = (docId, status, details = {}) => {
    setDocuments((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || {}),
        status,
        fileName: details.fileName || prev[docId]?.fileName || null,
        uploadedAt: details.uploadedAt || new Date().toISOString().split('T')[0],
      },
    }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        documents,
        setDocumentStatus,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
