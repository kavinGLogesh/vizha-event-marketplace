# admin.py — Pydantic models for Admin authentication
from pydantic import BaseModel, Field


class AdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminInDB(BaseModel):
    username: str
    password: str  # hashed password stored in DB


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
