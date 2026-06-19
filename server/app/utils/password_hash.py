# password_hash.py — Password hashing and verification
from passlib.context import CryptContext

# Use a backend that is available without external bcrypt bindings
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password using pbkdf2_sha256."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)
