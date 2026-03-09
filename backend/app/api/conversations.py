"""
Conversations API Route
CRUD operations for chat sessions

CHANGES LOG:
- v2.3: Added LLM-based title generation endpoint (ChatGPT/Claude-style naming)
"""
from fastapi import APIRouter, HTTPException
from typing import List
import logging
import json
import re

from ..models import (
    ConversationCreate,
    ConversationResponse,
    MessageResponse,
    GenerateTitleResponse
)
from ..services.mongodb_service import mongodb_service

# Import LLM generator for title creation
from rag.src.helper import generate_response

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


# ============================================
# LLM-BASED TITLE GENERATION (ChatGPT/Claude-style)
# ============================================

# Booking intent patterns for title generation
BOOKING_TITLE_PATTERNS = [
    r'\b(book|schedule|make|get)\s*(an?|my)?\s*(appointment|booking|meeting|visit)\b',
    r'\b(need|want|looking)\s*(to)?\s*(see|visit|consult)\s*(a|an|the)?\s*(doctor|specialist|physician)\b',
    r'\bappointment\s*(with|for)\b',
    r'\b(see|visit|consult)\s*(a|an)?\s*\w+logist\b',
]

# Specialty extraction for booking titles
SPECIALTY_MAP = {
    r'cardio\w*|heart': 'Cardiologist',
    r'derma\w*|skin': 'Dermatologist',
    r'neuro\w*|brain': 'Neurologist',
    r'ortho\w*|bone|joint': 'Orthopedist',
    r'pedia\w*|child|kid': 'Pediatrician',
    r'psych\w*|therap\w*|mental\s*health': 'Psychiatrist',
    r'gyn\w*|obst\w*|women': 'Gynecologist',
    r'ophthalm\w*|eye': 'Ophthalmologist',
    r'dent\w*|tooth|teeth': 'Dentist',
    r'ent|ear\s*nose\s*throat': 'ENT Specialist',
    r'gastro\w*|stomach|digest': 'Gastroenterologist',
    r'pulmon\w*|lung|breath': 'Pulmonologist',
    r'endocrin\w*|hormone|diabetes|thyroid': 'Endocrinologist',
    r'oncolog\w*|cancer': 'Oncologist',
    r'urolog\w*|kidney|bladder': 'Urologist',
    r'general|gp|family': 'General Doctor',
}

# Generic opening messages to skip
GENERIC_MESSAGES = [
    r'^hi\s*$', r'^hey\s*$', r'^hello\s*$', r'^hii+\s*$',
    r'^good\s*(morning|afternoon|evening)\s*$',
    r'^how\s*are\s*you\b', r'^what\s*can\s*you\s*do\b',
    r'^help\s*$', r'^test\s*$', r'^ok\s*$',
]


def is_generic_message(message: str) -> bool:
    """Check if message is a generic greeting/opening."""
    msg = message.strip().lower()
    for pattern in GENERIC_MESSAGES:
        if re.match(pattern, msg, re.IGNORECASE):
            return True
    return len(msg) < 4


def detect_booking_for_title(message: str) -> tuple[bool, str | None]:
    """
    Check if message has booking intent and extract specialty.
    
    Returns:
        Tuple of (is_booking, specialty_name or None)
    """
    msg_lower = message.lower()
    
    # Check booking patterns
    is_booking = any(re.search(p, msg_lower) for p in BOOKING_TITLE_PATTERNS)
    
    if not is_booking:
        return False, None
    
    # Extract specialty
    for pattern, specialty_name in SPECIALTY_MAP.items():
        if re.search(pattern, msg_lower, re.IGNORECASE):
            return True, specialty_name
    
    return True, "Doctor"  # Generic booking


def build_title_prompt(messages: List[dict]) -> str:
    """
    Build LLM prompt for title generation following ChatGPT/Claude style.
    
    Args:
        messages: List of conversation messages with 'role' and 'content'
        
    Returns:
        Prompt string for LLM
    """
    # Filter user messages only
    user_messages = [m for m in messages if m.get('role') == 'user']
    
    if not user_messages:
        return None
    
    # Find first substantive message (skip generic greetings)
    substantive_messages = []
    for msg in user_messages[:5]:  # Check first 5 user messages
        content = msg.get('content', '').strip()
        if content and not is_generic_message(content):
            substantive_messages.append(content)
    
    if not substantive_messages:
        # All messages are generic, use first one
        first_content = user_messages[0].get('content', 'General Chat')
        substantive_messages = [first_content]
    
    # Check for booking intent first (fast path)
    for msg in substantive_messages:
        is_booking, specialty = detect_booking_for_title(msg)
        if is_booking:
            # Return booking title directly, no LLM needed
            return f"BOOKING:{specialty}"
    
    # Build context for LLM
    messages_text = "\n".join([f"- {m}" for m in substantive_messages[:3]])
    
    prompt = f"""You are a conversation title generator. Generate a short, descriptive title for this conversation.

MESSAGES:
{messages_text}

RULES:
1. Output ONLY valid JSON: {{"title": "Your Title Here"}}
2. Title must be 3-6 words, max 45 characters
3. Use Title Case (capitalize major words)
4. Capture the main topic or intent
5. For medical symptoms, include the condition (e.g., "Managing Chronic Back Pain")
6. For health questions, include what they're asking about (e.g., "Preventing Type 2 Diabetes")
7. For crisis/suicide topics, use supportive title (e.g., "Mental Health Support")
8. AVOID: Personal names, dates, "I want", "How to", quotation marks in title
9. If unclear, use: {{"title": "General Health Chat"}}

Generate the JSON now:"""
    
    return prompt


def parse_title_response(llm_response: str) -> str:
    """
    Parse LLM response to extract title.
    
    Handles both JSON format and plain text fallbacks.
    """
    if not llm_response:
        return "New Chat"
    
    response = llm_response.strip()
    
    # Try to parse as JSON first
    try:
        # Handle potential markdown code blocks
        if response.startswith("```"):
            response = re.sub(r'^```(?:json)?\s*', '', response)
            response = re.sub(r'\s*```$', '', response)
        
        data = json.loads(response)
        if isinstance(data, dict) and 'title' in data:
            title = data['title'].strip()
            # Validate length
            if len(title) > 45:
                title = title[:42] + '...'
            return title if title else "New Chat"
    except json.JSONDecodeError:
        pass
    
    # Fallback: Try to extract title from response text
    # Look for patterns like "title": "..." or Title: ...
    patterns = [
        r'"title"\s*:\s*"([^"]+)"',
        r"'title'\s*:\s*'([^']+)'",
        r'Title:\s*(.+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, response, re.IGNORECASE)
        if match:
            title = match.group(1).strip()
            if len(title) > 45:
                title = title[:42] + '...'
            return title if title else "New Chat"
    
    # Last resort: Use first line as title if it looks reasonable
    first_line = response.split('\n')[0].strip()
    if 3 <= len(first_line) <= 45 and not first_line.startswith('{'):
        return first_line
    
    return "New Chat"


@router.post("/{conversation_id}/generate-title", response_model=GenerateTitleResponse)
async def generate_title(conversation_id: str):
    """
    Generate an LLM-based title for a conversation (ChatGPT/Claude-style).
    
    Uses the conversation messages to create a concise, descriptive title.
    Handles booking intents, medical queries, and general conversations.
    
    Args:
        conversation_id: Conversation ID
        
    Returns:
        GenerateTitleResponse with the generated title
    """
    try:
        # Verify conversation exists
        conversation = await mongodb_service.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages
        messages = await mongodb_service.get_messages(
            conversation_id=conversation_id,
            limit=10  # Only need first few messages
        )
        
        if not messages:
            # No messages yet, keep default title
            return GenerateTitleResponse(
                title="New Chat",
                conversation_id=conversation_id
            )
        
        # Build prompt for title generation
        prompt = build_title_prompt(messages)
        
        if not prompt:
            return GenerateTitleResponse(
                title="New Chat",
                conversation_id=conversation_id
            )
        
        # Check for booking fast-path (no LLM needed)
        if prompt.startswith("BOOKING:"):
            specialty = prompt.replace("BOOKING:", "")
            title = f"Book: {specialty}"
            logger.info(f"Generated booking title: {title}")
        else:
            # Call LLM for title generation
            logger.info(f"Generating title for conversation {conversation_id}")
            llm_response = generate_response(prompt)
            title = parse_title_response(llm_response)
            logger.info(f"LLM generated title: {title}")
        
        # Update conversation title in database
        await mongodb_service.update_conversation_title(conversation_id, title)
        
        return GenerateTitleResponse(
            title=title,
            conversation_id=conversation_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generate title error: {e}")
        # Don't fail the request, just return a default
        return GenerateTitleResponse(
            title="New Chat",
            conversation_id=conversation_id
        )
