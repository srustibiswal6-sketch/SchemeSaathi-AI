import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.scheme import (
    SchemeDetailResponse,
    SchemeMatchesResponse,
    SchemeRecommendRequest,
    SchemeRecommendResponse,
    SchemeRecommendItem,
    DocumentGapResponse,
    SchemeResponse,
)
from services import scheme_service, search_service


router = APIRouter(
    prefix="/api/schemes",
    tags=["Schemes"],
)


@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    active: Optional[bool] = Query(True),
    q: Optional[str] = Query(None, description="Keyword search"),
    db: Session = Depends(get_db),
):
    """List available government schemes with optional filtering and keyword search."""
    return search_service.search_schemes(
        db=db, query=q, category=category, state=state, active=active
    )


@router.post("/recommend", response_model=SchemeRecommendResponse)
def recommend_schemes(
    request: SchemeRecommendRequest,
    db: Session = Depends(get_db),
):
    """
    Recommend schemes for a citizen profile using the deterministic eligibility engine.
    Accepts a profile dict — no need for a saved DB profile.
    This is the primary endpoint used by the frontend.
    """
    profile_dict = request.profile.normalized()
    retrieved = search_service.retrieve_relevant_schemes(db=db, profile=profile_dict)

    items = []
    for r in retrieved:
        scheme = r["scheme"]
        sources = [
            {"source_name": s.source_name, "source_url": s.source_url, "last_verified": s.last_verified}
            for s in (scheme.sources or [])
        ]
        items.append(SchemeRecommendItem(
            id=scheme.id,
            name=scheme.name,
            category=scheme.category,
            department=scheme.ministry,
            description=scheme.description,
            benefits=scheme.benefits,
            status=r["status"],
            application_url=scheme.application_url,
            government_level=scheme.government_level,
            state_applicable=scheme.state_applicable,
            last_verified=scheme.last_verified,
            demo_data=scheme.demo_data,
            matched_rules=r["matched_rules"],
            failed_rules=r["failed_rules"],
            missing_information=r["missing_information"],
            relevance_score=r["relevance_score"],
            sources=sources,
        ))

    eligible_count = sum(1 for item in items if item.status == "potentially_eligible")

    return SchemeRecommendResponse(
        schemes=items,
        total=len(items),
        potentially_eligible_count=eligible_count,
        profile_summary={
            "age": profile_dict.get("age"),
            "state": profile_dict.get("state"),
            "annual_income": profile_dict.get("annual_income"),
            "student": profile_dict.get("student"),
            "farmer": profile_dict.get("farmer"),
        },
    )


@router.get("/matches/{profile_id}", response_model=SchemeMatchesResponse)
def get_scheme_matches(profile_id: int, db: Session = Depends(get_db)):
    """Evaluate scheme eligibility for a saved citizen profile."""
    result = scheme_service.match_schemes_for_profile(db=db, profile_id=profile_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found",
        )
    return result


@router.get("/{scheme_id}/documents", response_model=DocumentGapResponse)
def get_scheme_documents(
    scheme_id: int,
    profile_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get document gap analysis for a scheme (optionally against a citizen's uploaded docs)."""
    if profile_id:
        from services.document_service import get_document_gap_analysis
        gap = get_document_gap_analysis(db=db, profile_id=profile_id, scheme_id=scheme_id)
        if "error" in gap:
            raise HTTPException(status_code=404, detail=gap["error"])
        return gap

    # Without profile, just return scheme's required documents
    from database.models import SchemeDB
    scheme = db.query(SchemeDB).filter(SchemeDB.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    try:
        req_docs = json.loads(scheme.required_documents or "[]")
    except Exception:
        req_docs = []
    return DocumentGapResponse(
        scheme_id=scheme_id,
        scheme_name=scheme.name,
        total_required=len(req_docs),
        available_count=0,
        missing_count=len(req_docs),
        available_documents=[],
        missing_documents=req_docs,
        readiness_percentage=0,
    )


@router.get("/{scheme_id}/application")
def get_scheme_application_guide(scheme_id: int, db: Session = Depends(get_db)):
    """Get application steps and official portal for a scheme."""
    from database.models import SchemeDB
    scheme = db.query(SchemeDB).filter(SchemeDB.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    try:
        steps = json.loads(scheme.application_steps or "[]")
    except Exception:
        steps = []
    return {
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "department": scheme.ministry,
        "official_url": scheme.application_url,
        "application_steps": steps,
        "last_verified": scheme.last_verified,
        "disclaimer": (
            "SchemeSaathi AI does not process applications. "
            "Please apply directly on the official government portal."
        ),
    }


@router.get("/{scheme_id}", response_model=SchemeDetailResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Get full details of a government scheme."""
    scheme = scheme_service.get_scheme_by_id(db=db, scheme_id=scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {scheme_id} not found",
        )
    return scheme
