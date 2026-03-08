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

    # ============================================
    # Appointment Booking Settings
    # ============================================
    BOOKING_MODE: str = "dummy"  # "dummy" or "real_time"
    
    # External Provider APIs (for real_time mode)
    ZOCDOC_API_KEY: str = ""
    ZOCDOC_API_URL: str = "https://api.zocdoc.com/v1"
    HEALTHGRADES_API_KEY: str = ""
    
    # Appointment Settings
    PROVIDER_SEARCH_RADIUS_MILES: int = 10
    APPOINTMENT_TTL_DAYS: int = 30
    MAX_APPOINTMENTS_PER_SESSION: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()