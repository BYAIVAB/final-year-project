"""
Conversation Buffer Memory Manager
Handles short-term conversation history for prompt context
"""
from typing import List, Dict, Optional
import logging

from ..config import config

logger = logging.getLogger(__name__)


class ConversationBuffer:
    """
    Manages conversation buffer memory.
    Loads last N messages from MongoDB for prompt context.
    """
    
    def __init__(self, buffer_size: int = None):
        """
        Initialize buffer manager.
        
        Args:
            buffer_size: Number of messages to keep in buffer
        """
        self.buffer_size = buffer_size or config.BUFFER_SIZE
    
    def format_messages_for_prompt(
        self, 
        messages: List[Dict]
    ) -> List[Dict]:
        """
        Format messages for prompt inclusion.
        Takes last N messages and prepares them.
        
        Args:
            messages: List of message documents from MongoDB
            
        Returns:
            Formatted messages for prompt
        """
        if not messages:
            return []
        
        # Take last N messages
        buffer = messages[-self.buffer_size:]
        
        # Format for prompt
        formatted = []
        for msg in buffer:
            formatted.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", ""),
                "timestamp": msg.get("created_at")
            })
        
        return formatted
    
    def should_summarize(self, message_count: int) -> bool:
        """
        Check if conversation should be summarized.
        (Future feature: summarize old messages)
        
        Args:
            message_count: Total messages in conversation
            
        Returns:
            True if should summarize
        """
        # Simple heuristic: every 50 messages
        return message_count > 0 and message_count % 50 == 0
    
    def truncate_long_messages(
        self, 
        messages: List[Dict], 
        max_chars: int = 500
    ) -> List[Dict]:
        """
        Truncate very long messages to prevent prompt bloat.
        
        Args:
            messages: List of messages
            max_chars: Max characters per message
            
        Returns:
            Messages with truncated content
        """
        truncated = []
        for msg in messages:
            content = msg.get("content", "")
            if len(content) > max_chars:
                content = content[:max_chars] + "..."
            
            truncated.append({
                **msg,
                "content": content
            })
        
        return truncated
    
    def get_buffer_summary(self, messages: List[Dict]) -> Dict:
        """
        Get summary statistics about the buffer.
        
        Args:
            messages: Buffer messages
            
        Returns:
            Summary dict
        """
        if not messages:
            return {
                "count": 0,
                "user_messages": 0,
                "assistant_messages": 0,
                "total_chars": 0
            }
        
        user_count = sum(1 for m in messages if m.get("role") == "user")
        assistant_count = sum(1 for m in messages if m.get("role") == "assistant")
        total_chars = sum(len(m.get("content", "")) for m in messages)
        
        return {
            "count": len(messages),
            "user_messages": user_count,
            "assistant_messages": assistant_count,
            "total_chars": total_chars,
            "avg_chars": total_chars / len(messages) if messages else 0
        }


# Global instance
conversation_buffer = ConversationBuffer()


def format_buffer_for_prompt(messages: List[Dict]) -> List[Dict]:
    """
    Convenience function to format buffer.
    
    Args:
        messages: Raw messages from MongoDB
        
    Returns:
        Formatted messages for prompt
    """
    return conversation_buffer.format_messages_for_prompt(messages)
