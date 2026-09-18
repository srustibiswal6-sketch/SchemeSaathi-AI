from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class EligibilityRuleResponse(BaseModel):
    id: int
    field: str
    operator: str
    value: str

    model_config = ConfigDict(from_attributes=True)


class SchemeSourceResponse(BaseModel):
    id: int
    source_name: str
    source_url: str
    last_verified: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    ministry: str
    category: str
    benefits: str
    application_url: Optional[str] = None
    active: bool

    model_config = ConfigDict(from_attributes=True)


class SchemeDetailResponse(SchemeResponse):
    rules: List[EligibilityRuleResponse] = []
    sources: List[SchemeSourceResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SchemeMatchItem(BaseModel):
    scheme_id: int
    scheme_name: str
    ministry: str
    category: str
    benefits: str
    application_url: Optional[str] = None
    status: str  # "eligible", "missing_information", "ineligible"
    reason: str
    matched_rules_count: int
    failed_rules_count: int


class SchemeMatchesResponse(BaseModel):
    profile_id: int
    citizen_name: str
    total_schemes_evaluated: int
    eligible_count: int
    matches: List[SchemeMatchItem]
