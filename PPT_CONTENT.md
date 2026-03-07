# Medical RAG Chatbot - Project Presentation

---

## SLIDE 1: Project Overview

### Title: AI-Powered Medical RAG Chatbot

**Tagline:** Intelligent Medical Information Retrieval using RAG Architecture

| Aspect | Details |
|--------|---------|
| **Project Type** | Full-Stack RAG-Powered Medical Chatbot |
| **Domain** | Healthcare / Medical Information |
| **Architecture** | React Frontend + FastAPI Backend + RAG Engine |
| **AI Model** | Local LLM (Ollama - TinyLlama/Llama2) |

### Key Highlights
- Upload medical PDFs and ask questions
- AI retrieves relevant information from documents
- Maintains conversation memory for context
- Shows source citations for transparency
- Real-time analytics dashboard

---

## SLIDE 2: Technology Stack

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                          │
│         React 18 + Vite + TailwindCSS + Zustand             │
│              http://localhost:5173                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (Axios)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                           │
│              FastAPI + Python 3.11 + Async                  │
│              http://localhost:8000                           │
└───────┬─────────────────┬─────────────────┬─────────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   MongoDB     │ │   Pinecone    │ │    Ollama     │
│  (Metadata)   │ │ (Vector DB)   │ │    (LLM)      │
│  Port: 27017  │ │   Cloud API   │ │  Port: 11434  │
└───────────────┘ └───────────────┘ └───────────────┘
```

### Tech Stack Details

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite, TailwindCSS | Modern responsive UI |
| **State** | Zustand | Global state management |
| **Backend** | FastAPI (Python) | Async REST API server |
| **Database** | MongoDB (Motor) | Conversations, messages, documents |
| **Vector DB** | Pinecone | Semantic search on embeddings |
| **Embeddings** | sentence-transformers/all-MiniLM-L6-v2 | 384-dim text embeddings |
| **LLM** | Ollama (TinyLlama) | Local AI response generation |
| **PDF Processing** | PyMuPDF (fitz) | Fast PDF text extraction |

---

## SLIDE 3: System Workflow

### User Interaction Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│ Frontend │────▶│ Backend  │────▶│   RAG    │
│  Query   │     │  React   │     │ FastAPI  │     │  Engine  │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
      ┌─────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE STEPS                        │
│                                                              │
│  1. Load Conversation Buffer (Last 10 messages)              │
│                      ↓                                       │
│  2. Generate Query Embedding (384 dimensions)                │
│                      ↓                                       │
│  3. Semantic Search in Pinecone                              │
│     • Search Documents (Top 3)                               │
│     • Search Chat History (Top 2)                            │
│                      ↓                                       │
│  4. Build Context Prompt                                     │
│     • System Instructions                                    │
│     • Retrieved Documents                                    │
│     • Conversation History                                   │
│     • User Query                                             │
│                      ↓                                       │
│  5. Generate Response via Ollama LLM                         │
│                      ↓                                       │
│  6. Return Response with Source Citations                    │
└──────────────────────────────────────────────────────────────┘
```

---

## SLIDE 4: Data Pipeline

### Document Processing Pipeline

```
┌─────────────┐
│ PDF Upload  │
│  (User)     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                 DOCUMENT PROCESSING                          │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   PyMuPDF   │───▶│  LangChain  │───▶│ Sentence    │      │
│  │   Extract   │    │   Chunker   │    │ Transformer │      │
│  │   Text      │    │  500 chars  │    │ Embeddings  │      │
│  └─────────────┘    └─────────────┘    └──────┬──────┘      │
│                                               │              │
└───────────────────────────────────────────────┼──────────────┘
                                                │
       ┌────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA STORAGE                             │
│                                                              │
│   ┌─────────────────┐         ┌─────────────────┐           │
│   │    MongoDB      │         │    Pinecone     │           │
│   │                 │         │                 │           │
│   │ • Document ID   │         │ • Vector ID     │           │
│   │ • Filename      │         │ • 384-dim       │           │
│   │ • Status        │         │   Embedding     │           │
│   │ • Page Count    │         │ • Metadata      │           │
│   │ • Chunk Count   │         │   (page, text)  │           │
│   └─────────────────┘         └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

| Collection | Fields | Purpose |
|------------|--------|---------|
| **conversations** | id, title, created_at, last_active | Chat sessions |
| **messages** | id, conversation_id, role, content, metadata | Chat messages |
| **documents** | id, conversation_id, filename, status, chunks | Uploaded PDFs |

### Pinecone Namespaces

| Namespace | Vector Format | Use Case |
|-----------|---------------|----------|
| `documents` | doc_{id}_chunk_{n} | PDF chunk retrieval |
| `chat_history` | msg_{conv_id}_{msg_id} | Past conversation retrieval |

---

## SLIDE 5: Core Features & Business Logic

### Feature Matrix

| Feature | Description | Business Value |
|---------|-------------|----------------|
| **PDF Upload** | Upload medical documents | Knowledge base creation |
| **Semantic Search** | Find relevant info by meaning | Accurate retrieval |
| **Conversation Memory** | Remember last 10 messages | Context-aware responses |
| **Dual Retrieval** | Search docs + chat history | Comprehensive answers |
| **Source Citations** | Show where info came from | Trust & transparency |
| **Analytics Dashboard** | Track usage metrics | Insights & monitoring |

### Business Logic Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                            │
│                                                              │
│   USER JOURNEY:                                              │
│   ─────────────                                              │
│                                                              │
│   1. User uploads medical PDF                                │
│      └─▶ System extracts, chunks, embeds, stores            │
│                                                              │
│   2. User asks medical question                              │
│      └─▶ System retrieves relevant chunks                   │
│      └─▶ System retrieves relevant past chats               │
│      └─▶ LLM generates contextual answer                    │
│      └─▶ Response includes source citations                 │
│                                                              │
│   3. User continues conversation                             │
│      └─▶ System maintains context (buffer memory)           │
│      └─▶ Each response builds on previous context           │
│                                                              │
│   4. Admin views dashboard                                   │
│      └─▶ See query patterns, popular topics                 │
│      └─▶ Monitor response times, usage stats                │
└─────────────────────────────────────────────────────────────┘
```

---

## SLIDE 6: API Endpoints & Architecture

### REST API Structure

```
                    ┌─────────────────┐
                    │   /api/health   │───▶ Health Check
                    └─────────────────┘
                    
┌───────────────────────────────────────────────────────────┐
│                       /api/chat                           │
│                                                           │
│   POST /api/chat                                          │
│   ├── Input: { conversation_id, message }                 │
│   └── Output: { response, sources, timing }               │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                   /api/conversations                      │
│                                                           │
│   GET    /api/conversations          - List all          │
│   POST   /api/conversations          - Create new        │
│   GET    /api/conversations/{id}     - Get one           │
│   DELETE /api/conversations/{id}     - Delete            │
│   GET    /api/conversations/{id}/messages - Get messages │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    /api/documents                         │
│                                                           │
│   POST /api/documents/upload - Upload PDF                 │
│   GET  /api/documents/{id}   - Get status                │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                     /api/metrics                          │
│                                                           │
│   GET /api/metrics/dashboard - Analytics data            │
└───────────────────────────────────────────────────────────┘
```

---

## SLIDE 7: Future Enhancements & Roadmap

### Current Limitations

| Limitation | Impact |
|------------|--------|
| Local LLM only | Limited to device capabilities |
| No user authentication | Single user system |
| No streaming responses | Wait for complete response |
| Basic analytics | Limited insights |

### Future Enhancement Roadmap

```
┌─────────────────────────────────────────────────────────────┐
│                   ENHANCEMENT ROADMAP                        │
│                                                              │
│   PHASE 1 (Short-term):                                     │
│   ├── ✦ Streaming responses (real-time output)              │
│   ├── ✦ Multi-user authentication                           │
│   ├── ✦ Document management UI                               │
│   └── ✦ Export chat history                                  │
│                                                              │
│   PHASE 2 (Medium-term):                                    │
│   ├── ✦ Cloud LLM integration (GPT-4, Claude)               │
│   ├── ✦ Multi-language support                               │
│   ├── ✦ Voice input/output                                   │
│   └── ✦ Mobile responsive PWA                                │
│                                                              │
│   PHASE 3 (Long-term):                                      │
│   ├── ✦ Medical knowledge graph integration                  │
│   ├── ✦ HIPAA compliance features                            │
│   ├── ✦ Integration with EHR systems                         │
│   └── ✦ AI-powered medical report generation                 │
└─────────────────────────────────────────────────────────────┘
```

### Scalability Considerations

| Aspect | Current | Future |
|--------|---------|--------|
| **LLM** | Local Ollama | Cloud APIs (OpenAI, Anthropic) |
| **Vector DB** | Pinecone Free | Pinecone Enterprise / Weaviate |
| **Database** | Local MongoDB | MongoDB Atlas (Cloud) |
| **Hosting** | Local | AWS/GCP/Azure Kubernetes |
| **Users** | Single | Multi-tenant with auth |

---

## SLIDE 8: Performance Metrics

### Response Time Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│              TYPICAL RESPONSE TIME: 3-6 seconds             │
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │ Buffer Load (MongoDB)          │░░░░│ ~20ms        │    │
│   ├────────────────────────────────────────────────────┤    │
│   │ Embedding Generation           │░░░░░│ ~50ms       │    │
│   ├────────────────────────────────────────────────────┤    │
│   │ Pinecone Vector Search         │░░░░░░│ ~150ms     │    │
│   ├────────────────────────────────────────────────────┤    │
│   │ LLM Generation (Ollama)        │░░░░░░░░░░░░░░░░░░░│    │
│   │                                │ ~2-5 seconds      │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
│   PDF Processing: ~1-2 seconds per page                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Metrics

| Metric | Value |
|--------|-------|
| Chat Response Time | 3-6 seconds |
| PDF Processing | ~1-2s per page |
| Embedding Dimension | 384 |
| Context Window | Last 10 messages |
| Retrieval Top-K | 3 docs + 2 chat |
| Chunk Size | 500 characters |

---

## Quick Reference

### Project URLs
- **GitHub:** https://github.com/BYAIVAB/final-year-project
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Commands Summary
```cmd
# Backend
cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000

# Frontend  
cd frontend && npm run dev

# Services
mongod          # MongoDB
ollama serve    # LLM
```

---

## Summary

**Medical RAG Chatbot** is a full-stack AI-powered application that:

1. **Processes** medical PDF documents using advanced NLP
2. **Stores** semantic embeddings for intelligent retrieval
3. **Retrieves** relevant information using vector similarity
4. **Generates** contextual responses with local LLM
5. **Maintains** conversation memory for coherent dialogue
6. **Cites** sources for transparency and trust

### Tech Innovation
- RAG (Retrieval-Augmented Generation) architecture
- Dual retrieval (documents + chat history)
- Local LLM for privacy
- Async operations for performance

---

*Created for Final Year Project Presentation*
