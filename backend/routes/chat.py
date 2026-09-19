from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.database import get_db
from services import ai_service


router = APIRouter(
    prefix="/api/chat",
    tags=["AI Assistant"],
)


class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # en | hi | or
    # Option A: use a saved profile by ID
    profile_id: Optional[int] = None
    # Option B: pass profile dict directly (stateless chat)
    profile: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    mode: str
    matched_schemes: Optional[list] = None
    grounded_context: Optional[Dict[str, Any]] = None


@router.post("", response_model=ChatResponse)
def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    Interact with SchemeSaathi AI Assistant.

    The assistant explains deterministic eligibility results in natural language.
    It does NOT independently decide eligibility — that is handled by the rule engine.

    Accepts either:
    - profile_id (integer) — for citizens with a saved DB profile
    - profile (dict) — for stateless chat with a profile passed from the frontend
    """
    if request.profile_id:
        result = ai_service.generate_chat_response(
            db=db,
            profile_id=request.profile_id,
            message=request.message,
            language=request.language,
        )
    elif request.profile:
        result = ai_service.generate_stateless_chat_response(
            db=db,
            profile=request.profile,
            message=request.message,
            language=request.language,
        )
    else:
        # No profile provided — generic helpful response
        return ChatResponse(
            response=(
                "Hello! I'm SchemeSaathi AI. To find government schemes relevant to you, "
                "please fill in your citizen profile first. I'll then be able to match "
                "you with schemes you may be eligible for and explain why."
            ),
            mode="no_profile",
            grounded_context=None,
        )

    return ChatResponse(
        response=result["response"],
        mode=result["mode"],
        matched_schemes=result.get("matched_schemes"),
        grounded_context=result.get("grounded_context"),
    )
