"""
Enhanced Helper Module
Fast embeddings and LLM client with connection pooling
"""
import requests
from typing import List, Dict, Optional
from sentence_transformers import SentenceTransformer
import torch
import logging
from functools import lru_cache

from ..config import config

logger = logging.getLogger(__name__)


class EmbeddingGenerator:
    """
    Fast embedding generation using sentence-transformers.
    Singleton pattern for model reuse.
    """
    
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._model is None:
            logger.info(f"Loading embedding model: {config.EMBEDDING_MODEL}")
            self._model = SentenceTransformer(
                config.EMBEDDING_MODEL,
                device=config.EMBEDDING_DEVICE
            )
            logger.info(f"Model loaded on {config.EMBEDDING_DEVICE}")
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for single text.
        
        Args:
            text: Input text
            
        Returns:
            384-dim embedding vector
        """
        return self.generate_embeddings([text])[0]
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for batch of texts (FAST).
        
        Args:
            texts: List of text strings
            
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        # Batch processing for speed
        embeddings = self._model.encode(
            texts,
            batch_size=config.EMBEDDING_BATCH_SIZE,
            show_progress_bar=False,
            convert_to_numpy=False,  # Return tensors for speed
            normalize_embeddings=True  # Normalized for cosine similarity
        )
        
        # Convert to list
        if isinstance(embeddings, torch.Tensor):
            embeddings = embeddings.tolist()
        
        return embeddings
    
    @property
    def dimension(self) -> int:
        """Get embedding dimension"""
        return self._model.get_sentence_embedding_dimension()


class OllamaClient:
    """
    Fast Ollama LLM client with connection pooling.
    """
    
    def __init__(self):
        self.base_url = config.OLLAMA_URL
        self.model = config.OLLAMA_MODEL
        self.session = requests.Session()  # Connection pooling
        self.session.headers.update({
            "Content-Type": "application/json"
        })
    
    def generate(
        self, 
        prompt: str, 
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> str:
        """
        Generate response from Ollama.
        
        Args:
            prompt: Complete prompt
            max_tokens: Max tokens to generate
            temperature: Sampling temperature
            
        Returns:
            Generated text
        """
        endpoint = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,  # No streaming for speed
            "options": {
                "temperature": temperature or config.OLLAMA_TEMPERATURE,
                "num_predict": max_tokens or config.OLLAMA_MAX_TOKENS,
            }
        }
        
        try:
            response = self.session.post(
                endpoint,
                json=payload,
                timeout=config.OLLAMA_TIMEOUT
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get("response", "").strip()
            
        except requests.Timeout:
            logger.error("Ollama request timed out")
            raise TimeoutError("LLM generation timed out")
        except Exception as e:
            logger.error(f"Ollama error: {e}")
            raise
    
    def generate_streaming(self, prompt: str):
        """
        Generate streaming response (optional for UI).
        
        Args:
            prompt: Complete prompt
            
        Yields:
            Text chunks
        """
        endpoint = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": config.OLLAMA_TEMPERATURE,
                "num_predict": config.OLLAMA_MAX_TOKENS,
            }
        }
        
        try:
            response = self.session.post(
                endpoint,
                json=payload,
                stream=True,
                timeout=config.OLLAMA_TIMEOUT
            )
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    import json
                    data = json.loads(line)
                    if "response" in data:
                        yield data["response"]
                    if data.get("done", False):
                        break
                        
        except Exception as e:
            logger.error(f"Ollama streaming error: {e}")
            raise
    
    def health_check(self) -> bool:
        """Check if Ollama is available"""
        try:
            response = self.session.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False


# Global instances (singleton pattern for speed)
embedding_generator = EmbeddingGenerator()
ollama_client = OllamaClient()


# Convenience functions
def generate_embedding(text: str) -> List[float]:
    """Generate embedding for text"""
    return embedding_generator.generate_embedding(text)


def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for batch"""
    return embedding_generator.generate_embeddings(texts)


def generate_response(prompt: str) -> str:
    """Generate LLM response"""
    return ollama_client.generate(prompt)


def check_services() -> Dict[str, bool]:
    """Check if all services are available"""
    return {
        "embeddings": embedding_generator is not None,
        "llm": ollama_client.health_check()
    }
