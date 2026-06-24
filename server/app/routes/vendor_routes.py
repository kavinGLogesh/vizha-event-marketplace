# vendor_routes.py — Vendor CRUD endpoints (public read, admin write)
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from typing import Optional
from app.config.db import get_db
from app.models.vendor import VendorCreate, VendorUpdate
from app.schemas.vendor_schema import vendor_serializer, vendors_serializer
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/vendors", tags=["Vendors"])


def validate_object_id(id: str):
    """Raise 400 if id is not a valid MongoDB ObjectId."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vendor ID.")
    return ObjectId(id)


# ─── Public Endpoints ────────────────────────────────────────

@router.get("")
async def get_vendors(
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    limit: Optional[int] = Query(None),
    skip: int = Query(0)
):
    """
    List all vendors with optional filters:
    - district: filter by district name (case-insensitive)
    - category: filter by category name (case-insensitive)
    - featured: filter featured vendors only
    - limit: max results
    - skip: pagination offset
    """
    db = get_db()
    query = {}

    if district:
        query["district"] = {"$regex": f"^{district}$", "$options": "i"}
    if category:
        query["category"] = {"$regex": f"^{category.replace('-', ' ')}$", "$options": "i"}
    if featured is not None:
        query["featured"] = featured

    cursor = db["vendors"].find(query).sort("rating", -1).skip(skip)
    if limit:
        cursor = cursor.limit(limit)

    vendors = await cursor.to_list(length=1000)
    return vendors_serializer(vendors)


@router.get("/{vendor_id}")
async def get_vendor(vendor_id: str):
    """Get a single vendor by MongoDB ObjectId."""
    oid = validate_object_id(vendor_id)
    db = get_db()
    vendor = await db["vendors"].find_one({"_id": oid})

    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found.")

    return vendor_serializer(vendor)


# ─── Admin-Protected Endpoints ───────────────────────────────

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_vendor(
    vendor: VendorCreate,
    admin=Depends(get_current_admin)
):
    """Create a new vendor. Admin only."""
    db = get_db()
    doc = vendor.model_dump()
    result = await db["vendors"].insert_one(doc)

    # Update district vendor count
    await db["districts"].update_one(
        {"name": {"$regex": f"^{vendor.district}$", "$options": "i"}},
        {"$inc": {"vendor_count": 1}},
        upsert=False
    )

    new_vendor = await db["vendors"].find_one({"_id": result.inserted_id})
    return vendor_serializer(new_vendor)


@router.put("/{vendor_id}")
async def update_vendor(
    vendor_id: str,
    vendor: VendorUpdate,
    admin=Depends(get_current_admin)
):
    """Update an existing vendor. Admin only."""
    oid = validate_object_id(vendor_id)
    db = get_db()

    # Only update fields that were actually provided
    update_data = {k: v for k, v in vendor.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")

    result = await db["vendors"].update_one(
        {"_id": oid},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found.")

    updated = await db["vendors"].find_one({"_id": oid})
    return vendor_serializer(updated)


@router.delete("/{vendor_id}", status_code=status.HTTP_200_OK)
async def delete_vendor(
    vendor_id: str,
    admin=Depends(get_current_admin)
):
    """Delete a vendor. Admin only."""
    oid = validate_object_id(vendor_id)
    db = get_db()

    vendor = await db["vendors"].find_one({"_id": oid})
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found.")

    await db["vendors"].delete_one({"_id": oid})

    # Decrement district vendor count
    await db["districts"].update_one(
        {"name": {"$regex": f"^{vendor['district']}$", "$options": "i"}},
        {"$inc": {"vendor_count": -1}},
        upsert=False
    )

    return {"message": "Vendor deleted successfully.", "id": vendor_id}
