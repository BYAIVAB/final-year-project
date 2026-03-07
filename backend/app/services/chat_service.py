"""
Chat Service - Fast RAG Pipeline
Optimized orchestration of retrieval + LLM generation
"""
from typing import Dict, List
import time
import logging

from ..services.mongodb_service import mongodb_service
from ..services.metrics_service import metrics_service
from ..config import settings

# Import RAG components
from rag.src.helper import generate_embedding, generate_response
from rag.src.prompt import build_complete_prompt
from rag.src.memory import format_buffer_for_prompt
from rag.retrieval.retriever import retriever
from rag.vectorstore.pinecone_store import pinecone_store

logger = logging.getLogger(__name__)


class ChatService:
    """
    Fast chat pipeline orchestration.
    Optimized for speed with minimal overhead.
    """
    
    async def process_message(
        self,
        conversation_id: str,
        message: str
    ) -> Dict:
        """
        Complete RAG pipeline (OPTIMIZED FOR SPEED).
        
        Pipeline:
        1. Load buffer from MongoDB (last 10 messages)
        2. Generate query embedding
        3. Dual retrieval (docs + chat history)
        4. Build prompt
        5. Generate response
        6. Save to MongoDB
        7. Store in Pinecone
        
        Args:
            conversation_id: Conversation ID
            message: User message
            
        Returns:
            Response dict with message, sources, timing
        """
        start_time = time.time()
        timing = {}
        
        try:
            # Step 1: Load conversation buffer (FAST - only last 10)
            buffer_start = time.time()
            buffer_messages = await mongodb_service.get_recent_messages(
                conversation_id=conversation_id,
                limit=settings.BUFFER_SIZE
            )
            timing["buffer_load"] = (time.time() - buffer_start) * 1000
            logger.info(f"Buffer: {len(buffer_messages)} messages in {timing['buffer_load']:.0f}ms")
            
            # Step 2: Generate embedding (FAST - optimized model)
            embed_start = time.time()
            query_embedding = generate_embedding(message)
            timing["embedding"] = (time.time() - embed_start) * 1000
            logger.info(f"Embedding: {timing['embedding']:.0f}ms")
            
            # Step 3: Dual retrieval (FAST - Pinecone)
            retrieval_start = time.time()
            doc_matches, chat_matches = await retriever.retrieve(
                query=message,
                conversation_id=conversation_id
            )
            timing["retrieval"] = (time.time() - retrieval_start) * 1000
            logger.info(f"Retrieval: {timing['retrieval']:.0f}ms ({len(doc_matches)} docs, {len(chat_matches)} chat)")
            
            # Step 4: Build prompt (FAST - simple string operations)
            prompt_start = time.time()
            formatted_buffer = format_buffer_for_prompt(buffer_messages)
            prompt = build_complete_prompt(
                user_query=message,
                buffer_messages=formatted_buffer,
                retrieved_docs=doc_matches,
                retrieved_chat=chat_matches
            )
            timing["prompt_build"] = (time.time() - prompt_start) * 1000
            
            # Step 5: Generate LLM response (MAIN BOTTLENECK)
            llm_start = time.time()
            response = generate_response(prompt)
            timing["llm_generation"] = (time.time() - llm_start) * 1000
            logger.info(f"LLM: {timing['llm_generation']:.0f}ms")
            
            # Step 6: Save messages (FAST - async MongoDB)
            save_start = time.time()
            
            # Save user message
            user_msg_id = await mongodb_service.save_message(
                conversation_id=conversation_id,
                role="user",
                content=message,
                metadata={"timing": timing}
            )
            
            # Save assistant message with sources
            sources = retriever.format_sources_for_response(doc_matches)
            assistant_msg_id = await mongodb_service.save_message(
                conversation_id=conversation_id,
                role="assistant",
                content=response,
                metadata={"sources": sources, "timing": timing}
            )
            
            # Update conversation activity
            await mongodb_service.update_conversation_activity(conversation_id)
            
            timing["save"] = (time.time() - save_start) * 1000
            
            # Step 7: Store in Pinecone for future retrieval (async, don't wait)
            try:
                pinecone_store.upsert_message(
                    message_id=user_msg_id,
                    conversation_id=conversation_id,
                    content=message,
                    embedding=query_embedding,
                    role="user"
                )
            except Exception as e:
                logger.error(f"Pinecone upsert failed: {e}")
            
            # Total time
            timing["total"] = (time.time() - start_time) * 1000
            logger.info(f"✅ Pipeline completed in {timing['total']:.0f}ms")
            
            # Track metrics for dashboard
            try:
                if metrics_service.db is None:
                    await metrics_service.connect()
                await metrics_service.track_query(
                    conversation_id=conversation_id,
                    query=message,
                    response_time=timing["total"],
                    sources_count=len(sources),
                    llm_model="llama2"
                )
            except Exception as metrics_error:
                logger.warning(f"Metrics tracking failed: {metrics_error}")
            
            return {
                "message_id": assistant_msg_id,
                "response": response,
                "sources": sources,
                "timing": timing
            }
            
        except Exception as e:
            logger.error(f"Chat pipeline error: {e}", exc_info=True)
            raise


# Global instance
chat_service = ChatService()
