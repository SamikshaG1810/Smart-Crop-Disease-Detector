from typing import Optional
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import desc
from starlette.concurrency import run_in_threadpool

from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.models.disease import DiseaseInfo
from app.schemas.scan import ScanResponse, ScanPredictionResult, ScanHistoryList
from app.schemas.disease import DiseaseInfoResponse
from app.routes.auth import require_current_user
from app.ml.model import classifier
from app.ml.fruit_model import fruit_classifier
from app.utils.file_storage import save_upload_file

router = APIRouter(tags=["Scans"])
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=ScanPredictionResult)
async def predict_crop_disease(
    file: UploadFile = File(...),
    detector: str = Form("leaf"),
    field_location: Optional[str] = Form("Field Zone A"),
    notes: Optional[str] = Form(None),
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if detector not in {"leaf", "fruit"}:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Detector must be either 'leaf' or 'fruit'.",
        )

    if detector == "leaf" and not classifier.loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The trained disease model is unavailable. Install the verified model weights before scanning.",
        )

    # Validate content type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Invalid image format. Supported formats: JPEG, PNG, WEBP."
        )

    logger.info("Prediction request received user_id=%s detector=%s", current_user.id, detector)
    original_filename = file.filename or "uploaded_leaf.jpg"
    file_path, public_url = await save_upload_file(file)
    logger.info("Image received user_id=%s detector=%s", current_user.id, detector)

    try:
        with open(file_path, "rb") as image_file:
            image_bytes = image_file.read()

        logger.info("Image preprocessing and inference started user_id=%s detector=%s", current_user.id, detector)
        if detector == "fruit":
            pred = await run_in_threadpool(fruit_classifier.predict, image_bytes)
        else:
            pred = await run_in_threadpool(
                classifier.predict,
                image_bytes,
                filename=original_filename,
            )
        logger.info(
            "Inference complete user_id=%s detector=%s class=%s confidence=%.2f engine=%s",
            current_user.id,
            detector,
            pred["class_id"],
            pred["confidence"],
            pred["engine"],
        )
    except ValueError as error:
        Path(file_path).unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
    except RuntimeError as error:
        Path(file_path).unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error
    except Exception as error:
        Path(file_path).unlink(missing_ok=True)
        logger.exception("Scan inference failed user_id=%s detector=%s", current_user.id, detector)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model inference failed. Check the backend log for details.",
        ) from error

    logger.info(
        "Scan prediction engine=%s file=%s class=%s confidence=%.2f top3=%s",
        pred["engine"],
        file_path,
        pred["class_id"],
        pred["confidence"],
        pred.get("top_probabilities", []),
    )

    # Query disease information
    disease_info = None
    if detector == "leaf":
        disease_info = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == pred["class_id"]).first()

    severity = pred.get("severity", disease_info.severity if disease_info else "Moderate")

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
    try:
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        Path(file_path).unlink(missing_ok=True)
        logger.exception("Could not save scan user_id=%s detector=%s", current_user.id, detector)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction completed but the scan could not be saved.",
        ) from error
    db.refresh(scan_record)
    logger.info("Scan saved user_id=%s scan_id=%s detector=%s", current_user.id, scan_record.id, detector)

    return {
        "scan_id": scan_record.id,
        "image_url": public_url,
        "crop_name": scan_record.crop_name,
        "disease_name": scan_record.disease_name,
        "class_id": scan_record.class_id,
        "confidence": scan_record.confidence,
        "engine": pred["engine"],
        "detector": detector,
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
