# upload_routes.py — Image upload endpoint with Cloudinary support and local fallback
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Request, UploadFile, File, HTTPException, status, Depends
from app.middleware.auth_middleware import get_current_admin
from app.config.cloudinary import upload_image_to_cloudinary

router = APIRouter(tags=["Upload"])
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    """Accept a single image file and upload to Cloudinary (if configured) or save locally. Admin only."""
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded.")

    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to read file: {e}")

    # Check if Cloudinary is configured
    cloudinary_cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    cloudinary_api_key = os.getenv("CLOUDINARY_API_KEY")
    cloudinary_api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if cloudinary_cloud_name and cloudinary_api_key and cloudinary_api_secret:
        try:
            result = upload_image_to_cloudinary(contents)
            return {"url": result["url"], "filename": result["public_id"]}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Cloudinary upload failed: {e}")

    # Fallback to local storage
    suffix = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{suffix}"
    destination = UPLOAD_DIR / filename

    try:
        with open(destination, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save file locally: {e}")

    # Return relative URL so frontend resolves it dynamically based on backend base URL
    relative_url = f"/uploads/{filename}"
    return {"url": relative_url, "filename": filename}
