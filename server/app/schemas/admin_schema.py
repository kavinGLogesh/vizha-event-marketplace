# admin_schema.py — MongoDB document serializers for admin
from bson import ObjectId


def admin_serializer(admin: dict) -> dict:
    """Convert a MongoDB admin document to a JSON-safe dict (excludes password)."""
    return {
        "_id": str(admin["_id"]),
        "username": admin.get("username", ""),
    }


def category_serializer(cat: dict) -> dict:
    return {
        "_id": str(cat["_id"]),
        "name": cat.get("name", ""),
        "description": cat.get("description", ""),
        "icon": cat.get("icon", ""),
    }


def categories_serializer(cats: list) -> list:
    return [category_serializer(c) for c in cats]


def district_serializer(dist: dict) -> dict:
    return {
        "_id": str(dist["_id"]),
        "name": dist.get("name", ""),
        "state": dist.get("state", "Tamil Nadu"),
        "vendor_count": dist.get("vendor_count", 0),
    }


def districts_serializer(dists: list) -> list:
    return [district_serializer(d) for d in dists]
