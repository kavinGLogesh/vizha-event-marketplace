# vendor_schema.py — MongoDB document serializers for vendors
from bson import ObjectId


def vendor_serializer(vendor: dict) -> dict:
    """Convert a single MongoDB vendor document to a JSON-serializable dict."""
    return {
        "_id": str(vendor["_id"]),
        "shop_name": vendor.get("shop_name", ""),
        "category": vendor.get("category", ""),
        "district": vendor.get("district", ""),
        "phone": vendor.get("phone", ""),
        "whatsapp": vendor.get("whatsapp", ""),
        "description": vendor.get("description", ""),
        "price_range": vendor.get("price_range", ""),
        "rating": vendor.get("rating", 0),
        "owner_name": vendor.get("owner_name", ""),
        "experience": vendor.get("experience", 0),
        "languages": vendor.get("languages", []),
        "services": vendor.get("services", []),
        "images": vendor.get("images", []),
        "featured": vendor.get("featured", False),
        "email": vendor.get("email", ""),
    }


def vendors_serializer(vendors: list) -> list:
    """Convert a list of MongoDB vendor documents."""
    return [vendor_serializer(v) for v in vendors]
