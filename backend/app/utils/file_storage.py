import os
import uuid
from pathlib import Path
from fastapi import UploadFile
from fastapi import HTTPException, status
from PIL import Image, UnidentifiedImageError
from app.config import settings

def ensure_upload_dir() -> Path:
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path

async def save_upload_file(file: UploadFile) -> tuple[str, str]:
    """
    Saves an uploaded file to the upload directory.
    Returns (relative_file_path, public_url)
    """
    upload_dir = ensure_upload_dir()
    file_ext = Path(file.filename or "leaf.jpg").suffix.lower()
    if not file_ext or file_ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        file_ext = ".jpg"

    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    destination = upload_dir / unique_filename

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    total_bytes = 0
    try:
        with open(destination, "wb") as output:
            while chunk := await file.read(1024 * 1024):
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Image must be smaller than {settings.MAX_UPLOAD_SIZE_MB} MB",
                    )
                output.write(chunk)

        with Image.open(destination) as image:
            image.verify()
    except (HTTPException, UnidentifiedImageError, OSError) as error:
        destination.unlink(missing_ok=True)
        if isinstance(error, HTTPException):
            raise
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image",
        ) from error

    public_url = f"{settings.STATIC_URL_PREFIX}/{unique_filename}"
    return str(destination), public_url
