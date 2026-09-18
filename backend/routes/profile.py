from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.profile import (
    CitizenProfile,
    CitizenProfileCreate,
    CitizenProfileResponse,
    CitizenProfileUpdate,
    ProfileCreatedResponse,
)
from services import profile_service


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)


@router.post("", response_model=ProfileCreatedResponse, status_code=status.HTTP_201_CREATED)
def create_profile(profile: CitizenProfileCreate, db: Session = Depends(get_db)):
    """Create a new citizen profile and save it to the database."""
    created_profile = profile_service.create_profile(db=db, profile_data=profile)
    return {
        "message": "Profile created successfully",
        "profile_id": created_profile.id,
        "profile": created_profile
    }


@router.get("/{profile_id}", response_model=CitizenProfileResponse)
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    """Retrieve an existing citizen profile by ID."""
    profile = profile_service.get_profile_by_id(db=db, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )
    return profile


@router.put("/{profile_id}", response_model=CitizenProfileResponse)
def update_profile(
    profile_id: int,
    update_data: CitizenProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update details of an existing citizen profile."""
    updated = profile_service.update_profile(db=db, profile_id=profile_id, update_data=update_data)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )
    return updated