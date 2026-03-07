"""
Fast Retrieval Module
Dual retrieval: documents + chat history
"""
from typing import List, Dict, Tuple
import logging

from ..vectorstore.pinecone_store import pinecone_store
from ..src.helper import generate_embedding
from ..config import config

logger = logging.getLogger(__name__)


class Retriever:
    """
    Fast retrieval combining multiple sources.
    """
    
    def __init__(self):
        self.vector_store = pinecone_store
    
    async def retrieve(
        self,
        query: str,
        conversation_id: str
    ) -> Tuple[List[Dict], List[Dict]]:
        """
        Dual retrieval: documents + chat history (FAST).
        
        Args:
            query: User query text
            conversation_id: Conversation UUID
            
        Returns:
            Tuple of (document_matches, chat_matches)
        """
        # Generate query embedding once
        query_embedding = generate_embedding(query)
        
        # Parallel retrieval (fast)
        doc_matches = self.vector_store.query_documents(
            query_embedding=query_embedding,
            conversation_id=conversation_id,
            top_k=config.TOP_K_DOCS
        )
        
        chat_matches = self.vector_store.query_chat_history(
            query_embedding=query_embedding,
            conversation_id=conversation_id,
            top_k=config.TOP_K_CHAT
        )
        
        logger.info(
            f"Retrieved {len(doc_matches)} docs, {len(chat_matches)} chat messages"
        )
        
        return doc_matches, chat_matches
    
    def format_sources_for_response(
        self,
        doc_matches: List[Dict]
    ) -> List[Dict]:
        """
        Format document matches for API response.
        
        Args:
            doc_matches: Retrieved documents
            
        Returns:
            Formatted sources
        """
        sources = []
        
        for match in doc_matches:
            metadata = match.get("metadata", {})
            sources.append({
                "type": "document",
                "document_id": metadata.get("document_id"),
                "page": metadata.get("page_number"),
                "similarity": match.get("similarity", 0),
                "snippet": metadata.get("text", "")[:200]
            })
        
        return sources


# Global instance
retriever = Retriever()
