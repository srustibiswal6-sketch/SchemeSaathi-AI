from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.scheme import SchemeDetailResponse, SchemeMatchesResponse, SchemeResponse
from services import scheme_service


router = APIRouter(
    prefix="/api/schemes",
    tags=["Schemes"]
)


@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    category: Optional[str] = Query(None, description="Filter schemes by category name"),
    state: Optional[str] = Query(None, description="Filter schemes applicable to a specific state"),
    active: Optional[bool] = Query(True, description="Filter schemes by active status"),
    db: Session = Depends(get_db)
):
    """List available government schemes with optional category, state, and active filtering."""
    schemes = scheme_service.list_schemes(db=db, category=category, state=state, active=active)
    return schemes


@router.get("/matches/{profile_id}", response_model=SchemeMatchesResponse)
def get_scheme_matches(profile_id: int, db: Session = Depends(get_db)):
    """
    Evaluate deterministic scheme eligibility for a given citizen profile.
    Returns ranked matches with eligible schemes first.
    """
    result = scheme_service.match_schemes_for_profile(db=db, profile_id=profile_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )
    return result


@router.get("/{scheme_id}", response_model=SchemeDetailResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a specific government scheme including rules and sources."""
    scheme = scheme_service.get_scheme_by_id(db=db, scheme_id=scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {scheme_id} not found"
        )
    return scheme
