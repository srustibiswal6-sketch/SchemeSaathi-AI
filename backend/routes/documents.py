from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database.database import get_db
from services import document_service


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


@router.post("/upload", status_code=201)
def upload_document(
    profile_id: int = Form(...),
    document_type: str = Form(default="Unknown"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a citizen document.
    File is saved securely and analyzed using the Textract pipeline (or mock in demo mode).
    Returns detected document type and classification confidence.
    """
    try:
        result = document_service.save_and_analyze_document(
            db=db,
            profile_id=profile_id,
            document_type=document_type,
            file=file,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(e)}",
        )


@router.post("/analyze", status_code=201)
def analyze_document_only(
    profile_id: int = Form(...),
    document_type: str = Form(default="Unknown"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Analyze a document without persisting to a profile.
    Returns document type classification and extracted fields.
    """
    try:
        result = document_service.save_and_analyze_document(
            db=db,
            profile_id=profile_id,
            document_type=document_type,
            file=file,
        )
        return {
            **result,
            "mode": "analysis_only",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/profile/{profile_id}")
@router.get("/{profile_id}")
def get_profile_documents(profile_id: int, db: Session = Depends(get_db)):
    """Get all documents uploaded by a citizen profile."""
    docs = document_service.get_documents_by_profile(db=db, profile_id=profile_id)
    return [
        {
            "id": d.id,
            "document_type": d.document_type,
            "file_name": d.file_name,
            "status": d.status,
            "confidence": d.confidence,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in docs
    ]
