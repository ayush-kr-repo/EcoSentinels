"""
AlertAgent - Generates community-facing emergency alerts.
Produces structured alerts with affected population guidance.
"""
import logging
import uuid
from rag.pipeline import _generate
from rag.vectorstore import get_retriever, format_docs

logger = logging.getLogger(__name__)

ALERT_GENERATION_PROMPT = """You are EcoSentinel's emergency alert system. Generate a clear, actionable community alert.

Alert Type: {alert_type}
Severity: {severity}
Location: {location}
Environmental Data: {raw_data}
Scientific Context: {kb_context}

Generate a structured emergency alert with these exact sections:

TITLE: [Short, urgent title - max 10 words]

SUMMARY: [2-3 sentence summary of the situation and main action needed]

DETAILED MESSAGE: [3-4 paragraphs explaining the threat, what it means for residents, and specific protective actions]

AFFECTED GROUPS: [Comma-separated list of most vulnerable groups]

IMMEDIATE ACTIONS:
1. [First thing to do]
2. [Second thing to do]
3. [Third thing to do]
4. [Fourth thing to do]
5. [Fifth thing to do]

Be direct, clear, and avoid jargon. This alert will be read by community members during an emergency."""

AFFECTED_POPULATIONS_MAP = {
    "air_quality": [
        "People with asthma or COPD",
        "Children under 18",
        "Adults over 65",
        "Pregnant women",
        "Outdoor workers",
        "People with cardiovascular disease",
    ],
    "weather": [
        "Elderly residents",
        "People without air conditioning",
        "Outdoor workers and athletes",
        "People with chronic illness",
        "Homeless individuals",
        "Children",
    ],
    "wildfire": [
        "People with respiratory conditions",
        "Children and elderly",
        "Outdoor workers",
        "Residents in fire evacuation zones",
        "Livestock and pet owners",
        "People on oxygen therapy",
    ],
    "flood": [
        "Residents in low-lying areas",
        "People with mobility limitations",
        "Drivers on flooded roads",
        "Children near waterways",
        "Riverside and coastal communities",
        "People dependent on electricity for medical devices",
    ],
    "heat_wave": [
        "Adults over 65",
        "Infants and young children",
        "Outdoor laborers",
        "People without air conditioning",
        "Athletes training outdoors",
        "People on diuretics or psychiatric medications",
    ],
    "general": [
        "Sensitive individuals",
        "Vulnerable community members",
        "Those with pre-existing health conditions",
    ],
}


def _parse_alert_response(raw: str, alert_type: str, location: str) -> dict:
    """Parse structured alert from LLM output. Handles both inline and multi-line section content."""
    import re

    result = {
        "title": f"Environmental Alert: {location}",
        "summary": "",
        "detailed_message": "",
        "recommendations": [],
        "affected_populations": AFFECTED_POPULATIONS_MAP.get(alert_type, AFFECTED_POPULATIONS_MAP["general"]),
    }

    if not raw.strip():
        return result

    # Extract TITLE
    title_m = re.search(r"(?:^|\n)\*{0,2}TITLE:?\*{0,2}\s*\*{0,2}(.+?)\*{0,2}(?:\n|$)", raw, re.IGNORECASE)
    if title_m:
        result["title"] = title_m.group(1).strip().strip("*")

    # Extract SUMMARY — everything between SUMMARY: and DETAILED MESSAGE:
    summary_m = re.search(
        r"(?:^|\n)\*{0,2}SUMMARY:?\*{0,2}\s*(.*?)(?=\n\*{0,2}DETAILED MESSAGE|\n\*{0,2}AFFECTED GROUPS|\n\*{0,2}IMMEDIATE ACTIONS|$)",
        raw, re.IGNORECASE | re.DOTALL
    )
    if summary_m:
        result["summary"] = summary_m.group(1).strip().strip("*")

    # Extract DETAILED MESSAGE
    detail_m = re.search(
        r"(?:^|\n)\*{0,2}DETAILED MESSAGE:?\*{0,2}\s*(.*?)(?=\n\*{0,2}AFFECTED GROUPS|\n\*{0,2}IMMEDIATE ACTIONS|$)",
        raw, re.IGNORECASE | re.DOTALL
    )
    if detail_m:
        result["detailed_message"] = detail_m.group(1).strip()

    # Extract AFFECTED GROUPS
    groups_m = re.search(
        r"(?:^|\n)\*{0,2}AFFECTED GROUPS:?\*{0,2}\s*(.+?)(?=\n\*{0,2}IMMEDIATE ACTIONS|\n\n|$)",
        raw, re.IGNORECASE | re.DOTALL
    )
    if groups_m:
        groups_text = groups_m.group(1).strip()
        groups = [g.strip().strip("*-• ") for g in re.split(r"[,\n]", groups_text) if g.strip().strip("*-• ")]
        if groups:
            result["affected_populations"] = groups[:8]

    # Extract IMMEDIATE ACTIONS — numbered list
    actions_m = re.search(
        r"(?:^|\n)\*{0,2}IMMEDIATE ACTIONS:?\*{0,2}\s*(.*?)(?=\n\n\n|$)",
        raw, re.IGNORECASE | re.DOTALL
    )
    if actions_m:
        actions_text = actions_m.group(1).strip()
        actions = []
        for line in actions_text.split("\n"):
            cleaned = re.sub(r"^\s*[\d]+[.)]\s*\*{0,2}", "", line).strip().strip("*")
            if cleaned and len(cleaned) > 5:
                actions.append(cleaned)
        if actions:
            result["recommendations"] = actions[:6]

    # Fallbacks
    if not result["summary"] and result["detailed_message"]:
        result["summary"] = result["detailed_message"][:250].rstrip() + "..."
    if not result["summary"] and raw.strip():
        # Use the whole raw text as summary if nothing parsed
        result["summary"] = raw.strip()[:300] + "..."
    if not result["recommendations"]:
        result["recommendations"] = [
            "Evacuate immediately if ordered by authorities",
            "Monitor official emergency broadcasts",
            "Keep windows and doors closed to reduce smoke exposure",
            "Check on vulnerable neighbors and family members",
        ]

    return result


async def generate_alert(
    location: str,
    lat: float,
    lon: float,
    alert_type: str,
    severity: str,
    raw_data: dict,
) -> dict:
    retriever = get_retriever()
    query = f"{alert_type.replace('_', ' ')} emergency response {severity} severity"
    docs = retriever.invoke(query)
    kb_context = format_docs(docs)

    data_str = "\n".join(f"{k}: {v}" for k, v in raw_data.items()) if raw_data else "No additional data provided"

    user_msg = ALERT_GENERATION_PROMPT.format(
        alert_type=alert_type.replace("_", " ").title(),
        severity=severity.upper(),
        location=location,
        raw_data=data_str,
        kb_context=kb_context[:1500],
    )

    raw_alert = _generate("You are an emergency alert system for environmental hazards.", user_msg, temperature=0.2)
    parsed = _parse_alert_response(raw_alert, alert_type, location)

    return {
        "alert_id": str(uuid.uuid4())[:8].upper(),
        "title": parsed["title"],
        "summary": parsed["summary"],
        "detailed_message": parsed["detailed_message"],
        "recommendations": parsed["recommendations"],
        "threat_level": severity,
        "affected_populations": parsed["affected_populations"],
    }


async def translate_alert(alert_text: str, language: str) -> dict:
    """Translate an emergency alert while preserving numbers and urgency."""
    supported = {"es", "fr", "pt", "hi", "sw", "ar", "zh", "bn", "en"}
    language = language.lower()
    if language not in supported:
        raise ValueError(f"Language '{language}' not supported. Supported: {', '.join(sorted(supported))}")
    if language == "en":
        return {"language": language, "translated_alert": alert_text}

    language_names = {
        "es": "Spanish",
        "fr": "French",
        "pt": "Portuguese",
        "hi": "Hindi",
        "sw": "Swahili",
        "ar": "Arabic",
        "zh": "Chinese (Simplified)",
        "bn": "Bengali",
    }
    lang_name = language_names.get(language, language)
    prompt = (
        f"Translate this emergency alert to {lang_name}. Keep the same structure "
        f"and urgency. Preserve all numbers and measurements.\n\n"
        f"Alert:\n{alert_text}\n\nTranslated alert:"
    )
    translated = _generate("You are an expert emergency alert translator.", prompt, temperature=0.05)
    return {"language": language, "translated_alert": translated}
