#!/usr/bin/env python3
"""
seed_admin.py — Standalone script to create/reset the admin account.

Usage:
    cd server
    python seed_admin.py

Or to set custom credentials:
    ADMIN_USERNAME=myadmin ADMIN_PASSWORD=MyPass123 python seed_admin.py
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://logesh:logu1234@cluster0.6bpgk1l.mongodb.net/eventmarket?appName=Cluster0")
DB_NAME = os.getenv("DB_NAME", "eventmarket")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@123")


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    # Use the same hashing scheme as the application (`pbkdf2_sha256`).
    # This avoids bcrypt-specific byte-length limits and backend issues.
    hashed = pwd_context.hash(ADMIN_PASSWORD or "")

    result = await db["admins"].update_one(
        {"username": ADMIN_USERNAME},
        {"$set": {"username": ADMIN_USERNAME, "password": hashed}},
        upsert=True
    )

    if result.upserted_id:
        print(f"✅ Admin account CREATED: username='{ADMIN_USERNAME}'")
    else:
        print(f"✅ Admin account UPDATED: username='{ADMIN_USERNAME}'")

    print(f"   Password: {ADMIN_PASSWORD}")
    print(f"   Database: {DB_NAME}")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
