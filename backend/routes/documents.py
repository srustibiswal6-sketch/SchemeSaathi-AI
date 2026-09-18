from typing import List
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.document import DocumentAnalysisResponse, DocumentResponse
from services import document_service, profile_service


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


@router.post("/analyze", response_model=DocumentAnalysisResponse, status_code=status.HTTP_201_CREATED)
def upload_and_analyze_document(
    profile_id: int = Form(..., description="The ID of the citizen profile"),
    document_type: str = Form(..., description="Type of document (e.g. aadhaar, income_certificate, land_records)"),
    file: UploadFile = File(..., description="Document file to upload (.pdf, .png, .jpg, .jpeg)"),
    db: Session = Depends(get_db)
):
    """
    Upload and analyze a citizen document.
    Stores the document securely and initializes metadata extraction.
    Designed with a clean integration point for AWS Textract.
    """
    profile = profile_service.get_profile_by_id(db=db, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )

    try:
        result = document_service.save_and_analyze_document(
            db=db,
            profile_id=profile_id,
            document_type=document_type,
            file=file
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{profile_id}", response_model=List[DocumentResponse])
def get_user_documents(profile_id: int, db: Session = Depends(get_db)):
    """Retrieve all uploaded documents for a citizen profile."""
    profile = profile_service.get_profile_by_id(db=db, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )
    return document_service.get_documents_by_profile(db=db, profile_id=profile_id)
