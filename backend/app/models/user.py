from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship, synonym
from app.database import Base

class User(Base):
    """Account credentials and profile information for an AgroScan user."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    farm_name = Column(String, nullable=True, default="Green Acres Farm")
    farm_location = Column(String, nullable=True, default="California, USA")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Compatibility name used by the simplified database specification.
    name = synonym("full_name")

    scans = relationship("Scan", back_populates="owner", cascade="all, delete-orphan")
