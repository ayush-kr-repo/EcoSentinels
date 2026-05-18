import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")


class Settings(BaseSettings):
    google_api_key: str = ""
    gemma_model: str = "gemma-4-26b-a4b-it"
    llm_timeout_seconds: int = 90
    chroma_persist_dir: str = os.path.join(os.path.dirname(__file__), "data", "chroma_db")
    knowledge_base_dir: str = os.path.join(os.path.dirname(__file__), "data", "knowledge_base")
    chunk_size: int = 400
    chunk_overlap: int = 150
    retrieval_k: int = 2
    port: int = int(os.getenv("PORT", os.getenv("RAG_PORT", "6000")))
    cors_origins: list[str] = ["*"]
    log_level: str = "info"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")


settings = Settings()