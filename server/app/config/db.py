# db.py — MongoDB Atlas async connection using Motor with local fallback
import os
import re
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from bson import ObjectId

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "vizha")

# Single database instance — reused across the app
client: AsyncIOMotorClient = None
db = None


class FakeCursor:
    def __init__(self, docs):
        self._docs = docs
        self._sort = None
        self._skip = 0
        self._limit = None

    def sort(self, key, direction):
        self._sort = (key, direction)
        return self

    def skip(self, count):
        self._skip = count
        return self

    def limit(self, count):
        self._limit = count
        return self

    async def to_list(self, length=None):
        docs = list(self._docs)
        if self._sort:
            key, direction = self._sort
            docs = sorted(docs, key=lambda d: d.get(key, None), reverse=(direction < 0))
        if self._skip:
            docs = docs[self._skip:]
        if self._limit is not None:
            docs = docs[: self._limit]
        if length is not None:
            docs = docs[:length]
        return [doc.copy() for doc in docs]


class FakeCollection:
    def __init__(self):
        self._docs = []

    def _match(self, doc, query):
        for key, value in query.items():
            field_value = doc.get(key)
            if isinstance(value, dict) and "$regex" in value:
                pattern = value["$regex"]
                opts = value.get("$options", "")
                flags = re.IGNORECASE if "i" in opts else 0
                if not re.match(pattern, str(field_value or ""), flags):
                    return False
            else:
                if field_value != value:
                    return False
        return True

    def find(self, query=None):
        query = query or {}
        results = [doc for doc in self._docs if self._match(doc, query)]
        return FakeCursor(results)

    async def find_one(self, query=None):
        query = query or {}
        for doc in self._docs:
            if self._match(doc, query):
                return doc.copy()
        return None

    async def insert_one(self, doc):
        new_doc = doc.copy()
        if "_id" not in new_doc:
            new_doc["_id"] = ObjectId()
        self._docs.append(new_doc)

        class Result:
            inserted_id = new_doc["_id"]

        return Result()

    async def insert_many(self, docs):
        inserted_ids = []
        for doc in docs:
            new_doc = doc.copy()
            if "_id" not in new_doc:
                new_doc["_id"] = ObjectId()
            self._docs.append(new_doc)
            inserted_ids.append(new_doc["_id"])

        class Result:
            pass

        result = Result()
        result.inserted_ids = inserted_ids
        return result

    async def update_one(self, query, update, upsert=False):
        matched = 0
        modified = 0
        for doc in self._docs:
            if self._match(doc, query):
                matched = 1
                if "$set" in update:
                    for key, value in update["$set"].items():
                        doc[key] = value
                if "$inc" in update:
                    for key, value in update["$inc"].items():
                        doc[key] = doc.get(key, 0) + value
                modified = 1
                break

        if matched == 0 and upsert:
            new_doc = {**query}
            if "$set" in update:
                new_doc.update(update["$set"])
            if "$inc" in update:
                for key, value in update["$inc"].items():
                    new_doc[key] = new_doc.get(key, 0) + value
            if "_id" not in new_doc:
                new_doc["_id"] = ObjectId()
            self._docs.append(new_doc)
            modified = 1

        class Result:
            matched_count = matched
            modified_count = modified

        return Result()

    async def delete_one(self, query):
        for i, doc in enumerate(self._docs):
            if self._match(doc, query):
                del self._docs[i]

                class Result:
                    deleted_count = 1

                return Result()

        class Result:
            deleted_count = 0

        return Result()

    async def count_documents(self, query=None):
        query = query or {}
        return sum(1 for doc in self._docs if self._match(doc, query))


class FakeDB:
    def __init__(self):
        self._collections = {}

    def __getitem__(self, item):
        if item not in self._collections:
            self._collections[item] = FakeCollection()
        return self._collections[item]


async def connect_db():
    """Connect to MongoDB Atlas on app startup, with fallback to in-memory data."""
    global client, db
    try:
        if not MONGODB_URL or "<username>" in MONGODB_URL or "xxxxx" in MONGODB_URL:
            raise ValueError("Invalid MongoDB URL placeholder detected.")

        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command("ping")
        db = client[DB_NAME]
        print(f"✅ Connected to MongoDB: {DB_NAME}")
    except (PyMongoError, ValueError, Exception) as exc:
        print(f"⚠️ MongoDB connection failed, using in-memory fallback database: {exc}")
        client = None
        db = FakeDB()


async def close_db():
    """Close the MongoDB connection on app shutdown."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed.")


def get_db():
    """Return the active database instance."""
    return db
