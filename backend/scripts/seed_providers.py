"""
Seed dummy providers for testing
Run: python -m scripts.seed_providers
"""
import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.config import settings


async def seed_providers():
    """Seed dummy provider data"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB]
    providers = db.providers
    
    # Clear existing providers
    await providers.delete_many({})
    
    # Generate future appointment slots
    base_date = datetime.now() + timedelta(days=2)
    slots = [
        base_date + timedelta(days=i, hours=h)
        for i in range(7)  # Next 7 days
        for h in [9, 10, 11, 14, 15, 16]  # Morning and afternoon slots
    ]
    
    dummy_providers = [
        {
            "provider_id": "dummy_dr_smith",
            "name": "Dr. Jane Smith",
            "specialty": "Cardiology",
            "rating": 4.8,
            "location": "Boston Medical Center",
            "bio": "Board-certified cardiologist with 15 years of experience",
            "photo_url": "https://i.pravatar.cc/150?img=1",
            "available": True,
            "available_slots": slots[:20]
        },
        {
            "provider_id": "dummy_dr_cardiac2",
            "name": "Dr. Robert Williams",
            "specialty": "Cardiology",
            "rating": 4.5,
            "location": "Heart & Vascular Center",
            "bio": "Interventional cardiologist specializing in heart disease",
            "photo_url": "https://i.pravatar.cc/150?img=11",
            "available": True,
            "available_slots": slots[5:25]
        },
        {
            "provider_id": "dummy_dr_jones",
            "name": "Dr. Michael Jones",
            "specialty": "Dermatology",
            "rating": 4.6,
            "location": "Virtual Clinic",
            "bio": "Specialist in skin conditions and cosmetic dermatology",
            "photo_url": "https://i.pravatar.cc/150?img=2",
            "available": True,
            "available_slots": slots[10:30]
        },
        {
            "provider_id": "dummy_dr_derm2",
            "name": "Dr. Lisa Anderson",
            "specialty": "Dermatology",
            "rating": 4.8,
            "location": "Skin Care Clinic",
            "bio": "Expert in acne, eczema, and skin rejuvenation",
            "photo_url": "https://i.pravatar.cc/150?img=12",
            "available": True,
            "available_slots": slots[2:22]
        },
        {
            "provider_id": "dummy_dr_patel",
            "name": "Dr. Priya Patel",
            "specialty": "Neurology",
            "rating": 4.9,
            "location": "City Hospital",
            "bio": "Neurologist specializing in headaches and migraines",
            "photo_url": "https://i.pravatar.cc/150?img=3",
            "available": True,
            "available_slots": slots[5:25]
        },
        {
            "provider_id": "dummy_dr_chen",
            "name": "Dr. David Chen",
            "specialty": "Orthopedics",
            "rating": 4.7,
            "location": "Sports Medicine Clinic",
            "bio": "Orthopedic surgeon specializing in sports injuries",
            "photo_url": "https://i.pravatar.cc/150?img=4",
            "available": True,
            "available_slots": slots[8:28]
        },
        {
            "provider_id": "dummy_dr_garcia",
            "name": "Dr. Maria Garcia",
            "specialty": "Pediatrics",
            "rating": 4.9,
            "location": "Children's Clinic",
            "bio": "Pediatrician with expertise in child development",
            "photo_url": "https://i.pravatar.cc/150?img=5",
            "available": True,
            "available_slots": slots[3:23]
        },
        {
            "provider_id": "dummy_dr_psych",
            "name": "Dr. Sarah Thompson",
            "specialty": "Psychiatry",
            "rating": 4.7,
            "location": "Mental Health Center",
            "bio": "Psychiatrist specializing in anxiety and depression",
            "photo_url": "https://i.pravatar.cc/150?img=6",
            "available": True,
            "available_slots": slots[4:24]
        },
        {
            "provider_id": "dummy_dr_gp",
            "name": "Dr. James Wilson",
            "specialty": "General Practice",
            "rating": 4.6,
            "location": "Family Medicine Clinic",
            "bio": "Family physician for all ages",
            "photo_url": "https://i.pravatar.cc/150?img=7",
            "available": True,
            "available_slots": slots[:25]
        },
        {
            "provider_id": "dummy_dr_ent",
            "name": "Dr. Amanda Lee",
            "specialty": "ENT",
            "rating": 4.8,
            "location": "Head & Neck Clinic",
            "bio": "ENT specialist for ear, nose, and throat conditions",
            "photo_url": "https://i.pravatar.cc/150?img=8",
            "available": True,
            "available_slots": slots[6:26]
        },
        {
            "provider_id": "dummy_dr_gastro",
            "name": "Dr. Kevin Brown",
            "specialty": "Gastroenterology",
            "rating": 4.5,
            "location": "Digestive Health Center",
            "bio": "GI specialist focusing on digestive disorders",
            "photo_url": "https://i.pravatar.cc/150?img=9",
            "available": True,
            "available_slots": slots[7:27]
        },
        {
            "provider_id": "dummy_dr_eye",
            "name": "Dr. Emily Davis",
            "specialty": "Ophthalmology",
            "rating": 4.9,
            "location": "Vision Care Center",
            "bio": "Eye specialist for vision and eye health",
            "photo_url": "https://i.pravatar.cc/150?img=10",
            "available": True,
            "available_slots": slots[1:21]
        }
    ]
    
    result = await providers.insert_many(dummy_providers)
    print(f"✅ Seeded {len(result.inserted_ids)} dummy providers")
    
    # Create indexes
    await providers.create_index("specialty")
    await providers.create_index("available")
    await providers.create_index("rating")
    print("✅ Created indexes on providers collection")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_providers())
