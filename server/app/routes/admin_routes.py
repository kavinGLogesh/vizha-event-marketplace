# admin_routes.py — Admin authentication endpoints
from fastapi import APIRouter, HTTPException, status, Depends
from app.config.db import get_db
from app.models.admin import AdminLogin, TokenResponse
from app.utils.password_hash import verify_password
from app.utils.jwt_handler import create_access_token
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/login", response_model=TokenResponse)
async def admin_login(credentials: AdminLogin):
    """
    Authenticate admin and return a JWT access token.
    Only one admin account exists (seeded at startup).
    """
    db = get_db()
    admin = await db["admins"].find_one({"username": credentials.username})

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    if not verify_password(credentials.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    token = create_access_token({"sub": admin["username"]})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        username=admin["username"]
    )


@router.get("/me")
async def get_admin_profile(admin=Depends(get_current_admin)):
    """Return current admin profile (protected route test endpoint)."""
    return {"username": admin["username"], "role": "admin"}
