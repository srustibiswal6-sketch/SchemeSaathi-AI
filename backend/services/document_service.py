"""
SchemeSaathi AI — Document Upload and Analysis Service

Orchestrates: file validation → S3 upload → Textract analysis → DB record creation.
In DEMO_MODE: saves locally and uses mock classification.
"""
import json
import os
from typing import Any, Dict, List, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from database.models import DocumentDB, SchemeDB
from services.s3_service import upload_document as s3_upload
from services.textract_service import analyze_document as textract_analyze

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def save_and_analyze_document(
    db: Session,
    profile_id: int,
    document_type: str,
    file: UploadFile,
) -> Dict[str, Any]:
    """
    Save an uploaded document and run analysis pipeline.
    Returns structured result with document type classification.
    """
    # Validate extension
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type '{file_ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read file content
    file_bytes = file.file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError(
            f"File size exceeds maximum limit of {MAX_FILE_SIZE_BYTES // (1024*1024)} MB."
        )

    # Upload to S3 / local
    storage_result = s3_upload(
        file_bytes=file_bytes,
        original_filename=file.filename,
        profile_id=profile_id,
    )

    # Analyze document
    local_path = storage_result.get("local_path")
    analysis = {}
    if local_path and os.path.exists(local_path):
        analysis = textract_analyze(file_path=local_path, filename=file.filename)
    else:
        # S3-based analysis would use Textract S3 integration
        from services.textract_service import classify_document
        analysis = classify_document(file.filename)

    # Use detected type if document_type is generic/empty
    detected_type = analysis.get("document_type", document_type)
    final_type = detected_type if detected_type != "Unknown Document" else document_type
    confidence = analysis.get("confidence", 0.0)

    # Store record
    doc_record = DocumentDB(
        profile_id=profile_id,
        document_type=final_type,
        file_name=file.filename,
        file_path=local_path,
        s3_key=storage_result.get("storage_key"),
        status="processed" if confidence > 0.5 else "uploaded",
        extracted_data=json.dumps({
            "analysis": analysis,
            "storage": storage_result.get("mode"),
        }),
        confidence=confidence,
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    return {
        "document_id": doc_record.id,
        "profile_id": doc_record.profile_id,
        "document_type": doc_record.document_type,
        "file_name": doc_record.file_name,
        "status": doc_record.status,
        "confidence": doc_record.confidence,
        "detected_type": detected_type,
        "extracted_fields": analysis.get("extracted_fields", {}),
        "disclaimer": analysis.get(
            "disclaimer",
            "This classification is detected — not officially verified."
        ),
        "message": (
            f"Document classified as '{final_type}' with "
            f"{int((confidence or 0) * 100)}% confidence. "
            f"This is a detected classification, not official verification."
        ),
    }


def get_documents_by_profile(db: Session, profile_id: int) -> List[DocumentDB]:
    """Retrieve all documents belonging to a citizen profile."""
    return db.query(DocumentDB).filter(DocumentDB.profile_id == profile_id).all()


def get_document_gap_analysis(
    db: Session,
    profile_id: int,
    scheme_id: int,
) -> Dict[str, Any]:
    """
    Compare uploaded documents against scheme requirements.
    Returns gap analysis showing what's available and what's missing.
    """
    import json as _json

    scheme = db.query(SchemeDB).filter(SchemeDB.id == scheme_id).first()
    if not scheme:
        return {"error": "Scheme not found"}

    # Get required documents from scheme
    try:
        required_docs = _json.loads(scheme.required_documents or "[]")
    except Exception:
        required_docs = []

    # Get uploaded documents for this profile
    uploaded = db.query(DocumentDB).filter(
        DocumentDB.profile_id == profile_id,
        DocumentDB.status.in_(["uploaded", "processed"]),
    ).all()

    uploaded_types = {doc.document_type.lower() for doc in uploaded}

    available = []
    missing = []
    for req_doc in required_docs:
        doc_name = req_doc if isinstance(req_doc, str) else req_doc.get("name", "")
        if any(doc_name.lower() in ut or ut in doc_name.lower() for ut in uploaded_types):
            available.append(doc_name)
        else:
            missing.append(doc_name)

    return {
        "scheme_id": scheme_id,
        "scheme_name": scheme.name,
        "total_required": len(required_docs),
        "available_count": len(available),
        "missing_count": len(missing),
        "available_documents": available,
        "missing_documents": missing,
        "readiness_percentage": round(
            (len(available) / len(required_docs) * 100) if required_docs else 100
        ),
    }
