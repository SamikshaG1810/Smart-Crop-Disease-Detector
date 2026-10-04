import warnings
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
    destination = upload_dir / f"{uuid.uuid4().hex}.upload"

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

        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(destination) as image:
                image_format = image.format
                width, height = image.size
                if image_format not in {"JPEG", "PNG", "WEBP"}:
                    raise HTTPException(
                        status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                        detail="Unsupported image format. Supported formats: JPEG, PNG, WEBP.",
                    )
                if width * height > settings.MAX_IMAGE_PIXELS:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Image dimensions exceed the maximum supported size.",
                    )
                image.verify()
        file_ext = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}[image_format]
        final_destination = destination.with_suffix(file_ext)
        destination.replace(final_destination)
        destination = final_destination
    except (HTTPException, UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning) as error:
        destination.unlink(missing_ok=True)
        if isinstance(error, HTTPException):
            raise
        if isinstance(error, (Image.DecompressionBombError, Image.DecompressionBombWarning)):
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image dimensions exceed the maximum supported size.",
            ) from error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image",
        ) from error

    public_url = f"{settings.STATIC_URL_PREFIX}/{destination.name}"
    return str(destination), public_url
