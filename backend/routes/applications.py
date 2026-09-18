from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from schemas.application import (
    ApplicationCreateRequest,
    ApplicationResponse,
    ApplicationStatusUpdateRequest,
)
from services import application_service, profile_service, scheme_service


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application_record(
    request: ApplicationCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new application tracking record with status 'not_started'."""
    profile = profile_service.get_profile_by_id(db=db, profile_id=request.profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {request.profile_id} not found"
        )

    scheme = scheme_service.get_scheme_by_id(db=db, scheme_id=request.scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with ID {request.scheme_id} not found"
        )

    application = application_service.create_application(
        db=db,
        profile_id=request.profile_id,
        scheme_id=request.scheme_id
    )

    return {
        "id": application.id,
        "profile_id": application.profile_id,
        "scheme_id": application.scheme_id,
        "scheme_name": scheme.name,
        "status": application.status,
        "created_at": application.created_at,
        "updated_at": application.updated_at
    }


@router.get("/{profile_id}", response_model=List[ApplicationResponse])
def get_user_applications(
    profile_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve all application tracking records for a citizen profile."""
    profile = profile_service.get_profile_by_id(db=db, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen profile with ID {profile_id} not found"
        )

    apps = application_service.get_applications_by_profile(db=db, profile_id=profile_id)
    return [
        {
            "id": app.id,
            "profile_id": app.profile_id,
            "scheme_id": app.scheme_id,
            "scheme_name": app.scheme.name if app.scheme else None,
            "status": app.status,
            "created_at": app.created_at,
            "updated_at": app.updated_at
        }
        for app in apps
    ]


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_status(
    application_id: int,
    request: ApplicationStatusUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update application lifecycle status."""
    try:
        updated = application_service.update_application_status(
            db=db,
            application_id=application_id,
            status=request.status
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {application_id} not found"
        )

    return {
        "id": updated.id,
        "profile_id": updated.profile_id,
        "scheme_id": updated.scheme_id,
        "scheme_name": updated.scheme.name if updated.scheme else None,
        "status": updated.status,
        "created_at": updated.created_at,
        "updated_at": updated.updated_at
    }
