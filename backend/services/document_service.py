import json
import os
import shutil
import uuid
from typing import Any, Dict, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from database.models import DocumentDB


UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


def save_and_analyze_document(
    db: Session,
    profile_id: int,
    document_type: str,
    file: UploadFile
) -> Dict[str, Any]:
    """
    Save uploaded citizen document and generate metadata.
    Designed with a clean abstraction layer for upcoming AWS Textract integration.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file extension '{file_ext}'. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Sanitize and create unique file storage name
    unique_filename = f"{profile_id}_{uuid.uuid4().hex[:8]}_{file.filename}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(saved_path)

    # Metadata extraction abstraction (ready for AWS Textract)
    extracted_metadata = {
        "original_filename": file.filename,
        "file_format": file_ext.replace(".", "").upper(),
        "file_size_bytes": file_size,
        "ocr_engine": "AWS_Textract_Integration_Placeholder",
        "verification_status": "Document stored; pending AWS Textract OCR extraction",
        "target_fields": ["document_holder_name", "id_reference_number", "verification_date"]
    }

    # Store in database
    doc_record = DocumentDB(
        profile_id=profile_id,
        document_type=document_type,
        file_name=file.filename,
        file_path=saved_path,
        status="uploaded",
        extracted_data=json.dumps(extracted_metadata)
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
        "message": "Document uploaded and registered successfully. Ready for AWS Textract OCR pipeline.",
        "extracted_data": extracted_metadata
    }


def get_documents_by_profile(db: Session, profile_id: int):
    """Retrieve all documents belonging to a citizen profile."""
    return db.query(DocumentDB).filter(DocumentDB.profile_id == profile_id).all()
