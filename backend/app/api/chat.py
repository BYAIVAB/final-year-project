"""
Chat API Route - Main RAG Pipeline
Fast message processing with retrieval and generation
"""
from fastapi import APIRouter, HTTPException
from typing import List
import logging

from ..models import ChatRequest, ChatResponse, Source
from ..services.chat_service import chat_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send message and get RAG response (MAIN PIPELINE).
    
    This endpoint:
    1. Loads conversation buffer (last 10 messages)
    2. Generates embedding for query
    3. Retrieves relevant documents and chat history
    4. Builds prompt with context
    5. Generates LLM response
    6. Saves to MongoDB
    7. Stores in Pinecone for future retrieval
    
    Args:
        request: ChatRequest with conversation_id and message
        
    Returns:
        ChatResponse with generated response, sources, and timing
    """
    try:
        logger.info(f"Processing message for conversation {request.conversation_id}")
        
        # Process through RAG pipeline
        try:
            result = await chat_service.process_message(
                conversation_id=request.conversation_id,
                message=request.message
            )
        except TimeoutError:
            raise HTTPException(
                status_code=504,
                detail="LLM is busy. Please retry in a moment."
            )
        
        # Convert to response model
        sources = [Source(**src) for src in result["sources"]]
        
        return ChatResponse(
            message_id=result["message_id"],
            response=result["response"],
            sources=sources,
            timing=result["timing"]
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
