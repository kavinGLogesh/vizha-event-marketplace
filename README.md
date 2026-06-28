# Vizha — Tamil Nadu Event Vendor Marketplace

A full-stack, multilingual, district-based event vendor marketplace platform for Tamil Nadu.
Built with React + FastAPI + MongoDB Atlas + Cloudinary.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|--------------------------------------------------|
| Frontend  | React 18 (Vite), MUI v5, React Router v6, Axios, react-i18next |
| Backend   | FastAPI, JWT Auth, Motor (async MongoDB driver)  |
| Database  | MongoDB Atlas                                    |
| Images    | Cloudinary                                       |
| Auth      | JWT Bearer tokens + bcrypt password hashing      |

---

## Project Structure

```
event-marketplace/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + all API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── VendorCard.jsx
│   │   │   ├── DistrictCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   └── LanguageSwitcher.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── DistrictPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── VendorDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Vendors.jsx
│   │   │       ├── AddVendor.jsx
│   │   │       └── EditVendor.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # All routes + ProtectedRoute guard
│   │   ├── translations/
│   │   │   ├── en.json              # English translations
│   │   │   ├── ta.json              # Tamil translations
│   │   │   └── i18n.js              # i18next config
│   │   ├── App.jsx                  # MUI theme + BrowserRouter
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                          # FastAPI backend
    ├── app/
    │   ├── main.py                  # App entry, CORS, startup seed
    │   ├── config/
    │   │   ├── db.py                # MongoDB Motor connection
    │   │   └── cloudinary.py        # Cloudinary SDK setup
    │   ├── models/
    │   │   ├── vendor.py            # Vendor Pydantic models
    │   │   ├── category.py          # Category models
    │   │   ├── district.py          # District models
    │   │   └── admin.py             # Admin / token models
    │   ├── routes/
    │   │   ├── vendor_routes.py     # GET/POST/PUT/DELETE vendors
    │   │   ├── category_routes.py   # Category CRUD
    │   │   ├── district_routes.py   # District CRUD
    │   │   └── admin_routes.py      # POST /admin/login
    │   ├── schemas/
    │   │   ├── vendor_schema.py     # MongoDB → JSON serializers
    │   │   └── admin_schema.py      # Category/District serializers
    │   ├── utils/
    │   │   ├── jwt_handler.py       # JWT create + verify
    │   │   └── password_hash.py     # bcrypt hash + verify
    │   └── middleware/
    │       └── auth_middleware.py   # Bearer token dependency
    ├── seed_admin.py                # Script to create admin account
    ├── requirements.txt
    └── .env.example
```

---

## Prerequisites

- Node.js >= 18
- Python >= 3.10
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

## 1. MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free M0 cluster**.
3. Under **Database Access** → add a user with read/write permissions.
4. Under **Network Access** → add `0.0.0.0/0` to allow all IPs (or your server IP).
5. Click **Connect** → **Connect your application** → copy the connection string.
6. Replace `<username>` and `<password>` in the connection string with your DB user credentials.

---

## 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account.
2. From the **Dashboard**, copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 3. Backend Setup

```bash
# Navigate to server directory
cd event-marketplace/server

# Create and activate virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and fill in your values
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vizha?retryWrites=true&w=majority
DB_NAME=vizha
JWT_SECRET=your-very-long-random-secret-string-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
CORS_ORIGINS=http://localhost:3000
```

### Run the backend

```bash
# From the server/ directory (with venv activated)
uvicorn app.main:app --reload --port 8000
```

The API will auto-seed:
- Admin account
- 38 Tamil Nadu districts
- 15 event categories
- 6 sample vendors

Visit **http://localhost:8000/docs** for the interactive Swagger UI.

---

## 4. Admin Account Setup

The admin account is **automatically created** on first startup using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values from `.env`.

To manually reset or recreate the admin:
```bash
cd server
python seed_admin.py
```

Default credentials:
- **Username:** `admin`
- **Password:** `Admin@123`

> ⚠️ Change these in `.env` before deploying to production.

---

## 5. Frontend Setup

```bash
# Navigate to client directory
cd event-marketplace/client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Run the frontend

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 6. User Flows

### Public User Flow
```
Open site → Select Language (Tamil/English)
         → Select District (e.g. /chennai)
         → Select Category (e.g. /chennai/catering)
         → View Vendor Cards
         → Click vendor → View full details
         → Call or WhatsApp vendor
```

### Admin Flow
```
Go to /admin/login
→ Enter username + password
→ JWT token stored in localStorage
→ Redirected to /admin/dashboard
→ Manage vendors, categories, districts
→ Upload images via Cloudinary
→ Logout clears token
```

---

## 7. API Reference

### Public Endpoints
| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| GET    | `/vendors`                      | List vendors (filter by district/category/featured) |
| GET    | `/vendors/{id}`                 | Get single vendor                        |
| GET    | `/districts`                    | List all districts                       |
| GET    | `/categories`                   | List all categories                      |

**Query parameters for GET /vendors:**
- `?district=Chennai`
- `?category=Catering`
- `?featured=true`
- `?limit=6&skip=0`

### Admin Endpoints (JWT Required)
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/admin/login`        | Login → returns JWT token |
| POST   | `/vendors`            | Create vendor            |
| PUT    | `/vendors/{id}`       | Update vendor            |
| DELETE | `/vendors/{id}`       | Delete vendor            |
| POST   | `/categories`         | Create category          |
| PUT    | `/categories/{id}`    | Update category          |
| DELETE | `/categories/{id}`    | Delete category          |
| POST   | `/districts`          | Create district          |
| PUT    | `/districts/{id}`     | Update district          |
| DELETE | `/districts/{id}`     | Delete district          |
| POST   | `/upload`             | Upload image → Cloudinary|

---

## 8. Build for Production

### Backend (with Gunicorn)
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
cd client
npm run build
# Output is in client/dist/
```

Serve `dist/` with Nginx, Apache, or any static host (Netlify, Vercel, etc.).

---

## 9. Deployment Guide

### Option A: VPS (e.g. DigitalOcean, Linode)

**Backend:**
```bash
# Install Python + pip
sudo apt update && sudo apt install python3 python3-pip python3-venv -y

# Clone and set up
git clone <your-repo>
cd event-marketplace/server
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in real values

# Run with systemd or screen
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd event-marketplace/client
npm install && npm run build
# Copy dist/ to /var/www/html or serve via Nginx
```

**Nginx config example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/vizha/dist;
        try_files $uri /index.html;
    }

    # Backend proxy
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option B: Render (Free Tier)

**Backend on Render:**
1. Connect your GitHub repo
2. New → Web Service → select `server/` as root directory
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env` (including `RESEND_API_KEY`, `MAIL_FROM`, etc.)
6. Python version is pinned via `server/.python-version` (3.12) — do not use 3.14 on Render
7. **Required for Netlify frontend** — set on Render:
   ```
   CORS_ORIGINS=http://localhost:3000,https://vizhamarket.netlify.app
   ```

**Frontend on Netlify:**
1. Connect GitHub repo
2. Root directory: `client/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://vizhaeventmarketplaceback.onrender.com
   ```
6. Redeploy after changing env vars (Netlify rebuilds are required for `VITE_*` vars)

---

## 10. Environment Variables Summary

### Server (`server/.env`)
| Variable               | Description                         | Example                          |
|------------------------|-------------------------------------|----------------------------------|
| `MONGODB_URL`          | MongoDB Atlas connection string     | `mongodb+srv://...`              |
| `DB_NAME`              | Database name                       | `vizha`                          |
| `JWT_SECRET`           | Long random string for JWT signing  | `abc123xyz...`                   |
| `JWT_ALGORITHM`        | JWT algorithm                       | `HS256`                          |
| `JWT_EXPIRE_MINUTES`   | Token expiry in minutes             | `1440` (24 hours)                |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name               | `mycloud`                        |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                  | `123456789`                      |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret               | `abc-xyz...`                     |
| `ADMIN_USERNAME`       | Admin login username                | `admin`                          |
| `ADMIN_PASSWORD`       | Admin login password                | `Admin@123`                      |
| `CORS_ORIGINS`         | Allowed frontend origins (comma-separated) | `http://localhost:3000,https://vizhamarket.netlify.app` |

### Client (`client/.env`)
| Variable        | Description          | Example                          |
|-----------------|----------------------|----------------------------------|
| `VITE_API_URL`  | Backend API base URL | `http://localhost:8000`          |

---

## 11. Features Summary

| Feature                        | Status |
|-------------------------------|--------|
| Tamil / English language switch | ✅    |
| District-based navigation       | ✅    |
| Category-based filtering        | ✅    |
| Vendor cards with Call/WhatsApp | ✅    |
| Full vendor details page        | ✅    |
| Image gallery with thumbnails   | ✅    |
| Admin JWT login                 | ✅    |
| Protected admin routes          | ✅    |
| Add / Edit / Delete vendors     | ✅    |
| Cloudinary image upload         | ✅    |
| Admin dashboard with stats      | ✅    |
| Category management             | ✅    |
| District management             | ✅    |
| Responsive mobile-first design  | ✅    |
| Auto-seed on first startup      | ✅    |
| Search + sort on category page  | ✅    |
| Featured vendors on homepage    | ✅    |
| bcrypt password hashing         | ✅    |
| CORS middleware                 | ✅    |

---

## License

MIT — free to use for personal and commercial projects.
