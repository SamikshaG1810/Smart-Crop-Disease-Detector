from datetime import datetime
from typing import Optional, List
from pydantic import Field
from pydantic import BaseModel
from app.schemas.disease import DiseaseInfoResponse

class ScanBase(BaseModel):
    crop_name: str
    disease_name: str
    class_id: str
    confidence: float
    severity: str
    notes: Optional[str] = None
    field_location: Optional[str] = "Field Zone A"

class ScanResponse(ScanBase):
    id: int
    user_id: Optional[int] = None
    image_url: str
    original_filename: Optional[str] = None
    created_at: datetime
    disease_info: Optional[DiseaseInfoResponse] = None

    class Config:
        from_attributes = True

class ScanPredictionResult(BaseModel):
    scan_id: int
    image_url: str
    crop_name: str
    disease_name: str
    class_id: str
    confidence: float
    severity: str
    disease_info: DiseaseInfoResponse
    top_probabilities: Optional[List[dict]] = Field(default_factory=list)

class ScanHistoryList(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[ScanResponse]
