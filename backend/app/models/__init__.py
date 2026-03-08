"""
Pydantic Models - Request/Response Schemas
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime


# Conversation Models
class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"


class ConversationResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    created_at: datetime
    last_active: datetime
    
    class Config:
        populate_by_name = True


# Message Models
class MessageResponse(BaseModel):
    id: str = Field(alias="_id")
    conversation_id: str
    role: str
    content: str
    created_at: datetime
    metadata: Optional[Dict] = {}
    
    class Config:
        populate_by_name = True


# Chat Models
class ChatRequest(BaseModel):
    conversation_id: str
    message: str


class Source(BaseModel):
    type: str
    document_id: Optional[str] = None
    page: Optional[int] = None
    similarity: float
    snippet: str


class ChatResponseMetadata(BaseModel):
    """Metadata returned with chat responses, including booking intent info"""
    intent: Optional[str] = None  # 'booking', 'medical_query', etc.
    extracted_slots: Optional[Dict] = None  # specialty, urgency, etc.
    
    model_config = {
        "extra": "allow"  # Allow extra fields for future extensibility
    }


class ChatResponse(BaseModel):
    message_id: str
    response: str
    sources: List[Source] = []
    timing: Dict[str, float]
    metadata: Optional[ChatResponseMetadata] = None  # Booking intent info
    
    model_config = {
        "extra": "allow"
    }


# Document Models
class DocumentResponse(BaseModel):
    id: str = Field(alias="_id")
    conversation_id: str
    filename: str
    status: str
    page_count: Optional[int] = None
    chunk_count: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True


class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    page_count: Optional[int] = None
    chunk_count: Optional[int] = None
    timing: Optional[Dict] = None


# Health Models
class HealthResponse(BaseModel):
    status: str
    services: Dict[str, bool]
    timestamp: datetime
