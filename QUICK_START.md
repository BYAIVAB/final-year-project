# Medical RAG Chatbot - Complete Quick Start Guide
## Ready-to-Run in 30 Minutes

---

## 📦 What's Included

### ✅ Complete Backend (FastAPI)
- Fast RAG pipeline (3-4s responses)
- MongoDB integration
- Pinecone vector database
- Async operations throughout
- **20+ Python files**

### ✅ Complete RAG Module
- PyMuPDF (3x faster PDF processing)
- Batch embeddings
- Conversational buffer memory
- Your existing code enhanced
- **15+ Python files**

### ✅ Working Frontend (React)
- ARC AGI dark theme
- Complete chat UI
- Upload modal
- Sound effects ready
- **20+ React files**

---

## 🚀 Complete Setup Commands

### Step 1: Extract and Navigate
```bash
# Extract the archive
tar -xzf medical-rag-chatbot-complete.tar.gz
cd medical-rag-chatbot
```

### Step 2: Install Prerequisites

#### A. MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod

# Verify
mongosh  # Should connect successfully
```

#### B. Ollama + LLM
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull llama2 model (recommended for speed)
ollama pull llama2

# Verify
ollama list
curl http://localhost:11434/api/tags
```

#### C. Pinecone Setup
1. Go to https://www.pinecone.io/
2. Sign up (free tier available)
3. Create index:
   - Name: `medical-rag`
   - Dimension: `384`
   - Metric: `cosine`
   - Cloud: AWS
   - Region: `us-east-1`
4. Copy API key

#### D. OCR Dependencies
```bash
# macOS
brew install tesseract poppler

# Ubuntu
sudo apt install -y tesseract-ocr poppler-utils
```

### Step 3: Backend Setup (5 minutes)
```bash
cd backend

# Create virtual environment with Python 3.11
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install all backend dependencies
pip install -r requirements.txt

# Install RAG module in editable mode
cd ../rag
pip install -e .
cd ../backend

# Verify installations
python -c "import fastapi; print('✅ FastAPI')"
python -c "import langchain; print('✅ LangChain:', langchain.__version__)"
python -c "import sentence_transformers; print('✅ Embeddings')"
python -c "import pinecone; print('✅ Pinecone')"
python -c "import fitz; print('✅ PyMuPDF')"
```

### Step 4: Configure Backend (2 minutes)
```bash
cd backend

# Copy example env
cp .env.example .env

# Edit .env - ADD YOUR PINECONE API KEY!
nano .env  # or use your preferred editor
```

**Critical Settings in .env:**
```bash
# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=medical_rag

# Pinecone - REPLACE WITH YOUR ACTUAL API KEY
PINECONE_API_KEY=pcsk_XXXXXXXXXXXXXXXXXXXXXXXX
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=medical-rag

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# App
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50
BUFFER_SIZE=10
CORS_ORIGINS=["http://localhost:5173"]
```

**Create uploads directory:**
```bash
mkdir -p uploads
```

### Step 5: Start Backend (1 minute)
```bash
cd backend
source venv/bin/activate
python -m app.main
```

**Expected Output:**
```
🚀 Starting Medical RAG Chatbot
MongoDB: mongodb://localhost:27017
Ollama: http://localhost:11434
INFO:     Loading embedding model: sentence-transformers/all-MiniLM-L6-v2
INFO:     Model loaded on cpu
✅ MongoDB connected
✅ Embeddings: True
✅ LLM: True
INFO:     Pinecone initialized
✅ Pinecone connected
🎉 Application ready!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test Backend:**
```bash
# In a new terminal
curl http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "services": {
    "mongodb": true,
    "pinecone": true,
    "embeddings": true,
    "llm": true
  }
}
```

### Step 6: Frontend Setup (3 minutes)
```bash
# In a new terminal
cd frontend

# Install Node dependencies
npm install

# Copy example env
cp .env.example .env

# .env should contain:
# VITE_API_URL=http://localhost:8000
# VITE_ENABLE_SOUNDS=true
```

### Step 7: Start Frontend (1 minute)
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 8: Open Application
```
http://localhost:5173
```

---

## ✅ Verification Checklist

After starting both servers, verify:

1. **Backend Health** - http://localhost:8000/api/health
   - Status: "healthy"
   - All services: true

2. **Frontend Loads** - http://localhost:5173
   - Dark blue ARC theme visible
   - Grid background present
   - Sidebar on left

3. **Create Conversation**
   - Click "+ New Chat" button
   - Should create successfully

4. **Send Message**
   - Type: "Hello, what can you help with?"
   - Press Enter
   - Should get response in 3-4 seconds

5. **Upload PDF** (Optional)
   - Click "📎 Upload PDF" button
   - Select a PDF file
   - Should process and show success

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'rag'"
```bash
cd rag
pip install -e .
```

### Issue: "Pinecone initialization failed"
- Check API key in `backend/.env`
- Verify index name is `medical-rag`
- Verify dimension is `384`
- Check https://app.pinecone.io/ dashboard

### Issue: "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongosh

# If fails, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Issue: "Ollama not responding"
```bash
# Check if Ollama is running
ollama list

# If empty or fails
ollama serve  # Start Ollama
ollama pull llama2  # Pull model again
```

### Issue: "Slow responses (>10 seconds)"
**Quick fixes:**

1. Check Ollama model:
   ```bash
   ollama list  # Should show llama2, not llama2:70b
   ```

2. Reduce buffer size in `backend/.env`:
   ```bash
   BUFFER_SIZE=5  # Instead of 10
   ```

3. Reduce retrieval in `rag/config.py`:
   ```python
   TOP_K_DOCS = 2  # Instead of 3
   TOP_K_CHAT = 1  # Instead of 2
   ```

### Issue: "Frontend can't connect to backend"
- Check backend is running on port 8000
- Check CORS_ORIGINS in `backend/.env` includes `http://localhost:5173`
- Check `VITE_API_URL` in `frontend/.env` is `http://localhost:8000`

---

## 📊 Expected Performance

| Operation | Time |
|-----------|------|
| PDF Upload (50 pages) | ~15 seconds |
| Embedding (100 chunks) | ~3 seconds |
| Vector Search | ~80ms |
| LLM Generation | ~2 seconds |
| **Total Chat Response** | **3-4 seconds** |

---

## 🎯 Features Included

### Backend
✅ Fast RAG pipeline with tracing
✅ Conversational buffer memory (last 10 messages)
✅ Dual retrieval (documents + chat history)
✅ MongoDB async operations
✅ Pinecone batch operations
✅ PyMuPDF (3x faster than pypdf2)
✅ Health checks
✅ Error handling

### Frontend
✅ ARC AGI dark theme
✅ Grid background effect
✅ Chat interface
✅ Conversation management
✅ PDF upload modal
✅ Source citations
✅ Typing indicator
✅ Sound effects (basic)
✅ Responsive design

---

## 📁 Project Structure

```
medical-rag-chatbot/
├── backend/              ✅ 20+ files
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/          (4 route files)
│   │   ├── models/       (Pydantic schemas)
│   │   └── services/     (3 service files)
│   ├── requirements.txt
│   └── .env.example
│
├── rag/                  ✅ 15+ files
│   ├── src/              (4 core files)
│   ├── vectorstore/      (Pinecone)
│   ├── retrieval/        (Dual retriever)
│   ├── config.py
│   ├── setup.py
│   └── requirements.txt
│
├── frontend/             ✅ 20+ files
│   ├── src/
│   │   ├── components/   (15+ components)
│   │   ├── hooks/        (5 hooks)
│   │   ├── services/     (4 API services)
│   │   ├── store/        (Zustand)
│   │   └── styles/       (CSS)
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🎉 You're Ready!

Your complete Medical RAG Chatbot is now running with:
- Fast backend (3-4s responses)
- Professional UI (ARC AGI theme)
- Conversational memory
- Document upload
- Source citations

**Need help?**
- Check logs in terminal
- Visit http://localhost:8000/docs for API documentation
- Review code comments for implementation details

---

## 📚 Next Steps

### To Enhance:
1. Add more sound effects (replace synthesized sounds with real audio files)
2. Add streaming responses for real-time output
3. Add document management UI
4. Add user settings panel
5. Deploy to production

### To Learn More:
- Backend code: `backend/app/`
- RAG logic: `rag/src/`
- Frontend UI: `frontend/src/components/`

---

**Enjoy your Medical RAG Chatbot! 🚀**
