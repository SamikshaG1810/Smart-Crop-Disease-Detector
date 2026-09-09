from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import synonym
from app.database import Base

class DiseaseInfo(Base):
    """Reference knowledge shown with a diagnosis: causes, symptoms, and treatments."""

    __tablename__ = "disease_info"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(String, unique=True, index=True, nullable=False) # e.g. "Tomato___Late_blight"
    crop_name = Column(String, index=True, nullable=False)           # e.g. "Tomato"
    disease_name = Column(String, index=True, nullable=False)        # e.g. "Late Blight"
    scientific_name = Column(String, nullable=True)                  # e.g. "Phytophthora infestans"
    description = Column(Text, nullable=False)
    causes = Column(Text, nullable=False)
    symptoms = Column(JSON, nullable=False)                          # list of symptom bullet points
    severity = Column(String, nullable=False, default="Moderate")    # "Healthy", "Low", "Moderate", "High", "Critical"
    organic_treatment = Column(Text, nullable=False)
    chemical_treatment = Column(Text, nullable=False)
    prevention = Column(Text, nullable=False)
    sample_image_url = Column(String, nullable=True)

    # Compatibility name used by the simplified database specification.
    cause = synonym("causes")
