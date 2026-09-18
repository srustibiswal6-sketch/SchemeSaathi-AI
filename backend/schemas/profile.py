from typing import Optional
from pydantic import BaseModel, ConfigDict


class CitizenProfile(BaseModel):
    name: str
    age: int
    gender: str
    state: str
    district: str
    annual_income: float
    occupation: str
    student: bool = False
    farmer: bool = False

    model_config = ConfigDict(from_attributes=True)


class CitizenProfileCreate(CitizenProfile):
    pass


class CitizenProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    student: Optional[bool] = None
    farmer: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class CitizenProfileResponse(CitizenProfile):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProfileCreatedResponse(BaseModel):
    message: str
    profile_id: int
    profile: CitizenProfileResponse