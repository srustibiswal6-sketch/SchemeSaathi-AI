from typing import Any, Dict, Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    profile_id: int
    message: str


class ChatResponse(BaseModel):
    response: str
    mode: str  # "rule_based_assistant" or "llm_grounded"
    grounded_context: Optional[Dict[str, Any]] = None
