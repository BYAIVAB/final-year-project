"""
Setup appointments collection with TTL index
Run: python -m scripts.setup_appointments_collection
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.config import settings


async def setup_appointments():
    """Create appointments collection with proper indexes"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB]
    
    # Create collection
    if "appointments" not in await db.list_collection_names():
        await db.create_collection("appointments")
        print("✅ Created appointments collection")
    else:
        print("ℹ️  Appointments collection already exists")
    
    appointments = db.appointments
    
    # Create indexes
    indexes = [
        ("appointment_id", 1),  # Unique
        ("conversation_id", 1),
        ("session_fingerprint", 1),
        ("datetime", 1),
        ("status", 1),
        ("confirmation_code", 1),
    ]
    
    for field, order in indexes:
        await appointments.create_index([(field, order)])
        print(f"✅ Created index on {field}")
    
    # Create TTL index (auto-delete after expiration)
    await appointments.create_index(
        "expires_at",
        expireAfterSeconds=0
    )
    print("✅ Created TTL index (auto-deletion after expires_at)")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(setup_appointments())
