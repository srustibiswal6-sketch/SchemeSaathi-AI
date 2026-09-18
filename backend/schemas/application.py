from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


VALID_STATUSES = {
    "not_started",
    "documents_pending",
    "ready_to_apply",
    "applied",
    "completed"
}


class ApplicationCreateRequest(BaseModel):
    profile_id: int
    scheme_id: int


class ApplicationStatusUpdateRequest(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    profile_id: int
    scheme_id: int
    scheme_name: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
