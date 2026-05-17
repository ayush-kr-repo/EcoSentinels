# EcoSentinels

Environmental intelligence platform for the Gemma 4 Hackathon — RAG-powered, real-time air quality + weather data, multi-agent system, community alert generation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the Express API server (port 8080 → `/api`)
- `cd services/eco-rag && RAG_PORT=6000 python3 main.py` — run the Python RAG service (port 6000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (Node) + FastAPI (Python)
- RAG: LangChain + ChromaDB (ONNX local embeddings) + Gemini 2.5 Flash (via Replit AI Integrations)
- Real-time data: Open-Meteo (weather + air quality) — free, no API key
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `services/eco-rag/` — Python FastAPI RAG service (self-contained)
  - `main.py` — FastAPI app, background vector store init
  - `config.py` — settings (port, model names, paths)
  - `rag/vectorstore.py` — ChromaDB + ONNX embeddings
  - `rag/pipeline.py` — Gemini 2.5 Flash RAG chain via Replit AI proxy
  - `agents/environmental_agent.py` — multi-agent: data fetch + RAG synthesis
  - `agents/alert_agent.py` — community alert generation + parsing
  - `routers/` — FastAPI routers: `/rag`, `/data`, `/alerts`
  - `data/knowledge_base/` — 7 curated environmental knowledge documents (~30k words)
  - `data/chroma_db/` — persisted ChromaDB vector store (78 chunks)
- `artifacts/api-server/` — Express API server, proxies `/api/eco/*` → RAG service
- `lib/api-spec/openapi.yaml` — full OpenAPI spec with all EcoSentinels endpoints

## Architecture decisions

- **Two-service architecture**: Node.js Express (TypeScript ecosystem, proxy, future frontend) + Python FastAPI (AI/ML ecosystem, LangChain, ChromaDB). Express proxies `/api/eco/*` to Python on port 6000.
- **Local ONNX embeddings**: ChromaDB's built-in all-MiniLM-L6-v2 ONNX model for indexing (no network calls, instant startup). Vector store pre-built and persisted.
- **Replit AI Integrations proxy for LLM**: `gemini-2.5-flash` via `AI_INTEGRATIONS_GEMINI_BASE_URL` — no API quota limits. Falls back to direct GOOGLE_API_KEY if proxy unavailable.
- **Open-Meteo for all real-time data**: Free, no API key for both weather and air quality. Switched from OpenAQ (requires paid key) to Open-Meteo Air Quality API.
- **Background vector store init**: FastAPI starts immediately (responds to health checks in <1s), loads vector store in background thread. Search/query endpoints check readiness before serving.

## Product

EcoSentinels provides three core capabilities:

1. **RAG Knowledge Queries** (`POST /rag/query`, mode=`rag`) — Semantic search over 7 curated environmental knowledge bases (IPCC climate, WHO/EPA air quality, disaster response, ecosystems, wildfire, ocean/sea level, environmental health). Answers include sources, threat level, and actionable recommendations.

2. **Agent Mode** (`POST /rag/query`, mode=`agent`) — Real-time environmental intelligence: fetches live air quality + weather for coordinates, synthesizes with RAG knowledge, returns comprehensive situational report with agent trace.

3. **Alert Generation** (`POST /alerts/generate`) — Generates structured community emergency alerts (title, summary, detailed message, immediate actions, affected populations) for wildfire, flood, air quality, heat wave events.

Supporting endpoints:
- `GET /data/air-quality?lat=&lon=` — Real-time PM2.5, PM10, CO, NO2, O3, US AQI from Open-Meteo
- `GET /data/weather?lat=&lon=` — Current weather + 3-day forecast from Open-Meteo
- `POST /data/analyze` — Combined environmental analysis with risk flagging
- `GET /alerts/severity-guide` — Alert severity thresholds reference
- `GET /rag/search?q=&k=` — Pure semantic search over knowledge base
- `GET /health` — Service health + RAG readiness check

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **ONNX model auto-download**: On first startup after clearing ChromaDB, ChromaDB downloads the ONNX embedding model (~79MB). Subsequent startups use cache at `~/.cache/chroma/`. Pre-build the vector store with `python3 -c "from rag.vectorstore import get_vectorstore; get_vectorstore(force_rebuild=True)"`.
- **Replit workflow port detection**: The RAG workflow uses `outputType: console` with no `waitForPort` to avoid Replit's port detection timeout (the service binds port 6000 correctly but the Replit detector fails). The workflow shows as running successfully despite no port in `openPorts`.
- **Gemini 2.5 Flash thinking mode**: The model returns thinking parts before the answer. `_generate()` in `pipeline.py` extracts text from non-thought parts as fallback when `response.text` is empty.
- **OpenAQ requires API key** (v3): Switched to Open-Meteo Air Quality API which is free and requires no key.
- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Python deps at `/home/runner/workspace/.pythonlibs/bin/python3`
- RAG service FastAPI docs: `http://localhost:6000/docs`
