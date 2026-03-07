from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "medical_rag"

    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str = "us-east1-gcp"
    PINECONE_INDEX_NAME: str = "medical-rag"

    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "tinyllama"

    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 50
    BUFFER_SIZE: int = 10

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ]

    API_PREFIX: str = "/api"

    USE_GPU: bool = False
    USE_STREAMING: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()