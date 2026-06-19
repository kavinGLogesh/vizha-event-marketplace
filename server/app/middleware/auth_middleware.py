# auth_middleware.py — FastAPI dependency for protecting admin routes
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import verify_token

# Use Bearer token scheme
bearer_scheme = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> dict:
    """
    FastAPI dependency that extracts and validates the JWT token
    from the Authorization: Bearer <token> header.

    Usage:
        @router.post("/vendors")
        async def create(admin=Depends(get_current_admin)):
            ...
    """
    token = credentials.credentials
    payload = verify_token(token)

    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload."
        )

    return {"username": username}
