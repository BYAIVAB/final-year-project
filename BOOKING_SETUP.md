# Appointment Booking Setup Checklist

## Overview

This document provides setup and testing instructions for the AI Appointment Booking Agent feature integrated into the Medical RAG Chatbot.

## Backend Setup

### 1. Install Dependencies

The booking feature uses the same dependencies as the main app. No additional packages required.

```bash
cd backend
pip install -r requirements.txt
```

### 2. Update Environment Variables

Add to `backend/.env`:

```bash
# Booking Settings
BOOKING_MODE=dummy  # Use "dummy" for testing, "real_time" for production
PROVIDER_SEARCH_RADIUS_MILES=10
APPOINTMENT_TTL_DAYS=30
MAX_APPOINTMENTS_PER_SESSION=5

# External Provider APIs (for real_time mode - optional)
ZOCDOC_API_KEY=
ZOCDOC_API_URL=https://api.zocdoc.com/v1
HEALTHGRADES_API_KEY=
```

### 3. Setup MongoDB Collections

Run the setup scripts to create collections and seed dummy data:

```bash
cd backend

# Create appointments collection with indexes
python -m scripts.setup_appointments_collection

# Seed dummy providers (for testing)
python -m scripts.seed_providers
```

Verify in MongoDB:

```bash
mongosh medical_rag
db.providers.find()  # Should show 5 providers
db.appointments.find()  # Should be empty initially
```

### 4. Start Backend

```bash
cd backend
python -m app.main
```

Verify: http://localhost:8000/docs
- Check `/api/appointments/*` endpoints exist

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Frontend

```bash
npm run dev
```

Verify: http://localhost:5173

## End-to-End Testing

### Test Dummy Mode Booking

1. Go to http://localhost:5173/chat
2. Type: "I need to see a cardiologist"
3. Expected: Location modal appears
4. Click "Enter City Manually" → Type "Boston"
5. Expected: Provider list shows (Dr. Jane Smith, etc.)
6. Click "View Available Times" on any provider
7. Expected: Time slots appear
8. Select any slot
9. Expected: Patient info form appears
10. Fill in:
    - Name: "John Doe"
    - Phone: "555-123-4567"
11. Click "Confirm Appointment"
12. Expected: Confirmation card shows with confirmation code

### Verify Appointment Saved

1. Go to http://localhost:5173 (landing page)
2. Scroll to "My Appointments" section
3. Expected: See your booked appointment

### Test Cancellation

1. In "My Appointments", click "Cancel"
2. Confirm cancellation
3. Expected: Appointment removed from list

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments/providers/search` | Search providers by specialty |
| GET | `/api/appointments/providers/{id}/slots` | Get available time slots |
| POST | `/api/appointments/book` | Book an appointment |
| GET | `/api/appointments` | List user's appointments |
| DELETE | `/api/appointments/{id}` | Cancel an appointment |

## Troubleshooting

### Issue: "No providers found"

**Fix:** Run seed script again:
```bash
cd backend
python -m scripts.seed_providers
```

### Issue: "Missing X-Session-ID header"

**Fix:** Check browser localStorage has `session_id`
```javascript
// In browser console:
localStorage.getItem('session_id')
```

### Issue: Intent detection not working

**Fix:** 
1. Check Ollama is running: `ollama ps`
2. Test intent manually:
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversation_id": "test", "message": "book cardiologist"}'
```

### Issue: Booking UI not appearing

**Fix:**
1. Check browser console for errors
2. Verify React DevTools appointment store state

## Architecture Overview

### Backend Components

```
backend/
├── app/
│   ├── api/
│   │   └── appointments.py    # REST API endpoints
│   ├── services/
│   │   └── appointment_service.py  # Business logic
│   └── prompts/
│       └── booking_intent_prompts.py  # LLM prompts
└── scripts/
    ├── seed_providers.py      # Seed dummy data
    └── setup_appointments_collection.py  # MongoDB setup
```

### Frontend Components

```
frontend/src/
├── store/
│   └── appointmentStore.js    # Zustand state management
├── services/
│   └── appointmentService.js  # API client
├── hooks/
│   └── useBooking.js          # Booking workflow hook
├── components/
│   └── Booking/
│       ├── BookingCard.jsx
│       ├── ProviderCard.jsx
│       ├── LocationPermissionModal.jsx
│       ├── SlotSelector.jsx
│       └── PatientInfoForm.jsx
└── features/landing/appointments/
    └── MyAppointmentsSection.jsx
```

### Booking Flow

```
User Message ("I need a cardiologist")
        ↓
Intent Detection (LLM analyzes message)
        ↓
Extract Slots (specialty, symptoms, urgency)
        ↓
Request Location (browser geolocation or manual)
        ↓
Search Providers (dummy or real-time API)
        ↓
Select Provider → Show Time Slots
        ↓
Select Slot → Patient Info Form
        ↓
Book Appointment → Save to MongoDB
        ↓
Show Confirmation (with calendar download)
```

## Production Checklist

Before deploying to production:

- [ ] Switch `BOOKING_MODE=real_time` in `.env`
- [ ] Add real provider API keys (Zocdoc, etc.)
- [ ] Implement rate limiting on booking endpoints
- [ ] Add CAPTCHA to prevent spam bookings
- [ ] Setup appointment reminder emails/SMS
- [ ] Add analytics tracking for booking funnel
- [ ] Test on mobile devices
- [ ] Load test with 100+ concurrent bookings
- [ ] Setup monitoring/alerts for booking failures
- [ ] Implement actual external API integrations
