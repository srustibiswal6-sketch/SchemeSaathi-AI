from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from database.models import ApplicationDB
from schemas.application import VALID_STATUSES


def create_application(db: Session, profile_id: int, scheme_id: int) -> ApplicationDB:
    """Create a new application tracking record for a citizen profile and scheme."""
    # Check if application already exists
    existing = db.query(ApplicationDB).filter(
        ApplicationDB.profile_id == profile_id,
        ApplicationDB.scheme_id == scheme_id
    ).first()

    if existing:
        return existing

    app = ApplicationDB(
        profile_id=profile_id,
        scheme_id=scheme_id,
        status="not_started",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


def get_applications_by_profile(db: Session, profile_id: int) -> List[ApplicationDB]:
    """Retrieve all applications submitted or tracked by a citizen profile."""
    return db.query(ApplicationDB).options(joinedload(ApplicationDB.scheme)).filter(
        ApplicationDB.profile_id == profile_id
    ).order_by(ApplicationDB.created_at.desc()).all()


def update_application_status(db: Session, application_id: int, status: str) -> Optional[ApplicationDB]:
    """Update application tracking status."""
    if status not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{status}'. Valid statuses: {', '.join(sorted(VALID_STATUSES))}")

    app = db.query(ApplicationDB).filter(ApplicationDB.id == application_id).first()
    if not app:
        return None

    app.status = status
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    return app
