# Medical RAG Chatbot - Complete Project Documentation

> **LLM CONTEXT DOCUMENT**: This README is specifically designed to provide AI/LLM systems complete understanding of the entire codebase, architecture, and operational flows. Every file, folder, function, and data flow is documented comprehensively.

---

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Complete Folder Structure](#complete-folder-structure)
4. [Backend Documentation](#backend-documentation)
5. [RAG Engine Documentation](#rag-engine-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [API Reference](#api-reference)
8. [Data Flow Diagrams](#data-flow-diagrams)
9. [Database Schemas](#database-schemas)
10. [Configuration Reference](#configuration-reference)
11. [Dependencies](#dependencies)
12. [Setup & Usage](#setup--usage)

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
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP/REST (axios)
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
│  └────────────────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │                       SERVICES (app/services/)                          │     │
│  │  ChatService        - Orchestrates RAG pipeline                         │     │
│  │  DocumentService    - Handles PDF processing pipeline                   │     │
│  │  MongoDBService     - Async MongoDB operations (Motor driver)           │     │
│  │  MetricsService     - Tracks usage analytics                            │     │
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
│   │   │   └── metrics.py                 # GET /api/metrics/dashboard
│   │   │
│   │   ├── models/                        # ─── Pydantic Models ───
│   │   │   └── __init__.py                # Request/Response schemas
│   │   │
│   │   ├── services/                      # ─── Business Logic Services ───
│   │   │   ├── __init__.py
│   │   │   ├── chat_service.py            # RAG pipeline orchestration
│   │   │   ├── document_service.py        # PDF processing pipeline
│   │   │   ├── mongodb_service.py         # Async MongoDB operations
│   │   │   └── metrics_service.py         # Analytics tracking
│   │   │
│   │   └── utils/
│   │       └── __init__.py
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
        │   │   ├── ChatContainer.jsx      # Main chat UI with input + messages
        │   │   ├── MessageInput.jsx       # Text input with send button
        │   │   ├── MessageItem.jsx        # Single message bubble
        │   │   ├── MessageList.jsx        # Scrollable message list
        │   │   └── TypingIndicator.jsx    # "..." animation while AI responds
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
        │   │   └── CursorGlow.jsx
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
        │   ├── useChat.js                 # Chat logic (sendMessage, loadMessages)
        │   ├── useConversations.js        # Conversation CRUD logic
        │   ├── useDocuments.js            # Document upload logic
        │   ├── useDashboardData.js        # Dashboard data fetching
        │   ├── useAutoScroll.js           # Auto-scroll to bottom
        │   └── useSound.js                # Sound effects
        │
        ├── services/                      # ─── API Service Layer ───
        │   ├── api.js                     # Axios instance with interceptors
        │   ├── chatService.js             # Chat API calls
        │   ├── conversationService.js     # Conversation API calls
        │   └── documentService.js         # Document upload API calls
        │
        ├── store/                         # ─── State Management ───
        │   └── chatStore.js               # Zustand store (conversations, messages)
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
**Purpose**: Orchestrates the complete RAG pipeline

```python
class ChatService:
    async def process_message(conversation_id: str, message: str) -> Dict:
        """
        Complete RAG Pipeline:
        
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
            timing: Dict[str, float]
        }
        """
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
**Purpose**: Chat business logic hook

```javascript
const useChat = (conversationId) => {
  // Uses: useChatStore, chatService
  
  const loadMessages = async () => {
    // GET /api/conversations/{id}/messages
    // Updates store.messages
  }
  
  const sendMessage = async (message) => {
    // 1. Add user message to UI immediately
    // 2. Set typing indicator
    // 3. POST /api/chat
    // 4. Add assistant response to UI
    // 5. Clear typing indicator
  }
  
  return { messages, isLoading, isTyping, sendMessage, loadMessages }
}
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

**4. Start Services:**
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

*This documentation was generated to provide complete context for AI/LLM systems working with this codebase.*
