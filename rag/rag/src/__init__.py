"""
RAG Core Module
Enhanced versions of existing code with speed optimizations
"""
from .document_processor import DocumentProcessor, document_processor
from .helper import (
    EmbeddingGenerator, 
    OllamaClient,
    embedding_generator,
    ollama_client,
    generate_embedding,
    generate_embeddings,
    generate_response,
    check_services
)
from .prompt import (
    SYSTEM_PROMPT,
    build_complete_prompt,
    build_simple_prompt,
    validate_prompt_length
)
from .memory import (
    ConversationBuffer,
    conversation_buffer,
    format_buffer_for_prompt
)

__all__ = [
    # Document Processing
    "DocumentProcessor",
    "document_processor",
    
    # Embeddings & LLM
    "EmbeddingGenerator",
    "OllamaClient",
    "embedding_generator",
    "ollama_client",
    "generate_embedding",
    "generate_embeddings",
    "generate_response",
    "check_services",
    
    # Prompts
    "SYSTEM_PROMPT",
    "build_complete_prompt",
    "build_simple_prompt",
    "validate_prompt_length",
    
    # Memory
    "ConversationBuffer",
    "conversation_buffer",
    "format_buffer_for_prompt",
]
