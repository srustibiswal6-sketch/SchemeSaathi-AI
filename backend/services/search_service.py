"""
SchemeSaathi AI — Scheme Search Service

Provides keyword-based and profile-based scheme search/retrieval.
Designed as the retrieval step in the RAG pipeline.
Local SQLite-based fallback — no OpenSearch required for demo.
"""
import os
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from database.models import SchemeDB, CitizenProfileDB
from services.eligibility_service import evaluate_eligibility


def search_schemes(
    db: Session,
    query: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    active: bool = True,
) -> List[SchemeDB]:
    """
    Keyword + filter search across schemes.
    Searches: name, description, ministry, category, state_applicable.
    """
    q = db.query(SchemeDB).filter(SchemeDB.active == active)

    if category:
        q = q.filter(SchemeDB.category.ilike(f"%{category}%"))

    if state:
        q = q.filter(
            (SchemeDB.state_applicable == "All India") |
            (SchemeDB.state_applicable.ilike(f"%{state}%"))
        )

    schemes = q.all()

    if not query or not query.strip():
        return schemes

    # Score by keyword match
    query_lower = query.lower()
    keywords = query_lower.split()

    def score(scheme: SchemeDB) -> int:
        text = (
            (scheme.name or "") + " " +
            (scheme.description or "") + " " +
            (scheme.ministry or "") + " " +
            (scheme.category or "") + " " +
            (scheme.state_applicable or "")
        ).lower()
        return sum(1 for kw in keywords if kw in text)

    scored = [(scheme, score(scheme)) for scheme in schemes]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [s for s, sc in scored if sc > 0] or schemes


def retrieve_relevant_schemes(
    db: Session,
    profile: Dict[str, Any],
    limit: int = 20,
) -> List[Dict[str, Any]]:
    """
    RAG retrieval step: find schemes relevant to a citizen profile.
    Runs deterministic eligibility on each scheme and returns enriched results.
    """
    # Filter by state first for efficiency
    citizen_state = profile.get("state", "")
    schemes = db.query(SchemeDB).filter(SchemeDB.active == True).all()

    results = []
    for scheme in schemes:
        # State filter
        if scheme.state_applicable and scheme.state_applicable != "All India":
            if citizen_state.lower() not in scheme.state_applicable.lower():
                continue

        # Run deterministic eligibility
        eval_result = evaluate_eligibility(profile=profile, rules=scheme.rules)

        # Build enriched result
        matched = eval_result["matched_rules"]
        failed = eval_result["failed_rules"]
        missing = eval_result["missing_information"]

        if failed:
            status = "not_currently_matching"
        elif missing:
            status = "needs_more_information"
        else:
            status = "potentially_eligible"

        # Relevance score for ordering (not eligibility probability)
        relevance = len(matched) * 2 - len(failed) * 3

        results.append({
            "scheme": scheme,
            "status": status,
            "matched_rules": matched,
            "failed_rules": failed,
            "missing_information": missing,
            "relevance_score": relevance,
            "summary": eval_result["summary"],
        })

    # Sort: potentially_eligible first, then needs_info, then not_matching
    priority = {"potentially_eligible": 0, "needs_more_information": 1, "not_currently_matching": 2}
    results.sort(key=lambda x: (priority.get(x["status"], 3), -x["relevance_score"]))

    return results[:limit]
