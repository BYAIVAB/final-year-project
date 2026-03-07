# Medical RAG Chatbot - Quick Start Guide (Windows + VS Code)

---

## Prerequisites

Before starting, ensure you have installed:
- **Python 3.11+** - https://www.python.org/downloads/
- **Node.js 18+** - https://nodejs.org/
- **MongoDB Community** - https://www.mongodb.com/try/download/community
- **Ollama** - https://ollama.com/download
- **Git** - https://git-scm.com/downloads

---

## STEP 1: Clone the Repository

Open **VS Code Terminal** (Ctrl + `) and run:

```cmd
git clone https://github.com/BYAIVAB/final-year-project.git
cd final-year-project
```

---

## STEP 2: Setup Pinecone (Vector Database)

1. Go to https://www.pinecone.io/ and sign up (free tier available)
2. Once logged in, go to **API Keys** section
3. Copy your **API Key** (starts with `pcsk_...`)
4. Go to **Indexes** → Click **Create Index**
   - **Name:** `medical-rag`
   - **Dimensions:** `384`
   - **Metric:** `cosine`
   - **Cloud Provider:** AWS
   - **Region:** `us-east-1`
5. Click **Create Index** and wait for it to initialize

---

## STEP 3: Start MongoDB

Open a **new terminal** and run:

```cmd
mongod
```

Keep this terminal running. MongoDB runs on `localhost:27017`.

---

## STEP 4: Start Ollama (LLM)

Open a **new terminal** and run:

```cmd
ollama serve
```

Open **another terminal** and pull the model:

```cmd
ollama pull tinyllama
```

Keep the `ollama serve` terminal running.

---

## STEP 5: Backend Setup

Open **VS Code integrated terminal** in the project root folder.

```cmd
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Install backend dependencies
pip install -r requirements.txt
```

Now install the RAG module:

```cmd
cd ..\rag
pip install -e .
cd ..\backend
```

---

## STEP 6: Create Backend Environment File

Create a file named `.env` in the `backend` folder with this content:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=medical_rag

# Pinecone - REPLACE WITH YOUR API KEY FROM STEP 2
PINECONE_API_KEY=pcsk_YOUR_API_KEY_HERE
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=medical-rag

# Ollama LLM
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=tinyllama

# Settings
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50
BUFFER_SIZE=10
CORS_ORIGINS=["http://localhost:5173"]
```

**Important:** Replace `pcsk_YOUR_API_KEY_HERE` with your actual Pinecone API key!

---

## STEP 7: Start Backend Server

In the backend terminal (with venv activated):

```cmd
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Test it: Open browser → http://localhost:8000/api/health

---

## STEP 8: Frontend Setup

Open a **new terminal** in VS Code:

```cmd
cd frontend

# Install Node.js dependencies
npm install
```

---

## STEP 9: Start Frontend Server

In the frontend terminal:

```cmd
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## STEP 10: Open the Application

Open your browser and go to: **http://localhost:5173**

---

## Summary - Terminals Needed

| Terminal | Command | Purpose |
|----------|---------|---------|
| Terminal 1 | `mongod` | MongoDB Database |
| Terminal 2 | `ollama serve` | LLM Server |
| Terminal 3 | `cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8000` | Backend API |
| Terminal 4 | `cd frontend && npm run dev` | Frontend UI |

---

## Verify Installation

```cmd
# In backend venv
python -c "import fastapi; print('FastAPI OK')"
python -c "import langchain; print('LangChain OK')"
python -c "import sentence_transformers; print('Embeddings OK')"
python -c "import pinecone; print('Pinecone OK')"
python -c "import fitz; print('PyMuPDF OK')"
```

---

## Quick Commands Reference

### Backend (from project root)
```cmd
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (from project root)
```cmd
cd frontend
npm run dev
```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'rag'"
```cmd
cd rag
pip install -e .
cd ..\backend
```

### "Pinecone initialization failed"
- Verify API key in `backend/.env`
- Verify index name is `medical-rag`
- Verify dimension is `384`
- Check https://app.pinecone.io/ dashboard

### "Cannot connect to MongoDB"
Make sure `mongod` is running in a separate terminal.

### "Ollama not responding"
```cmd
ollama serve   # Start Ollama in a terminal
ollama pull tinyllama   # Pull the model
```

### "500 Server Error on /api/generate (Ollama)"
1. Verify Ollama is running: `ollama list`
2. Test model directly: `ollama run tinyllama "Hello"`
3. Check model name in `.env` matches exactly: `OLLAMA_MODEL=tinyllama`
4. Try a different model: `ollama pull llama2` then update `.env`

### "Frontend can't connect to backend"
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in `backend/.env` includes `http://localhost:5173`

### Pylance Import Errors in VS Code
These are IDE warnings, not runtime errors. The code runs correctly.
To fix, select the correct Python interpreter:
1. Press `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose `backend/venv/Scripts/python.exe`

---

## Expected Performance

| Operation | Time |
|-----------|------|
| Chat Response | 3-6 seconds |
| PDF Upload (10 pages) | ~10 seconds |
| Vector Search | ~100ms |

---

## Project Structure

```
final-year-project/
│
├── backend/                    # FastAPI Backend Server
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment config (create this)
│   ├── uploads/                # Temporary PDF storage
│   └── app/
│       ├── main.py             # FastAPI app entry point
│       ├── config.py           # Pydantic settings (loads .env)
│       ├── api/                # API Route Handlers
│       │   ├── chat.py         # POST /api/chat
│       │   ├── conversations.py
│       │   ├── documents.py    # POST /api/documents/upload
│       │   ├── health.py       # GET /api/health
│       │   └── metrics.py
│       ├── services/           # Business Logic
│       │   ├── chat_service.py # RAG pipeline orchestration
│       │   ├── document_service.py
│       │   ├── mongodb_service.py
│       │   └── metrics_service.py
│       └── models/             # Pydantic schemas
│
├── rag/                        # RAG Engine Module (pip install -e .)
│   ├── setup.py                # Package setup
│   ├── requirements.txt
│   └── rag/
│       ├── config.py           # RAGConfig class
│       ├── src/                # Core RAG Logic
│       │   ├── helper.py       # EmbeddingGenerator, OllamaClient
│       │   ├── document_processor.py  # PDF extraction + chunking
│       │   ├── memory.py       # Conversation buffer
│       │   └── prompt.py       # Prompt templates
│       ├── vectorstore/
│       │   └── pinecone_store.py  # Vector DB operations
│       └── retrieval/
│           └── retriever.py    # Dual retriever (docs + chat)
│
├── frontend/                   # React Frontend (Vite + TailwindCSS)
│   ├── package.json            # NPM dependencies
│   ├── vite.config.js          # Vite bundler + proxy config
│   ├── tailwind.config.js      # Theme configuration
│   ├── index.html
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Route definitions
│       ├── components/         # Reusable UI components
│       │   ├── Chat/           # ChatContainer, MessageInput, etc.
│       │   ├── Layout/         # MainLayout, GridBackground
│       │   ├── Sidebar/        # Conversation list
│       │   └── Upload/         # PDF upload modal
│       ├── pages/              # Page components
│       │   ├── landing/        # LandingPage.jsx
│       │   ├── chat/           # ChatPage.jsx
│       │   └── dashboard/      # DashboardPage.jsx
│       ├── hooks/              # Custom React hooks
│       │   ├── useChat.js      # Chat logic
│       │   ├── useConversations.js
│       │   └── useDocuments.js
│       └── services/           # API service functions
│           ├── api.js          # Axios instance
│           └── chatService.js
│
├── README.md                   # Full documentation
├── QUICK_START.md              # This file
├── PPT_CONTENT.md              # Presentation content
├── pyrightconfig.json          # Python IDE config
└── .gitignore                  # Git exclusions
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/health |

---

**Happy Coding!**

