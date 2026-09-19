from typing import Any, Dict, List, Optional
from pydantic import BaseModel, HttpUrl


class EligibilityRuleSchema(BaseModel):
    field: str
    operator: str
    value: str
    label: Optional[str] = None


class SchemeSourceSchema(BaseModel):
    source_name: str
    source_url: str
    last_verified: Optional[str] = None


class SchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    ministry: str
    category: str
    benefits: str
    application_url: Optional[str] = None
    active: bool
    government_level: Optional[str] = "Central"
    state_applicable: Optional[str] = "All India"
    last_verified: Optional[str] = None
    demo_data: bool = True

    class Config:
        from_attributes = True


class SchemeDetailResponse(BaseModel):
    id: int
    name: str
    description: str
    ministry: str
    category: str
    benefits: str
    application_url: Optional[str] = None
    active: bool
    government_level: Optional[str] = "Central"
    state_applicable: Optional[str] = "All India"
    required_documents: Optional[str] = None   # JSON string
    application_steps: Optional[str] = None    # JSON string
    last_verified: Optional[str] = None
    demo_data: bool = True
    rules: List[EligibilityRuleSchema] = []
    sources: List[SchemeSourceSchema] = []

    class Config:
        from_attributes = True


# --- Recommend endpoint ---

class ProfileForRecommend(BaseModel):
    age: Optional[float] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    area_type: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    student: Optional[bool] = False
    farmer: Optional[bool] = False
    is_disability: Optional[bool] = False
    is_senior: Optional[bool] = False
    is_business_owner: Optional[bool] = False
    is_woman: Optional[bool] = False
    # Frontend field aliases
    annualIncome: Optional[float] = None
    isStudent: Optional[bool] = None
    isFarmer: Optional[bool] = None
    isDisability: Optional[bool] = None
    isSenior: Optional[bool] = None
    isBusinessOwner: Optional[bool] = None
    isWoman: Optional[bool] = None

    def normalized(self) -> dict:
        """Normalize field names to backend conventions."""
        return {
            "age": self.age,
            "gender": self.gender,
            "state": self.state,
            "district": self.district,
            "area_type": self.area_type,
            "annual_income": self.annual_income or self.annualIncome,
            "occupation": self.occupation,
            "employment_status": self.employment_status,
            "student": self.student or self.isStudent or False,
            "farmer": self.farmer or self.isFarmer or False,
            "is_disability": self.is_disability or self.isDisability or False,
            "is_senior": self.is_senior or self.isSenior or False,
            "is_business_owner": self.is_business_owner or self.isBusinessOwner or False,
            "is_woman": self.is_woman or self.isWoman or False,
        }


class SchemeRecommendRequest(BaseModel):
    profile: ProfileForRecommend


class MatchedCriterion(BaseModel):
    criterion: str
    required: str
    actual: Optional[str] = None
    status: str  # passed | failed | unknown


class SchemeRecommendItem(BaseModel):
    id: int
    name: str
    category: str
    department: str
    description: str
    benefits: str
    status: str  # potentially_eligible | needs_more_information | not_currently_matching
    application_url: Optional[str] = None
    government_level: Optional[str] = None
    state_applicable: Optional[str] = None
    last_verified: Optional[str] = None
    demo_data: bool = True
    matched_rules: List[Dict[str, Any]] = []
    failed_rules: List[Dict[str, Any]] = []
    missing_information: List[Dict[str, Any]] = []
    relevance_score: int = 0
    sources: List[SchemeSourceSchema] = []


class SchemeRecommendResponse(BaseModel):
    schemes: List[SchemeRecommendItem]
    total: int
    potentially_eligible_count: int
    profile_summary: Dict[str, Any]
    disclaimer: str = (
        "Scheme information is based on available published data. "
        "Always verify final eligibility on the official government portal."
    )


class DocumentGapResponse(BaseModel):
    scheme_id: int
    scheme_name: str
    total_required: int
    available_count: int
    missing_count: int
    available_documents: List[str]
    missing_documents: List[str]
    readiness_percentage: int


# --- Keep existing response models ---

class SchemeMatchItem(BaseModel):
    scheme_name: str
    category: str
    benefits: str
    status: str
    reason: Optional[str] = None
    application_url: Optional[str] = None
    matched_rules_count: Optional[int] = 0
    failed_rules_count: Optional[int] = 0
    matched_rules: List[Dict[str, Any]] = []
    failed_rules: List[Dict[str, Any]] = []


class SchemeMatchesResponse(BaseModel):
    citizen_name: str
    profile_id: int
    total_schemes_evaluated: int
    eligible_count: Optional[int] = 0
    matches: List[SchemeMatchItem]
