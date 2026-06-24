# upload_routes.py — Image upload endpoint storing files locally in /uploads
import uuid
from pathlib import Path
from fastapi import APIRouter, Request, UploadFile, File, HTTPException, status, Depends
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(tags=["Upload"])
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    """Accept a single image file and save it locally. Admin only."""
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded.")

    suffix = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{suffix}"
    destination = UPLOAD_DIR / filename

    try:
        contents = await file.read()
        with open(destination, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save file: {e}")

    upload_url = request.url_for("uploads", path=filename)
    return {"url": upload_url, "filename": filename}
