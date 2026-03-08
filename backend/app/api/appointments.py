"""
Appointment Booking API Endpoints
"""
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
import logging

from app.services.appointment_service import AppointmentService
from app.services.mongodb_service import mongodb_service
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/appointments", tags=["appointments"])


# ============================================
# Request/Response Models
# ============================================

class LocationInput(BaseModel):
    """Location input - either coordinates or city name"""
    lat: Optional[float] = None
    lng: Optional[float] = None
    city: Optional[str] = None


class ProviderSearchRequest(BaseModel):
    """Provider search request"""
    conversation_id: str
    specialty: str = Field(..., description="Medical specialty (e.g., cardiology)")
    location: Optional[LocationInput] = None
    radius_miles: int = Field(10, ge=1, le=50)
    date_range: Optional[dict] = None


class PatientInfo(BaseModel):
    """Patient information for booking"""
    name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    reason: Optional[str] = Field(None, max_length=500)


class BookAppointmentRequest(BaseModel):
    """Appointment booking request"""
    conversation_id: str
    provider_id: str
    slot_id: str
    slot_datetime: datetime
    patient_info: PatientInfo


class CancelAppointmentRequest(BaseModel):
    """Appointment cancellation request"""
    confirmation_code: str
    reason: Optional[str] = None


# ============================================
# Dependency Injection
# ============================================

async def get_appointment_service() -> AppointmentService:
    """Get appointment service instance"""
    return AppointmentService(mongodb_service.db, settings)


# ============================================
# API Endpoints
# ============================================

@router.post("/providers/search")
async def search_providers(
    request: ProviderSearchRequest,
    service: AppointmentService = Depends(get_appointment_service)
):
    """
    Search for healthcare providers
    
    - **specialty**: Medical specialty (cardiology, dermatology, etc.)
    - **location**: User location (optional for dummy mode)
    - **radius_miles**: Search radius in miles
    """
    try:
        if settings.BOOKING_MODE == "dummy":
            providers = await service.search_providers_dummy(
                specialty=request.specialty,
                limit=5
            )
        else:
            if not request.location or (not request.location.lat and not request.location.city):
                raise HTTPException(400, "Location required for real-time search")
            
            providers = await service.search_providers_realtime(
                specialty=request.specialty,
                location=request.location.dict(),
                radius_miles=request.radius_miles,
                date_range=request.date_range
            )
        
        return {
            "providers": providers,
            "total_count": len(providers),
            "search_metadata": {
                "specialty": request.specialty,
                "mode": settings.BOOKING_MODE
            }
        }
    except Exception as e:
        logger.error(f"Provider search error: {e}")
        raise HTTPException(500, f"Provider search failed: {str(e)}")


@router.get("/providers/{provider_id}/slots")
async def get_provider_slots(
    provider_id: str,
    start_date: str,
    end_date: str,
    service: AppointmentService = Depends(get_appointment_service)
):
    """
    Get available appointment slots for a provider
    
    - **provider_id**: Provider identifier
    - **start_date**: Start date (ISO format: 2026-03-15)
    - **end_date**: End date (ISO format: 2026-03-22)
    """
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        slots = await service.get_provider_slots(provider_id, start, end)
        
        return {
            "provider_id": provider_id,
            "slots": slots,
            "total_slots": len(slots)
        }
    except ValueError as e:
        raise HTTPException(400, f"Invalid date format: {str(e)}")
    except Exception as e:
        logger.error(f"Get slots error: {e}")
        raise HTTPException(500, f"Failed to retrieve slots: {str(e)}")


@router.post("/book")
async def book_appointment(
    request: BookAppointmentRequest,
    x_session_id: str = Header(None, alias="X-Session-ID"),
    service: AppointmentService = Depends(get_appointment_service)
):
    """
    Book an appointment
    
    Requires X-Session-ID header for anonymous user tracking
    """
    if not x_session_id:
        raise HTTPException(400, "Missing X-Session-ID header")
    
    try:
        appointment = await service.book_appointment(
            conversation_id=request.conversation_id,
            provider_id=request.provider_id,
            slot_id=request.slot_id,
            slot_datetime=request.slot_datetime,
            patient_info=request.patient_info.dict(),
            session_fingerprint=x_session_id
        )
        
        return appointment
    except ValueError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        logger.error(f"Booking error: {e}")
        raise HTTPException(500, f"Booking failed: {str(e)}")


@router.get("")
async def list_appointments(
    x_session_id: str = Header(None, alias="X-Session-ID"),
    status: Optional[str] = None,
    limit: int = 10,
    service: AppointmentService = Depends(get_appointment_service)
):
    """
    List appointments for the current session
    
    Requires X-Session-ID header
    """
    if not x_session_id:
        raise HTTPException(400, "Missing X-Session-ID header")
    
    try:
        appointments = await service.get_appointments(
            session_fingerprint=x_session_id,
            status=status,
            limit=limit
        )
        
        return {
            "appointments": appointments,
            "total": len(appointments)
        }
    except Exception as e:
        logger.error(f"List appointments error: {e}")
        raise HTTPException(500, f"Failed to retrieve appointments: {str(e)}")


@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: str,
    request: CancelAppointmentRequest,
    service: AppointmentService = Depends(get_appointment_service)
):
    """
    Cancel an appointment
    
    Requires confirmation code for verification
    """
    try:
        result = await service.cancel_appointment(
            appointment_id=appointment_id,
            confirmation_code=request.confirmation_code,
            reason=request.reason
        )
        
        return result
    except ValueError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        logger.error(f"Cancel appointment error: {e}")
        raise HTTPException(500, f"Cancellation failed: {str(e)}")
