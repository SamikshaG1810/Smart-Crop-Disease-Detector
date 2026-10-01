from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, synonym
from app.database import Base

class Scan(Base):
    """A user's uploaded leaf image and the model's diagnosis result."""

    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_url = Column(String, nullable=False)
    original_filename = Column(String, nullable=True)
    crop_name = Column(String, index=True, nullable=False)
    disease_name = Column(String, index=True, nullable=False)
    class_id = Column(String, index=True, nullable=False)
    confidence = Column(Float, nullable=False) # e.g. 96.5
    severity = Column(String, nullable=False)   # "Healthy", "Low", "Moderate", "High", "Critical"
    notes = Column(Text, nullable=True)
    field_location = Column(String, nullable=True, default="Field Zone A")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Compatibility names used by the simplified database specification.
    image_path = synonym("image_url")
    predicted_disease = synonym("disease_name")
    confidence_score = synonym("confidence")

    owner = relationship("User", back_populates="scans")

    @property
    def detector(self) -> str:
        return "fruit" if self.class_id.startswith("Fruit___") else "leaf"
