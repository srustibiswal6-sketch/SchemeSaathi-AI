from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.chat import ChatRequest, ChatResponse
from services import ai_service, profile_service


router = APIRouter(
    prefix="/api/chat",
    tags=["AI Assistant"]
)


@router.post("", response_model=ChatResponse)
def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Interact with the SchemeSaathi AI Assistant.
    The assistant explains deterministic eligibility results in natural language without making independent decisions.
    """
    profile = profile_service.get_profile_by_id(db=db, profile_id=request.profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {request.profile_id} not found"
        )

    ai_result = ai_service.generate_chat_response(
        db=db,
        profile_id=request.profile_id,
        message=request.message
    )

    return ai_result
