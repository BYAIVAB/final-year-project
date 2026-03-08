"""
End-to-end booking flow test
Run: pytest tests/test_booking_flow.py -v
"""
import pytest
import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.appointment_service import AppointmentService
from app.config import settings


@pytest.fixture
async def db_client():
    """Create a test database client"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[f"{settings.MONGODB_DB}_test"]
    yield db
    # Cleanup
    await db.appointments.delete_many({})
    await db.providers.delete_many({})
    client.close()


@pytest.fixture
async def appointment_service(db_client):
    """Create appointment service with test database"""
    return AppointmentService(db_client, settings)


@pytest.mark.asyncio
async def test_dummy_provider_search(appointment_service):
    """Test searching dummy providers"""
    # Seed test provider
    await appointment_service.providers.insert_one({
        "provider_id": "test_dr_smith",
        "name": "Dr. Test Smith",
        "specialty": "Cardiology",
        "rating": 4.8,
        "location": "Test Hospital",
        "available": True,
        "available_slots": [datetime.now() + timedelta(days=i) for i in range(5)]
    })

    providers = await appointment_service.search_providers_dummy("cardiology")
    
    assert len(providers) > 0
    assert providers[0]["name"] == "Dr. Test Smith"
    assert providers[0]["specialty"] == "Cardiology"


@pytest.mark.asyncio
async def test_provider_slots(appointment_service):
    """Test getting provider slots"""
    # Seed test provider with slots
    test_slots = [
        datetime.now() + timedelta(days=2, hours=10),
        datetime.now() + timedelta(days=2, hours=11),
        datetime.now() + timedelta(days=3, hours=10),
    ]
    
    await appointment_service.providers.insert_one({
        "provider_id": "dummy_test_dr",
        "name": "Dr. Test",
        "specialty": "Test",
        "available": True,
        "available_slots": test_slots
    })
    
    start_date = datetime.now()
    end_date = datetime.now() + timedelta(days=7)
    
    slots = await appointment_service.get_provider_slots(
        "dummy_test_dr",
        start_date,
        end_date
    )
    
    assert len(slots) == 3
    assert all(slot["available"] for slot in slots)


@pytest.mark.asyncio
async def test_complete_booking_flow(appointment_service):
    """Test complete booking flow"""
    # 1. Seed provider
    test_slot = datetime.now() + timedelta(days=2, hours=10)
    await appointment_service.providers.insert_one({
        "provider_id": "dummy_test_jones",
        "name": "Dr. Test Jones",
        "specialty": "Dermatology",
        "rating": 4.5,
        "location": "Test Clinic",
        "available": True,
        "available_slots": [test_slot]
    })

    # 2. Search providers
    providers = await appointment_service.search_providers_dummy("dermatology")
    assert len(providers) == 1
    provider = providers[0]

    # 3. Get slots
    start_date = datetime.now()
    end_date = datetime.now() + timedelta(days=7)
    slots = await appointment_service.get_provider_slots(
        provider["provider_id"],
        start_date,
        end_date
    )
    assert len(slots) > 0

    # 4. Book appointment
    slot = slots[0]
    appointment = await appointment_service.book_appointment(
        conversation_id="test_conv_123",
        provider_id=provider["provider_id"],
        slot_id=slot["slot_id"],
        slot_datetime=datetime.fromisoformat(slot["datetime"]),
        patient_info={
            "name": "Test Patient",
            "phone": "+1-555-123-4567",
            "email": "test@example.com",
            "reason": "Test appointment"
        },
        session_fingerprint="test_session_123"
    )

    assert appointment["status"] == "confirmed"
    assert appointment["confirmation_code"]
    assert len(appointment["confirmation_code"]) == 9  # CARD-1234 format

    # 5. Retrieve appointments
    appointments = await appointment_service.get_appointments("test_session_123")
    assert len(appointments) == 1
    assert appointments[0]["appointment_id"] == appointment["appointment_id"]

    # 6. Cancel appointment
    cancel_result = await appointment_service.cancel_appointment(
        appointment["appointment_id"],
        appointment["confirmation_code"],
        "Test cancellation"
    )
    assert cancel_result["status"] == "cancelled"


@pytest.mark.asyncio
async def test_confirmation_code_format(appointment_service):
    """Test confirmation code generation"""
    code = appointment_service.generate_confirmation_code()
    
    # Should be in format XXXX-1234
    assert len(code) == 9
    assert code[4] == "-"
    assert code[:4].isalpha()
    assert code[5:].isdigit()


@pytest.mark.asyncio
async def test_cancel_with_invalid_code(appointment_service):
    """Test cancellation with invalid confirmation code"""
    # Try to cancel non-existent appointment
    with pytest.raises(ValueError) as exc_info:
        await appointment_service.cancel_appointment(
            "non_existent_apt",
            "INVALID-1234",
            "Test"
        )
    
    assert "not found" in str(exc_info.value).lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
