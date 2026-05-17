# Architecture

EcoSentinels uses a two-service backend:

- `artifacts/api-server`: TypeScript Express gateway at `/api`.
- `services/eco-rag`: Python FastAPI AI service with RAG, agents, live data fetchers, and alert generation.

## Core Flow

1. A client calls `/api/eco/rag/briefing` with coordinates, a human situation, alert type, and language.
2. The Python agent fetches air-quality and weather readings from Open-Meteo.
3. If live APIs fail, deterministic offline readings are used and clearly labelled in the response.
4. Chroma retrieves relevant environmental knowledge chunks.
5. Gemma 4 synthesizes a community briefing with risk level, evidence, and actions.
6. If requested, Gemma 4 generates a public alert and translates it while preserving urgency, numbers, and measurements.

## Gemma 4 Usage

The target runtime is local-first Gemma 4 through an Ollama-compatible endpoint:

- `GEMMA_PROVIDER=ollama`
- `GEMMA_MODEL=gemma4:e4b` for edge-friendly demos, or a larger Gemma 4 variant for cloud demos.
- `OLLAMA_BASE_URL=http://localhost:11434`

Hosted fallback is intentionally marked as development-only. Health responses expose the active model and provider so judges can verify model provenance.

## Trust And Safety

EcoSentinels is designed for high-stakes environmental guidance, so each briefing includes:

- Retrieved evidence snippets from the local knowledge base.
- Explicit real-time data values or labelled offline fallback values.
- Risk flags and severity.
- Immediate protective actions.
- Trust notes that instruct users to verify emergency instructions with local authorities.

## Offline Resilience

The fallback scenario pack makes the app demonstrable without internet access and useful in edge deployments:

- South Asia heat and air pollution.
- California wildfire smoke and wind.
- Heavy rainfall and flood risk for other regions.

Fallback data is never hidden; the response includes `offline_fallback`, `fallback_reason`, and a trust note.

