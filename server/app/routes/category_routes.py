# category_routes.py — Category CRUD endpoints
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.config.db import get_db
from app.models.category import CategoryCreate, CategoryUpdate
from app.schemas.admin_schema import category_serializer, categories_serializer
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])


def validate_oid(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid category ID.")
    return ObjectId(id)


# ─── Public ──────────────────────────────────────────────────

@router.get("")
async def get_categories():
    """List all categories."""
    db = get_db()
    cats = await db["categories"].find().sort("name", 1).to_list(length=100)
    return categories_serializer(cats)


@router.get("/{cat_id}")
async def get_category(cat_id: str):
    oid = validate_oid(cat_id)
    db = get_db()
    cat = await db["categories"].find_one({"_id": oid})
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category_serializer(cat)


# ─── Admin Protected ─────────────────────────────────────────

@router.post("", status_code=201)
async def create_category(cat: CategoryCreate, admin=Depends(get_current_admin)):
    """Create a new category. Admin only."""
    db = get_db()
    # Prevent duplicate names
    existing = await db["categories"].find_one({"name": {"$regex": f"^{cat.name}$", "$options": "i"}})
    if existing:
        raise HTTPException(status_code=400, detail=f"Category '{cat.name}' already exists.")
    result = await db["categories"].insert_one(cat.model_dump())
    new = await db["categories"].find_one({"_id": result.inserted_id})
    return category_serializer(new)


@router.put("/{cat_id}")
async def update_category(cat_id: str, cat: CategoryUpdate, admin=Depends(get_current_admin)):
    oid = validate_oid(cat_id)
    db = get_db()
    update_data = {k: v for k, v in cat.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = await db["categories"].update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found.")
    updated = await db["categories"].find_one({"_id": oid})
    return category_serializer(updated)


@router.delete("/{cat_id}")
async def delete_category(cat_id: str, admin=Depends(get_current_admin)):
    oid = validate_oid(cat_id)
    db = get_db()
    result = await db["categories"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found.")
    return {"message": "Category deleted.", "id": cat_id}
