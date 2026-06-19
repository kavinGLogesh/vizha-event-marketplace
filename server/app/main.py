# main.py — FastAPI application entry point
import os
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.config.db import connect_db, close_db, get_db
from app.config.cloudinary import configure_cloudinary
from app.utils.password_hash import hash_password
from app.middleware.auth_middleware import get_current_admin

from app.routes.vendor_routes import router as vendor_router
from app.routes.category_routes import router as category_router
from app.routes.district_routes import router as district_router
from app.routes.admin_routes import router as admin_router

load_dotenv()

# ── FastAPI App ───────────────────────────────────────────────
app = FastAPI(
    title="Vizha API",
    description="Tamil Nadu Event Vendor Marketplace — Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── CORS Middleware ───────────────────────────────────────────
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup & Shutdown ────────────────────────────────────────
@app.on_event("startup")
async def startup():
    await connect_db()
    configure_cloudinary()
    await seed_initial_data()


@app.on_event("shutdown")
async def shutdown():
    await close_db()


# ── Seed Function ─────────────────────────────────────────────
async def seed_initial_data():
    """
    Seed the database with:
    - Admin account (if none exists)
    - Tamil Nadu districts (if none exist)
    - Event categories (if none exist)
    """
    db = get_db()

    # ── Admin ──
    admin_exists = await db["admins"].find_one({})
    if not admin_exists:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "Admin@123")
        await db["admins"].insert_one({
            "username": admin_username,
            "password": hash_password(admin_password)
        })
        print(f"✅ Admin account created: username='{admin_username}'")

    # ── Districts ──
    district_count = await db["districts"].count_documents({})
    if district_count == 0:
        districts = [
            "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
            "Erode", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul",
            "Thanjavur", "Ranipet", "Sivaganga", "Virudhunagar", "Nagapattinam",
            "Karur", "Namakkal", "Dharmapuri", "Krishnagiri", "Perambalur",
            "Ariyalur", "Cuddalore", "Villupuram", "Kanchipuram", "Tiruvallur",
            "Tiruvannamalai", "Vellore", "Nilgiris", "Pudukkottai", "Ramanathapuram",
            "Theni", "Tenkasi", "Tiruppur", "Kallakurichi", "Chengalpattu",
            "Mayiladuthurai", "Tirupattur", "Kanyakumari"
        ]
        # Deduplicate
        unique_districts = list(dict.fromkeys(districts))
        docs = [{"name": d, "state": "Tamil Nadu", "vendor_count": 0} for d in unique_districts]
        await db["districts"].insert_many(docs)
        print(f"✅ Seeded {len(docs)} Tamil Nadu districts.")

    # ── Categories ──
    cat_count = await db["categories"].count_documents({})
    if cat_count == 0:
        categories = [
            {"name": "Catering", "description": "Wedding and event food catering services", "icon": "restaurant"},
            {"name": "Decoration", "description": "Floral and stage decoration services", "icon": "celebration"},
            {"name": "Photography", "description": "Wedding and event photography", "icon": "camera_alt"},
            {"name": "Videography", "description": "Wedding videography and cinematic films", "icon": "videocam"},
            {"name": "DJ & Music", "description": "DJs, live bands, and music entertainment", "icon": "music_note"},
            {"name": "Flowers", "description": "Fresh flower arrangements and garlands", "icon": "local_florist"},
            {"name": "Mehendi", "description": "Bridal and decorative mehendi artists", "icon": "spa"},
            {"name": "Bridal Makeup", "description": "Professional bridal makeup artists", "icon": "face"},
            {"name": "Transport", "description": "Wedding car and guest transport services", "icon": "directions_car"},
            {"name": "Cake", "description": "Custom wedding and event cakes", "icon": "cake"},
            {"name": "Tent & Canopy", "description": "Shamiana and tent services for outdoor events", "icon": "house"},
            {"name": "Jewellery", "description": "Bridal jewellery rental and sales", "icon": "diamond"},
            {"name": "Invitation Cards", "description": "Custom printed and digital wedding invitations", "icon": "mail"},
            {"name": "Fireworks", "description": "Licensed fireworks and sparkler displays", "icon": "stars"},
            {"name": "Sound System", "description": "PA systems and audio equipment rental", "icon": "speaker"},
        ]
        await db["categories"].insert_many(categories)
        print(f"✅ Seeded {len(categories)} event categories.")

    # ── Sample Vendors (only if none exist) ──
    vendor_count = await db["vendors"].count_documents({})
    if vendor_count == 0:
        sample_vendors = [
            {
                "shop_name": "Sri Amman Catering Services",
                "category": "Catering",
                "district": "Erode",
                "phone": "9876543210",
                "whatsapp": "9876543210",
                "description": "Premium wedding catering with authentic Tamil Nadu cuisine. 15+ years of experience serving thousands of happy families.",
                "price_range": "₹250/person",
                "rating": 4.8,
                "owner_name": "Murugan Selvam",
                "experience": 15,
                "languages": ["Tamil", "English"],
                "services": ["Breakfast Catering", "Lunch Catering", "Dinner Catering", "Snacks", "Sweet Stalls"],
                "images": [],
                "featured": True
            },
            {
                "shop_name": "Kovai Royal Decoration",
                "category": "Decoration",
                "district": "Coimbatore",
                "phone": "9123456789",
                "whatsapp": "9123456789",
                "description": "Elegant floral and stage decorations for weddings, receptions, and all social events.",
                "price_range": "₹15,000 onwards",
                "rating": 4.9,
                "owner_name": "Priya Chandran",
                "experience": 10,
                "languages": ["Tamil", "English", "Malayalam"],
                "services": ["Stage Decoration", "Flower Arrangements", "Car Decoration", "Mandap Setup"],
                "images": [],
                "featured": True
            },
            {
                "shop_name": "Chennai Clicks Photography",
                "category": "Photography",
                "district": "Chennai",
                "phone": "9988776655",
                "whatsapp": "9988776655",
                "description": "Cinematic wedding photography capturing your most precious moments with creative artistry.",
                "price_range": "₹25,000 onwards",
                "rating": 4.7,
                "owner_name": "Karthik Rajan",
                "experience": 8,
                "languages": ["Tamil", "English"],
                "services": ["Wedding Photography", "Pre-Wedding Shoot", "Album Design", "Drone Shots"],
                "images": [],
                "featured": True
            },
            {
                "shop_name": "Madurai Mehendi Masters",
                "category": "Mehendi",
                "district": "Madurai",
                "phone": "9765432100",
                "whatsapp": "9765432100",
                "description": "Intricate bridal mehendi designs with Arabic, Rajasthani, and traditional Tamil styles.",
                "price_range": "₹2,500 onwards",
                "rating": 4.6,
                "owner_name": "Fatima Begum",
                "experience": 12,
                "languages": ["Tamil", "Hindi", "English"],
                "services": ["Bridal Mehendi", "Bridesmaids Mehendi", "Arabic Designs", "Glitter Mehendi"],
                "images": [],
                "featured": False
            },
            {
                "shop_name": "Salem DJ Beats",
                "category": "DJ & Music",
                "district": "Salem",
                "phone": "9654321098",
                "whatsapp": "9654321098",
                "description": "High-energy DJ services with premium sound systems for weddings and corporate events.",
                "price_range": "₹8,000 onwards",
                "rating": 4.5,
                "owner_name": "DJ Vijay",
                "experience": 6,
                "languages": ["Tamil", "English"],
                "services": ["Wedding DJ", "Sound System", "Lighting Setup", "MC Services"],
                "images": [],
                "featured": False
            },
            {
                "shop_name": "Trichy Sweet Bakes",
                "category": "Cake",
                "district": "Tiruchirappalli",
                "phone": "9543210987",
                "whatsapp": "9543210987",
                "description": "Custom multi-tier wedding cakes and designer cakes for all occasions.",
                "price_range": "₹1,500 onwards",
                "rating": 4.9,
                "owner_name": "Deepa Kumari",
                "experience": 9,
                "languages": ["Tamil"],
                "services": ["Wedding Cakes", "Birthday Cakes", "Cupcakes", "Photo Cakes"],
                "images": [],
                "featured": True
            }
        ]
        await db["vendors"].insert_many(sample_vendors)
        print(f"✅ Seeded {len(sample_vendors)} sample vendors.")


# ── Routers ───────────────────────────────────────────────────
app.include_router(admin_router)
app.include_router(vendor_router)
app.include_router(category_router)
app.include_router(district_router)


# ── Image Upload Route (global) ───────────────────────────────
@app.post("/upload", tags=["Upload"])
async def upload_image(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    """Upload an image to Cloudinary. Returns hosted URL. Admin only."""
    allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    from app.config.cloudinary import upload_image_to_cloudinary
    contents = await file.read()
    result = upload_image_to_cloudinary(contents)
    return {"url": result["url"], "public_id": result["public_id"]}


# ── Health Check ──────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "app": "Vizha API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
