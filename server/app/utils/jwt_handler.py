# jwt_handler.py — JWT token creation and verification
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))  # 24 hours default


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT access token.
    data: dict containing payload (e.g. {"sub": username})
    """
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload.update({"exp": expire, "iat": datetime.utcnow()})
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_token(token: str) -> dict:
    """
    Decode and verify a JWT token.
    Raises 401 if invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception
