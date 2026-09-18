import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { MOCK_SCHEMES } from '../data/mockSchemes';
import DocumentCard from '../components/DocumentCard';
import ProgressBar from '../components/ProgressBar';
import { 
  FolderCheck, 
  ArrowRight, 
  Info,
  Filter
} from 'lucide-react';

const COMMON_DOCUMENTS = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    required: true,
    description: 'Unique 12-digit identity proof with up-to-date mobile number linked.',
    category: 'Identity Proof',
  },
  {
    id: 'income-cert',
    name: 'Income Certificate',
    required: true,
    description: 'Issued by competent Revenue Authority (Tehsildar/SDM/Revenue Inspector) for current FY.',
    category: 'Income Proof',
  },
  {
    id: 'bank-passbook',
    name: 'Bank Passbook / Cancelled Cheque',
    required: true,
    description: 'Bank account in citizen name enabled for Direct Benefit Transfer (DBT/Aadhaar seeded).',
    category: 'Financial Details',
  },
  {
    id: 'student-id',
    name: 'Student ID / Institution Bonafide Certificate',
    required: false,
    description: 'Official proof of ongoing college or university enrollment.',
    category: 'Educational Proof',
  },
  {
    id: 'land-record',
    name: 'Land Ownership Record (Khata/Khasra/RoR)',
    required: false,
    description: 'Certified copy of land record showing cultivable land acreage in applicant name.',
    category: 'Property Proof',
  },
  {
    id: 'ration-card',
    name: 'Ration Card / NFSA Card',
    required: false,
    description: 'Food security card indicating household family member composition.',
    category: 'Household Proof',
  },
  {
    id: 'business-proof',
    name: 'Business Registration / Udyam Certificate',
    required: false,
    description: 'Udyam registration or municipal shop license for micro-enterprise loans.',
    category: 'Enterprise Proof',
  },
  {
    id: 'job-card',
    name: 'MGNREGA Job Card',
    required: false,
    description: 'Rural employment guarantee card for rural housing labor linkage.',
    category: 'Employment Proof',
  },
  {
    id: 'previous-marksheet',
    name: 'Previous Year Marksheet / Degree',
    required: false,
    description: 'Class 10th/12th or preceding semester degree examination marksheet.',
    category: 'Educational Proof',
  },
];

export default function Documents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const schemeParam = searchParams.get('schemeId');
  const { documents: storedDocs, setDocumentStatus } = useProfile();

  // Find active scheme if filtered
  const activeScheme = useMemo(() => {
    return MOCK_SCHEMES.find((s) => s.id === schemeParam) || null;
  }, [schemeParam]);

  // Determine list of documents to show: either scheme specific or common citizen pool
  const documentsToShow = useMemo(() => {
    if (activeScheme && activeScheme.documents) {
      return activeScheme.documents;
    }
    return COMMON_DOCUMENTS;
  }, [activeScheme]);

  // Document status calculations
  const totalCount = documentsToShow.length;
  const availableCount = documentsToShow.filter(
    (doc) => (storedDocs[doc.id]?.status || doc.status) === 'available'
  ).length;
  const missingCount = documentsToShow.filter(
    (doc) => (storedDocs[doc.id]?.status || doc.status) === 'missing'
  ).length;
  const verificationCount = totalCount - availableCount - missingCount;

  const handleStatusChange = (docId, newStatus, details) => {
    setDocumentStatus(docId, newStatus, details);
  };

  return (
    <div className="page-documents-container">
      {/* Header Band */}
      <div className="documents-header-band">
        <div className="documents-header-content">
          <span className="documents-eyebrow">
            <FolderCheck className="w-4 h-4 text-emerald-600 mr-1.5 inline" />
            CITIZEN READINESS AUDIT
          </span>
          <h1 className="documents-title">Document Checklist</h1>
          <p className="documents-subtext">
            Check which documents you have and upload copies to ensure quick verification on official portals.
          </p>

          {/* Scheme Filter Bar */}
          <div className="scheme-filter-selector-row">
            <span className="filter-selector-label">
              <Filter className="w-4 h-4 mr-1.5 inline text-slate-500" />
              Showing documents for:
            </span>
            <select
              value={schemeParam || 'all'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') {
                  searchParams.delete('schemeId');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ schemeId: val });
                }
              }}
              className="scheme-filter-dropdown"
              aria-label="Filter documents by scheme"
            >
              <option value="all">All Essential Citizen Documents</option>
              {MOCK_SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="documents-main-layout">
        {/* Document Readiness Progress Card */}
        <div className="document-summary-card">
          <div className="summary-stat-group">
            <div className="summary-stat-header">
              <h3 className="summary-stat-title">
                {availableCount} of {totalCount} documents available
              </h3>
              <span className="summary-stat-tag">
                {Math.round((availableCount / (totalCount || 1)) * 100)}% Complete
              </span>
            </div>

            <ProgressBar
              type="fraction"
              value={availableCount}
              max={totalCount}
              color="emerald"
            />
          </div>

          <div className="summary-breakdown-row">
            <div className="breakdown-item item-available">
              <span className="breakdown-dot dot-available"></span>
              <span>Available: <strong>{availableCount}</strong></span>
            </div>
            <div className="breakdown-item item-missing">
              <span className="breakdown-dot dot-missing"></span>
              <span>Missing: <strong>{missingCount}</strong></span>
            </div>
            {verificationCount > 0 && (
              <div className="breakdown-item item-verification">
                <span className="breakdown-dot dot-verification"></span>
                <span>Needs Verification: <strong>{verificationCount}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Informative Note */}
        <div className="documents-info-note">
          <Info className="w-4 h-4 text-sky-700 mr-2 shrink-0 mt-0.5" />
          <p>
            <strong>Zero Data Exposure:</strong> Selected documents are validated and prepared inside your browser environment. 
            When you visit the official government portal, you can easily upload these files without searching for them.
          </p>
        </div>

        {/* Document Cards List */}
        <div className="document-cards-list">
          {documentsToShow.map((doc) => {
            const state = storedDocs[doc.id] || {};
            const currentStatus = state.status || doc.status || 'missing';
            const currentFileName = state.fileName || null;

            return (
              <DocumentCard
                key={doc.id}
                document={doc}
                currentStatus={currentStatus}
                currentFileName={currentFileName}
                onStatusChange={handleStatusChange}
              />
            );
          })}
        </div>

        {/* Bottom Action Card */}
        <div className="documents-cta-card">
          <div className="cta-text-col">
            <h3 className="cta-card-title">Ready with your paperwork?</h3>
            <p className="cta-card-desc">
              {activeScheme
                ? `Proceed to the official application instructions for ${activeScheme.name}.`
                : 'Review the step-by-step application walkthrough to file your claim on official portals.'}
            </p>
          </div>

          <div className="cta-actions-col">
            {activeScheme ? (
              <Link to={`/application/${activeScheme.id}`} className="btn btn-primary">
                <span>View Application Guide</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            ) : (
              <Link to="/schemes" className="btn btn-primary">
                <span>Explore Recommended Schemes</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
