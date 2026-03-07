"""
Documents API Route
PDF upload and processing
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
import os
import uuid
import logging

from ..models import DocumentResponse, DocumentUploadResponse
from ..services.mongodb_service import mongodb_service
from ..services.document_service import document_service
from ..config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    conversation_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload PDF document for processing.
    
    Pipeline:
    1. Validate file
    2. Save temporarily
    3. Create document record
    4. Process PDF (extract, chunk, embed)
    5. Store in Pinecone
    6. Update MongoDB
    
    Args:
        conversation_id: Conversation ID
        file: PDF file
        
    Returns:
        Document processing result
    """
    try:
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files allowed")
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Seek back to start
        
        max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if file_size > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB"
            )
        
        # Create uploads directory
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Save file temporarily
        file_id = str(uuid.uuid4())
        file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}_{file.filename}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        logger.info(f"Saved file: {file_path}")
        
        # Create document record
        document_id = await mongodb_service.create_document(
            conversation_id=conversation_id,
            filename=file.filename,
            status="processing"
        )
        
        # Process document (async in background would be better, but keep simple)
        result = await document_service.process_document(
            document_id=document_id,
            file_path=file_path,
            filename=file.filename,
            conversation_id=conversation_id
        )
        
        return DocumentUploadResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Get document status and metadata.
    
    Args:
        document_id: Document ID
        
    Returns:
        Document details
    """
    try:
        # Get from MongoDB
        from bson import ObjectId
        document = await mongodb_service.db.documents.find_one(
            {"_id": ObjectId(document_id)}
        )
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        document["_id"] = str(document["_id"])
        document["conversation_id"] = str(document["conversation_id"])
        
        return DocumentResponse(**document)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get document error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversation/{conversation_id}", response_model=List[DocumentResponse])
async def list_conversation_documents(conversation_id: str):
    """
    List documents for a conversation.
    
    Args:
        conversation_id: Conversation ID
        
    Returns:
        List of documents
    """
    try:
        documents = await mongodb_service.get_documents(conversation_id)
        return [DocumentResponse(**doc) for doc in documents]
        
    except Exception as e:
        logger.error(f"List documents error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
