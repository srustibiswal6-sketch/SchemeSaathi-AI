import React, { useState, useRef } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2, FileCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { uploadDocument } from '../services/api';

export default function DocumentCard({
  document,
  onStatusChange,
  currentStatus,
  currentFileName,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const docStatus = currentStatus || document.status || 'missing';
  const fileName = currentFileName || document.fileName;

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'File exceeds 10MB limit. Please upload a smaller PDF or image.',
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setFeedback(null);

      await uploadDocument(file, document.id, (progress) => {
        setUploadProgress(progress);
      });

      setIsUploading(false);
      setUploadProgress(100);
      setFeedback({
        type: 'success',
        message: `Uploaded: ${file.name} (Ready for portal upload)`,
      });

      if (onStatusChange) {
        onStatusChange(document.id, 'available', {
          fileName: file.name,
          uploadedAt: new Date().toISOString().split('T')[0],
        });
      }
    } catch {
      setIsUploading(false);
      setFeedback({
        type: 'error',
        message: 'We couldn’t upload this document. Please try again.',
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`document-card doc-status-${docStatus}`}>
      <div className="doc-card-main">
        <div className="doc-icon-box">
          <FileText className="doc-icon" />
        </div>

        <div className="doc-info-col">
          <div className="doc-title-row">
            <h4 className="doc-title">{document.name}</h4>
            <div className="doc-badges">
              {document.required ? (
                <span className="badge-required">Mandatory</span>
              ) : (
                <span className="badge-optional">Optional</span>
              )}
              <StatusBadge status={docStatus} size="small" />
            </div>
          </div>

          <p className="doc-description">{document.description}</p>

          {/* Current file attachment banner if already available */}
          {fileName && (
            <div className="doc-attached-info">
              <FileCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span className="doc-attached-name">Attached: <strong>{fileName}</strong></span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="doc-upload-progress">
              <div className="progress-info-row">
                <span className="text-xs text-slate-600">Uploading document...</span>
                <span className="text-xs font-semibold text-sky-700">{uploadProgress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill progress-upload"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Feedback Alert */}
          {feedback && (
            <div className={`doc-feedback-alert feedback-${feedback.type}`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mr-1.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 mr-1.5 shrink-0" />
              )}
              <span className="feedback-text">{feedback.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="doc-card-action">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.jpg,.jpeg,.png"
          aria-label={`Upload ${document.name}`}
        />

        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className={`btn btn-upload ${docStatus === 'available' ? 'btn-upload-reupload' : 'btn-upload-new'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-1.5" />
              <span>{docStatus === 'available' ? 'Replace File' : 'Upload Document'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
