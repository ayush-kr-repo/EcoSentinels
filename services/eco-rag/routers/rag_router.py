import logging
from fastapi import APIRouter, HTTPException
from models.schemas import CommunityBriefingRequest, CommunityBriefingResponse, QueryRequest, RagResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/rag", tags=["rag"])


def _check_ready():
    """Check if the vector store is ready. RAG queries need the vector store but not the LLM."""
    from rag.vectorstore import get_doc_count
    count = get_doc_count()
    if count == 0:
        raise HTTPException(
            status_code=503,
            detail="RAG pipeline initializing. Please retry in ~30 seconds.",
        )


@router.post("/query", response_model=RagResponse)
async def query_knowledge_base(request: QueryRequest):
    """
    RAG-powered environmental knowledge query.
    Uses Gemma + ChromaDB vector store over curated environmental knowledge.
    mode='rag': pure knowledge base query
    mode='agent': real-time data + RAG synthesis (requires lat/lon)
    """
    _check_ready()
    try:
        if request.mode == "agent" and (request.lat is not None and request.lon is not None):
            from agents.environmental_agent import run_environmental_agent
            result = await run_environmental_agent(
                query=request.query,
                location=request.location,
                lat=request.lat,
                lon=request.lon,
            )
        else:
            from rag.pipeline import run_rag_query
            result = await run_rag_query(
                query=request.query,
                location=request.location,
            )

        return RagResponse(
            answer=result["answer"],
            sources=result.get("sources", []),
            threat_level=result.get("threat_level"),
            recommendations=result.get("recommendations", []),
            agent_trace=result.get("agent_trace"),
            location=result.get("location"),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("RAG query failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.post("/briefing", response_model=CommunityBriefingResponse)
async def create_community_briefing(request: CommunityBriefingRequest):
    """
    One-shot field briefing for the hackathon demo.
    Combines live/offline environmental data, RAG evidence, risk scoring,
    optional alert generation, and optional translation.
    """
    _check_ready()
    if not (-90 <= request.lat <= 90 and -180 <= request.lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates")

    try:
        from agents.environmental_agent import run_environmental_agent
        from agents.alert_agent import generate_alert, translate_alert
        from rag.pipeline import get_llm_runtime

        agent_result = await run_environmental_agent(
            query=request.situation,
            location=request.location,
            lat=request.lat,
            lon=request.lon,
        )

        alert = None
        translated_alert = None
        if request.include_alert:
            alert_payload = await generate_alert(
                location=request.location,
                lat=request.lat,
                lon=request.lon,
                alert_type=request.alert_type,
                severity=agent_result.get("threat_level", "low"),
                raw_data=agent_result.get("realtime_data", {}),
            )
            alert = alert_payload
            if request.language.lower() != "en":
                alert_text = "\n\n".join(
                    [
                        alert_payload["title"],
                        alert_payload["summary"],
                        alert_payload["detailed_message"],
                        "Immediate actions:",
                        *alert_payload["recommendations"],
                    ]
                )
                translated_alert = (await translate_alert(alert_text, request.language))["translated_alert"]

        trust_notes = [
            "Grounded by retrieved environmental knowledge-base chunks and current sensor/weather readings when available.",
            "Offline fallback readings are labelled when live APIs are unreachable.",
            "Emergency guidance should be verified against official local instructions before field deployment.",
        ]
        runtime = get_llm_runtime()
        return CommunityBriefingResponse(
            location=request.location,
            coordinates={"lat": request.lat, "lon": request.lon},
            situation=request.situation,
            threat_level=agent_result.get("threat_level", "low"),
            executive_summary=agent_result["answer"],
            immediate_actions=agent_result.get("recommendations", []),
            evidence=agent_result.get("sources", []),
            realtime_data=agent_result.get("realtime_data", {}),
            agent_trace=agent_result.get("agent_trace", []),
            alert=alert,
            translated_alert=translated_alert,
            trust_notes=trust_notes,
            model=runtime["model"],
            provider=runtime["provider"],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Community briefing failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Briefing failed: {str(e)}")


@router.get("/search")
async def search_knowledge_base(q: str, k: int = 5):
    """Semantic search over the environmental knowledge base."""
    _check_ready()
    if not q or len(q.strip()) < 3:
        raise HTTPException(status_code=400, detail="Query must be at least 3 characters")
    if k < 1 or k > 20:
        raise HTTPException(status_code=400, detail="k must be between 1 and 20")
    try:
        from rag.vectorstore import get_vectorstore
        vs = get_vectorstore()
        results = vs.similarity_search_with_score(q, k=k)
        return {
            "query": q,
            "results": [
                {
                    "content": doc.page_content,
                    "score": float(score),
                    "source_type": doc.metadata.get("source_type", "Unknown"),
                    "source_file": doc.metadata.get("source_file", "unknown"),
                }
                for doc, score in results
            ],
        }
    except Exception as e:
        logger.error("Search failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
