# vendor.py — Pydantic models for Vendor documents
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId


class VendorBase(BaseModel):
    shop_name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2)
    district: str = Field(..., min_length=2)
    phone: str = Field(..., pattern=r"^\d{10}$")
    whatsapp: Optional[str] = Field(None, pattern=r"^\d{10}$")
    description: Optional[str] = None
    price_range: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    owner_name: Optional[str] = None
    experience: Optional[int] = Field(None, ge=0)
    languages: Optional[List[str]] = []
    services: Optional[List[str]] = []
    images: Optional[List[str]] = []
    featured: Optional[bool] = False


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    """All fields are optional for partial updates."""
    shop_name: Optional[str] = Field(None, min_length=2, max_length=200)
    category: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = Field(None, pattern=r"^\d{10}$")
    whatsapp: Optional[str] = None
    description: Optional[str] = None
    price_range: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    owner_name: Optional[str] = None
    experience: Optional[int] = None
    languages: Optional[List[str]] = None
    services: Optional[List[str]] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None


class VendorResponse(VendorBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
