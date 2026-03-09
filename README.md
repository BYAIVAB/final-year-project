# Medical RAG Chatbot - Complete Project Documentation

> **LLM CONTEXT DOCUMENT**: This README is specifically designed to provide AI/LLM systems complete understanding of the entire codebase, architecture, and operational flows. Every file, folder, function, and data flow is documented comprehensively.

**Version:** 2.2 | **Last Updated:** March 9, 2026

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Complete Folder Structure](#complete-folder-structure)
4. [Backend Documentation](#backend-documentation)
5. [RAG Engine Documentation](#rag-engine-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [AI Appointment Booking Agent](#ai-appointment-booking-agent)
8. [API Reference](#api-reference)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Database Schemas](#database-schemas)
11. [Configuration Reference](#configuration-reference)
12. [Dependencies](#dependencies)
13. [Setup & Usage](#setup--usage)
14. [Changelog & Recent Updates](#changelog--recent-updates)

---

## PROJECT OVERVIEW

| Attribute | Value |
|-----------|-------|
| **Type** | Full-stack RAG (Retrieval-Augmented Generation) Medical Chatbot |
| **Architecture** | React Frontend + FastAPI Backend + RAG Engine Module |
| **Databases** | MongoDB (conversations/messages) + Pinecone (vector embeddings) |
| **LLM Provider** | Ollama (local, using tinyllama/llama2 model) |
| **Embedding Model** | sentence-transformers/all-MiniLM-L6-v2 (384 dimensions) |
| **Python Version** | 3.11+ |
| **Node Version** | 18+ |

### Core Features
1. **PDF Document Upload & Processing** - Upload medical PDFs, extract text, chunk, embed, store in Pinecone
2. **Conversational Buffer Memory** - Last 10 messages kept in context for continuity
3. **Dual Retrieval System** - Retrieves both document chunks AND relevant past chat messages
4. **Medical Domain Responses** - Specialized prompts for medical information
5. **Source Attribution** - Shows which documents/pages answers came from
6. **Real-time Dashboard** - Analytics showing queries, response times, popular topics
7. **Responsive UI** - Modern React interface with ARC AGI dark theme
8. **AI Appointment Booking Agent** - Natural language appointment scheduling with provider search, slot selection, and confirmation
9. **Smart Severity Detection** - Dynamic closing messages based on query urgency (critical/serious/moderate/general)
10. **ChatGPT-Style Thinking Indicator** - Modern animated loading states with phases (Thinking → Analyzing → Generating)
11. **Crisis Support Integration** - Automatic emergency helpline display for mental health crisis queries

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   USER INTERFACE                                 │
│                           (React + Vite + TailwindCSS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Landing Page │  │  Chat Page   │  │  Dashboard   │  │    Upload Modal    │   │
│  │  /           │  │   /chat      │  │  /dashboard  │  │  (PDF Processing)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                     AI APPOINTMENT BOOKING UI                             │   │
│  │  LocationModal → ProviderCard → SlotSelector → PatientInfoForm → BookingCard │
│  └──────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP/REST (axios) + X-Session-ID Header
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FASTAPI BACKEND                                     │
│                        (Async Python, Port 8000)                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │                          API ROUTES (app/api/)                          │     │
│  │  POST /api/chat          - Main RAG pipeline, returns AI response       │     │
│  │  GET/POST /api/conversations - CRUD conversations                       │     │
│  │  POST /api/documents/upload  - PDF upload and processing                │     │
│  │  GET /api/health             - System health check                      │     │
│  │  GET /api/metrics/dashboard  - Dashboard analytics data                 │     │
│  │  POST /api/appointments/providers/search - Search providers by specialty│     │
│  │  GET  /api/appointments/providers/{id}/slots - Get available time slots │     │
│  │  POST /api/appointments/book - Book an appointment                      │     │
│  │  GET  /api/appointments      - List user appointments (by session ID)   │     │
│  │  DELETE /api/appointments/{id} - Cancel an appointment                  │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │                       SERVICES (app/services/)                          │     │
│  │  ChatService        - Orchestrates RAG pipeline + booking intent detect │     │
│  │  DocumentService    - Handles PDF processing pipeline                   │     │
│  │  MongoDBService     - Async MongoDB operations (Motor driver)           │     │
│  │  MetricsService     - Tracks usage analytics                            │     │
│  │  AppointmentService - Provider search, slot management, booking logic   │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                      ▼                 ▼                 ▼
┌─────────────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐
│      RAG ENGINE         │  │    MONGODB      │  │       PINECONE          │
│    (rag/ module)        │  │   (Port 27017)  │  │    (Vector DB)          │
│                         │  │                 │  │                         │
│ • DocumentProcessor     │  │ Collections:    │  │ Index: medical-rag      │
│   - PDF extraction      │  │ • conversations │  │ Dimension: 384          │
│   - Text chunking       │  │ • messages      │  │ Metric: cosine          │
│                         │  │ • documents     │  │                         │
│ • EmbeddingGenerator    │  │ • metrics_*     │  │ Namespaces:             │
│   - sentence-transformers│ │                 │  │ • documents             │
│   - batch processing    │  │                 │  │ • chat_history          │
│                         │  │                 │  │                         │
│ • OllamaClient          │  │                 │  │                         │
│   - LLM generation      │  │                 │  │                         │
│                         │  │                 │  │                         │
│ • Retriever             │  │                 │  │                         │
│   - Dual retrieval      │  │                 │  │                         │
│                         │  │                 │  │                         │
│ • PromptBuilder         │  │                 │  │                         │
│   - Context assembly    │  │                 │  │                         │
└─────────────────────────┘  └─────────────────┘  └─────────────────────────┘
                                                            │
                                                            ▼
                                                  ┌─────────────────────┐
                                                  │      OLLAMA         │
                                                  │   (Port 11434)      │
                                                  │   tinyllama/llama2  │
                                                  └─────────────────────┘
```

---

## COMPLETE FOLDER STRUCTURE

```
medical-rag-chatbot/
│
├── README.md                              # This file - Complete documentation
├── QUICK_START.md                         # Quick setup guide
├── BOOKING_SETUP.md                       # AI Booking Agent setup guide
├── START_BOOKING.bat                      # Windows startup script
├── architecture_explanation_for_ai.txt    # Additional AI context document
├── pyrightconfig.json                     # Python type checking config
│
├── backend/                               # ══════════ FASTAPI BACKEND ══════════
│   ├── requirements.txt                   # Python dependencies (FastAPI, Motor, etc.)
│   ├── .env                               # Environment variables (create this)
│   │
│   ├── app/
│   │   ├── __init__.py                    # Package marker
│   │   ├── main.py                        # FastAPI app entry, lifespan, CORS, routers
│   │   ├── config.py                      # Pydantic Settings class (loads .env)
│   │   │
│   │   ├── api/                           # ─── API Route Handlers ───
│   │   │   ├── __init__.py                # Exports all routers
│   │   │   ├── chat.py                    # POST /api/chat - Main RAG endpoint
│   │   │   ├── conversations.py           # CRUD /api/conversations
│   │   │   ├── documents.py               # POST /api/documents/upload
│   │   │   ├── health.py                  # GET /api/health
│   │   │   ├── metrics.py                 # GET /api/metrics/dashboard
│   │   │   └── appointments.py            # Appointment booking API endpoints
│   │   │
│   │   ├── models/                        # ─── Pydantic Models ───
│   │   │   └── __init__.py                # Request/Response schemas
│   │   │
│   │   ├── services/                      # ─── Business Logic Services ───
│   │   │   ├── __init__.py
│   │   │   ├── chat_service.py            # RAG pipeline + booking intent detection
│   │   │   ├── document_service.py        # PDF processing pipeline
│   │   │   ├── mongodb_service.py         # Async MongoDB operations
│   │   │   ├── metrics_service.py         # Analytics tracking
│   │   │   └── appointment_service.py     # Provider search, slot management, booking
│   │   │
│   │   ├── prompts/                       # ─── LLM Prompt Templates ───
│   │   │   ├── __init__.py                # Exports prompt templates
│   │   │   └── booking_intent_prompts.py  # Booking intent detection prompts
│   │   │
│   │   └── utils/
│   │       └── __init__.py
│   │
│   ├── scripts/                           # ─── Setup & Seed Scripts ───
│   │   ├── __init__.py
│   │   ├── seed_providers.py              # Seeds dummy provider data
│   │   └── setup_appointments_collection.py  # MongoDB collection setup
│   │
│   ├── tests/                             # ─── Test Suite ───
│   │   ├── __init__.py
│   │   └── test_booking_flow.py           # Booking flow integration tests
│   │
│   └── uploads/                           # Temporary PDF storage (auto-created)
│
├── rag/                                   # ══════════ RAG ENGINE MODULE ══════════
│   ├── __init__.py                        # Package marker
│   ├── setup.py                           # pip install -e . setup
│   ├── requirements.txt                   # RAG-specific dependencies
│   │
│   ├── rag/                               # Main RAG package
│   │   ├── __init__.py
│   │   ├── config.py                      # RAGConfig class - all RAG settings
│   │   │
│   │   ├── src/                           # ─── Core RAG Logic ───
│   │   │   ├── __init__.py
│   │   │   ├── helper.py                  # EmbeddingGenerator, OllamaClient
│   │   │   ├── document_processor.py      # PDF extraction (PyMuPDF) + chunking
│   │   │   ├── memory.py                  # ConversationBuffer manager
│   │   │   └── prompt.py                  # Prompt template builder
│   │   │
│   │   ├── vectorstore/                   # ─── Vector Database ───
│   │   │   ├── __init__.py
│   │   │   └── pinecone_store.py          # PineconeStore class
│   │   │
│   │   ├── retrieval/                     # ─── Retrieval Logic ───
│   │   │   ├── __init__.py
│   │   │   └── retriever.py               # Dual retriever (docs + chat)
│   │   │
│   │   └── llm/
│   │       └── __init__.py
│   │
│   ├── medical_rag.egg-info/              # Generated by pip install -e .
│   └── rag.egg-info/
│
└── frontend/                              # ══════════ REACT FRONTEND ══════════
    ├── package.json                       # NPM dependencies
    ├── vite.config.js                     # Vite bundler config + proxy
    ├── tailwind.config.js                 # TailwindCSS theme config
    ├── postcss.config.js                  # PostCSS config
    ├── index.html                         # HTML entry point
    │
    ├── public/                            # Static assets
    │
    └── src/
        ├── main.jsx                       # React entry point, BrowserRouter
        ├── App.jsx                        # Main routes: /, /chat, /dashboard
        │
        ├── components/                    # ─── Reusable UI Components ───
        │   ├── Chat/
        │   │   ├── ChatContainer.jsx      # Main chat UI + booking integration
        │   │   ├── MessageInput.jsx       # Text input with send button
        │   │   ├── MessageItem.jsx        # Single message bubble
        │   │   ├── MessageList.jsx        # Scrollable message list
        │   │   └── TypingIndicator.jsx    # "..." animation while AI responds
        │   │
        │   ├── Booking/                   # ─── AI Appointment Booking Components ───
        │   │   ├── index.js               # Exports all booking components
        │   │   ├── LocationPermissionModal.jsx  # Geolocation/city selection
        │   │   ├── ProviderCard.jsx       # Provider selection card
        │   │   ├── SlotSelector.jsx       # Date/time slot selection
        │   │   ├── PatientInfoForm.jsx    # Patient information form
        │   │   └── BookingCard.jsx        # Confirmation card with calendar
        │   │
        │   ├── Layout/
        │   │   ├── MainLayout.jsx         # Page wrapper component
        │   │   └── GridBackground.jsx     # ARC AGI animated background
        │   │
        │   ├── Sidebar/
        │   │   └── Sidebar.jsx            # Conversation list + new chat button
        │   │
        │   └── Upload/
        │       └── UploadModal.jsx        # PDF upload modal with progress
        │
        ├── features/                      # ─── Feature-specific Components ───
        │   ├── landing/                   # Landing page sections
        │   │   ├── Navbar.jsx
        │   │   ├── HeroSection.jsx
        │   │   ├── DashboardGrid.jsx
        │   │   ├── FeaturesSection.jsx
        │   │   ├── HowItWorksSection.jsx
        │   │   ├── TestimonialsSection.jsx
        │   │   ├── CTASection.jsx
        │   │   ├── Footer.jsx
        │   │   ├── FloatingChatButton.jsx
        │   │   ├── ChatPopup.jsx
        │   │   ├── CursorGlow.jsx
        │   │   └── index.js               # Exports all landing components
        │   │   │
        │   │   └── appointments/          # ─── Appointment Management UI ───
        │   │       ├── index.js           # Exports appointments components
        │   │       └── MyAppointmentsSection.jsx  # User's appointments list
        │   │
        │   └── chat-widget/               # Embeddable chat widget
        │
        ├── pages/                         # ─── Page Components ───
        │   ├── NotFoundPage.jsx           # 404 page
        │   ├── landing/
        │   │   └── LandingPage.jsx        # Home page with all sections
        │   ├── chat/
        │   │   └── ChatPage.jsx           # Full chat interface
        │   └── dashboard/
        │       └── DashboardPage.jsx      # Analytics dashboard
        │
        ├── hooks/                         # ─── Custom React Hooks ───
        │   ├── useChat.js                 # Chat logic + booking intent detection
        │   ├── useConversations.js        # Conversation CRUD logic
        │   ├── useDocuments.js            # Document upload logic
        │   ├── useDashboardData.js        # Dashboard data fetching
        │   ├── useAutoScroll.js           # Auto-scroll to bottom
        │   ├── useSound.js                # Sound effects
        │   └── useBooking.js              # Booking flow management hook
        │
        ├── services/                      # ─── API Service Layer ───
        │   ├── api.js                     # Axios instance with session ID
        │   ├── chatService.js             # Chat API calls
        │   ├── conversationService.js     # Conversation API calls
        │   ├── documentService.js         # Document upload API calls
        │   └── appointmentService.js      # Appointment booking API calls
        │
        ├── store/                         # ─── State Management ───
        │   ├── chatStore.js               # Zustand store (conversations, messages)
        │   └── appointmentStore.js        # Zustand store (booking flow state)
        │
        └── styles/
            ├── globals.css                # Global styles + Tailwind imports
            └── landing/                   # Landing page specific styles
```

---

## BACKEND DOCUMENTATION

### File: `backend/app/main.py`
**Purpose**: FastAPI application entry point with lifecycle management

```python
# Key Components:
- lifespan(): Async context manager for startup/shutdown
  - Startup: Connects MongoDB, verifies RAG services, checks Pinecone
  - Shutdown: Disconnects MongoDB gracefully
  
- app: FastAPI instance with CORS middleware
  
- Routers included:
  - chat.router      → /api/chat
  - conversations.router → /api/conversations
  - documents.router → /api/documents
  - health.router    → /api/health
  - metrics.router   → /api/metrics

# Startup Sequence:
1. Connect to MongoDB (async)
2. Connect metrics service
3. Verify embeddings model loaded
4. Verify Ollama LLM available
5. Verify Pinecone connection
6. Log "Application ready!"
```

### File: `backend/app/config.py`
**Purpose**: Configuration management using Pydantic Settings

```python
class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "medical_rag"
    
    # Pinecone Vector DB
    PINECONE_API_KEY: str              # Required - from .env
    PINECONE_ENVIRONMENT: str = "us-east1-gcp"
    PINECONE_INDEX_NAME: str = "medical-rag"
    
    # Ollama LLM
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "tinyllama"
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 50
    
    # Memory
    BUFFER_SIZE: int = 10              # Last N messages in context
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", ...]
    
    # Prefix
    API_PREFIX: str = "/api"
    
    # Performance
    USE_GPU: bool = False
    USE_STREAMING: bool = False
```

### File: `backend/app/services/chat_service.py`
**Purpose**: Orchestrates the complete RAG pipeline with booking intent detection

```python
class ChatService:
    # Booking Keywords - Regex patterns for fast detection
    BOOKING_KEYWORDS = [
        r'\b(book|schedule|make)\s+(an?\s+)?appointment',
        r'\bsee\s+a\s+(doctor|specialist|\w+ologist)',
        r'\b(find|looking for)\s+a\s+\w+ologist',
        r'\bconsult\s+(with\s+)?a\s+\w+ologist',
        # ... more patterns
    ]
    
    def detect_booking_intent_keywords(message: str) -> Dict:
        """
        Keyword-based booking intent detection (fast & reliable)
        
        Uses regex patterns instead of LLM for:
        - Faster detection (<5ms vs 2-3 seconds)
        - More reliable than small LLMs
        - No dependency on LLM output format
        
        Returns: {
            "is_booking_intent": true/false,
            "specialty": "cardiology",  # extracted from patterns
            "urgency": "normal"  # or "urgent" if detected
        }
        """
    
    def clean_llm_response(response: str) -> str:
        """
        Clean LLM response to remove prompt artifacts
        Strips: GUIDELINE:, RECENT CONVERSATION:, Context: sections
        """
    
    async def process_message(conversation_id: str, message: str) -> Dict:
        """
        Complete RAG Pipeline with Booking Detection:
        
        Step 0: Detect Booking Intent (NEW)
           - Send message to LLM with booking intent prompt
           - If booking intent detected, return booking_data
           
        Step 1: Load Buffer (MongoDB)
           - Get last 10 messages for conversation
           - Format for prompt inclusion
           
        Step 2: Generate Embedding
           - Use sentence-transformers
           - 384-dimension vector
           
        Step 3: Dual Retrieval (Pinecone)
           - Query documents namespace (top 3)
           - Query chat_history namespace (top 2)
           - Filter by similarity threshold (0.7)
           
        Step 4: Build Prompt
           - System prompt (medical guidelines)
           - Retrieved document context
           - Retrieved chat history
           - Conversation buffer
           - Current user query
           
        Step 5: Generate Response (Ollama)
           - Send assembled prompt
           - Receive generated text
           
        Step 6: Save to MongoDB
           - Save user message
           - Save assistant response with sources
           
        Step 7: Store in Pinecone
           - Upsert user message embedding
           - For future semantic retrieval
           
        Returns: {
            message_id: str,
            response: str,
            sources: List[Dict],
            timing: Dict[str, float],
            booking_data: Optional[Dict]  # NEW: If booking intent detected
        }
        """
```

### File: `backend/app/services/appointment_service.py`
**Purpose**: Provider search, slot management, and appointment booking

```python
class AppointmentService:
    """
    Handles all appointment booking operations.
    Supports two modes: 'dummy' (local DB) and 'real_time' (external APIs)
    """
    
    async def search_providers_dummy(specialty: str, city: str, limit: int) -> List[Dict]:
        """
        Search dummy providers from MongoDB.
        Returns providers matching specialty and city.
        """
    
    async def search_providers_realtime(specialty: str, city: str, lat: float, lng: float) -> List[Dict]:
        """
        Search real providers via external APIs (Zocdoc, Healthgrades, etc.)
        Requires BOOKING_MODE=real_time and valid API keys.
        """
    
    async def get_provider_slots(provider_id: str, date: str = None) -> List[Dict]:
        """
        Get available appointment slots for a provider.
        In dummy mode: generates slots for next 7 days
        In real_time mode: fetches from provider's scheduling API
        
        Returns: [
            {"date": "2026-03-10", "time": "09:00 AM", "duration": 30},
            ...
        ]
        """
    
    async def book_appointment(
        session_id: str,
        provider_id: str, 
        slot: Dict,
        patient_info: Dict
    ) -> Dict:
        """
        Book an appointment and save to MongoDB.
        
        Generates confirmation code: XXXX-1234 format
        
        Returns: {
            "appointment_id": str,
            "confirmation_code": "CARD-5678",
            "provider": {...},
            "slot": {...},
            "patient_info": {...},
            "status": "confirmed"
        }
        """
    
    async def get_appointments(session_id: str) -> List[Dict]:
        """
        Get all appointments for a session ID.
        Sorted by date descending.
        """
    
    async def cancel_appointment(appointment_id: str, session_id: str) -> Dict:
        """
        Cancel an appointment.
        Verifies session_id ownership before cancellation.
        """
    
    def generate_confirmation_code(specialty: str) -> str:
        """
        Generate confirmation code in format: XXXX-1234
        XXXX = first 4 chars of specialty uppercased
        1234 = random 4-digit number
        """

# Global instance
appointment_service = AppointmentService()
```

### File: `backend/app/prompts/booking_intent_prompts.py`
**Purpose**: LLM prompts for booking intent detection

```python
BOOKING_INTENT_SYSTEM_PROMPT = '''
You are an AI assistant that detects appointment booking intent.

Analyze the user message and determine if they want to:
1. Schedule/book a doctor appointment
2. Find a healthcare provider/specialist
3. Check appointment availability

Return JSON with:
{
    "is_booking_intent": true/false,
    "specialty": "extracted specialty or null",
    "symptoms": ["symptoms mentioned"],
    "urgency": "low|medium|high"
}

Examples of booking intent:
- "I need to see a cardiologist" → is_booking_intent: true
- "Can I schedule an appointment with a dermatologist?"
- "I want to book a doctor for my back pain"
- "Find me a pediatrician near me"

Examples of NON-booking intent:
- "What are symptoms of diabetes?" → is_booking_intent: false
- "How do I treat a headache?"
- "What does high blood pressure mean?"
'''

LOCATION_REQUEST_PROMPT = '''
Ask the user for their location to find nearby providers.
'''

CONFIRMATION_PROMPT_TEMPLATE = '''
Confirm the appointment booking:
Provider: {provider_name}
Date: {date}
Time: {time}
'''
```

### File: `backend/app/services/document_service.py`
**Purpose**: Handles PDF upload and processing pipeline

```python
class DocumentService:
    async def process_document(document_id, file_path, filename, conversation_id):
        """
        Document Processing Pipeline:
        
        Step 1: Extract Text (PyMuPDF)
           - Fast text extraction
           - OCR fallback if enabled
           
        Step 2: Chunk Text (LangChain)
           - Chunk size: 500 chars
           - Overlap: 50 chars
           - Recursive splitting
           
        Step 3: Generate Embeddings (Batch)
           - Batch size: 32
           - sentence-transformers
           
        Step 4: Upsert to Pinecone
           - documents namespace
           - Include metadata (page, filename)
           
        Step 5: Update MongoDB
           - Mark document as completed
           - Store page/chunk counts
        """
```

### File: `backend/app/services/mongodb_service.py`
**Purpose**: Async MongoDB operations using Motor driver

```python
class MongoDBService:
    # Conversation Operations
    async def create_conversation(title: str) -> str
    async def get_conversations(limit: int) -> List[Dict]
    async def get_conversation(id: str) -> Dict
    async def delete_conversation(id: str) -> None
    
    # Message Operations
    async def save_message(conversation_id, role, content, metadata) -> str
    async def get_messages(conversation_id, limit) -> List[Dict]
    async def get_recent_messages(conversation_id, limit=10) -> List[Dict]
    
    # Document Operations
    async def create_document(conversation_id, filename, status) -> str
    async def update_document(id, status, page_count, chunk_count) -> None
    async def get_documents(conversation_id) -> List[Dict]
```

### File: `backend/app/services/metrics_service.py`
**Purpose**: Tracks usage analytics for dashboard

```python
class MetricsService:
    # Tracking Methods
    async def track_query(conversation_id, query, response_time, sources_count)
    async def track_document_upload(document_id, filename, page_count, ...)
    
    # Aggregation Methods
    async def get_dashboard_metrics() -> Dict:
        """Returns:
        - hero_metrics: total queries, avg response time, sessions
        - query_distribution: by category (symptoms, diagnosis, treatment, prevention)
        - timeline: hourly query counts
        - popular_topics: medical topics frequency
        - activity_feed: recent actions
        """
    
    # Query Categorization
    def categorize_query(query: str) -> str  # symptoms|diagnosis|treatment|prevention|general
    def extract_topics(query: str) -> List[str]  # Medical topics found
```

### File: `backend/app/models/__init__.py`
**Purpose**: Pydantic request/response schemas

```python
# Conversation Models
class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    last_active: datetime

# Message Models
class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str  # "user" | "assistant"
    content: str
    created_at: datetime
    metadata: Optional[Dict]

# Chat Models
class ChatRequest(BaseModel):
    conversation_id: str
    message: str

class Source(BaseModel):
    type: str  # "document"
    document_id: Optional[str]
    page: Optional[int]
    similarity: float
    snippet: str

class ChatResponse(BaseModel):
    message_id: str
    response: str
    sources: List[Source]
    timing: Dict[str, float]

# Document Models
class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str  # "processing" | "completed" | "failed"
    page_count: Optional[int]
    chunk_count: Optional[int]
    timing: Optional[Dict]
```

---

## RAG ENGINE DOCUMENTATION

### File: `rag/rag/config.py`
**Purpose**: RAG-specific configuration

```python
class RAGConfig:
    # Embeddings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_BATCH_SIZE = 32
    EMBEDDING_DEVICE = "cpu"  # or "cuda"
    
    # Pinecone
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = "medical-rag"
    PINECONE_NAMESPACE_DOCS = "documents"
    PINECONE_NAMESPACE_CHAT = "chat_history"
    
    # Chunking
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50
    
    # Retrieval
    TOP_K_DOCS = 3
    TOP_K_CHAT = 2
    SIMILARITY_THRESHOLD = 0.7
    
    # LLM (Ollama)
    OLLAMA_URL = "http://localhost:11434"
    OLLAMA_MODEL = "tinyllama"
    OLLAMA_TIMEOUT = 180
    OLLAMA_TEMPERATURE = 0.7
    OLLAMA_MAX_TOKENS = 256
    
    # Memory
    BUFFER_SIZE = 10
```

### File: `rag/rag/src/helper.py`
**Purpose**: Core ML utilities - embeddings and LLM client

```python
class EmbeddingGenerator:
    """Singleton pattern for model reuse"""
    
    def generate_embedding(text: str) -> List[float]:
        """Generate 384-dim embedding for single text"""
        
    def generate_embeddings(texts: List[str]) -> List[List[float]]:
        """Batch embedding generation (faster)"""
        
    @property
    def dimension(self) -> int:
        """Returns 384 for MiniLM"""

class OllamaClient:
    """HTTP client for Ollama LLM"""
    
    def generate(prompt: str, max_tokens: int, temperature: float) -> str:
        """Generate text response from Ollama"""
        # POST to http://localhost:11434/api/generate

# Convenience Functions
def generate_embedding(text: str) -> List[float]
def generate_embeddings(texts: List[str]) -> List[List[float]]
def generate_response(prompt: str) -> str
def check_services() -> Dict[str, bool]  # Check embeddings/LLM availability
```

### File: `rag/rag/src/document_processor.py`
**Purpose**: PDF text extraction and chunking

```python
class DocumentProcessor:
    def extract_text_from_pdf(pdf_path: str) -> List[Dict]:
        """
        Uses PyMuPDF (fitz) for fast extraction
        Returns: [{"page_number": 1, "text": "..."}]
        Falls back to OCR via pytesseract if text minimal
        """
    
    def chunk_pages(pages: List[Dict]) -> List[Dict]:
        """
        Uses LangChain RecursiveCharacterTextSplitter
        Chunk size: 500, Overlap: 50
        Returns: [{
            "text": "chunk content",
            "page_number": 1,
            "chunk_index": 0,
            "token_count": 85
        }]
        """
    
    def process_pdf(pdf_path: str) -> Tuple[List[Dict], int]:
        """
        Complete pipeline: extract → chunk
        Returns: (chunks, page_count)
        """
```

### File: `rag/rag/src/prompt.py`
**Purpose**: Prompt template construction

```python
SYSTEM_PROMPT = """You are a helpful medical AI assistant...
GUIDELINES:
1. Provide clear, concise answers
2. Always cite sources when using document information
3. If you don't know something, admit it honestly
4. Never provide medical diagnoses or treatment recommendations
5. Encourage users to consult healthcare professionals
6. Use simple language when possible, but be technically accurate
"""

def build_context_section(retrieved_docs: List[Dict]) -> str:
    """Formats retrieved documents for prompt"""

def build_chat_history_section(buffer_messages: List[Dict]) -> str:
    """Formats recent conversation for prompt"""

def build_complete_prompt(
    user_query: str,
    buffer_messages: List[Dict],
    retrieved_docs: List[Dict],
    retrieved_chat: List[Dict]
) -> str:
    """
    Assembles complete prompt structure:
    
    [SYSTEM_PROMPT]
    
    RETRIEVED CONTEXT:
    [Document 1] filename.pdf (Page 2) | Relevance: 0.85
    text content...
    
    RECENT CONVERSATION:
    User: previous message
    Assistant: previous response
    
    RELATED PAST DISCUSSIONS:
    [matched chat messages]
    
    USER QUESTION:
    current query
    
    ASSISTANT:
    """
```

### File: `rag/rag/src/memory.py`
**Purpose**: Conversation buffer memory management

```python
class ConversationBuffer:
    def __init__(self, buffer_size: int = 10):
        """Keep last N messages in context"""
    
    def format_messages_for_prompt(messages: List[Dict]) -> List[Dict]:
        """Format MongoDB messages for prompt inclusion"""
    
    def truncate_long_messages(messages: List[Dict], max_chars: int = 500):
        """Prevent prompt bloat from very long messages"""

def format_buffer_for_prompt(messages: List[Dict]) -> List[Dict]:
    """Convenience function"""
```

### File: `rag/rag/vectorstore/pinecone_store.py`
**Purpose**: Pinecone vector database operations

```python
class PineconeStore:
    def __init__(self):
        """Initialize Pinecone connection, create index if needed"""
        # Index: medical-rag
        # Dimension: 384 (MiniLM)
        # Metric: cosine
    
    def upsert_documents(document_id, chunks, conversation_id) -> int:
        """
        Batch upsert document chunks to 'documents' namespace
        Vector ID format: doc_{document_id}_chunk_{index}
        Metadata: document_id, conversation_id, page_number, text
        """
    
    def upsert_message(message_id, conversation_id, content, embedding, role):
        """
        Upsert single message to 'chat_history' namespace
        Vector ID format: msg_{conversation_id}_{message_id}
        """
    
    def query_documents(query_embedding, conversation_id, top_k=3) -> List[Dict]:
        """
        Query documents namespace filtered by conversation
        Returns matches above SIMILARITY_THRESHOLD (0.7)
        """
    
    def query_chat_history(query_embedding, conversation_id, top_k=2) -> List[Dict]:
        """
        Query chat_history namespace for relevant past messages
        """
    
    def health_check() -> bool:
        """Verify Pinecone connectivity"""
```

### File: `rag/rag/retrieval/retriever.py`
**Purpose**: Dual retrieval system

```python
class Retriever:
    async def retrieve(query: str, conversation_id: str) -> Tuple[List, List]:
        """
        Dual retrieval pipeline:
        1. Generate query embedding
        2. Query documents namespace (top 3)
        3. Query chat_history namespace (top 2)
        4. Return (doc_matches, chat_matches)
        """
    
    def format_sources_for_response(doc_matches: List[Dict]) -> List[Dict]:
        """
        Format for API response:
        [{
            type: "document",
            document_id: str,
            page: int,
            similarity: float,
            snippet: str (first 200 chars)
        }]
        """

# Global instance
retriever = Retriever()
```

---

## FRONTEND DOCUMENTATION

### File: `frontend/src/App.jsx`
**Purpose**: Main routing configuration

```jsx
// Routes:
<Route path="/" element={<LandingPage />} />      // Home with features
<Route path="/chat" element={<ChatPage />} />     // Full chat interface
<Route path="/dashboard" element={<DashboardPage />} />  // Analytics
<Route path="/404" element={<NotFoundPage />} />
<Route path="*" element={<Navigate to="/404" />} />
```

### File: `frontend/src/store/chatStore.js`
**Purpose**: Zustand global state management

```javascript
const useChatStore = create((set, get) => ({
  // State
  conversations: [],           // All conversations list
  currentConversationId: null, // Selected conversation
  messages: [],                // Current conversation messages
  isLoading: false,            // Loading indicator
  isTyping: false,             // AI typing indicator
  error: null,                 // Error message
  
  // Actions
  setConversations: (list) => set({ conversations: list }),
  setCurrentConversation: (id) => set({ currentConversationId: id, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set(state => ({ messages: [...state.messages, msg] })),
  setLoading: (bool) => set({ isLoading: bool }),
  setTyping: (bool) => set({ isTyping: bool }),
  setError: (err) => set({ error: err }),
  reset: () => set({ /* reset all to initial */ })
}))
```

### File: `frontend/src/hooks/useChat.js`
**Purpose**: Chat business logic hook with booking integration

```javascript
const useChat = (conversationId) => {
  // Uses: useChatStore, useAppointmentStore, chatService
  
  const loadMessages = async () => {
    // GET /api/conversations/{id}/messages
    // Updates store.messages
  }
  
  const sendMessage = async (message) => {
    // 1. Add user message to UI immediately
    // 2. Set typing indicator
    // 3. POST /api/chat
    // 4. Check for booking_data in response (NEW)
    //    - If booking intent detected, trigger booking flow
    //    - Call startBooking(booking_data)
    // 5. Add assistant response to UI
    // 6. Clear typing indicator
  }
  
  return { messages, isLoading, isTyping, sendMessage, loadMessages }
}
```

### File: `frontend/src/store/appointmentStore.js`
**Purpose**: Zustand state management for booking flow

```javascript
const useAppointmentStore = create((set, get) => ({
  // State
  isBooking: false,              // Booking mode active
  bookingStep: 'idle',           // idle|location|providers|slots|patientInfo|confirmation
  extractedSlots: null,          // Slots from LLM extraction
  detectedSpecialty: null,       // Specialty from intent detection
  location: null,                // User's location {city, lat, lng}
  providers: [],                 // Found providers
  selectedProvider: null,        // Chosen provider
  selectedSlot: null,            // Chosen time slot
  patientInfo: null,             // Patient form data
  appointments: [],              // Booked appointments
  loading: false,
  error: null,
  
  // Actions
  startBooking: (data) => set({
    isBooking: true,
    bookingStep: 'location',
    detectedSpecialty: data.specialty,
    extractedSlots: data.slots
  }),
  
  setBookingStep: (step) => set({ bookingStep: step }),
  setLocation: (location) => set({ location }),
  setProviders: (providers) => set({ providers }),
  selectProvider: (provider) => set({ selectedProvider: provider, bookingStep: 'slots' }),
  selectSlot: (slot) => set({ selectedSlot: slot, bookingStep: 'patientInfo' }),
  setPatientInfo: (info) => set({ patientInfo: info }),
  
  addAppointment: (appointment) => set(state => ({
    appointments: [...state.appointments, appointment],
    bookingStep: 'confirmation'
  })),
  
  resetBooking: () => set({
    isBooking: false,
    bookingStep: 'idle',
    selectedProvider: null,
    selectedSlot: null,
    patientInfo: null,
    providers: [],
    error: null
  }),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}))
```

### File: `frontend/src/hooks/useBooking.js`
**Purpose**: Booking workflow logic hook

```javascript
const useBooking = () => {
  // Uses: useAppointmentStore, appointmentService
  
  const searchProviders = async (specialty, location) => {
    // POST /api/appointments/providers/search
    // Updates store.providers
  }
  
  const fetchSlots = async (providerId) => {
    // GET /api/appointments/providers/{id}/slots
    // Returns available time slots
  }
  
  const bookAppointment = async (providerId, slot, patientInfo) => {
    // POST /api/appointments/book
    // Adds new appointment to store.appointments
  }
  
  const loadAppointments = async () => {
    // GET /api/appointments
    // Fetches user's appointments by session ID
  }
  
  const cancelAppointment = async (appointmentId) => {
    // DELETE /api/appointments/{id}
    // Removes from store.appointments
  }
  
  return {
    ...appointmentStore,
    searchProviders,
    fetchSlots,
    bookAppointment,
    loadAppointments,
    cancelAppointment
  }
}
```

### File: `frontend/src/services/appointmentService.js`
**Purpose**: Appointment API client functions

```javascript
// Provider Search
const searchProviders = async (specialty, city, lat, lng) => {
  // POST /api/appointments/providers/search
  // Body: { specialty, city, latitude, longitude }
}

// Get Slots
const getProviderSlots = async (providerId, date) => {
  // GET /api/appointments/providers/{id}/slots?date={date}
}

// Book Appointment
const bookAppointment = async (providerId, slot, patientInfo) => {
  // POST /api/appointments/book
  // Body: { provider_id, slot, patient_info }
}

// Get My Appointments
const getAppointments = async () => {
  // GET /api/appointments
  // Uses X-Session-ID header automatically
}

// Cancel Appointment
const cancelAppointment = async (appointmentId) => {
  // DELETE /api/appointments/{id}
}
```

### Booking Components (`frontend/src/components/Booking/`)

**LocationPermissionModal.jsx**
```jsx
// Modal that appears when booking starts
// Options:
// 1. Allow browser geolocation
// 2. Enter city manually
// 3. Skip (use default location)

// Props: onLocationSelected(location), onClose()
```

**ProviderCard.jsx**
```jsx
// Displays a single provider for selection
// Shows:
// - Provider name and photo
// - Specialty
// - Rating (stars)
// - Distance/location
// - Next available slot
// - "Select" button

// Props: provider, onSelect()
```

**SlotSelector.jsx**
```jsx
// Date/time slot selection grid
// Features:
// - Date picker (next 7 days)
// - Time slots grid (morning/afternoon/evening)
// - Selected slot highlighting

// Props: slots, selectedSlot, onSlotSelect(slot)
```

**PatientInfoForm.jsx**
```jsx
// Form for patient information
// Fields:
// - Full name (required)
// - Phone number (required)  
// - Email (required)
// - Reason for visit (optional)
// - Notes (optional)

// Props: onSubmit(patientInfo), onBack()
```

**BookingCard.jsx**
```jsx
// Confirmation card after successful booking
// Shows:
// - Confirmation code (XXXX-1234)
// - Provider details
// - Date and time
// - "Add to Calendar" button (generates .ics file)
// - "Book Another" button

// Props: appointment, onNewBooking()
```

### File: `frontend/src/components/Chat/ChatContainer.jsx`
**Purpose**: Main chat UI with integrated booking flow

```jsx
// Integrated booking UI with all handlers memoized via useCallback
// Renders based on bookingStep:
// - 'idle': Normal chat interface
// - 'location': <LocationPermissionModal /> (shows immediately)
// - 'providers': List of <ProviderCard /> with error handling
// - 'slots': <SlotSelector /> with loading/empty states
// - 'patientInfo': <PatientInfoForm />
// - 'confirmed': Booking complete (confirmation added to chat)

// Flow:
// User message → Backend returns metadata.intent='booking' → startBooking()
// → location modal (immediate) → providers → slots → patientInfo
// → book → confirmation message in chat with special styling

// Booking confirmation is added to chat messages:
addMessage({
  role: 'assistant',
  content: `🎉 Appointment Confirmed!\n\nProvider: ...`,
  metadata: { type: 'booking_confirmation', confirmation_code }
})
```

### File: `frontend/src/components/Chat/MessageItem.jsx`
**Purpose**: Renders individual chat messages with special booking confirmation styling

```jsx
// Detects metadata.type === 'booking_confirmation'
// Renders booking confirmations with:
// - Green-themed card styling
// - Prominent confirmation code display
// - Key/value details (provider, date, time, location)
```

### File: `frontend/src/features/landing/appointments/MyAppointmentsSection.jsx`
**Purpose**: User's appointments displayed on landing page

```jsx
// Section on landing page showing booked appointments
// Features:
// - List of upcoming appointments
// - Confirmation codes
// - Cancel appointment button
// - "No appointments yet" state
// - Auto-refreshes on mount
```

### File: `frontend/src/hooks/useConversations.js`
**Purpose**: Conversation CRUD logic hook

```javascript
const useConversations = () => {
  const loadConversations = async () => {
    // GET /api/conversations
  }
  
  const createConversation = async (title) => {
    // POST /api/conversations
    // Auto-select new conversation
  }
  
  const deleteConversation = async (id) => {
    // DELETE /api/conversations/{id}
    // Select another if deleted current
  }
  
  return { conversations, currentConversationId, createConversation, deleteConversation, selectConversation }
}
```

### File: `frontend/src/hooks/useDocuments.js`
**Purpose**: Document upload logic hook

```javascript
const useDocuments = () => {
  const uploadDocument = async (conversationId, file) => {
    // POST /api/documents/upload
    // FormData with file + conversation_id
    // Track upload progress
  }
  
  return { uploading, progress, error, uploadDocument, getDocuments }
}
```

### File: `frontend/src/services/api.js`
**Purpose**: Axios instance configuration

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',  // Uses Vite proxy in dev
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000  // 2 minutes for document processing
})

// Request/Response interceptors for error handling
```

### File: `frontend/src/pages/chat/ChatPage.jsx`
**Purpose**: Full chat interface page

```jsx
// Layout:
<MainLayout>
  <Sidebar />           // Conversation list, new chat, upload button
  <ChatContainer />     // Messages + input
</MainLayout>

// Modal:
<UploadModal />         // PDF upload when triggered
```

### File: `frontend/src/pages/dashboard/DashboardPage.jsx`  
**Purpose**: Analytics dashboard page

```jsx
// Displays:
- Hero metrics: Total queries, avg response time, sessions
- Query distribution chart (by category)
- Timeline chart (queries over time)
- Popular topics
- Activity feed (recent actions)

// Uses: useDashboardData hook
// Polls: GET /api/metrics/dashboard every 30 seconds
```

---

## AI APPOINTMENT BOOKING AGENT

### Overview

The AI Appointment Booking Agent is an intelligent scheduling system integrated into the Medical RAG Chatbot. It uses natural language processing to detect booking intent, extract medical specialties from user messages, and guide users through a seamless appointment booking flow.

### Key Features

| Feature | Description |
|---------|-------------|
| **Intent Detection** | Keyword-based regex patterns detect booking intent (fast <5ms) |
| **Specialty Extraction** | Automatically extracts medical specialty from user message |
| **Provider Search** | Find healthcare providers by specialty and location |
| **Real-time Slots** | View available appointment time slots |
| **Anonymous Booking** | Session-based booking (no login required) |
| **Calendar Export** | Download .ics files for calendar integration |
| **Confirmation Codes** | Unique codes in XXXX-1234 format |
| **Chat Confirmation** | Booking confirmation displayed in chat with special styling |

### Booking Flow

```
User Message: "I want to book an appointment with a cardiologist"
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Intent Detection (ChatService)    │
│  - Keyword regex matches booking phrases   │
│  - Extracts: specialty, urgency            │
│  - Fast: <5ms for detection                │
│  - Returns: metadata.intent = 'booking'    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Location Request                   │
│  - LocationPermissionModal appears IMMEDIATELY│
│  - Options: Geolocation / Enter city / Skip │
│  - User provides location                   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 3: Provider Search                    │
│  - POST /api/appointments/providers/search  │
│  - Returns matching providers from DB       │
│  - Display ProviderCard list                │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 4: Slot Selection                     │
│  - GET /api/appointments/providers/{id}/slots│
│  - Display SlotSelector component           │
│  - User selects date and time               │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 5: Patient Information                │
│  - PatientInfoForm appears                  │
│  - Collects: name, phone, email, reason     │
│  - User submits form                        │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  STEP 6: Book & Confirm                     │
│  - POST /api/appointments/book              │
│  - Generate confirmation code (CARD-1234)   │
│  - Add confirmation message to chat         │
│  - Display with special green card styling  │
│  - Option to download .ics calendar file    │
└─────────────────────────────────────────────┘
```

### Intent Detection Keywords

The system uses regex patterns to detect booking intent (defined in `chat_service.py`):

| Pattern Type | Examples |
|--------------|----------|
| **Book Actions** | "book appointment", "schedule a visit", "make an appointment" |
| **Need Doctor** | "need to see a doctor", "want to consult a specialist" |
| **Find Provider** | "find a cardiologist", "looking for a dermatologist" |
| **Specialty Suffix** | "see a neurologist", "consult a psychiatrist" |

### Booking Modes

The system supports two operation modes controlled by `BOOKING_MODE` environment variable:

| Mode | Description | Use Case |
|------|-------------|----------|
| `dummy` | Uses local MongoDB with seeded providers | Development/Testing |
| `real_time` | Integrates with external APIs (Zocdoc, Healthgrades) | Production |

### Dummy Providers (for Testing)

Seed providers with: `.\venv\Scripts\python.exe -m scripts.seed_providers`

The system includes 12 seeded providers for testing:

| Provider | Specialty | Rating |
|----------|-----------|--------|
| Dr. Jane Smith | Cardiology | 4.8 |
| Dr. Robert Williams | Cardiology | 4.5 |
| Dr. Michael Jones | Dermatology | 4.6 |
| Dr. Lisa Anderson | Dermatology | 4.8 |
| Dr. Priya Patel | Neurology | 4.9 |
| Dr. David Chen | Orthopedics | 4.7 |
| Dr. Maria Garcia | Pediatrics | 4.9 |
| Dr. Sarah Thompson | Psychiatry | 4.7 |
| Dr. James Wilson | General Practice | 4.6 |
| Dr. Amanda Lee | ENT | 4.8 |
| Dr. Kevin Brown | Gastroenterology | 4.5 |
| Dr. Emily Davis | Ophthalmology | 4.9 |

### Session-based Authentication

Appointments are tied to browser sessions via `X-Session-ID` header:
- Session ID is auto-generated on first visit
- Stored in `localStorage` 
- Attached to all API requests via Axios interceptor
- Enables anonymous booking without login

### Files Added/Modified for Booking

**New Backend Files:**
| File | Purpose |
|------|---------|
| `app/services/appointment_service.py` | Core booking business logic |
| `app/api/appointments.py` | REST API endpoints |
| `app/prompts/__init__.py` | Prompt exports |
| `app/prompts/booking_intent_prompts.py` | Intent detection prompts |
| `scripts/seed_providers.py` | Seeds dummy provider data |
| `scripts/setup_appointments_collection.py` | MongoDB setup |
| `tests/test_booking_flow.py` | Integration tests |

**Modified Backend Files:**
| File | Changes |
|------|---------|
| `app/config.py` | Added booking config vars |
| `app/main.py` | Added appointments router |
| `app/services/chat_service.py` | Added intent detection |

**New Frontend Files:**
| File | Purpose |
|------|---------|
| `store/appointmentStore.js` | Zustand booking state |
| `services/appointmentService.js` | API client functions |
| `hooks/useBooking.js` | Booking logic hook |
| `components/Booking/LocationPermissionModal.jsx` | Location input |
| `components/Booking/ProviderCard.jsx` | Provider selection |
| `components/Booking/SlotSelector.jsx` | Time slot grid |
| `components/Booking/PatientInfoForm.jsx` | Patient form |
| `components/Booking/BookingCard.jsx` | Confirmation card |
| `features/landing/appointments/MyAppointmentsSection.jsx` | Appointments list |

**Modified Frontend Files:**
| File | Changes |
|------|---------|
| `services/api.js` | Added session ID interceptor |
| `hooks/useChat.js` | Added booking intent trigger |
| `components/Chat/ChatContainer.jsx` | Integrated booking UI |
| `pages/landing/LandingPage.jsx` | Added appointments section |

### Setup Instructions

**1. Setup MongoDB Collection:**
```bash
cd backend
python -m scripts.setup_appointments_collection
```

**2. Seed Dummy Providers:**
```bash
python -m scripts.seed_providers
```

**3. Configure Environment:**
Add to `backend/.env`:
```env
# Booking Configuration
BOOKING_MODE=dummy
APPOINTMENT_TTL_DAYS=30
MAX_APPOINTMENTS_PER_SESSION=10

# For production (optional)
# BOOKING_MODE=real_time
# ZOCDOC_API_KEY=your-key
# HEALTHGRADES_API_KEY=your-key
```

**4. Test Booking:**
- Start the application
- Type: "I need to see a cardiologist"
- Follow the booking flow

---

## API REFERENCE

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message, get RAG response |

**Request:**
```json
{
  "conversation_id": "507f1f77bcf86cd799439011",
  "message": "What are the symptoms of diabetes?"
}
```

**Response:**
```json
{
  "message_id": "507f1f77bcf86cd799439012",
  "response": "The main symptoms of diabetes include...",
  "sources": [
    {
      "type": "document",
      "document_id": "507f1f77bcf86cd799439010",
      "page": 5,
      "similarity": 0.89,
      "snippet": "Diabetes symptoms typically include..."
    }
  ],
  "timing": {
    "buffer_load": 12.5,
    "embedding": 45.2,
    "retrieval": 120.3,
    "llm_generation": 2500.1,
    "total": 2680.5
  }
}
```

### Conversation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/conversations` | List all conversations |
| `POST` | `/api/conversations` | Create new conversation |
| `GET` | `/api/conversations/{id}` | Get single conversation |
| `DELETE` | `/api/conversations/{id}` | Delete conversation |
| `GET` | `/api/conversations/{id}/messages` | Get conversation messages |

### Document Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/documents/upload` | Upload PDF (multipart/form-data) |
| `GET` | `/api/documents/{id}` | Get document status |
| `GET` | `/api/conversations/{id}/documents` | Get conversation documents |

### Metrics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/metrics/dashboard` | Get all dashboard metrics |
| `GET` | `/api/metrics/realtime` | Get minimal real-time metrics |
| `POST` | `/api/metrics/accuracy/feedback` | Submit accuracy feedback |

### Health Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health check |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/appointments/providers/search` | Search providers by specialty/location |
| `GET` | `/api/appointments/providers/{id}/slots` | Get provider's available slots |
| `POST` | `/api/appointments/book` | Book an appointment |
| `GET` | `/api/appointments` | List user's appointments (by session) |
| `DELETE` | `/api/appointments/{id}` | Cancel an appointment |

**Search Providers Request:**
```json
{
  "specialty": "cardiology",
  "city": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Search Providers Response:**
```json
{
  "providers": [
    {
      "id": "507f1f77bcf86cd799439020",
      "name": "Dr. Jane Smith",
      "specialty": "Cardiology",
      "rating": 4.8,
      "location": "123 Medical Center, New York",
      "distance_miles": 2.5,
      "next_available": "2026-03-09 09:00 AM",
      "photo_url": "https://..."
    }
  ]
}
```

**Get Slots Response:**
```json
{
  "provider_id": "507f1f77bcf86cd799439020",
  "slots": [
    {
      "date": "2026-03-10",
      "time": "09:00 AM",
      "duration": 30,
      "available": true
    },
    {
      "date": "2026-03-10",
      "time": "09:30 AM", 
      "duration": 30,
      "available": true
    }
  ]
}
```

**Book Appointment Request:**
```json
{
  "provider_id": "507f1f77bcf86cd799439020",
  "slot": {
    "date": "2026-03-10",
    "time": "09:00 AM"
  },
  "patient_info": {
    "name": "John Doe",
    "phone": "+1-555-123-4567",
    "email": "john@example.com",
    "reason": "Annual checkup"
  }
}
```

**Book Appointment Response:**
```json
{
  "appointment_id": "507f1f77bcf86cd799439030",
  "confirmation_code": "CARD-5678",
  "status": "confirmed",
  "provider": {
    "name": "Dr. Jane Smith",
    "specialty": "Cardiology",
    "location": "123 Medical Center, New York"
  },
  "slot": {
    "date": "2026-03-10",
    "time": "09:00 AM",
    "duration": 30
  },
  "patient_info": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "created_at": "2026-03-08T14:30:00Z"
}
```

**Get My Appointments Response:**
```json
{
  "appointments": [
    {
      "id": "507f1f77bcf86cd799439030",
      "confirmation_code": "CARD-5678",
      "status": "confirmed",
      "provider": {...},
      "slot": {...},
      "created_at": "2026-03-08T14:30:00Z"
    }
  ]
}
```

**Cancel Appointment Response:**
```json
{
  "message": "Appointment cancelled successfully",
  "appointment_id": "507f1f77bcf86cd799439030"
}
```

---

## DATA FLOW DIAGRAMS

### Chat Message Flow
```
User types message
       │
       ▼
┌─────────────────┐
│ Frontend: React │
│ useChat hook    │
└────────┬────────┘
         │ POST /api/chat
         ▼
┌─────────────────┐
│ Backend: FastAPI│
│ chat.py router  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ChatService     │
│ process_message │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────────┐
│MongoDB│ │ RAG Engine│
│buffer │ │           │
└───┬───┘ └─────┬─────┘
    │           │
    │     ┌─────┴─────┐
    │     │           │
    │     ▼           ▼
    │  ┌──────┐  ┌────────┐
    │  │Embed │  │Pinecone│
    │  │Query │  │ Query  │
    │  └──┬───┘  └───┬────┘
    │     │          │
    │     └────┬─────┘
    │          │
    │          ▼
    │    ┌───────────┐
    │    │Prompt     │
    │    │Builder    │
    │    └─────┬─────┘
    │          │
    │          ▼
    │    ┌───────────┐
    │    │ Ollama    │
    │    │ LLM Gen   │
    │    └─────┬─────┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│ Save to MongoDB │
│ + Pinecone      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Response │
│ to Frontend     │
└─────────────────┘
```

### Document Upload Flow
```
User selects PDF
       │
       ▼
┌─────────────────┐
│ Frontend: React │
│ UploadModal     │
└────────┬────────┘
         │ POST /api/documents/upload
         │ (multipart/form-data)
         ▼
┌─────────────────┐
│ Backend: FastAPI│
│ documents.py    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DocumentService │
│ process_document│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RAG: PyMuPDF    │
│ Extract Text    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RAG: LangChain  │
│ Chunk Text      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RAG: Embeddings │
│ Batch Generate  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pinecone        │
│ Upsert Vectors  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB         │
│ Update Status   │
└─────────────────┘
```

### Appointment Booking Flow
```
User types: "I need to see a cardiologist"
       │
       ▼
┌─────────────────┐
│ Frontend: React │
│ useChat hook    │
└────────┬────────┘
         │ POST /api/chat
         ▼
┌─────────────────┐
│ ChatService     │
│ detect_booking  │
│ _intent()       │
└────────┬────────┘
         │ Ollama LLM
         ▼
┌─────────────────┐
│ Returns:        │
│ is_booking:true │
│ specialty:      │
│ "cardiology"    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Frontend:       │
│ startBooking()  │
│ Opens Location  │
│ Modal           │
└────────┬────────┘
         │ User provides location
         ▼
┌─────────────────┐
│ POST /api/      │
│ appointments/   │
│ providers/search│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Appointment     │
│ Service queries │
│ MongoDB         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display         │
│ ProviderCards   │
└────────┬────────┘
         │ User selects provider
         ▼
┌─────────────────┐
│ GET /api/       │
│ appointments/   │
│ providers/{id}/ │
│ slots           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display         │
│ SlotSelector    │
└────────┬────────┘
         │ User selects slot
         ▼
┌─────────────────┐
│ Display         │
│ PatientInfoForm │
└────────┬────────┘
         │ User submits info
         ▼
┌─────────────────┐
│ POST /api/      │
│ appointments/   │
│ book            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Appointment     │
│ Service:        │
│ - Generate code │
│ - Save to DB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display         │
│ BookingCard     │
│ CARD-5678       │
└─────────────────┘
```

---

## DATABASE SCHEMAS

### MongoDB Collections

**conversations**
```javascript
{
  _id: ObjectId,
  title: String,           // "New Chat" default
  created_at: Date,
  last_active: Date        // Updated on each message
}
```

**messages**
```javascript
{
  _id: ObjectId,
  conversation_id: ObjectId,
  role: String,            // "user" | "assistant"
  content: String,
  created_at: Date,
  metadata: {
    sources: [...],        // For assistant messages
    timing: {...}
  }
}
```

**documents**
```javascript
{
  _id: ObjectId,
  conversation_id: ObjectId,
  filename: String,
  status: String,          // "processing" | "completed" | "failed"
  page_count: Number,
  chunk_count: Number,
  created_at: Date,
  completed_at: Date
}
```

**metrics_queries**
```javascript
{
  _id: ObjectId,
  conversation_id: String,
  query: String,
  category: String,        // "symptoms" | "diagnosis" | "treatment" | "prevention" | "general"
  topics: [String],        // ["Cardiovascular", "Diabetes"]
  response_time: Number,   // ms
  sources_count: Number,
  timestamp: Date
}
```

**providers** (Appointment Booking)
```javascript
{
  _id: ObjectId,
  name: String,            // "Dr. Jane Smith"
  specialty: String,       // "Cardiology"
  location: String,        // "123 Medical Center, New York"
  city: String,            // "New York"
  rating: Number,          // 4.8
  photo_url: String,       // Profile photo URL
  phone: String,
  email: String,
  available_slots: [       // Pre-generated slots
    {
      date: String,        // "2026-03-10"
      time: String,        // "09:00 AM"
      duration: Number,    // 30 (minutes)
      available: Boolean
    }
  ],
  created_at: Date
}
```

**appointments** (Appointment Booking)
```javascript
{
  _id: ObjectId,
  session_id: String,      // X-Session-ID header value (for anonymous users)
  provider_id: ObjectId,
  confirmation_code: String,  // "CARD-5678"
  status: String,          // "confirmed" | "cancelled" | "completed"
  slot: {
    date: String,          // "2026-03-10"
    time: String,          // "09:00 AM"
    duration: Number       // 30
  },
  patient_info: {
    name: String,
    phone: String,
    email: String,
    reason: String
  },
  provider_snapshot: {     // Denormalized provider data at booking time
    name: String,
    specialty: String,
    location: String
  },
  created_at: Date,
  cancelled_at: Date,      // If cancelled
  expires_at: Date         // TTL index for auto-cleanup
}
```

### Pinecone Index Schema

**Index: medical-rag**
- Dimension: 384
- Metric: cosine

**Namespace: documents**
```javascript
{
  id: "doc_{document_id}_chunk_{index}",
  values: [0.123, ...],    // 384-dim embedding
  metadata: {
    document_id: String,
    conversation_id: String,
    chunk_index: Number,
    page_number: Number,
    text: String,          // First 500 chars
    type: "document"
  }
}
```

**Namespace: chat_history**
```javascript
{
  id: "msg_{conversation_id}_{message_id}",
  values: [0.123, ...],    // 384-dim embedding
  metadata: {
    message_id: String,
    conversation_id: String,
    content: String,       // First 500 chars
    role: String,          // "user" | "assistant"
    type: "message"
  }
}
```

---

## CONFIGURATION REFERENCE

### Environment Variables (.env)

Create `backend/.env`:
```bash
# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=medical_rag

# Pinecone (REQUIRED)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=medical-rag

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=tinyllama

# AI Appointment Booking
BOOKING_MODE=dummy                    # dummy | real_time
APPOINTMENT_TTL_DAYS=30               # Auto-delete appointments after N days
MAX_APPOINTMENTS_PER_SESSION=10       # Limit per anonymous session
PROVIDER_SEARCH_RADIUS_MILES=25       # Search radius for providers

# External Provider APIs (for real_time mode)
ZOCDOC_API_KEY=                       # Optional: Zocdoc integration
ZOCDOC_API_URL=https://api.zocdoc.com
HEALTHGRADES_API_KEY=                 # Optional: Healthgrades integration

# Optional
USE_GPU=false
USE_STREAMING=false
BUFFER_SIZE=10
```

### Frontend Environment (optional)

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8000
```

---

## DEPENDENCIES

### Backend (Python)
```
fastapi==0.115.0          # Web framework
uvicorn[standard]==0.34.0 # ASGI server
motor==3.6.0              # Async MongoDB driver
pymongo==4.9.2            # MongoDB driver
pydantic==2.10.3          # Data validation
pydantic-settings==2.6.1  # Settings management
python-multipart==0.0.20  # File uploads
requests==2.32.3          # HTTP client
python-dotenv==1.1.0      # Environment loading
```

### RAG Engine (Python)
```
langchain==0.3.26         # Text splitting
sentence-transformers==4.1.0  # Embeddings
transformers==4.47.1      # Transformer models
torch==2.4.0              # Deep learning
pinecone>=7.0.0           # Vector database
PyMuPDF==1.24.0           # PDF extraction
pypdf==5.6.1              # PDF fallback
pytesseract==0.3.13       # OCR
pdf2image==1.17.0         # PDF to image
Pillow==10.4.0            # Image processing
numpy==1.26.4             # Numerical operations
```

### Frontend (Node.js)
```
react==18.3.1             # UI framework
react-dom==18.3.1         # React DOM
react-router-dom==6.22.0  # Routing
zustand==5.0.2            # State management
axios==1.7.9              # HTTP client
framer-motion==11.0.0     # Animations
recharts==2.12.0          # Charts
tailwindcss==3.4.17       # CSS framework
vite==6.0.3               # Build tool
```

---

## SETUP & USAGE

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on localhost:27017
- Ollama running with tinyllama model
- Pinecone account with API key

### Quick Start

**1. Clone and Setup Backend:**
```bash
cd backend
pip install -r requirements.txt

# Create .env file with your PINECONE_API_KEY

# Start server
uvicorn app.main:app --reload --port 8000
```

**2. Install RAG Module:**
```bash
cd rag
pip install -e .
```

**3. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**4. Setup Appointment Booking (Optional):**
```bash
cd backend

# Setup MongoDB collections
python -m scripts.setup_appointments_collection

# Seed dummy providers
python -m scripts.seed_providers
```

**5. Start Services:**
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Ollama
ollama serve
ollama run tinyllama

# Terminal 3: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 4: Frontend
cd frontend && npm run dev
```

**5. Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## CHANGELOG & RECENT UPDATES

### Version 2.2 - March 9, 2026

#### 🔧 Bug Fixes

**1. Pinecone Connection Fix**
- **Issue:** `.env` file was entirely commented out, causing Pinecone API key not to load
- **Fix:** Uncommented all environment variables in `backend/.env`
- **File:** `backend/.env`

**2. Timestamp Timezone Fix**
- **Issue:** Timestamps showed UTC time (e.g., 04:38 AM) instead of user's local device time (e.g., 10:11 PM IST)
- **Root Cause:** Python datetime serialization missing `Z` suffix, causing JavaScript to interpret UTC timestamps as local time
- **Fix:** Added `@field_serializer` decorators to Pydantic models to append `Z` suffix for proper UTC serialization
- **Files Modified:**
  - `backend/app/models/__init__.py` - Added serializers to `ConversationResponse`, `MessageResponse`, `DocumentResponse`

#### ✨ New Features

**3. ChatGPT-Style Thinking Indicator**
- **Feature:** Modern loading animation while AI generates response
- **Phases:** 🧠 Thinking... → 🔍 Analyzing your query... → ✨ Generating response...
- **Includes:** Animated progress bar
- **Files Modified:**
  - `frontend/src/components/Chat/TypingIndicator.jsx` - Complete rewrite with phase animations
  - `frontend/tailwind.config.js` - Added `thinking-bar` animation keyframes

**4. Smart Severity Detection System**
- **Feature:** Dynamically adjusts closing messages based on query severity
- **Severity Levels:**
  | Level | Triggers | Closing Message |
  |-------|----------|-----------------|
  | **Critical** 🚨 | suicide, self-harm, heart attack, chest pain, can't breathe | Emergency helplines + crisis resources |
  | **Serious** ⚕️ | depression, anxiety, symptoms, medication, diagnosis | "Please consult a healthcare professional..." |
  | **Moderate** 💡 | what is, explain, diet, exercise, vitamins | "For personalized advice, consider consulting..." |
  | **General** 💙 | hello, thanks, bye | "Feel free to ask..." |
- **Files Modified:**
  - `backend/app/services/chat_service.py` - Added `SEVERITY_PATTERNS`, `CLOSING_MESSAGES`, `detect_query_severity()`

**5. Response Formatting Improvements**
- **Feature:** Clean, structured output like modern chatbots
- **Changes:**
  - Removed all `AI:` prefixes from LLM responses
  - Split long responses into readable paragraphs
  - Numbered points get visual left-border accent
  - **Bold text** markdown support
  - Proper closing section with separator line
- **Files Modified:**
  - `backend/app/services/chat_service.py` - Enhanced `clean_llm_response()` with:
    - AI: prefix removal regex
    - Paragraph structuring logic
    - Severity-based closing selection
  - `frontend/src/components/Chat/MessageItem.jsx` - Added:
    - `formatContent()` - Splits content into styled paragraphs
    - `renderWithBold()` - Renders **bold** markdown
    - Visual separator for closing section

#### 🎨 UI/UX Improvements

**6. Tailwind Theme Enhancements**
- Added new color tokens:
  - `arc-accent` - Accent color for highlights
  - `arc-surface-secondary` - Secondary surface color
- **File:** `frontend/tailwind.config.js`

#### 📁 Files Modified Summary

| File | Changes |
|------|---------|
| `backend/.env` | Uncommented all configuration variables |
| `backend/app/models/__init__.py` | Added datetime serializers with UTC `Z` suffix |
| `backend/app/services/chat_service.py` | Severity detection, AI: removal, structured formatting |
| `frontend/src/components/Chat/TypingIndicator.jsx` | ChatGPT-style thinking animation |
| `frontend/src/components/Chat/MessageItem.jsx` | Paragraph formatting, bold support |
| `frontend/tailwind.config.js` | New animations and color tokens |

#### 🧪 Testing the Changes

**Test Severity Detection:**
```
Critical: "I'm having thoughts of suicide" → Shows emergency helplines
Serious:  "What are symptoms of depression?" → Shows "consult healthcare professional"
Moderate: "What is vitamin D good for?" → Shows "for personalized advice"
General:  "Hello!" → Shows "feel free to ask"
```

**Test Timestamp:**
- Send a message and verify timestamp matches your device's local time
- Check Network tab: `created_at` should end with `Z` (e.g., `2026-03-09T10:51:00Z`)

**Test Thinking Indicator:**
- Send any message
- Should see animated "🧠 Thinking..." with progress bar
- Phases cycle: Thinking → Analyzing → Generating

---

## KNOWN ISSUES

1. **Pylance Import Warnings** - VS Code may show import errors for packages. These are IDE warnings, not runtime errors. Select correct Python interpreter (`backend/venv/Scripts/python.exe`).

2. **Browser Console Warnings** - `scrollbar-width` and `scrollbar-color` CSS properties not supported in older browsers. Non-breaking.

---

## CONTRIBUTING

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ for Medical AI Assistance**


## TIMING EXPECTATIONS

| Operation | Expected Time |
|-----------|---------------|
| Embedding generation | 30-50ms |
| Pinecone query | 100-200ms |
| Buffer load (MongoDB) | 10-20ms |
| LLM generation | 2-5 seconds |
| Total response | 3-6 seconds |
| PDF processing (10 pages) | 5-15 seconds |

---

## KEY DESIGN DECISIONS

1. **Dual Retrieval**: Queries both document chunks AND past chat messages for richer context
2. **Buffer Memory**: Last 10 messages always in context for conversation continuity
3. **Conversation Isolation**: Documents and chat history are filtered by conversation_id
4. **Async Everything**: FastAPI + Motor for non-blocking operations
5. **Singleton Patterns**: Embedding model loaded once, reused for all requests
6. **Batch Processing**: Embeddings generated in batches of 32 for speed
7. **Local LLM**: Ollama eliminates network latency, ensures privacy

---

## TROUBLESHOOTING GUIDE

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'rag'` | `cd rag && pip install -e .` |
| Pinecone initialization failed | Verify API key, index name (`medical-rag`), dimension (`384`) |
| MongoDB connection refused | Start MongoDB: `mongod` |
| Ollama 500 error | Verify model: `ollama list`, test: `ollama run tinyllama "test"` |
| CORS errors | Check `CORS_ORIGINS` in `.env` includes frontend URL |
| Pylance import errors | Select correct interpreter: `backend/venv/Scripts/python.exe` |

### Booking-Specific Issues

| Issue | Solution |
|-------|----------|
| No providers found | Run seed script: `python -m scripts.seed_providers` |
| Booking intent not detected | Verify Ollama is running and responding |
| Session ID errors | Clear localStorage and refresh browser |
| Slots not loading | Check provider exists in MongoDB |
| Confirmation code missing | Check `appointment_service.py` logs |
| Appointments collection error | Run: `python -m scripts.setup_appointments_collection` |

### Testing Booking Flow
```bash
# 1. Ensure MongoDB is running
mongod

# 2. Setup collections
cd backend
python -m scripts.setup_appointments_collection

# 3. Seed test providers
python -m scripts.seed_providers

# 4. Run tests
pytest tests/test_booking_flow.py -v

# 5. Manual test
# Start app and type: "I need to see a cardiologist"
```

### Verifying Ollama Setup
```cmd
ollama list                      # Show installed models
ollama run tinyllama "Hello"     # Test generation
ollama ps                        # Show running models
```

---

## CHANGELOG

### v2.3.0 (UI Scrolling & Booking Flow Fixes)
- **FIX: Landing page now scrollable** - Removed `overflow: hidden` from global CSS that blocked all scrolling
- **FIX: Booking modal now appears correctly** - Fixed metadata flow from backend to frontend for booking intent detection
- **NEW: Enhanced scrollbar styling** - Always-visible blue gradient scrollbar on all scrollable areas
- **IMPROVED: Appointments section moved to top** - Now appears right after Hero section on landing page
- **IMPROVED: Chat container scrolling** - Messages area now has persistent scrollbar with `scrollbarGutter: stable`
- **CLEANED: Removed debug logging** - Production-ready code without console spam

**Files Modified:**

1. **`frontend/src/styles/globals.css`**:
   - Changed `html, body, #root { overflow: hidden }` → `overflow-y: auto` for scrolling
   - Enhanced scrollbar styling with blue gradient (`linear-gradient(180deg, #3B82F6, #2563eb)`)
   - Added Firefox scrollbar support (`scrollbar-width: auto; scrollbar-color`)

2. **`frontend/src/pages/landing/LandingPage.jsx`**:
   - Removed `overflow-x-hidden` from root container
   - Moved `<MyAppointmentsSection />` to appear right after `<HeroSection />`

3. **`frontend/src/components/Layout/MainLayout.jsx`**:
   - Changed to `fixed inset-0` layout with proper flex structure
   - Header now `flex-shrink-0` to prevent collapse

4. **`frontend/src/components/Chat/ChatContainer.jsx`**:
   - Messages area now uses `overflow-y-scroll` with `scrollbarGutter: stable`
   - Removed debug panel from UI

5. **`frontend/src/components/Sidebar/Sidebar.jsx`**:
   - Conversations list now uses `overflow-y-scroll` for always-visible scrollbar

6. **`frontend/src/hooks/useChat.js`**:
   - Booking intent detection working: checks `response.metadata?.intent === 'booking'`
   - Calls `startBooking(extracted_slots)` on intent match

7. **`frontend/src/store/appointmentStore.js`**:
   - `startBooking()` sets `bookingInProgress: true, bookingStep: 'location'`

8. **`frontend/src/features/landing/appointments/MyAppointmentsSection.jsx`**:
   - Fixed filter to show future confirmed appointments only
   - Removed debug useEffect logging

**Scrolling Architecture:**
```css
/* Global scrolling now enabled */
html, body { overflow-x: hidden; overflow-y: auto; }
#root { min-height: 100%; }

/* Scrollbar always visible */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3B82F6, #2563eb); }
```

---

### v2.2.0 (Appointment Persistence & Landing Page Integration)
- **NEW: Appointments persist after page refresh** - Uses Zustand persist middleware with localStorage
- **NEW: Complete appointment details returned from API** - Backend now returns full provider snapshot, patient info, and appointment details
- **NEW: Enhanced landing page appointments section** - Displays upcoming appointments with reminders
- **IMPROVED: Calendar export (.ics)** - Download appointments directly to calendar apps
- **IMPROVED: 24-hour reminder banner** - Visual alert for appointments within 24 hours
- **IMPROVED: Cancel appointments** - Direct cancellation from landing page with store sync
- **FIX: API response structure standardized** - Consistent `provider`, `appointment_details`, and `patient_info` objects

**Backend Files Modified:**
- `app/services/appointment_service.py`:
  - `book_appointment()` now returns complete provider details (name, specialty, location, rating, phone, photo_url)
  - `get_appointments()` returns full appointment structure matching frontend expectations
  - Appointment document now stores `slot_id`, `provider_rating`, `provider_phone` for full persistence

**Frontend Files Modified:**
- `store/appointmentStore.js`:
  - Changed localStorage key to `medical-appointments-storage`
  - Added `loading` state for UI feedback
  - Clean separation of persisted (appointments) vs transient (booking flow) state
  
- `hooks/useBooking.js`:
  - Wrapped all functions with `useCallback` for memoization
  - `bookAppointment()` now adds directly to persisted store via `addAppointment()`
  - `cancelAppointment()` removes from persisted store via `removeAppointment()`
  - Removed redundant `loadAppointments()` call after booking (already added to store)
  
- `services/appointmentService.js`:
  - Standardized API signatures to accept single params object
  - `searchProviders(params)` - accepts `{conversation_id, specialty, city, latitude, longitude}`
  - `bookAppointment(bookingData)` - accepts `{conversation_id, provider_id, slot_id, slot_datetime, patient_info}`
  - `cancelAppointment(appointmentId, cancelData)` - accepts `{confirmation_code, reason}`
  
- `components/Chat/ChatContainer.jsx`:
  - Updated `handlePatientInfoSubmit()` to use markdown formatting in confirmation message
  - Reads appointment data from response (not local state) for accurate display
  - Syncs with backend after booking via `loadAppointments()`

**Persistence Architecture:**
```javascript
// localStorage structure
{
  "state": {
    "appointments": [
      {
        "appointment_id": "apt_abc123",
        "confirmation_code": "CARD-1234",
        "status": "confirmed",
        "datetime": "2026-03-15T10:00:00Z",
        "provider": {
          "provider_id": "dummy_card001",
          "name": "Dr. John Smith",
          "specialty": "Cardiology",
          "location": "Boston Medical Center",
          "rating": 4.8
        },
        "patient_info": {...}
      }
    ]
  },
  "version": 0
}
```

**Testing Verification:**
```javascript
// Check persistence in browser console
console.log(JSON.parse(localStorage.getItem('medical-appointments-storage')));
```

### v2.1.0 (Booking Flow Fixes)
- **FIX: Replaced LLM-based intent detection with keyword regex patterns** - Much faster and more reliable
- **FIX: Removed prompt leaking** - Added clean_llm_response() to strip system prompt artifacts
- **FIX: Timestamps now timezone-aware** - Changed from datetime.utcnow() to datetime.now(timezone.utc)
- **IMPROVED: Provider list expanded** - Now includes 12 providers across 10 specialties
- **IMPROVED: UI handling** - Better loading and empty state for provider list
- **IMPROVED: API metadata** - ChatResponse now includes booking metadata field

**Backend Files Modified:**
- `app/services/chat_service.py` - Keyword-based booking detection, response cleanup
- `app/services/mongodb_service.py` - Timezone-aware timestamps
- `app/models/__init__.py` - Added ChatResponseMetadata model
- `app/api/chat.py` - Returns metadata in response
- `scripts/seed_providers.py` - Expanded to 12 providers

**Frontend Files Modified:**
- `components/Chat/ChatContainer.jsx` - Better loading/empty state for providers

### v2.0.0 (AI Appointment Booking Agent)
- **NEW: AI Appointment Booking Agent** - Natural language appointment scheduling
- Provider search by specialty and location
- Real-time availability slot selection
- Anonymous session-based booking (no login required)
- Calendar export (.ics) for appointments
- Unique confirmation codes (XXXX-1234 format)
- Supports dummy mode (local DB) and real-time mode (external APIs)

**Backend Files Added:**
- `app/services/appointment_service.py` - Booking business logic
- `app/api/appointments.py` - REST API endpoints
- `app/prompts/booking_intent_prompts.py` - Intent detection prompts
- `scripts/seed_providers.py` - Dummy data seeding
- `scripts/setup_appointments_collection.py` - MongoDB setup
- `tests/test_booking_flow.py` - Integration tests

**Frontend Files Added:**
- `store/appointmentStore.js` - Zustand booking state
- `services/appointmentService.js` - API client
- `hooks/useBooking.js` - Booking workflow hook
- `components/Booking/*` - 5 booking UI components
- `features/landing/appointments/MyAppointmentsSection.jsx` - Appointments list

**Files Modified:**
- `app/config.py` - Added booking configuration
- `app/main.py` - Added appointments router
- `app/services/chat_service.py` - Added intent detection
- `services/api.js` - Added session ID interceptor
- `hooks/useChat.js` - Added booking trigger
- `components/Chat/ChatContainer.jsx` - Integrated booking UI
- `pages/landing/LandingPage.jsx` - Added appointments section

**Documentation Added:**
- `BOOKING_SETUP.md` - Comprehensive booking setup guide
- `START_BOOKING.bat` - Windows startup script
- Updated `README.md` with full booking documentation

### v1.0.0 (Initial Release)
- Full-stack RAG chatbot implementation
- PDF document upload and processing
- Conversational buffer memory (10 messages)
- Dual retrieval system (documents + chat history)
- Real-time analytics dashboard
- Modern React UI with ARC AGI theme

### Files Added
- `PPT_CONTENT.md` - Presentation content for project demonstration
- `QUICK_START.md` - Step-by-step Windows setup guide
- `pyrightconfig.json` - Python IDE configuration

---

*This documentation was generated to provide complete context for AI/LLM systems working with this codebase.*
