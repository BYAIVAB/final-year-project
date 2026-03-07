"""
Conversations API Route
CRUD operations for chat sessions
"""
from fastapi import APIRouter, HTTPException
from typing import List
import logging

from ..models import (
    ConversationCreate,
    ConversationResponse,
    MessageResponse
)
from ..services.mongodb_service import mongodb_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=ConversationResponse, status_code=201)
async def create_conversation(request: ConversationCreate):
    """
    Create new conversation.
    
    Args:
        request: ConversationCreate with optional title
        
    Returns:
        Created conversation
    """
    try:
        conversation_id = await mongodb_service.create_conversation(
            title=request.title
        )
        
        conversation = await mongodb_service.get_conversation(conversation_id)
        
        return ConversationResponse(**conversation)
        
    except Exception as e:
        logger.error(f"Create conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[ConversationResponse])
async def list_conversations(limit: int = 50):
    """
    List all conversations.
    
    Args:
        limit: Maximum conversations to return
        
    Returns:
        List of conversations
    """
    try:
        conversations = await mongodb_service.get_conversations(limit=limit)
        return [ConversationResponse(**conv) for conv in conversations]
        
    except Exception as e:
        logger.error(f"List conversations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str):
    """
    Get single conversation.
    
    Args:
        conversation_id: Conversation ID
        
    Returns:
        Conversation details
    """
    try:
        conversation = await mongodb_service.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return ConversationResponse(**conversation)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(conversation_id: str, limit: int = 50):
    """
    Get conversation messages.
    
    Args:
        conversation_id: Conversation ID
        limit: Maximum messages to return
        
    Returns:
        List of messages
    """
    try:
        messages = await mongodb_service.get_messages(
            conversation_id=conversation_id,
            limit=limit
        )
        
        return [MessageResponse(**msg) for msg in messages]
        
    except Exception as e:
        logger.error(f"Get messages error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(conversation_id: str):
    """
    Delete conversation and all messages.
    
    Args:
        conversation_id: Conversation ID
    """
    try:
        await mongodb_service.delete_conversation(conversation_id)
        return None
        
    except Exception as e:
        logger.error(f"Delete conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
