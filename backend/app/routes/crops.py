from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.disease import DiseaseInfo
from app.schemas.disease import DiseaseInfoResponse, CropSummary

router = APIRouter(tags=["Crops & Diseases"])

@router.get("", response_model=List[CropSummary])
def get_supported_crops(db: Session = Depends(get_db)):
    diseases = db.query(DiseaseInfo).all()
    
    # Group by crop
    crops_map = {}
    for d in diseases:
        c_name = d.crop_name
        if c_name not in crops_map:
            crops_map[c_name] = []
        crops_map[c_name].append(d)

    summary = []
    for c_name, d_list in crops_map.items():
        summary.append({
            "crop_name": c_name,
            "total_diseases": len(d_list),
            "diseases": [DiseaseInfoResponse.from_orm(d) for d in d_list]
        })
    
    return summary

@router.get("/list", response_model=List[DiseaseInfoResponse])
def get_all_diseases(db: Session = Depends(get_db)):
    return db.query(DiseaseInfo).all()

@router.get("/{crop_name}", response_model=List[DiseaseInfoResponse])
def get_crop_diseases(crop_name: str, db: Session = Depends(get_db)):
    diseases = db.query(DiseaseInfo).filter(DiseaseInfo.crop_name.ilike(f"%{crop_name}%")).all()
    if not diseases:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No disease records found for crop '{crop_name}'"
        )
    return diseases

@router.get("/disease/{class_id}", response_model=DiseaseInfoResponse)
def get_disease_detail(class_id: str, db: Session = Depends(get_db)):
    disease = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == class_id).first()
    if not disease:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Disease record '{class_id}' not found"
        )
    return disease
