from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session, joinedload
from database.models import CitizenProfileDB, SchemeDB
from services.eligibility_service import evaluate_eligibility


def list_schemes(
    db: Session,
    category: Optional[str] = None,
    state: Optional[str] = None,
    active: Optional[bool] = None
) -> List[SchemeDB]:
    """Retrieve schemes with optional filtering."""
    query = db.query(SchemeDB).options(joinedload(SchemeDB.rules), joinedload(SchemeDB.sources))

    if active is not None:
        query = query.filter(SchemeDB.active == active)

    if category:
        query = query.filter(SchemeDB.category.ilike(f"%{category}%"))

    schemes = query.all()

    # Optional state-level filter: if state is specified, only include schemes that either have no state rule
    # or have a state rule matching the requested state
    if state:
        filtered = []
        for s in schemes:
            state_rules = [r for r in s.rules if r.field.lower() == "state"]
            if not state_rules or any(r.value.lower() == state.lower() for r in state_rules):
                filtered.append(s)
        return filtered

    return schemes


def get_scheme_by_id(db: Session, scheme_id: int) -> Optional[SchemeDB]:
    """Retrieve a single scheme by ID with its rules and sources loaded."""
    return db.query(SchemeDB).options(
        joinedload(SchemeDB.rules),
        joinedload(SchemeDB.sources)
    ).filter(SchemeDB.id == scheme_id).first()


def match_schemes_for_profile(db: Session, profile_id: int) -> Optional[Dict[str, Any]]:
    """
    Evaluate citizen profile against all active schemes.
    Rank results:
    1. Eligible schemes first
    2. Missing information schemes second
    3. Ineligible schemes last
    """
    profile = db.query(CitizenProfileDB).filter(CitizenProfileDB.id == profile_id).first()
    if not profile:
        return None

    schemes = db.query(SchemeDB).options(joinedload(SchemeDB.rules)).filter(SchemeDB.active == True).all()

    matches = []
    eligible_count = 0

    for scheme in schemes:
        eval_result = evaluate_eligibility(profile, scheme.rules)

        if eval_result["eligible"]:
            status_str = "eligible"
            eligible_count += 1
            sort_weight = 1
        elif len(eval_result["failed_rules"]) == 0 and len(eval_result["missing_information"]) > 0:
            status_str = "missing_information"
            sort_weight = 2
        else:
            status_str = "ineligible"
            sort_weight = 3

        matches.append({
            "scheme_id": scheme.id,
            "scheme_name": scheme.name,
            "ministry": scheme.ministry,
            "category": scheme.category,
            "benefits": scheme.benefits,
            "application_url": scheme.application_url,
            "status": status_str,
            "reason": eval_result["summary"],
            "matched_rules_count": len(eval_result["matched_rules"]),
            "failed_rules_count": len(eval_result["failed_rules"]),
            "_sort_weight": sort_weight
        })

    # Sort matches by ranking weight (eligible first, missing info second, ineligible last)
    matches.sort(key=lambda x: (x["_sort_weight"], x["scheme_name"]))

    # Clean internal sort key
    for m in matches:
        del m["_sort_weight"]

    return {
        "profile_id": profile.id,
        "citizen_name": profile.name,
        "total_schemes_evaluated": len(schemes),
        "eligible_count": eligible_count,
        "matches": matches
    }
