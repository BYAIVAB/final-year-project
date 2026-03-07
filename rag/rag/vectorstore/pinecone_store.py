"""
Pinecone Vector Store
Optimized for fast upsert and retrieval with batch operations
"""
from typing import List, Dict, Optional
from pinecone import Pinecone, ServerlessSpec
import logging
import time

from ..config import config

logger = logging.getLogger(__name__)


class PineconeStore:
    """
    Fast Pinecone vector database with batch operations.
    """
    
    def __init__(self):
        self.pc = None
        self.index = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Pinecone connection"""
        try:
            logger.info("Initializing Pinecone")
            self.pc = Pinecone(api_key=config.PINECONE_API_KEY)
            
            # Check if index exists
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]
            
            if config.PINECONE_INDEX_NAME not in existing_indexes:
                logger.info(f"Creating index: {config.PINECONE_INDEX_NAME}")
                self.pc.create_index(
                    name=config.PINECONE_INDEX_NAME,
                    dimension=384,  # MiniLM dimension
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )
                # Wait for index to be ready
                time.sleep(10)
            
            self.index = self.pc.Index(config.PINECONE_INDEX_NAME)
            logger.info("Pinecone initialized")
            
        except Exception as e:
            logger.error(f"Pinecone initialization failed: {e}")
            raise
    
    def upsert_documents(
        self,
        document_id: str,
        chunks: List[Dict],
        conversation_id: str
    ) -> int:
        """
        Upsert document chunks to Pinecone (FAST batch operation).
        
        Args:
            document_id: Document UUID
            chunks: List of chunks with embeddings
            conversation_id: Conversation UUID
            
        Returns:
            Number of vectors upserted
        """
        vectors = []
        
        for chunk in chunks:
            vector_id = f"doc_{document_id}_chunk_{chunk['chunk_index']}"
            
            metadata = {
                "document_id": document_id,
                "conversation_id": conversation_id,
                "chunk_index": chunk["chunk_index"],
                "page_number": chunk.get("page_number"),
                "text": chunk["text"][:500],  # Limit metadata size
                "type": "document"
            }
            
            # SAFETY: Pinecone requires list[float], not torch.Tensor
            embedding = chunk["embedding"]
            if hasattr(embedding, "tolist"):
                embedding = embedding.tolist()
            
            vectors.append({
                "id": vector_id,
                "values": embedding,
                "metadata": metadata
            })
        
        # Batch upsert (100 at a time for speed)
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(
                vectors=batch,
                namespace=config.PINECONE_NAMESPACE_DOCS
            )
        
        logger.info(f"Upserted {len(vectors)} document vectors")
        return len(vectors)
    
    def upsert_message(
        self,
        message_id: str,
        conversation_id: str,
        content: str,
        embedding: List[float],
        role: str = "user"
    ):
        """
        Upsert single message to chat history.
        
        Args:
            message_id: Message UUID
            conversation_id: Conversation UUID
            content: Message text
            embedding: Message embedding
            role: user or assistant
        """
        vector_id = f"msg_{conversation_id}_{message_id}"
        
        metadata = {
            "message_id": message_id,
            "conversation_id": conversation_id,
            "content": content[:500],  # Limit size
            "role": role,
            "type": "message"
        }
        
        # SAFETY: Pinecone requires list[float], not torch.Tensor
        if hasattr(embedding, "tolist"):
            embedding = embedding.tolist()
        
        self.index.upsert(
            vectors=[{
                "id": vector_id,
                "values": embedding,
                "metadata": metadata
            }],
            namespace=config.PINECONE_NAMESPACE_CHAT
        )
    
    def query_documents(
        self,
        query_embedding: List[float],
        conversation_id: str,
        top_k: int = None
    ) -> List[Dict]:
        """
        Query document namespace (FAST).
        
        Args:
            query_embedding: Query vector
            conversation_id: Filter by conversation
            top_k: Number of results
            
        Returns:
            List of matches
        """
        top_k = top_k or config.TOP_K_DOCS
        
        # SAFETY: Pinecone requires list[float], not torch.Tensor
        if hasattr(query_embedding, "tolist"):
            query_embedding = query_embedding.tolist()
        
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            namespace=config.PINECONE_NAMESPACE_DOCS,
            filter={"conversation_id": conversation_id},
            include_metadata=True
        )
        
        # Filter by threshold and format
        matches = []
        for match in results.matches:
            if match.score >= config.SIMILARITY_THRESHOLD:
                matches.append({
                    "id": match.id,
                    "score": match.score,
                    "similarity": match.score,
                    "metadata": match.metadata
                })
        
        return matches
    
    def query_chat_history(
        self,
        query_embedding: List[float],
        conversation_id: str,
        top_k: int = None
    ) -> List[Dict]:
        """
        Query chat history namespace (FAST).
        
        Args:
            query_embedding: Query vector
            conversation_id: Filter by conversation
            top_k: Number of results
            
        Returns:
            List of matches
        """
        top_k = top_k or config.TOP_K_CHAT
        
        # SAFETY: Pinecone requires list[float], not torch.Tensor
        if hasattr(query_embedding, "tolist"):
            query_embedding = query_embedding.tolist()
        
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            namespace=config.PINECONE_NAMESPACE_CHAT,
            filter={"conversation_id": conversation_id},
            include_metadata=True
        )
        
        matches = []
        for match in results.matches:
            if match.score >= config.SIMILARITY_THRESHOLD:
                matches.append({
                    "id": match.id,
                    "score": match.score,
                    "similarity": match.score,
                    "metadata": match.metadata
                })
        
        return matches
    
    def delete_document(self, document_id: str):
        """
        Delete all vectors for a document.
        
        Args:
            document_id: Document UUID
        """
        # Delete by ID prefix
        self.index.delete(
            filter={"document_id": document_id},
            namespace=config.PINECONE_NAMESPACE_DOCS
        )
        logger.info(f"Deleted document {document_id} from Pinecone")
    
    def health_check(self) -> bool:
        """Check Pinecone connectivity"""
        try:
            stats = self.index.describe_index_stats()
            return True
        except:
            return False


# Global instance
pinecone_store = PineconeStore()
