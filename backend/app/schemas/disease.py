from typing import List, Optional
from pydantic import BaseModel

class DiseaseInfoBase(BaseModel):
    class_id: str
    crop_name: str
    disease_name: str
    scientific_name: Optional[str] = None
    description: str = ""
    causes: str = ""
    symptoms: List[str] = []
    severity: str = "Moderate"
    organic_treatment: str = ""
    chemical_treatment: str = ""
    prevention: str = ""
    sample_image_url: Optional[str] = None

class DiseaseInfoResponse(DiseaseInfoBase):
    id: int

    class Config:
        from_attributes = True

class CropSummary(BaseModel):
    crop_name: str
    total_diseases: int
    diseases: List[DiseaseInfoResponse]
