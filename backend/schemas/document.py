from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    id: int
    profile_id: int
    document_type: str
    file_name: str
    status: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DocumentAnalysisResponse(BaseModel):
    document_id: int
    profile_id: int
    document_type: str
    file_name: str
    status: str
    message: str
    extracted_data: Optional[Dict[str, Any]] = None
