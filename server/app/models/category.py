# category.py — Pydantic models for Category documents
from pydantic import BaseModel, Field
from typing import Optional


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None  # icon name or URL


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
