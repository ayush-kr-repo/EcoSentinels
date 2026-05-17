import logging
from rag.vectorstore import get_retriever, format_docs
from models.schemas import Source
from config import settings
from ollama import chat

logger = logging.getLogger(__name__)


def get_llm_runtime() -> dict:
    return {
        "provider": "ollama",
        "model": settings.gemma_model or "gemma4",
    }


RAG_SYSTEM_PROMPT = """You are EcoSentinel, an advanced environmental AI assistant.

Your mission is to provide accurate, grounded environmental intelligence using only the provided context.

RULES:
1. Base your answer strictly on the provided context.
2. Keep answers concise and practical.
3. Prioritize immediate safety guidance when relevant.
4. Do not produce long reports unless explicitly asked.
5. Use plain language for community responders.

CONTEXT FROM KNOWLEDGE BASE:
{context}

{location_context}"""


def _generate(system_prompt: str, user_message: str, temperature: float = 0.1) -> str:
    """Generate response using local Gemma via Ollama."""

    response = chat(
        model=settings.gemma_model or "gemma4",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
        options={
            "temperature": temperature,
            "num_predict": 320,
            "num_ctx": 4096,
        },
    )

    return response["message"]["content"]


def extract_sources(docs) -> list[Source]:
    sources = []
    for doc in docs:
        sources.append(
            Source(
                title=doc.metadata.get("source_type", "Environmental Research"),
                content=doc.page_content[:300] + "..." if len(doc.page_content) > 300 else doc.page_content,
                score=doc.metadata.get("relevance_score", 0.8),
                source_type=doc.metadata.get("source_file", "knowledge_base"),
            )
        )
    return sources


def assess_threat_level(query: str, context: str) -> str:
    try:
        prompt = THREAT_ASSESSMENT_PROMPT.format(query=query, context=context[:500])
        result = _generate("You are a threat assessment specialist.", prompt, temperature=0.0)
        result = result.strip().upper()
        if "CRITICAL" in result:
            return "critical"
        if "HIGH" in result:
            return "high"
        if "MODERATE" in result:
            return "moderate"
        return "low"
    except Exception as e:
        logger.warning("Threat assessment failed: %s", e)
        return "low"


def generate_recommendations(query: str, answer: str, location: str | None) -> list[str]:
    try:
        prompt = RECOMMENDATIONS_PROMPT.format(
            query=query, answer=answer, location=location or "your area"
        )
        result = _generate("You are an environmental safety advisor.", prompt, temperature=0.2)
        lines = [l.strip() for l in result.strip().split("\n") if l.strip()]
        recs = []
        for line in lines:
            cleaned = line.lstrip("0123456789.-) ").strip()
            if cleaned and len(cleaned) > 10:
                recs.append(cleaned)
        return recs[:5]
    except Exception as e:
        logger.warning("Recommendations generation failed: %s", e)
        return []


async def run_rag_query(
    query: str,
    location: str | None = None,
    generate_recs: bool = True,
) -> dict:
    retriever = get_retriever()
    location_context = f"Location context: {location}" if location else ""

    docs = retriever.invoke(query)
    context_str = format_docs(docs)
    sources = extract_sources(docs)

    system = RAG_SYSTEM_PROMPT.format(
        context=context_str,
        location_context=location_context,
    )
    user_msg = f"""Question: {query}

Provide a comprehensive, accurate answer based on the environmental knowledge above.
If this involves immediate health or safety risks, clearly state what action should be taken first."""

    answer = _generate(system, user_msg)
    threat_level = assess_threat_level(query, context_str)

    recommendations = []
    if generate_recs:
        recommendations = generate_recommendations(query, answer, location)

    return {
        "answer": answer,
        "sources": sources,
        "threat_level": threat_level,
        "recommendations": recommendations,
        "location": location,
    }


def get_llm_for_agent(temperature: float = 0.15):
    """Return a small callable wrapper for agent code."""

    class _SimpleLLM:
        def __init__(self, temp):
            self.temp = temp

        def invoke_text(self, system: str, user: str) -> str:
            return _generate(system, user, temperature=self.temp)

    return _SimpleLLM(temperature)