# district.py — Pydantic models for District documents
from pydantic import BaseModel, Field
from typing import Optional


class DistrictBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    state: Optional[str] = "Tamil Nadu"
    vendor_count: Optional[int] = 0


class DistrictCreate(DistrictBase):
    pass


class DistrictUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    state: Optional[str] = None
    vendor_count: Optional[int] = None


class DistrictResponse(DistrictBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
