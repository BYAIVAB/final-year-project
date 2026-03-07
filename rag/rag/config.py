"""
RAG Configuration
Optimized for speed and Python 3.11 compatibility
"""
import os
from dotenv import load_dotenv

load_dotenv()


class RAGConfig:
    """RAG Engine Configuration"""

    # Embeddings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_BATCH_SIZE = 32
    EMBEDDING_DEVICE = (
        "cuda" if os.getenv("USE_GPU", "false").lower() == "true" else "cpu"
    )

    # Pinecone (MATCH BACKEND NAMES)
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT", "us-east1-gcp")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "medical-rag")
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
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "tinyllama")
    OLLAMA_TIMEOUT = 180
    OLLAMA_TEMPERATURE = 0.7
    OLLAMA_MAX_TOKENS = 256

    # Memory
    BUFFER_SIZE = int(os.getenv("BUFFER_SIZE", "10"))

    # Performance
    USE_STREAMING = os.getenv("USE_STREAMING", "false").lower() == "true"
    CACHE_EMBEDDINGS = True

    # PDF
    PDF_ENGINE = "pymupdf"
    OCR_FALLBACK = False
    MAX_PAGES = 1000

    @classmethod
    def validate(cls):
        if not cls.PINECONE_API_KEY:
            raise ValueError("PINECONE_API_KEY is required")
        return True


config = RAGConfig()