from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field


ThreatLevel = Literal["low", "moderate", "high", "critical"]
QueryMode = Literal["rag", "agent", "alert"]
AlertType = Literal["air_quality", "weather", "wildfire", "flood", "heat_wave", "general"]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class HealthStatus(BaseModel):
    status: str
    rag_ready: bool = False
    vector_store_docs: int = 0
    model: str
    provider: str | None = None
    timestamp: str = Field(default_factory=utc_now_iso)


class Source(BaseModel):
    title: str
    content: str
    score: float = 0.0
    source_type: str


class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    location: str | None = None
    lat: float | None = None
    lon: float | None = None
    mode: QueryMode = "rag"
    language: str = "en"


class RagResponse(BaseModel):
    answer: str
    sources: list[Source] = Field(default_factory=list)
    threat_level: ThreatLevel | None = None
    recommendations: list[str] = Field(default_factory=list)
    agent_trace: list[str] | None = None
    location: str | None = None
    timestamp: str = Field(default_factory=utc_now_iso)


class EnvironmentalData(BaseModel):
    station_name: str
    distance_km: float = 0
    readings: dict[str, Any] = Field(default_factory=dict)
    aqi: int | None = None
    aqi_category: str | None = None


class AnalysisRequest(BaseModel):
    location: str
    lat: float
    lon: float
    include_air_quality: bool = True
    include_weather: bool = True
    detailed: bool = False


class AnalysisResponse(BaseModel):
    location: str
    coordinates: dict[str, float]
    air_quality: dict[str, Any] | None = None
    weather: dict[str, Any] | None = None
    risk_flags: list[str]
    overall_severity: ThreatLevel
    summary: str
    timestamp: str = Field(default_factory=utc_now_iso)


class AlertRequest(BaseModel):
    location: str
    lat: float
    lon: float
    alert_type: AlertType
    severity: ThreatLevel
    raw_data: dict[str, Any] = Field(default_factory=dict)


class AlertResponse(BaseModel):
    alert_id: str
    title: str
    summary: str
    detailed_message: str
    recommendations: list[str]
    threat_level: ThreatLevel
    affected_populations: list[str]
    timestamp: str = Field(default_factory=utc_now_iso)


class CommunityBriefingRequest(BaseModel):
    location: str
    lat: float
    lon: float
    situation: str = Field(
        default="Assess local environmental health risks and prepare community guidance.",
        max_length=2000,
    )
    alert_type: AlertType = "general"
    language: str = "en"
    include_alert: bool = True


class CommunityBriefingResponse(BaseModel):
    location: str
    coordinates: dict[str, float]
    situation: str
    threat_level: ThreatLevel
    executive_summary: str
    immediate_actions: list[str]
    evidence: list[Source] = Field(default_factory=list)
    realtime_data: dict[str, Any] = Field(default_factory=dict)
    agent_trace: list[str] = Field(default_factory=list)
    alert: AlertResponse | None = None
    translated_alert: str | None = None
    trust_notes: list[str] = Field(default_factory=list)
    model: str
    provider: str | None = None
    timestamp: str = Field(default_factory=utc_now_iso)
