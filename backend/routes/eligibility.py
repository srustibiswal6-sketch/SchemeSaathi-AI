from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse
from services import eligibility_service, profile_service, scheme_service


router = APIRouter(
    prefix="/api/eligibility",
    tags=["Eligibility"]
)


@router.post("/check", response_model=EligibilityCheckResponse)
def check_eligibility(
    request: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Run deterministic, rule-based eligibility evaluation for a citizen against a scheme.
    Guarantees that no LLM or arbitrary eval() influences the eligibility determination.
    """
    profile = profile_service.get_profile_by_id(db=db, profile_id=request.profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {request.profile_id} not found"
        )

    scheme = scheme_service.get_scheme_by_id(db=db, scheme_id=request.scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {request.scheme_id} not found"
        )

    eval_result = eligibility_service.evaluate_eligibility(profile=profile, rules=scheme.rules)

    return {
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "profile_id": profile.id,
        "eligible": eval_result["eligible"],
        "matched_rules": eval_result["matched_rules"],
        "failed_rules": eval_result["failed_rules"],
        "missing_information": eval_result["missing_information"],
        "summary": eval_result["summary"]
    }
