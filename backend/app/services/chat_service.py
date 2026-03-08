"""
Chat Service - Fast RAG Pipeline
Optimized orchestration of retrieval + LLM generation

CHANGES LOG:
- v2.1: Added robust keyword-based booking intent detection
- v2.1: Fixed prompt leaking issue with response cleanup
- v2.1: Improved booking flow trigger mechanism
"""
from typing import Dict, List, Optional, Tuple
import time
import logging
import json
import re

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

# ============================================
# BOOKING INTENT PATTERNS (Keyword-based)
# ============================================
BOOKING_KEYWORDS = [
    r'\b(book|schedule|make|get)\s*(an?|my)?\s*(appointment|booking|meeting|visit)\b',
    r'\b(need|want|looking)\s*(to)?\s*(see|visit|consult)\s*(a|an|the)?\s*(doctor|specialist|physician)\b',
    r'\bi\s*need\s*(to\s*)?(see|visit|consult)\s*(a|an)?\s*\w+logist\b',  # cardiologist, dermatologist, etc.
    r'\b(find|search|looking\s*for)\s*(a|an)?\s*(doctor|specialist|clinic|hospital)\b',
    r'\b(can\s*i|could\s*i|i\s*want\s*to)\s*(book|schedule|get)\b',
    r'\bappointment\s*(with|for)\b',
    r'\b(see|visit|consult)\s*(a|an)?\s*\w+logist\b',  # any specialist ending in -logist
    r'\bset\s*up\s*(an?)?\s*(appointment|meeting|visit)\b',
]

# Specialty mappings (normalized names)
SPECIALTY_PATTERNS = {
    r'cardio\w*|heart\s*(doctor|specialist)?': 'cardiology',
    r'derma\w*|skin\s*(doctor|specialist)?': 'dermatology',
    r'neuro\w*|brain\s*(doctor|specialist)?|nervous': 'neurology',
    r'ortho\w*|bone\s*(doctor|specialist)?|joint': 'orthopedics',
    r'pedia\w*|child\w*\s*(doctor)?|kid': 'pediatrics',
    r'psych\w*|therap\w*|mental\s*health|counselo?r': 'psychiatry',
    r'gyn\w*|obst\w*|women': 'gynecology',
    r'ophthalm\w*|eye\s*(doctor|specialist)?': 'ophthalmology',
    r'dent\w*|tooth|teeth': 'dentistry',
    r'ent|ear\s*nose\s*throat|otolaryn': 'ent',
    r'gastro\w*|stomach|digest': 'gastroenterology',
    r'pulmon\w*|lung|breath': 'pulmonology',
    r'endocrin\w*|hormone|diabetes|thyroid': 'endocrinology',
    r'oncolog\w*|cancer': 'oncology',
    r'urolog\w*|kidney|bladder': 'urology',
    r'rheumat\w*|arthritis|autoimmune': 'rheumatology',
    r'general\s*(physician|practitioner|doctor)|gp|family\s*(doctor|medicine)': 'general_practice',
}

# Urgency patterns
URGENCY_PATTERNS = {
    'urgent': [r'\burgent\w*\b', r'\basap\b', r'\bemergenc\w*\b', r'\bimmediatel\w*\b', r'\btoday\b', r'\bnow\b'],
    'routine': [r'\broutine\b', r'\bcheck\s*up\b', r'\bannual\b', r'\bregular\b', r'\bfollow\s*up\b']
}


class ChatService:
    """
    Fast chat pipeline orchestration.
    Optimized for speed with robust booking intent detection.
    
    CHANGES v2.1:
    - Keyword-based intent detection (more reliable than LLM-based)
    - Response cleanup to remove prompt artifacts
    - Proper booking flow triggering
    """
    
    def detect_booking_intent_keywords(self, message: str) -> Tuple[bool, Optional[Dict]]:
        """
        Detect booking intent using keyword patterns (FAST & RELIABLE).
        
        Args:
            message: User message text
            
        Returns:
            Tuple of (is_booking_intent, extracted_data)
        """
        message_lower = message.lower().strip()
        
        # Check for booking keywords
        is_booking = False
        for pattern in BOOKING_KEYWORDS:
            if re.search(pattern, message_lower, re.IGNORECASE):
                is_booking = True
                logger.info(f"Booking intent detected via pattern: {pattern}")
                break
        
        if not is_booking:
            return False, None
        
        # Extract specialty
        specialty = None
        for pattern, spec_name in SPECIALTY_PATTERNS.items():
            if re.search(pattern, message_lower, re.IGNORECASE):
                specialty = spec_name
                logger.info(f"Extracted specialty: {specialty}")
                break
        
        # Extract urgency
        urgency = 'routine'  # default
        for urgency_level, patterns in URGENCY_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, message_lower, re.IGNORECASE):
                    urgency = urgency_level
                    break
        
        # Build extracted slots
        extracted_slots = {
            'specialty': specialty,
            'symptoms': None,  # Could extract with NER later
            'timeframe': None,
            'location': None,
            'preferred_time': None,
            'urgency': urgency
        }
        
        # Determine what info is missing
        missing_slots = []
        if not specialty:
            missing_slots.append('specialty')
        missing_slots.append('location')  # Always need location
        
        # Generate next question
        if not specialty:
            next_question = "I'd be happy to help you book an appointment! 🏥 What type of doctor or specialist would you like to see?"
        else:
            next_question = f"Great! I can help you find a {specialty} specialist. 📍 Please share your location or enter your city so I can find doctors near you."
        
        return True, {
            'intent': 'booking',
            'confidence': 0.95,
            'extracted_slots': extracted_slots,
            'missing_slots': missing_slots,
            'next_question': next_question
        }
    
    def clean_llm_response(self, response: str) -> str:
        """
        Clean LLM response to remove prompt artifacts.
        
        Args:
            response: Raw LLM response
            
        Returns:
            Cleaned response text
        """
        if not response:
            return "I apologize, but I couldn't generate a response. Please try asking your question again."
        
        # Remove common prompt artifacts
        artifacts_to_remove = [
            r'^(GUIDELINE|GUIDELINES?):\s*[\s\S]*?(RECENT CONVERSATION|CURRENT QUESTION|User:)',
            r'^(SYSTEM PROMPT|INSTRUCTIONS?):\s*[\s\S]*?(User:|RECENT)',
            r'^(RECENT CONVERSATION|CONTEXT):\s*',
            r'^\d+\.\s*(Provide clear|Always cite|If you don\'t know|Never provide|Use simple|Encourage)[\s\S]*?(?=\n\n|\Z)',
            r'^Assistant:\s*',
            r'^\[INST\][\s\S]*?\[/INST\]\s*',
        ]
        
        cleaned = response.strip()
        
        for pattern in artifacts_to_remove:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE | re.MULTILINE)
        
        # Remove leading newlines and clean up
        cleaned = cleaned.strip()
        
        # If response still looks like it contains prompt content, extract actual answer
        if 'GUIDELINE' in cleaned or 'RECENT CONVERSATION' in cleaned:
            # Try to find actual response after prompt content
            parts = re.split(r'(?:Assistant:|Response:|Answer:)\s*', cleaned, flags=re.IGNORECASE)
            if len(parts) > 1:
                cleaned = parts[-1].strip()
            else:
                # Last resort: take content after last newline block
                lines = cleaned.split('\n\n')
                for line in reversed(lines):
                    if len(line.strip()) > 20 and not any(x in line for x in ['GUIDELINE', 'CONVERSATION', 'CONTEXT']):
                        cleaned = line.strip()
                        break
        
        # Final cleanup
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        return cleaned if len(cleaned) > 10 else "I'm here to help with your medical questions. Could you please rephrase your question?"
    
    async def process_message(
        self,
        conversation_id: str,
        message: str
    ) -> Dict:
        """
        Complete RAG pipeline with booking detection.
        
        Pipeline:
        0. Check for booking intent (keyword-based - FAST)
        1. Load buffer from MongoDB
        2. Generate query embedding
        3. Dual retrieval
        4. Build prompt
        5. Generate response (with cleanup)
        6. Save to MongoDB
        7. Store in Pinecone
        
        Args:
            conversation_id: Conversation ID
            message: User message
            
        Returns:
            Response dict with message, sources, timing, metadata
        """
        start_time = time.time()
        timing = {}
        
        try:
            # ============================================
            # STEP 0: CHECK FOR BOOKING INTENT (KEYWORD-BASED)
            # ============================================
            intent_start = time.time()
            is_booking, intent_data = self.detect_booking_intent_keywords(message)
            timing["intent_detection"] = (time.time() - intent_start) * 1000
            
            if is_booking and intent_data:
                logger.info(f"🎯 Booking intent detected: {intent_data.get('extracted_slots')}")
                
                # Get next question based on extracted info
                next_question = intent_data.get("next_question", 
                    "I'd be happy to help you book an appointment! What type of doctor do you need?")
                
                # Save user message
                user_msg_id = await mongodb_service.save_message(
                    conversation_id=conversation_id,
                    role="user",
                    content=message,
                    metadata={}
                )
                
                # Save assistant response with booking metadata
                assistant_msg_id = await mongodb_service.save_message(
                    conversation_id=conversation_id,
                    role="assistant",
                    content=next_question,
                    metadata={
                        "intent": "booking",
                        "extracted_slots": intent_data.get("extracted_slots", {}),
                        "booking_state": "awaiting_location"
                    }
                )
                
                timing["total"] = (time.time() - start_time) * 1000
                logger.info(f"✅ Booking response in {timing['total']:.0f}ms")
                
                return {
                    "message_id": assistant_msg_id,
                    "response": next_question,
                    "sources": [],
                    "timing": timing,
                    "metadata": {
                        "intent": "booking",
                        "booking_state": "awaiting_location",
                        "extracted_slots": intent_data.get("extracted_slots", {}),
                        "missing_slots": intent_data.get("missing_slots", []),
                        "confidence": intent_data.get("confidence", 0.95)
                    }
                }
            
            # ============================================
            # Continue with normal RAG flow if not booking
            # ============================================
            
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
            raw_response = generate_response(prompt)
            
            # Step 5.5: Clean up LLM response (remove prompt artifacts)
            response = self.clean_llm_response(raw_response)
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
                "timing": timing,
                "metadata": {
                    "intent": "medical_query",
                    "sources_count": len(sources)
                }
            }
            
        except Exception as e:
            logger.error(f"Chat pipeline error: {e}", exc_info=True)
            raise


# Global instance
chat_service = ChatService()
