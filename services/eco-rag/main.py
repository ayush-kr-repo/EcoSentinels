import logging
import asyncio
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from models.schemas import HealthStatus

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("ecosentinels")

_rag_ready = False


async def _init_vectorstore_background():
    global _rag_ready
    try:
        logger.info("Background: loading vector store...")
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _blocking_init)
        _rag_ready = True
        logger.info("Vector store ready — RAG pipeline active")
    except Exception as e:
        logger.error("Background init failed: %s", e, exc_info=True)


def _blocking_init():
    from rag.vectorstore import get_vectorstore
    get_vectorstore()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("EcoSentinels starting — scheduling background init")
    asyncio.create_task(_init_vectorstore_background())
    yield
    logger.info("EcoSentinels shutting down")


# Build app immediately — no blocking at module level
app = FastAPI(
    title="EcoSentinels RAG API",
    description="Environmental intelligence powered by Gemma 4",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers at module level (no heavy init happens on import)
from routers.rag_router import router as rag_router
from routers.data_router import router as data_router
from routers.alert_router import router as alert_router

app.include_router(rag_router)
app.include_router(data_router)
app.include_router(alert_router)


@app.get("/health", response_model=HealthStatus)
async def health_check():
    from rag.vectorstore import get_doc_count
    from rag.pipeline import get_llm_runtime
    runtime = get_llm_runtime()
    return HealthStatus(
        status="healthy" if _rag_ready else "initializing",
        rag_ready=_rag_ready,
        vector_store_docs=get_doc_count() if _rag_ready else 0,
        model=runtime["model"],
        provider=runtime["provider"],
    )


@app.get("/")
async def root():
    from rag.pipeline import get_llm_runtime
    runtime = get_llm_runtime()
    return {
        "service": "EcoSentinels RAG API",
        "version": "1.0.0",
        "status": "ready" if _rag_ready else "initializing (models loading ~30s)",
        "rag_ready": _rag_ready,
        "model": runtime["model"],
        "provider": runtime["provider"],
        "endpoints": {
            "health": "/health",
            "rag_query": "/rag/query",
            "community_briefing": "/rag/briefing",
            "rag_search": "/rag/search?q=",
            "air_quality": "/data/air-quality?lat=&lon=",
            "weather": "/data/weather?lat=&lon=",
            "analyze": "/data/analyze",
            "alert_generate": "/alerts/generate",
            "docs": "/docs",
        },
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.port,
        log_level=settings.log_level,
    )
