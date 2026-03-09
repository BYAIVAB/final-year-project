"""
Enhanced Prompt Templates
Optimized for medical RAG with conversational buffer memory
"""
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


# Ultra-minimal prompt for tinyllama - NO instructions it can leak
SYSTEM_PROMPT = """You are a helpful medical assistant."""


def build_context_section(retrieved_docs: List[Dict]) -> str:
    """
    Build context section from retrieved documents.
    
    Args:
        retrieved_docs: List of retrieved document chunks with metadata
        
    Returns:
        Formatted context string
    """
    if not retrieved_docs:
        return ""
    
    context_parts = ["RETRIEVED CONTEXT:"]
    
    for i, doc in enumerate(retrieved_docs, 1):
        metadata = doc.get("metadata", {})
        text = metadata.get("text", doc.get("text", ""))
        filename = metadata.get("filename", "Unknown")
        page = metadata.get("page_number", "?")
        similarity = doc.get("similarity", doc.get("score", 0))
        
        context_parts.append(
            f"\n[Document {i}] {filename} (Page {page}) | Relevance: {similarity:.2f}\n"
            f"{text[:300]}..."  # Truncate for speed
        )
    
    return "\n".join(context_parts)


def build_chat_history_section(
    buffer_messages: List[Dict],
    max_messages: int = 10
) -> str:
    """
    Build conversation history section from buffer.
    
    Args:
        buffer_messages: List of recent messages from MongoDB
        max_messages: Maximum messages to include
        
    Returns:
        Formatted conversation history
    """
    if not buffer_messages:
        return ""
    
    history_parts = ["RECENT CONVERSATION:"]
    
    # Take last N messages
    recent_messages = buffer_messages[-max_messages:]
    
    for msg in recent_messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        
        if role == "user":
            history_parts.append(f"User: {content}")
        elif role == "assistant":
            history_parts.append(f"Assistant: {content}")
    
    return "\n".join(history_parts)


def build_complete_prompt(
    user_query: str,
    buffer_messages: List[Dict],
    retrieved_docs: List[Dict],
    retrieved_chat: List[Dict] = None,
    system_prompt: str = None
) -> str:
    """
    Build complete prompt with all context.
    SIMPLIFIED for better tinyllama compatibility.
    
    Args:
        user_query: Current user question
        buffer_messages: Recent conversation buffer from MongoDB
        retrieved_docs: Retrieved document chunks from Pinecone
        retrieved_chat: Retrieved past messages from Pinecone (optional)
        system_prompt: Custom system prompt (optional)
        
    Returns:
        Complete formatted prompt
    """
    # Ultra-simple prompt structure for tinyllama
    parts = []
    
    # Add context if available (minimal)
    if retrieved_docs:
        context_text = ""
        for doc in retrieved_docs[:2]:  # Max 2 docs
            metadata = doc.get("metadata", {})
            text = metadata.get("text", doc.get("text", ""))
            if text:
                context_text += text[:200] + " "
        if context_text:
            parts.append(f"Context: {context_text.strip()}")
            parts.append("")
    
    # Direct question/answer format
    parts.append(f"User: {user_query}")
    parts.append("")
    parts.append("Assistant:")
    
    return "\n".join(parts)


def build_simple_prompt(user_query: str, context: str = "") -> str:
    """
    Build simple prompt without memory (for testing).
    
    Args:
        user_query: User question
        context: Optional context
        
    Returns:
        Simple prompt
    """
    parts = [SYSTEM_PROMPT, ""]
    
    if context:
        parts.append("CONTEXT:")
        parts.append(context)
        parts.append("")
    
    parts.append(f"User: {user_query}")
    parts.append("")
    parts.append("Assistant:")
    
    return "\n".join(parts)


def validate_prompt_length(prompt: str, max_tokens: int = 4000) -> bool:
    """
    Check if prompt is within token limit.
    
    Args:
        prompt: Complete prompt
        max_tokens: Maximum tokens allowed
        
    Returns:
        True if valid
    """
    # Rough estimate: 1 token ≈ 4 characters
    estimated_tokens = len(prompt) / 4
    
    if estimated_tokens > max_tokens:
        logger.warning(f"Prompt too long: ~{estimated_tokens:.0f} tokens (max {max_tokens})")
        return False
    
    return True
