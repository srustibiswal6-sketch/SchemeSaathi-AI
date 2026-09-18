from typing import Optional
from sqlalchemy.orm import Session
from database.models import CitizenProfileDB
from schemas.profile import CitizenProfileCreate, CitizenProfileUpdate


def create_profile(db: Session, profile_data: CitizenProfileCreate) -> CitizenProfileDB:
    """Create a new citizen profile record in the database."""
    db_profile = CitizenProfileDB(
        name=profile_data.name,
        age=profile_data.age,
        gender=profile_data.gender,
        state=profile_data.state,
        district=profile_data.district,
        annual_income=profile_data.annual_income,
        occupation=profile_data.occupation,
        student=profile_data.student,
        farmer=profile_data.farmer,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_profile_by_id(db: Session, profile_id: int) -> Optional[CitizenProfileDB]:
    """Retrieve a citizen profile by its database ID."""
    return db.query(CitizenProfileDB).filter(CitizenProfileDB.id == profile_id).first()


def update_profile(db: Session, profile_id: int, update_data: CitizenProfileUpdate) -> Optional[CitizenProfileDB]:
    """Update existing citizen profile attributes."""
    profile = get_profile_by_id(db, profile_id)
    if not profile:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
