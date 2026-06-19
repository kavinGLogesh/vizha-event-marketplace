# district_routes.py — District CRUD endpoints
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.config.db import get_db
from app.models.district import DistrictCreate, DistrictUpdate
from app.schemas.admin_schema import district_serializer, districts_serializer
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/districts", tags=["Districts"])


def validate_oid(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid district ID.")
    return ObjectId(id)


# ─── Public ──────────────────────────────────────────────────

@router.get("")
async def get_districts():
    """List all districts sorted alphabetically."""
    db = get_db()
    dists = await db["districts"].find().sort("name", 1).to_list(length=200)
    return districts_serializer(dists)


@router.get("/{dist_id}")
async def get_district(dist_id: str):
    oid = validate_oid(dist_id)
    db = get_db()
    dist = await db["districts"].find_one({"_id": oid})
    if not dist:
        raise HTTPException(status_code=404, detail="District not found.")
    return district_serializer(dist)


# ─── Admin Protected ─────────────────────────────────────────

@router.post("", status_code=201)
async def create_district(dist: DistrictCreate, admin=Depends(get_current_admin)):
    """Create a new district. Admin only."""
    db = get_db()
    existing = await db["districts"].find_one({"name": {"$regex": f"^{dist.name}$", "$options": "i"}})
    if existing:
        raise HTTPException(status_code=400, detail=f"District '{dist.name}' already exists.")
    result = await db["districts"].insert_one(dist.model_dump())
    new = await db["districts"].find_one({"_id": result.inserted_id})
    return district_serializer(new)


@router.put("/{dist_id}")
async def update_district(dist_id: str, dist: DistrictUpdate, admin=Depends(get_current_admin)):
    oid = validate_oid(dist_id)
    db = get_db()
    update_data = {k: v for k, v in dist.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = await db["districts"].update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="District not found.")
    updated = await db["districts"].find_one({"_id": oid})
    return district_serializer(updated)


@router.delete("/{dist_id}")
async def delete_district(dist_id: str, admin=Depends(get_current_admin)):
    oid = validate_oid(dist_id)
    db = get_db()
    result = await db["districts"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="District not found.")
    return {"message": "District deleted.", "id": dist_id}
