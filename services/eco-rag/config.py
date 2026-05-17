import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from the same directory as config.py
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")


class Settings(BaseSettings):
    google_api_key: str = ""
    gemma_model: str = ""

    llm_timeout_seconds: int = 90

    chroma_persist_dir: str = os.path.join(
        os.path.dirname(__file__),
        "data",
        "chroma_db"
    )

    knowledge_base_dir: str = os.path.join(
        os.path.dirname(__file__),
        "data",
        "knowledge_base"
    )

    chunk_size: int = 400
    chunk_overlap: int = 150
    retrieval_k: int = 2

    port: int = 6000

    cors_origins: list[str] = ["*"]
    log_level: str = "info"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()

# TEMP DEBUG
print("GOOGLE_API_KEY:", settings.google_api_key)