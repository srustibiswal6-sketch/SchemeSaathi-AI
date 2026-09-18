from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base


class CitizenProfileDB(Base):
    __tablename__ = "citizen_profiles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)

    state = Column(String, nullable=False)
    district = Column(String, nullable=False)

    annual_income = Column(Float, nullable=False)
    occupation = Column(String, nullable=False)

    student = Column(Boolean, default=False)
    farmer = Column(Boolean, default=False)

    applications = relationship("ApplicationDB", back_populates="profile", cascade="all, delete-orphan")
    documents = relationship("DocumentDB", back_populates="profile", cascade="all, delete-orphan")


class SchemeDB(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    description = Column(String, nullable=False)
    ministry = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    benefits = Column(String, nullable=False)
    application_url = Column(String, nullable=True)
    active = Column(Boolean, default=True)

    rules = relationship("EligibilityRuleDB", back_populates="scheme", cascade="all, delete-orphan")
    sources = relationship("SchemeSourceDB", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("ApplicationDB", back_populates="scheme", cascade="all, delete-orphan")


class EligibilityRuleDB(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)

    field = Column(String, nullable=False)
    operator = Column(String, nullable=False)  # ==, !=, >, >=, <, <=
    value = Column(String, nullable=False)

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
    status = Column(String, default="not_started", nullable=False)  # not_started, documents_pending, ready_to_apply, applied, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("CitizenProfileDB", back_populates="applications")
    scheme = relationship("SchemeDB", back_populates="applications")


class DocumentDB(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("citizen_profiles.id"), nullable=False)
    document_type = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    status = Column(String, default="uploaded", nullable=False)  # uploaded, processing, processed, failed
    extracted_data = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("CitizenProfileDB", back_populates="documents")