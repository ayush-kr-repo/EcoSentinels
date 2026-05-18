import logging
from google import genai
from google.genai import types
from config import settings
from rag.vectorstore import get_retriever, format_docs
from models.schemas import Source

logger = logging.getLogger(__name__)

DEFAULT_GOOGLE_GEMMA_MODEL = "gemma-4-26b-a4b-it"
OLLAMA_TO_GOOGLE_MODEL_ALIASES = {
    "gemma4": DEFAULT_GOOGLE_GEMMA_MODEL,
    "gemma4:latest": DEFAULT_GOOGLE_GEMMA_MODEL,
    "gemma-4": DEFAULT_GOOGLE_GEMMA_MODEL,
    "gemma-4:latest": DEFAULT_GOOGLE_GEMMA_MODEL,
    "gemma4-latest": DEFAULT_GOOGLE_GEMMA_MODEL,
}


def _resolve_google_model_name(model_name: str | None) -> str:
    raw_model = (model_name or "").strip()
    if not raw_model:
        return DEFAULT_GOOGLE_GEMMA_MODEL

    normalized = raw_model.lower()
    if normalized in OLLAMA_TO_GOOGLE_MODEL_ALIASES:
        resolved = OLLAMA_TO_GOOGLE_MODEL_ALIASES[normalized]
        logger.info("Mapped local model alias '%s' to hosted model '%s'.", raw_model, resolved)
        return resolved

    return raw_model


def get_llm_runtime() -> dict:
    resolved_model = _resolve_google_model_name(settings.gemma_model)
    return {
        "provider": "google-ai-studio",
        "model": resolved_model,
    }


RAG_SYSTEM_PROMPT = """You are EcoSentinel, an advanced environmental AI assistant.
Your mission is to provide accurate, grounded, actionable environmental intelligence.

You have access to authoritative environmental knowledge covering:
- climate science and projections
- air quality standards and health effects
- disaster response protocols
- ecosystem science and biodiversity
- environmental health guidance

RULES:
1. Base your answer strictly on the provided context.
2. Do not hallucinate facts.
3. Keep answers concise and practical.
4. Prioritize immediate safety guidance when relevant.
5. Use plain language for community responders.
6. If the context is insufficient, say so clearly.

CONTEXT FROM KNOWLEDGE BASE:
{context}

{location_context}"""


THREAT_ASSESSMENT_PROMPT = """Determine the threat level from the query and context.

Query: {query}
Context summary: {context}

Respond with ONLY one of these formats:
LOW: [reason]
MODERATE: [reason]
HIGH: [reason]
CRITICAL: [reason]"""


RECOMMENDATIONS_PROMPT = """Based on this environmental query and the expert answer, generate exactly 3-5 specific actions.

Query: {query}
Expert Answer: {answer}
Location: {location}

Return only a numbered list of practical actions.
Keep each action short and specific."""


_GENAI_CLIENT = genai.Client(api_key=settings.google_api_key) if settings.google_api_key else None


def _get_genai_client() -> tuple["genai.Client", str]:
    """Return the Google AI Studio client and configured model name."""
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is missing.")

    if _GENAI_CLIENT is None:
        raise RuntimeError("Google AI Studio client could not be initialized.")

    model_name = _resolve_google_model_name(settings.gemma_model)
    logger.debug("Using Google AI Studio with model %s", model_name)
    return _GENAI_CLIENT, model_name


def _extract_response_text(response) -> str:
    if getattr(response, "text", None):
        return response.text

    try:
        parts = []
        for candidate in getattr(response, "candidates", []) or []:
            content = getattr(candidate, "content", None)
            if not content:
                continue
            for part in getattr(content, "parts", []) or []:
                is_thought = getattr(part, "thought", False)
                text = getattr(part, "text", None)
                if text and not is_thought:
                    parts.append(text)
        return "".join(parts).strip()
    except Exception as e:
        logger.warning("Failed to extract text from response parts: %s", e)
        return ""


def _generate(
    system_prompt: str,
    user_message: str,
    temperature: float = 0.1,
    max_output_tokens: int = 1024,
) -> str:
    """Call Gemma through Google AI Studio."""
    client, model = _get_genai_client()

    response = client.models.generate_content(
        model=model,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=temperature,
            max_output_tokens=max_output_tokens,
            top_p=0.95,
        ),
    )

    return _extract_response_text(response)


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
        result = _generate(
            "You are a threat assessment specialist.",
            prompt,
            temperature=0.0,
            max_output_tokens=128,
        )
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
            query=query,
            answer=answer,
            location=location or "your area",
        )
        result = _generate(
            "You are an environmental safety advisor.",
            prompt,
            temperature=0.2,
            max_output_tokens=256,
        )
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

    docs = retriever.invoke(query)[:3]
    context_str = format_docs(docs)[:2200]
    sources = extract_sources(docs)

    system = RAG_SYSTEM_PROMPT.format(
        context=context_str,
        location_context=location_context,
    )
    user_msg = f"""Question: {query}

Provide a concise, practical answer based on the environmental knowledge above.
Keep the response under 200 words.
If this involves immediate health or safety risks, clearly state what should be done first."""

    answer = _generate(
        system,
        user_msg,
        temperature=0.1,
        max_output_tokens=768,
    )
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
            return _generate(system, user, temperature=self.temp, max_output_tokens=1024)

    return _SimpleLLM(temperature)