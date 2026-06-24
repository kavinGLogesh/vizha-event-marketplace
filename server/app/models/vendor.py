# vendor.py — Pydantic models for Vendor documents
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Any
from bson import ObjectId


def normalize_image_list(value: Any) -> Optional[List[str]]:
    if value is None:
        return None
    if isinstance(value, str):
        return [value]
    if not isinstance(value, list):
        raise ValueError("images must be a list of strings")

    normalized = []
    for item in value:
        if isinstance(item, str):
            normalized.append(item)
            continue
        if isinstance(item, dict):
            url = item.get("url") or item.get("_url")
            if isinstance(url, str):
                normalized.append(url)
                continue
        raise ValueError("each image entry must be a string or object with a url")
    return normalized


class VendorBase(BaseModel):
    shop_name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2)
    district: str = Field(..., min_length=2)
    phone: str = Field(..., pattern=r"^\d{10}$")
    whatsapp: Optional[str] = Field(None, pattern=r"^\d{10}$")
    email: Optional[str] = None
    description: Optional[str] = None
    price_range: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    owner_name: Optional[str] = None
    experience: Optional[int] = Field(None, ge=0)
    languages: Optional[List[str]] = []
    services: Optional[List[str]] = []
    images: Optional[List[str]] = []
    featured: Optional[bool] = False

    @field_validator("images", mode="before")
    def normalize_images(cls, value):
        return normalize_image_list(value)


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    """All fields are optional for partial updates."""
    shop_name: Optional[str] = Field(None, min_length=2, max_length=200)
    category: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = Field(None, pattern=r"^\d{10}$")
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
    price_range: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    owner_name: Optional[str] = None
    experience: Optional[int] = None
    languages: Optional[List[str]] = None
    services: Optional[List[str]] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None

    @field_validator("images", mode="before")
    def normalize_images(cls, value):
        return normalize_image_list(value)


class VendorResponse(VendorBase):
    id: str = Field(alias="_id")
    email: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
