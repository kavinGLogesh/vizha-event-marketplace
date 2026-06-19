# cloudinary.py — Cloudinary SDK configuration for image uploads
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()


def configure_cloudinary():
    """Initialize Cloudinary with credentials from environment."""
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if not (cloud_name and api_key and api_secret):
        print("⚠️ Cloudinary credentials not fully configured. Image upload endpoint will be disabled.")
        return

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    print("✅ Cloudinary configured.")


def upload_image_to_cloudinary(file_bytes: bytes, folder: str = "vizha/vendors") -> dict:
    """
    Upload image bytes to Cloudinary.
    Returns a dict with 'url' and 'public_id'.
    """
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="image",
        transformation=[
            {"width": 1200, "height": 900, "crop": "limit", "quality": "auto"},
            {"fetch_format": "auto"}
        ]
    )
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id")
    }
