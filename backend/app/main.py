"""
FastAPI Main Application
Optimized for speed with async operations
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .config import settings
from .services.mongodb_service import mongodb_service
from .services.metrics_service import metrics_service
from .api import chat, conversations, documents, health, metrics

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s [%(name)s] %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown.
    """
    # Startup
    logger.info("🚀 Starting Medical RAG Chatbot")
    logger.info(f"MongoDB: {settings.MONGODB_URL}")
    logger.info(f"Ollama: {settings.OLLAMA_URL}")
    
    # Connect to MongoDB
    await mongodb_service.connect()
    logger.info("✅ MongoDB connected")
    
    # Connect metrics service
    await metrics_service.connect()
    logger.info("✅ Metrics service connected")
    
    # Verify RAG services
    from rag.src.helper import check_services
    services = check_services()
    logger.info(f"✅ Embeddings: {services['embeddings']}")
    logger.info(f"✅ LLM: {services['llm']}")
    
    # Verify Pinecone
    from rag.vectorstore.pinecone_store import pinecone_store
    if pinecone_store.health_check():
        logger.info("✅ Pinecone connected")
    else:
        logger.warning("⚠️  Pinecone connection issue")
    
    logger.info("🎉 Application ready!")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down...")
    await mongodb_service.disconnect()
    logger.info("✅ MongoDB disconnected")


# Create FastAPI app
app = FastAPI(
    title="Medical RAG Chatbot API",
    description="Fast RAG chatbot with conversational memory",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware - Must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix=settings.API_PREFIX)
app.include_router(conversations.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(metrics.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Medical RAG Chatbot API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
