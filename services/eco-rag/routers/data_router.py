import logging
from fastapi import APIRouter, HTTPException
from models.schemas import EnvironmentalData, AnalysisRequest
from agents.environmental_agent import (
    fetch_air_quality,
    fetch_weather,
    _assess_environmental_risks,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/data", tags=["environmental-data"])


@router.get("/air-quality")
async def get_air_quality(lat: float, lon: float):
    """
    Fetch real-time air quality data from Open-Meteo.
    Returns PM2.5, PM10, NO2, O3, and calculated AQI.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    data = await fetch_air_quality(lat, lon)
    if "error" in data:
        raise HTTPException(status_code=503, detail=data["error"])
    return data


@router.get("/weather")
async def get_weather(lat: float, lon: float):
    """
    Fetch current weather conditions and 3-day forecast from Open-Meteo.
    Free, no API key required.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    data = await fetch_weather(lat, lon)
    if "error" in data:
        raise HTTPException(status_code=503, detail=data["error"])
    return data


@router.post("/analyze")
async def analyze_location(request: AnalysisRequest):
    """
    Comprehensive environmental analysis for a location.
    Combines air quality, weather, and risk assessment.
    """
    if not (-90 <= request.lat <= 90 and -180 <= request.lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid coordinates")

    import asyncio

    tasks = []
    if request.include_air_quality:
        tasks.append(fetch_air_quality(request.lat, request.lon))
    if request.include_weather:
        tasks.append(fetch_weather(request.lat, request.lon))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    air_data = {}
    weather_data = {}
    idx = 0
    if request.include_air_quality:
        air_data = results[idx] if not isinstance(results[idx], Exception) else {"error": str(results[idx])}
        idx += 1
    if request.include_weather:
        weather_data = results[idx] if not isinstance(results[idx], Exception) else {"error": str(results[idx])}

    risks = _assess_environmental_risks(air_data, weather_data)

    overall_severity = "low"
    for risk in risks:
        if risk.startswith("CRITICAL"):
            overall_severity = "critical"
            break
        elif risk.startswith("HIGH"):
            overall_severity = "high"
        elif risk.startswith("MODERATE") and overall_severity not in ("high", "critical"):
            overall_severity = "moderate"

    return {
        "location": request.location,
        "coordinates": {"lat": request.lat, "lon": request.lon},
        "air_quality": air_data if request.include_air_quality else None,
        "weather": weather_data if request.include_weather else None,
        "risk_flags": risks,
        "overall_severity": overall_severity,
        "summary": _generate_quick_summary(air_data, weather_data, overall_severity),
    }


def _generate_quick_summary(air_data: dict, weather_data: dict, severity: str) -> str:
    parts = []
    aqi = air_data.get("aqi")
    aqi_cat = air_data.get("aqi_category")
    if aqi:
        parts.append(f"Air quality is {aqi_cat} (AQI {aqi})")

    temp = weather_data.get("temperature_c")
    desc = weather_data.get("weather_description")
    if temp is not None:
        parts.append(f"{temp}°C with {desc}" if desc else f"{temp}°C")

    wind = weather_data.get("wind_speed_mph")
    if wind and wind > 20:
        parts.append(f"winds at {wind}mph")

    if not parts:
        return f"Environmental conditions: {severity} severity"

    summary = ". ".join(parts) + f". Overall risk: {severity.upper()}."
    return summary
