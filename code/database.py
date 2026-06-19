import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    # Using 'verisight' as the database name
    db = client.verisight
    
    # Ensure unique index on email
    try:
        await db.users.create_index("email", unique=True)
    except Exception as e:
        print(f"Warning: Could not create index on users collection: {e}")

async def close_mongo_connection():
    global client
    if client:
        client.close()

def get_database():
    return db
