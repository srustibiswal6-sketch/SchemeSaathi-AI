"""
SchemeSaathi AI — AI Chat Service

Orchestrates: profile lookup → scheme retrieval → RAG → BedrockService explanation.
The LLM explains deterministic results. It does NOT make eligibility decisions.
"""
import os
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session

from services import scheme_service, search_service
from services import bedrock_service

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")


def generate_chat_response(
    db: Session,
    profile_id: int,
    message: str,
    language: str = "en",
) -> Dict[str, Any]:
    """
    Generate a grounded chat response for a citizen with a saved profile.
    Uses deterministic eligibility results — LLM only explains, never decides.
    """
    matches_data = scheme_service.match_schemes_for_profile(db, profile_id)
    if not matches_data:
        return {
            "response": f"Profile with ID {profile_id} could not be found. Please create your citizen profile first.",
            "mode": "error",
            "grounded_context": None,
        }

    citizen_name = matches_data["citizen_name"]
    all_matches = matches_data["matches"]
    eligible = [m for m in all_matches if m["status"] == "eligible"]

    # Build context for LLM
    profile_dict = {
        "name": citizen_name,
        "profile_id": profile_id,
    }
    context_schemes = [
        {
            "name": m["scheme_name"],
            "category": m["category"],
            "benefits": m["benefits"],
            "status": m["status"],
        }
        for m in all_matches[:8]
    ]

    raw_response = bedrock_service.answer_question(
        question=message,
        context_schemes=context_schemes,
        profile=profile_dict,
    )

    final_response = bedrock_service.translate_response(raw_response, language)

    return {
        "response": final_response,
        "mode": "demo_mock" if DEMO_MODE else "bedrock_grounded",
        "grounded_context": {
            "eligible_count": len(eligible),
            "total_evaluated": matches_data["total_schemes_evaluated"],
            "schemes_shown": [m["scheme_name"] for m in eligible[:5]],
            "disclaimer": (
                "Scheme information is based on available data. "
                "Always verify on the official government portal."
            ),
        },
    }


def generate_stateless_chat_response(
    db: Session,
    profile: Dict[str, Any],
    message: str,
    language: str = "en",
) -> Dict[str, Any]:
    """
    Generate a grounded chat response using a profile dict (no DB profile_id needed).
    Used when the user chats without having created a saved profile.
    """
    retrieved = search_service.retrieve_relevant_schemes(db=db, profile=profile)

    context_schemes = [
        {
            "name": r["scheme"].name,
            "category": r["scheme"].category,
            "benefits": r["scheme"].benefits,
            "status": r["status"],
            "matched_criteria": len(r["matched_rules"]),
        }
        for r in retrieved[:8]
    ]

    profile_for_llm = {
        "name": profile.get("name") or "Citizen",
        "age": profile.get("age"),
        "state": profile.get("state"),
        "annual_income": profile.get("annual_income") or profile.get("annualIncome"),
        "student": profile.get("student") or profile.get("isStudent"),
        "farmer": profile.get("farmer") or profile.get("isFarmer"),
    }

    raw_response = bedrock_service.answer_question(
        question=message,
        context_schemes=context_schemes,
        profile=profile_for_llm,
    )

    final_response = bedrock_service.translate_response(raw_response, language)
    eligible_count = len([r for r in retrieved if r["status"] == "potentially_eligible"])

    return {
        "response": final_response,
        "mode": "demo_mock" if DEMO_MODE else "bedrock_grounded",
        "matched_schemes": [
            {
                "id": r["scheme"].id,
                "name": r["scheme"].name,
                "category": r["scheme"].category,
                "status": r["status"],
                "application_url": r["scheme"].application_url,
            }
            for r in retrieved[:5]
            if r["status"] in ("potentially_eligible", "needs_more_information")
        ],
        "grounded_context": {
            "eligible_count": eligible_count,
            "total_evaluated": len(retrieved),
            "disclaimer": (
                "Scheme information is based on available data. "
                "Always verify on the official government portal."
            ),
        },
    }
