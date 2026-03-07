"""
Health Check API Route
System status and service availability
"""
from fastapi import APIRouter
from datetime import datetime
import logging

from ..models import HealthResponse
from ..services.mongodb_service import mongodb_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
async def health_check():
    """
    Check system health and service availability.
    
    Checks:
    - MongoDB connection
    - Pinecone connection
    - Ollama LLM availability
    - Embedding model availability
    
    Returns:
        Health status of all services
    """
    services = {}
    
    # Check MongoDB
    try:
        await mongodb_service.db.command("ping")
        services["mongodb"] = True
    except:
        services["mongodb"] = False
    
    # Check Pinecone
    try:
        from rag.vectorstore.pinecone_store import pinecone_store
        services["pinecone"] = pinecone_store.health_check()
    except:
        services["pinecone"] = False
    
    # Check RAG services
    try:
        from rag.src.helper import check_services
        rag_services = check_services()
        services["embeddings"] = rag_services.get("embeddings", False)
        services["llm"] = rag_services.get("llm", False)
    except:
        services["embeddings"] = False
        services["llm"] = False
    
    # Overall status
    all_healthy = all(services.values())
    status = "healthy" if all_healthy else "degraded"
    
    return HealthResponse(
        status=status,
        services=services,
        timestamp=datetime.utcnow()
    )
