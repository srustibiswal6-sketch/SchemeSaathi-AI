from typing import Any, List, Optional
from pydantic import BaseModel


class EligibilityCheckRequest(BaseModel):
    profile_id: int
    scheme_id: int


class RuleEvaluationItem(BaseModel):
    field: str
    operator: str
    required: Any
    actual: Any


class MissingInfoItem(BaseModel):
    field: str
    operator: str
    required: Any
    reason: str


class EligibilityCheckResponse(BaseModel):
    scheme_id: int
    scheme_name: str
    profile_id: int
    eligible: bool
    matched_rules: List[RuleEvaluationItem] = []
    failed_rules: List[RuleEvaluationItem] = []
    missing_information: List[MissingInfoItem] = []
    summary: str
