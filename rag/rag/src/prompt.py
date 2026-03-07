"""
Enhanced Prompt Templates
Optimized for medical RAG with conversational buffer memory
"""
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


# System prompt optimized for medical domain
SYSTEM_PROMPT = """You are a helpful medical AI assistant. Your role is to provide accurate, evidence-based medical information.

GUIDELINES:
1. Provide clear, concise answers
2. Always cite sources when using document information
3. If you don't know something, admit it honestly
4. Never provide medical diagnoses or treatment recommendations
5. Encourage users to consult healthcare professionals for medical advice
6. Use simple language when possible, but be technically accurate

Remember: You are an information assistant, not a replacement for professional medical consultation."""


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
    
    Args:
        user_query: Current user question
        buffer_messages: Recent conversation buffer from MongoDB
        retrieved_docs: Retrieved document chunks from Pinecone
        retrieved_chat: Retrieved past messages from Pinecone (optional)
        system_prompt: Custom system prompt (optional)
        
    Returns:
        Complete formatted prompt
    """
    prompt_parts = []
    
    # 1. System prompt
    prompt_parts.append(system_prompt or SYSTEM_PROMPT)
    prompt_parts.append("")
    
    # 2. Retrieved document context
    if retrieved_docs:
        doc_context = build_context_section(retrieved_docs)
        if doc_context:
            prompt_parts.append(doc_context)
            prompt_parts.append("")
    
    # 3. Retrieved chat history (semantic search)
    if retrieved_chat:
        chat_context_parts = ["RELEVANT PAST DISCUSSIONS:"]
        for i, chat in enumerate(retrieved_chat, 1):
            metadata = chat.get("metadata", {})
            content = metadata.get("content", "")
            similarity = chat.get("similarity", chat.get("score", 0))
            
            chat_context_parts.append(
                f"[{i}] (Relevance: {similarity:.2f})\n{content[:200]}..."
            )
        
        prompt_parts.append("\n".join(chat_context_parts))
        prompt_parts.append("")
    
    # 4. Recent conversation buffer (last N turns)
    if buffer_messages:
        history = build_chat_history_section(buffer_messages)
        if history:
            prompt_parts.append(history)
            prompt_parts.append("")
    
    # 5. Current query
    prompt_parts.append("CURRENT QUESTION:")
    prompt_parts.append(f"User: {user_query}")
    prompt_parts.append("")
    prompt_parts.append("Assistant:")
    
    return "\n".join(prompt_parts)


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
