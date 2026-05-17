import logging
from fastapi import APIRouter, HTTPException
from models.schemas import AlertRequest, AlertResponse
from agents.alert_agent import generate_alert, translate_alert

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/generate", response_model=AlertResponse)
async def create_alert(request: AlertRequest):
    """Generate a community-facing emergency alert. Returns structured alert with key recommendations."""
    try:
        result = await generate_alert(
            location=request.location,
            lat=request.lat,
            lon=request.lon,
            alert_type=request.alert_type,
            severity=request.severity,
            raw_data=request.raw_data,
        )
        return AlertResponse(**result)
    except Exception as e:
        logger.error("Alert generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Alert generation failed: {str(e)}")


@router.post("/translate")
async def translate_alert_endpoint(alert_text: str, language: str):
    """Translate an alert into a target language. Supports: es, fr, pt, hi, sw, ar, zh, bn"""
    try:
        return await translate_alert(alert_text, language)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Translation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/severity-guide")
async def get_severity_guide():
    """Return the alert severity guide and threshold table."""
    return {
        "levels": {
            "low": {
                "description": "Minimal environmental risk",
                "color": "#22c55e",
                "action": "Monitor conditions, no immediate action required",
                "thresholds": {"aqi": "0-50", "heat_index_c": "<30", "wind_mph": "<15"},
            },
            "moderate": {
                "description": "Elevated risk for sensitive groups",
                "color": "#f59e0b",
                "action": "Sensitive populations take precautions",
                "thresholds": {"aqi": "51-100", "heat_index_c": "30-35", "wind_mph": "15-25"},
            },
            "high": {
                "description": "Significant risk for general population",
                "color": "#ef4444",
                "action": "Most people should take protective action",
                "thresholds": {"aqi": "101-200", "heat_index_c": "35-40", "wind_mph": "25-45"},
            },
            "critical": {
                "description": "Immediate danger — emergency conditions",
                "color": "#7c3aed",
                "action": "Emergency action required immediately",
                "thresholds": {"aqi": ">200", "heat_index_c": ">40", "wind_mph": ">45"},
            },
        }
    }
