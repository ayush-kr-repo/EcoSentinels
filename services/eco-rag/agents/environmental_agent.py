"""
EcoSentinels Multi-Agent System
================================
Three specialized agents working together:
1. AnalystAgent - RAG-grounded environmental analysis
2. DataAgent - Real-time environmental data (air quality, weather)
3. AlertAgent - Community alert generation
"""
import logging
import asyncio
import httpx
from config import settings
from rag.vectorstore import get_retriever, format_docs
from rag.pipeline import _generate, generate_recommendations, extract_sources

logger = logging.getLogger(__name__)

OFFLINE_DATA_NOTE = (
    "Offline demo fallback: representative environmental readings are used because "
    "live data could not be reached. Verify with local authorities before acting."
)


def _offline_air_quality(lat: float, lon: float, reason: str) -> dict:
    if 18 <= lat <= 32 and 72 <= lon <= 89:
        aqi = 168
        readings = {
            "PM2.5": {"value": 82.0, "unit": "ug/m3"},
            "PM10": {"value": 161.0, "unit": "ug/m3"},
            "NO2": {"value": 44.0, "unit": "ug/m3"},
            "O3": {"value": 70.0, "unit": "ug/m3"},
        }
    elif 32 <= lat <= 42 and -125 <= lon <= -114:
        aqi = 214
        readings = {
            "PM2.5": {"value": 149.0, "unit": "ug/m3"},
            "PM10": {"value": 210.0, "unit": "ug/m3"},
            "CO": {"value": 760.0, "unit": "ug/m3"},
            "O3": {"value": 63.0, "unit": "ug/m3"},
        }
    else:
        aqi = 118
        readings = {
            "PM2.5": {"value": 36.0, "unit": "ug/m3"},
            "PM10": {"value": 88.0, "unit": "ug/m3"},
            "NO2": {"value": 28.0, "unit": "ug/m3"},
        }
    return {
        "station_name": f"EcoSentinels offline grid ({lat:.3f}, {lon:.3f})",
        "distance_km": 0,
        "readings": readings,
        "aqi": aqi,
        "european_aqi": None,
        "aqi_category": _aqi_category(aqi),
        "coordinates": {"lat": lat, "lon": lon},
        "source": "EcoSentinels offline scenario pack",
        "offline_fallback": True,
        "fallback_reason": reason,
        "trust_note": OFFLINE_DATA_NOTE,
    }


def _offline_weather(lat: float, lon: float, reason: str) -> dict:
    if 18 <= lat <= 32 and 72 <= lon <= 89:
        current = {
            "temperature_c": 38.0,
            "feels_like_c": 43.0,
            "humidity_pct": 54,
            "wind_speed_mph": 9,
            "weather_description": "Extreme heat with stagnant air",
        }
        forecast = [
            {"date": "demo-day-1", "temp_max": 41, "temp_min": 30, "precipitation_mm": 0, "wind_speed_max_mph": 12, "uv_index_max": 10},
            {"date": "demo-day-2", "temp_max": 42, "temp_min": 31, "precipitation_mm": 0, "wind_speed_max_mph": 10, "uv_index_max": 11},
            {"date": "demo-day-3", "temp_max": 40, "temp_min": 30, "precipitation_mm": 2, "wind_speed_max_mph": 14, "uv_index_max": 9},
        ]
    elif 32 <= lat <= 42 and -125 <= lon <= -114:
        current = {
            "temperature_c": 34.0,
            "feels_like_c": 35.0,
            "humidity_pct": 16,
            "wind_speed_mph": 31,
            "weather_description": "Hot, dry and windy",
        }
        forecast = [
            {"date": "demo-day-1", "temp_max": 36, "temp_min": 19, "precipitation_mm": 0, "wind_speed_max_mph": 38, "uv_index_max": 8},
            {"date": "demo-day-2", "temp_max": 37, "temp_min": 18, "precipitation_mm": 0, "wind_speed_max_mph": 42, "uv_index_max": 8},
            {"date": "demo-day-3", "temp_max": 33, "temp_min": 17, "precipitation_mm": 0, "wind_speed_max_mph": 24, "uv_index_max": 7},
        ]
    else:
        current = {
            "temperature_c": 29.0,
            "feels_like_c": 32.0,
            "humidity_pct": 71,
            "wind_speed_mph": 18,
            "weather_description": "Humid with heavy rain risk",
        }
        forecast = [
            {"date": "demo-day-1", "temp_max": 31, "temp_min": 24, "precipitation_mm": 32, "wind_speed_max_mph": 22, "uv_index_max": 6},
            {"date": "demo-day-2", "temp_max": 30, "temp_min": 23, "precipitation_mm": 58, "wind_speed_max_mph": 27, "uv_index_max": 5},
            {"date": "demo-day-3", "temp_max": 29, "temp_min": 23, "precipitation_mm": 18, "wind_speed_max_mph": 16, "uv_index_max": 6},
        ]
    return {
        **current,
        "forecast_3day": forecast,
        "timezone": "offline-demo",
        "offline_fallback": True,
        "fallback_reason": reason,
        "trust_note": OFFLINE_DATA_NOTE,
    }


async def fetch_air_quality(lat: float, lon: float) -> dict:
    """Fetch air quality from Open-Meteo Air Quality API (free, no key required)."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = "https://air-quality-api.open-meteo.com/v1/air-quality"
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": [
                    "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide",
                    "ozone", "sulphur_dioxide", "us_aqi", "european_aqi",
                ],
                "timezone": "auto",
            }
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

            current = data.get("current", {})
            units = data.get("current_units", {})

            us_aqi = current.get("us_aqi")
            aqi_category = _aqi_category(us_aqi) if us_aqi is not None else None

            readings = {}
            pollutant_map = {
                "pm10": "PM10", "pm2_5": "PM2.5", "carbon_monoxide": "CO",
                "nitrogen_dioxide": "NO2", "ozone": "O3", "sulphur_dioxide": "SO2",
            }
            for key, label in pollutant_map.items():
                val = current.get(key)
                if val is not None:
                    readings[label] = {
                        "value": round(val, 2),
                        "unit": units.get(key, "μg/m³"),
                    }

            return {
                "station_name": f"Open-Meteo Grid ({lat:.3f}, {lon:.3f})",
                "distance_km": 0,
                "readings": readings,
                "aqi": us_aqi,
                "european_aqi": current.get("european_aqi"),
                "aqi_category": aqi_category,
                "coordinates": {"lat": lat, "lon": lon},
                "source": "Open-Meteo Air Quality API",
            }
    except Exception as e:
        logger.warning("Air quality fetch failed: %s", e)
        return _offline_air_quality(lat, lon, str(e))


def _aqi_category(aqi: int) -> str:
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    return "Hazardous"


async def fetch_weather(lat: float, lon: float) -> dict:
    """Fetch current weather + forecast from Open-Meteo (free, no key)."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": [
                    "temperature_2m", "relative_humidity_2m", "apparent_temperature",
                    "precipitation", "weather_code", "wind_speed_10m", "wind_direction_10m",
                    "surface_pressure", "visibility",
                ],
                "daily": [
                    "temperature_2m_max", "temperature_2m_min",
                    "precipitation_sum", "wind_speed_10m_max", "uv_index_max",
                ],
                "forecast_days": 3,
                "timezone": "auto",
                "wind_speed_unit": "mph",
                "temperature_unit": "celsius",
            }
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

            current = data.get("current", {})
            daily = data.get("daily", {})

            forecast = []
            for i, date in enumerate(daily.get("time", [])[:3]):
                forecast.append({
                    "date": date,
                    "temp_max": daily.get("temperature_2m_max", [None] * 3)[i],
                    "temp_min": daily.get("temperature_2m_min", [None] * 3)[i],
                    "precipitation_mm": daily.get("precipitation_sum", [None] * 3)[i],
                    "wind_speed_max_mph": daily.get("wind_speed_10m_max", [None] * 3)[i],
                    "uv_index_max": daily.get("uv_index_max", [None] * 3)[i],
                })

            return {
                "temperature_c": current.get("temperature_2m"),
                "feels_like_c": current.get("apparent_temperature"),
                "humidity_pct": current.get("relative_humidity_2m"),
                "wind_speed_mph": current.get("wind_speed_10m"),
                "wind_direction_deg": current.get("wind_direction_10m"),
                "visibility_m": current.get("visibility"),
                "precipitation_mm": current.get("precipitation"),
                "pressure_hpa": current.get("surface_pressure"),
                "weather_code": current.get("weather_code"),
                "weather_description": _decode_weather_code(current.get("weather_code", 0)),
                "forecast_3day": forecast,
                "timezone": data.get("timezone", "UTC"),
            }
    except Exception as e:
        logger.warning("Weather fetch failed: %s", e)
        return _offline_weather(lat, lon, str(e))


def _decode_weather_code(code: int) -> str:
    codes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Foggy", 48: "Depositing rime fog",
        51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
        80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
        85: "Slight snow showers", 86: "Heavy snow showers",
        95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
    }
    return codes.get(code, f"Weather code {code}")


def _assess_environmental_risks(air_data: dict, weather_data: dict) -> list[str]:
    risks = []

    aqi = air_data.get("aqi")
    if aqi is not None:
        if aqi > 300:
            risks.append("CRITICAL: AQI is Hazardous (>300) - immediate health danger for all")
        elif aqi > 200:
            risks.append("HIGH: AQI is Very Unhealthy (>200) - avoid outdoor activity")
        elif aqi > 150:
            risks.append("MODERATE: AQI is Unhealthy (>150) - sensitive groups at risk")
        elif aqi > 100:
            risks.append("LOW: AQI is Unhealthy for Sensitive Groups (>100)")

    temp = weather_data.get("feels_like_c")
    if temp is not None:
        if temp > 40:
            risks.append("CRITICAL: Heat index >40°C (104°F) - extreme heat danger")
        elif temp > 35:
            risks.append("HIGH: Heat index >35°C (95°F) - heat exhaustion risk")
        elif temp > 30:
            risks.append("MODERATE: Heat index >30°C (86°F) - stay hydrated")

    wind = weather_data.get("wind_speed_mph")
    if wind is not None:
        if wind > 45:
            risks.append("HIGH: Wind speed >45mph - extreme wildfire spread risk, red flag conditions")
        elif wind > 25:
            risks.append("MODERATE: Wind speed >25mph - elevated wildfire spread risk")

    for day in weather_data.get("forecast_3day", []):
        precip = day.get("precipitation_mm", 0) or 0
        if precip > 50:
            risks.append(f"HIGH: Heavy rainfall expected ({precip}mm on {day['date']}) - flood risk")
            break
        elif precip > 25:
            risks.append(f"MODERATE: Significant rainfall ({precip}mm on {day['date']}) - monitor water levels")
            break

    for day in weather_data.get("forecast_3day", [])[:1]:
        uv = day.get("uv_index_max", 0) or 0
        if uv >= 11:
            risks.append(f"HIGH: Extreme UV index ({uv}) - minimize sun exposure")
        elif uv >= 8:
            risks.append(f"MODERATE: Very High UV index ({uv}) - sun protection required")

    return risks if risks else ["LOW: No significant environmental risks detected at this time"]


AGENT_SYSTEM_PROMPT = """You are EcoSentinel's lead environmental intelligence agent.

Your job is to create a short, actionable field briefing for responders and community decision-makers.

RULES:
1. Be concise.
2. Use plain language.
3. Keep the total response under 220 words.
4. Focus on immediate action, not long explanation.
5. Use the provided data only.
6. Mention only the most important numbers.

Return these exact sections:

EXECUTIVE SUMMARY:
[2-3 short sentences]

IMMEDIATE ACTIONS:
1. [action]
2. [action]
3. [action]
4. [action]

EVIDENCE:
- [fact]
- [fact]
- [fact]
"""

def _extract_actions_from_answer(answer: str) -> list[str]:
    import re

    actions = []
    in_actions = False

    for raw_line in answer.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line.upper().startswith("IMMEDIATE ACTIONS"):
            in_actions = True
            continue

        if line.upper().startswith("EVIDENCE"):
            break

        if in_actions:
            cleaned = re.sub(r"^\d+[.)]\s*", "", line).strip()
            if cleaned:
                actions.append(cleaned)

    return actions[:4]


async def run_environmental_agent(
    query: str,
    location: str | None = None,
    lat: float | None = None,
    lon: float | None = None,
) -> dict:
    """Full multi-agent pipeline: data collection → RAG retrieval → LLM synthesis."""
    trace = []
    air_data: dict = {}
    weather_data: dict = {}

    if lat is not None and lon is not None:
        trace.append(f"Fetching real-time environmental data for ({lat:.3f}, {lon:.3f})")
        air_data, weather_data = await asyncio.gather(
            fetch_air_quality(lat, lon),
            fetch_weather(lat, lon),
        )
        trace.append(f"Air quality: {air_data.get('aqi_category', 'N/A')} (AQI: {air_data.get('aqi', 'N/A')})")
        trace.append(f"Weather: {weather_data.get('weather_description', 'N/A')}, {weather_data.get('temperature_c', 'N/A')}°C")
    else:
        trace.append("No coordinates provided — operating in knowledge-only mode")

    risks = _assess_environmental_risks(air_data, weather_data)
    trace.append(f"Risk assessment: {len(risks)} risk flag(s) identified")

    trace.append("Querying environmental knowledge base (RAG retrieval)")
    retriever = get_retriever()
    docs = retriever.invoke(query)[:2]
    kb_context = format_docs(docs)[:1800]
    trace.append(f"Retrieved {len(docs)} relevant knowledge chunks")

    realtime_summary = _format_realtime_data(air_data, weather_data, location)
    risk_flags_str = "\n".join(f"• {r}" for r in risks)
    location_ctx = f"Location: {location}" if location else ""

    trace.append("Synthesizing with Gemma environmental intelligence agent")

    user_msg = f"""User Query: {query}

REAL-TIME ENVIRONMENTAL DATA:
{realtime_summary}

RISK FLAGS:
{risk_flags_str}

KNOWLEDGE BASE CONTEXT:
{kb_context}

{location_ctx}

Create a short field briefing for a community decision-maker.
Be concise and action-first.
Do not write a long report."""
    
    answer = _generate(AGENT_SYSTEM_PROMPT, user_msg, temperature=0.1)
    trace.append("Agent synthesis complete")

    recommendations = _extract_actions_from_answer(answer)

    threat_level = "low"
    for risk in risks:
        if risk.startswith("CRITICAL"):
            threat_level = "critical"
            break
        elif risk.startswith("HIGH"):
            threat_level = "high"
        elif risk.startswith("MODERATE") and threat_level != "high":
            threat_level = "moderate"

    return {
        "answer": answer,
        "sources": extract_sources(docs),
        "threat_level": threat_level,
        "recommendations": recommendations,
        "agent_trace": trace,
        "location": location,
        "realtime_data": {
            "air_quality": air_data,
            "weather": weather_data,
            "risks": risks,
        },
    }


def _format_realtime_data(air_data: dict, weather_data: dict, location: str | None) -> str:
    parts = []

    if "error" not in air_data and air_data:
        aq_lines = [
            f"Station: {air_data.get('station_name', 'Unknown')}",
            f"AQI (US): {air_data.get('aqi', 'N/A')} — {air_data.get('aqi_category', 'N/A')}",
            f"European AQI: {air_data.get('european_aqi', 'N/A')}",
        ]
        for pollutant, reading in air_data.get("readings", {}).items():
            aq_lines.append(f"  {pollutant}: {reading['value']} {reading['unit']}")
        parts.append("AIR QUALITY:\n" + "\n".join(aq_lines))
    else:
        parts.append(f"AIR QUALITY: Not available ({air_data.get('error', 'Unknown error')})")

    if "error" not in weather_data and weather_data:
        wt_lines = [
            f"Temperature: {weather_data.get('temperature_c')}°C (feels like {weather_data.get('feels_like_c')}°C)",
            f"Humidity: {weather_data.get('humidity_pct')}%",
            f"Wind: {weather_data.get('wind_speed_mph')} mph",
            f"Conditions: {weather_data.get('weather_description')}",
        ]
        for day in weather_data.get("forecast_3day", []):
            wt_lines.append(
                f"  {day['date']}: {day['temp_min']}–{day['temp_max']}°C, "
                f"Rain: {day['precipitation_mm']}mm, Wind: {day['wind_speed_max_mph']}mph, UV: {day['uv_index_max']}"
            )
        parts.append("WEATHER:\n" + "\n".join(wt_lines))
    else:
        parts.append(f"WEATHER: Not available ({weather_data.get('error', 'Unknown error')})")

    return "\n\n".join(parts)
