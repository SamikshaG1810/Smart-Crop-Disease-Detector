from typing import Optional, List
import logging
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.models.disease import DiseaseInfo
from app.schemas.scan import ScanResponse, ScanPredictionResult, ScanHistoryList
from app.schemas.disease import DiseaseInfoResponse
from app.routes.auth import get_current_user, require_current_user
from app.ml.model import classifier
from app.utils.file_storage import save_upload_file

router = APIRouter(tags=["Scans"])
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=ScanPredictionResult)
async def predict_crop_disease(
    file: UploadFile = File(...),
    field_location: Optional[str] = Form("Field Zone A"),
    notes: Optional[str] = Form(None),
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    # Validate content type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Supported formats: JPEG, PNG, WEBP."
        )

    # Save image
    original_filename = file.filename or "uploaded_leaf.jpg"
    file_path, public_url = await save_upload_file(file)

    # Read image bytes for inference
    with open(file_path, "rb") as f:
        image_bytes = f.read()

    # Predict
    try:
        pred = classifier.predict(image_bytes, filename=original_filename)
    except Exception:
        from pathlib import Path
        Path(file_path).unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Inference failed. Please try another image."
        )

    logger.info(
        "Scan prediction file=%s class=%s confidence=%.2f top3=%s",
        file_path,
        pred["class_id"],
        pred["confidence"],
        pred.get("top_probabilities", []),
    )

    # Query disease information
    disease_info = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == pred["class_id"]).first()

    severity = disease_info.severity if disease_info else "Moderate"

    # Save to database
    scan_record = Scan(
        user_id=current_user.id,
        image_url=public_url,
        original_filename=original_filename,
        crop_name=pred["crop_name"],
        disease_name=pred["disease_name"],
        class_id=pred["class_id"],
        confidence=pred["confidence"],
        severity=severity,
        field_location=field_location,
        notes=notes
    )
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    return {
        "scan_id": scan_record.id,
        "image_url": public_url,
        "crop_name": scan_record.crop_name,
        "disease_name": scan_record.disease_name,
        "class_id": scan_record.class_id,
        "confidence": scan_record.confidence,
        "severity": scan_record.severity,
        "disease_info": disease_info,
        "top_probabilities": pred.get("top_probabilities", [])
    }

@router.get("/history", response_model=ScanHistoryList)
def get_scan_history(
    crop: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Scan)
    
    query = query.filter(Scan.user_id == current_user.id)
    
    if crop and crop.lower() != "all":
        query = query.filter(Scan.crop_name.ilike(f"%{crop}%"))
    
    if severity and severity.lower() != "all":
        query = query.filter(Scan.severity == severity)

    if search:
        query = query.filter(
            (Scan.crop_name.ilike(f"%{search}%")) |
            (Scan.disease_name.ilike(f"%{search}%")) |
            (Scan.field_location.ilike(f"%{search}%"))
        )

    total = query.count()
    offset = (page - 1) * page_size
    scans = query.order_by(desc(Scan.created_at)).offset(offset).limit(page_size).all()

    # Attach disease info
    results = []
    for s in scans:
        d_info = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == s.class_id).first()
        res = ScanResponse.from_orm(s)
        res.disease_info = DiseaseInfoResponse.from_orm(d_info) if d_info else None
        results.append(res)

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": results
    }

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_detail(
    scan_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
    
    d_info = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == scan.class_id).first()
    res = ScanResponse.from_orm(scan)
    res.disease_info = DiseaseInfoResponse.from_orm(d_info) if d_info else None
    return res

@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan(
    scan_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db),
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
    db.delete(scan)
    db.commit()
    return None
