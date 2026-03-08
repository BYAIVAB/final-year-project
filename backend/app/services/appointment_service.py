"""
Appointment Booking Service
Handles provider search and appointment creation
"""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import uuid
import random
import string
import logging

logger = logging.getLogger(__name__)


class AppointmentService:
    """Service for managing doctor appointments"""
    
    def __init__(self, db, config):
        self.db = db
        self.config = config
        self.appointments = db.appointments
        self.providers = db.providers
        
    def generate_confirmation_code(self) -> str:
        """Generate CARD-1234 style confirmation code"""
        prefix = ''.join(random.choices(string.ascii_uppercase, k=4))
        suffix = ''.join(random.choices(string.digits, k=4))
        return f"{prefix}-{suffix}"
    
    async def search_providers_dummy(
        self,
        specialty: str,
        limit: int = 5
    ) -> List[Dict]:
        """
        Search dummy providers (Mode B - for demo/testing)
        
        Args:
            specialty: Medical specialty (e.g., "cardiology", "dermatology")
            limit: Max number of providers to return
            
        Returns:
            List of provider dictionaries
        """
        try:
            # Case-insensitive specialty search
            providers = await self.providers.find({
                "specialty": {"$regex": specialty, "$options": "i"},
                "available": True
            }).limit(limit).to_list(length=limit)
            
            return [
                {
                    "provider_id": p["provider_id"],
                    "name": p["name"],
                    "specialty": p["specialty"],
                    "rating": p.get("rating", 4.5),
                    "location": p.get("location", "Virtual Clinic"),
                    "next_slot": p["available_slots"][0].isoformat() if p.get("available_slots") else None,
                    "photo_url": p.get("photo_url", f"https://i.pravatar.cc/150?u={p['provider_id']}")
                }
                for p in providers
            ]
        except Exception as e:
            logger.error(f"Error searching dummy providers: {e}")
            return []
    
    async def search_providers_realtime(
        self,
        specialty: str,
        location: Dict,
        radius_miles: int = 10,
        date_range: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search real-time providers (Mode A - production)
        
        In production, this would integrate with:
        - Zocdoc API
        - HealthGrades API
        - Internal provider network
        
        Args:
            specialty: Medical specialty
            location: {lat: float, lng: float} or {city: str}
            radius_miles: Search radius
            date_range: Optional date range filter
            
        Returns:
            List of provider dictionaries
        """
        # TODO: Replace with actual API integration
        # Example Zocdoc integration:
        # response = requests.post(
        #     f"{self.config.ZOCDOC_API_URL}/providers/search",
        #     json={
        #         "specialty": specialty,
        #         "lat": location.get("lat"),
        #         "lng": location.get("lng"),
        #         "radius_miles": radius_miles
        #     },
        #     headers={"Authorization": f"Bearer {self.config.ZOCDOC_API_KEY}"}
        # )
        # return response.json()["providers"]
        
        # Mock response for now
        logger.info(f"Real-time search: {specialty} near {location}")
        return [
            {
                "provider_id": f"real_{uuid.uuid4().hex[:8]}",
                "name": "Dr. Sarah Johnson",
                "specialty": specialty.capitalize(),
                "rating": 4.8,
                "distance_miles": 2.3,
                "address": "123 Medical Plaza, Boston MA",
                "next_slot": (datetime.now() + timedelta(days=3)).isoformat(),
                "photo_url": "https://i.pravatar.cc/150?img=1"
            }
        ]
    
    async def get_provider_slots(
        self,
        provider_id: str,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict]:
        """
        Get available appointment slots for a provider
        
        Args:
            provider_id: Provider identifier
            start_date: Start of date range
            end_date: End of date range
            
        Returns:
            List of available slots
        """
        is_dummy = provider_id.startswith("dummy_")
        
        if is_dummy:
            # Dummy mode: Get from local database
            provider = await self.providers.find_one({"provider_id": provider_id})
            if not provider:
                return []
            
            slots = provider.get("available_slots", [])
            return [
                {
                    "slot_id": f"slot_{i}",
                    "datetime": slot.isoformat() if isinstance(slot, datetime) else slot,
                    "duration_minutes": 30,
                    "available": True,
                    "appointment_type": "new_patient"
                }
                for i, slot in enumerate(slots)
                if start_date <= slot <= end_date
            ]
        else:
            # Real-time mode: Call external API
            # TODO: Implement actual API call
            return [
                {
                    "slot_id": f"slot_{i}",
                    "datetime": (start_date + timedelta(days=i, hours=10)).isoformat(),
                    "duration_minutes": 30,
                    "available": True,
                    "appointment_type": "new_patient"
                }
                for i in range(5)
            ]
    
    async def book_appointment(
        self,
        conversation_id: str,
        provider_id: str,
        slot_id: str,
        slot_datetime: datetime,
        patient_info: Dict,
        session_fingerprint: str
    ) -> Dict:
        """
        Create appointment booking
        
        Args:
            conversation_id: Chat conversation ID
            provider_id: Selected provider ID
            slot_id: Selected time slot ID
            slot_datetime: Appointment datetime
            patient_info: Patient details (name, phone, email, reason)
            session_fingerprint: Anonymous user session ID
            
        Returns:
            Appointment confirmation details
        """
        appointment_id = f"apt_{uuid.uuid4().hex[:10]}"
        confirmation_code = self.generate_confirmation_code()
        
        # Determine if dummy or real-time booking
        is_dummy = provider_id.startswith("dummy_")
        
        if is_dummy:
            # Get provider info from local DB
            provider = await self.providers.find_one({"provider_id": provider_id})
            if not provider:
                raise ValueError(f"Provider {provider_id} not found")
                
            provider_name = provider["name"]
            specialty = provider["specialty"]
            address = provider.get("location", "Virtual Clinic")
            booking_mode = "dummy"
            external_booking_id = None
        else:
            # Real-time mode: Call external API to reserve slot
            # TODO: Implement actual API call
            # booking_response = await self.external_api.reserve_slot(
            #     provider_id, slot_id, patient_info
            # )
            # external_booking_id = booking_response["booking_id"]
            
            provider_name = "Dr. Sarah Johnson"  # Mock
            specialty = "Cardiology"
            address = "123 Medical Plaza, Boston MA"
            booking_mode = "real_time"
            external_booking_id = f"ext_{uuid.uuid4().hex[:8]}"
        
        # Create appointment document
        appointment = {
            "appointment_id": appointment_id,
            "conversation_id": conversation_id,
            "session_fingerprint": session_fingerprint,
            "provider_id": provider_id,
            "provider_name": provider_name,
            "specialty": specialty,
            "datetime": slot_datetime,
            "duration_minutes": 30,
            "timezone": "America/New_York",
            "patient_info": {
                "name": patient_info.get("name"),
                "phone": patient_info.get("phone"),
                "email": patient_info.get("email"),
                "reason": patient_info.get("reason")
            },
            "confirmation_code": confirmation_code,
            "status": "confirmed",
            "booking_mode": booking_mode,
            "external_booking_id": external_booking_id,
            "address": address,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": slot_datetime + timedelta(days=30)  # TTL
        }
        
        # Save to database
        await self.appointments.insert_one(appointment)
        
        logger.info(f"Appointment booked: {appointment_id} for {patient_info.get('name')}")
        
        # Return confirmation
        return {
            "appointment_id": appointment_id,
            "confirmation_code": confirmation_code,
            "status": "confirmed",
            "provider": {
                "provider_id": provider_id,
                "name": provider_name,
                "specialty": specialty,
                "address": address
            },
            "appointment_details": {
                "datetime": slot_datetime.isoformat(),
                "duration_minutes": 30,
                "timezone": "America/New_York"
            },
            "patient_info": patient_info,
            "created_at": appointment["created_at"].isoformat()
        }
    
    async def get_appointments(
        self,
        session_fingerprint: str,
        status: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Get appointments for anonymous user
        
        Args:
            session_fingerprint: Browser/session identifier
            status: Optional status filter (confirmed, cancelled, etc.)
            limit: Max number of appointments to return
            
        Returns:
            List of appointments
        """
        query = {"session_fingerprint": session_fingerprint}
        if status:
            query["status"] = status
        
        appointments = await self.appointments.find(query).sort(
            "datetime", -1
        ).limit(limit).to_list(length=limit)
        
        return [
            {
                "appointment_id": apt["appointment_id"],
                "confirmation_code": apt["confirmation_code"],
                "status": apt["status"],
                "provider_name": apt["provider_name"],
                "specialty": apt["specialty"],
                "datetime": apt["datetime"].isoformat(),
                "address": apt.get("address"),
                "created_at": apt["created_at"].isoformat()
            }
            for apt in appointments
        ]
    
    async def cancel_appointment(
        self,
        appointment_id: str,
        confirmation_code: str,
        reason: Optional[str] = None
    ) -> Dict:
        """
        Cancel an appointment
        
        Args:
            appointment_id: Appointment ID
            confirmation_code: Confirmation code for verification
            reason: Optional cancellation reason
            
        Returns:
            Cancellation confirmation
        """
        # Verify appointment exists and code matches
        appointment = await self.appointments.find_one({
            "appointment_id": appointment_id,
            "confirmation_code": confirmation_code
        })
        
        if not appointment:
            raise ValueError("Appointment not found or invalid confirmation code")
        
        # If real-time booking, call external API to cancel
        if appointment.get("external_booking_id"):
            # TODO: Call external API
            # await self.external_api.cancel_booking(
            #     appointment["external_booking_id"]
            # )
            logger.info(f"External booking cancelled: {appointment['external_booking_id']}")
        
        # Update status in database
        await self.appointments.update_one(
            {"appointment_id": appointment_id},
            {
                "$set": {
                    "status": "cancelled",
                    "cancellation_reason": reason,
                    "cancelled_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Appointment cancelled: {appointment_id}")
        
        return {
            "appointment_id": appointment_id,
            "status": "cancelled",
            "cancelled_at": datetime.utcnow().isoformat()
        }
