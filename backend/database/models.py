from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database.database import Base


class CitizenProfileDB(Base):
    __tablename__ = "citizen_profiles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=True)  # Optional name
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)

    state = Column(String, nullable=False)
    district = Column(String, nullable=True)
    area_type = Column(String, nullable=True)  # Rural / Urban

    annual_income = Column(Float, nullable=False)
    occupation = Column(String, nullable=True)
    employment_status = Column(String, nullable=True)

    # Category flags
    student = Column(Boolean, default=False)
    farmer = Column(Boolean, default=False)
    is_disability = Column(Boolean, default=False)
    is_senior = Column(Boolean, default=False)
    is_business_owner = Column(Boolean, default=False)
    is_woman = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = relationship("ApplicationDB", back_populates="profile", cascade="all, delete-orphan")
    documents = relationship("DocumentDB", back_populates="profile", cascade="all, delete-orphan")


class SchemeDB(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=False)
    ministry = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    benefits = Column(Text, nullable=False)
    application_url = Column(String, nullable=True)
    active = Column(Boolean, default=True)

    # Extended fields
    government_level = Column(String, default="Central")  # Central / State / District
    state_applicable = Column(String, default="All India")  # specific state or "All India"
    required_documents = Column(Text, nullable=True)   # JSON array as text
    application_steps = Column(Text, nullable=True)    # JSON array as text
    last_verified = Column(String, nullable=True)      # ISO date string
    demo_data = Column(Boolean, default=True)          # True = demo/placeholder record

    rules = relationship("EligibilityRuleDB", back_populates="scheme", cascade="all, delete-orphan")
    sources = relationship("SchemeSourceDB", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("ApplicationDB", back_populates="scheme", cascade="all, delete-orphan")


class EligibilityRuleDB(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)

    field = Column(String, nullable=False)
    operator = Column(String, nullable=False)  # ==, !=, >, >=, <, <=, IN, NOT_IN
    value = Column(String, nullable=False)
    label = Column(String, nullable=True)  # Human-readable label for this criterion

    scheme = relationship("SchemeDB", back_populates="rules")


class SchemeSourceDB(Base):
    __tablename__ = "scheme_sources"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)

    source_name = Column(String, nullable=False)
    source_url = Column(String, nullable=False)
    last_verified = Column(String, nullable=True)

    scheme = relationship("SchemeDB", back_populates="sources")


class ApplicationDB(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("citizen_profiles.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    # not_started | documents_pending | ready_to_apply | applied | completed
    status = Column(String, default="not_started", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("CitizenProfileDB", back_populates="applications")
    scheme = relationship("SchemeDB", back_populates="applications")


class DocumentDB(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("citizen_profiles.id"), nullable=False)
    document_type = Column(String, nullable=False)  # Detected/declared type
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)   # Local path
    s3_key = Column(String, nullable=True)      # S3 object key if uploaded
    # uploaded | processing | processed | failed
    status = Column(String, default="uploaded", nullable=False)
    extracted_data = Column(Text, nullable=True)   # JSON string from Textract
    confidence = Column(Float, nullable=True)      # Classification confidence
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("CitizenProfileDB", back_populates="documents")