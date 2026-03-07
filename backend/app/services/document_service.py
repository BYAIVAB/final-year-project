"""
Document Service - Fast PDF Processing
Optimized for speed with PyMuPDF and batch operations
"""
import os
import time
import logging
from typing import Dict

from ..services.mongodb_service import mongodb_service
from ..services.metrics_service import metrics_service
from ..config import settings

# Import RAG components
from rag.src.document_processor import document_processor
from rag.src.helper import generate_embeddings
from rag.vectorstore.pinecone_store import pinecone_store

logger = logging.getLogger(__name__)


class DocumentService:
    """
    Fast document processing service.
    """
    
    async def process_document(
        self,
        document_id: str,
        file_path: str,
        filename: str,
        conversation_id: str
    ) -> Dict:
        """
        Complete document processing pipeline (OPTIMIZED).
        
        Pipeline:
        1. Extract text from PDF (PyMuPDF - fast)
        2. Chunk text
        3. Generate embeddings (batch)
        4. Upsert to Pinecone (batch)
        5. Update MongoDB
        
        Args:
            document_id: Document ID from MongoDB
            file_path: Path to uploaded PDF
            filename: Original filename
            conversation_id: Conversation ID
            
        Returns:
            Processing result dict
        """
        start_time = time.time()
        
        try:
            # Update status to processing
            await mongodb_service.update_document(
                document_id=document_id,
                status="processing"
            )
            
            # Step 1: Extract and chunk (PyMuPDF is FAST)
            extract_start = time.time()
            chunks, page_count = document_processor.process_pdf(file_path)
            extract_time = (time.time() - extract_start) * 1000
            logger.info(f"Extracted {page_count} pages, {len(chunks)} chunks in {extract_time:.0f}ms")
            
            if not chunks:
                raise ValueError("No text extracted from PDF")
            
            # Step 2: Generate embeddings (BATCH for speed)
            embed_start = time.time()
            texts = [chunk["text"] for chunk in chunks]
            embeddings = generate_embeddings(texts)
            embed_time = (time.time() - embed_start) * 1000
            logger.info(f"Generated {len(embeddings)} embeddings in {embed_time:.0f}ms")
            
            # Attach embeddings to chunks
            for chunk, embedding in zip(chunks, embeddings):
                chunk["embedding"] = embedding
            
            # Step 3: Upsert to Pinecone (BATCH)
            upsert_start = time.time()
            vector_count = pinecone_store.upsert_documents(
                document_id=document_id,
                chunks=chunks,
                conversation_id=conversation_id
            )
            upsert_time = (time.time() - upsert_start) * 1000
            logger.info(f"Upserted {vector_count} vectors in {upsert_time:.0f}ms")
            
            # Step 4: Update MongoDB
            await mongodb_service.update_document(
                document_id=document_id,
                status="completed",
                page_count=page_count,
                chunk_count=len(chunks)
            )
            
            # Clean up file
            if os.path.exists(file_path):
                os.remove(file_path)
            
            total_time = (time.time() - start_time) * 1000
            logger.info(f"✅ Document processed in {total_time:.0f}ms")
            
            # Track document upload metrics
            try:
                if metrics_service.db is None:
                    await metrics_service.connect()
                await metrics_service.track_document_upload(
                    document_id=document_id,
                    filename=filename,
                    page_count=page_count,
                    chunk_count=len(chunks),
                    processing_time=total_time
                )
            except Exception as metrics_error:
                logger.warning(f"Metrics tracking failed: {metrics_error}")
            
            return {
                "document_id": document_id,
                "filename": filename,
                "status": "completed",
                "page_count": page_count,
                "chunk_count": len(chunks),
                "timing": {
                    "extraction": extract_time,
                    "embedding": embed_time,
                    "upsert": upsert_time,
                    "total": total_time
                }
            }
            
        except Exception as e:
            logger.error(f"Document processing failed: {e}", exc_info=True)
            
            # Update status to failed
            await mongodb_service.update_document(
                document_id=document_id,
                status="failed"
            )
            
            # Clean up file
            if os.path.exists(file_path):
                os.remove(file_path)
            
            raise


# Global instance
document_service = DocumentService()
