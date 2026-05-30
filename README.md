<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a2e1a,50:1a5c2e,100:0d3320&height=200&section=header&text=🌍%20EcoSentinels&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Environmental%20Intelligence%20Platform&descAlignY=58&descSize=20&descColor=4ade80&animation=fadeIn" />

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&pause=1000&color=4ADE80&center=true&vCenter=true&width=650&lines=Real-time+Ecosystem+Risk+Monitoring;Biodiversity+Forecasting+%7C+RAG+%7C+Gemma+4;Multi-Agent+AI+%7C+10+REST+Endpoints;Built+for+Kaggle+Gemma+4+Good+Hackathon" alt="Typing SVG" />
</a>

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://eco-sentinels-frontend.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Gemma](https://img.shields.io/badge/Gemma_4-26B-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

> **AI-powered environmental intelligence platform** — real-time ecosystem risk monitoring, biodiversity forecasting, and community alert generation powered by Gemma 4 + RAG.

> ⚡ **Backend note:** The AI backend runs locally via Cloudflare Tunnel. If unreachable, the frontend automatically falls back to offline scenario data — demos never break.

</div>

---

## 💡 What Problem Does It Solve?

EcoSentinels bridges the gap between raw environmental sensor data and **actionable field intelligence**. It answers:

- 🔴 **What is happening?** — Live AQI, temperature, precipitation, wind anomalies
- 📍 **Where is the risk?** — Geospatial hotspot mapping across critical global regions
- ⚠️ **How severe is it?** — AI-classified severity: `low → moderate → high → critical`
- 🚨 **What should communities do right now?** — Gemma 4-generated field briefings and emergency alerts in multiple languages

---

## 📸 Screenshots

### 📊 Dashboard — Neural Modeling Score
![Dashboard](docs/images/dashboard.png)
*3D Earth globe with live ecosystem fragility overlays and early warning clusters*

### 🗺️ Risk Map — Live Planetary Feed
![Risk Map](docs/images/risk_map.png)
*Hotspot filtering across 6 global regions with fragility index and deforestation rate cards*

### 📈 Insights — Predictive Intelligence
![Insights](docs/images/Insights_Delhi.png)
*6-month biodiversity trend powered by live AQI + weather data — dynamically colored by severity*

### 🧭 Eco-Intel — AI Field Briefing
![Eco-Intel Response](docs/images/ecointel_response.png)
*Gemma 4 community briefing: threat level, executive summary, immediate actions, evidence, trust notes*

### 🌐 Multi-Language Translation
![French Translation](docs/images/translation_french.png)
*Live French alert output — field briefings translated into 8 languages via Gemma 4*

---

## 🖥️ Product Pages

> All pages accessible via the EcoSentinels side navigation panel — hover-expand with full mobile support.

<details open>
<summary><b>📊 Dashboard — Neural Modeling Score</b></summary>
<br/>

- Interactive **3D Earth globe** with live ecosystem fragility overlays
- **Biodiversity Drift Timeline** (2017–2026) showing accelerating species loss
- **Early Warning Cluster** — real-time alerts for microbiome collapse, hydraulic stress, and reforestation activity
- System stats: 12,840 active monitoring stations · 2.1M species indexed · 99.8% AI confidence
- **Scan Upload** and **Protocols** modals for field responders

</details>

<details>
<summary><b>🗺️ Risk Map — Live Planetary Feed</b></summary>
<br/>

- Interactive 3D globe with **Hotspot / At-Risk / Stable** filter modes
- Region cards: fragility index, temperature anomaly, precipitation trends, deforestation rate, soil moisture
- 6 monitored regions: Amazon Basin · Arctic Circle · Great Barrier Reef · Congo Rainforest · Scandinavian Forest Belt · New Zealand Alpine Zone

</details>

<details>
<summary><b>📈 Insights — Predictive Intelligence</b></summary>
<br/>

- **6-Month Biodiversity Trend** chart — dynamically colored by live severity
- **Fragility Index** and **Ecosystem Resilience** scores from real AQI + temperature data
- **Live Risk Signals** — AI-flagged environmental alerts with severity tagging
- **Live Monitoring Snapshot** — real-time weather and AQI per location

</details>

<details>
<summary><b>🧭 Eco-Intel — AI Field Briefings (Hero Workflow)</b></summary>
<br/>

- **Community Briefing Panel** — the primary AI workflow powered by Gemma 4 + RAG
- **Active Hotspots** — AI-detected crisis zones (Amazon, Great Barrier Reef, Himalayan Glacier)
- Generates: threat level · executive summary · immediate actions · supporting evidence · trust notes · model details
- **Multi-language translation** (ES, FR, PT, HI, SW, AR, ZH, BN) via `/alerts/translate`

</details>

---

## 🧠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data visualizations |
| Lucide Icons | Icon system |
| Vercel | Deployment |

### Backend
| Tech | Purpose |
|------|---------|
| FastAPI (Python) | REST API server |
| ChromaDB | Vector store — 78 chunks across 7 knowledge docs |
| LangChain | RAG orchestration |
| sentence-transformers | ONNX local embeddings |
| Gemma 4 (26B-A4B) | LLM via Google AI |
| Open-Meteo | Free real-time air quality + weather API |
| httpx | Async HTTP client |
| Pydantic v2 | Schema validation |

---

## 🏗️ Architecture

```
Browser (Vercel)
      │
      ▼
React Frontend
      │  VITE_API_BASE (direct)
      ▼
FastAPI RAG Backend (port 6000)
      │
      ├── /data/*    ── Open-Meteo Air Quality + Weather APIs
      ├── /rag/*     ── ChromaDB Vector Store + Gemma 4 LLM
      └── /alerts/*  ── Alert Generation + Translation Agent
```

### Multi-Agent System

Three specialized agents work in concert:

| Agent | Role |
|-------|------|
| **DataAgent** | Fetches live AQI (PM2.5, PM10, NO2, O3) + weather (temp, wind, precipitation, UV, 3-day forecast) from Open-Meteo |
| **AnalystAgent** | RAG retrieval over 7 curated environmental knowledge bases, synthesized by Gemma 4 |
| **AlertAgent** | Structured community emergency alert generation with multi-language translation |

> If live APIs are unreachable, the system falls back to representative offline scenario data with clear trust notes.

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Service health + RAG readiness |
| `GET` | `/data/air-quality?lat=&lon=` | Live AQI, PM2.5, PM10, NO2, O3 |
| `GET` | `/data/weather?lat=&lon=` | Current weather + 3-day forecast |
| `POST` | `/data/analyze` | Full environmental analysis + risk flags |
| `POST` | `/rag/query` | RAG knowledge query (`rag` or `agent` mode) |
| `POST` | `/rag/briefing` | Full community field briefing generation |
| `GET` | `/rag/search?q=` | Semantic search over knowledge base |
| `POST` | `/alerts/generate` | AI emergency alert generation |
| `POST` | `/alerts/translate?alert_text=&language=` | Translate alert title, summary, and actions |
| `GET` | `/alerts/severity-guide` | Severity thresholds reference |

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- pnpm

### 1. Clone the repo
```bash
git clone https://github.com/ayush-kr-repo/EcoSentinels.git
cd EcoSentinels
```

### 2. Backend setup
```bash
cd services/eco-rag

# Create virtual environment
py -3.11 -m venv venv

# Activate — Windows PowerShell
.\venv\Scripts\Activate.ps1
# Activate — Mac/Linux
source venv/bin/activate

# Install dependencies
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Create `services/eco-rag/.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
GEMMA_MODEL=gemma-4-26b-a4b-it
RAG_PORT=6000
LOG_LEVEL=info
LLM_TIMEOUT_SECONDS=90
```

### 3. Frontend setup
```bash
cd frontend
pnpm install
```

Create `frontend/.env`:
```env
VITE_API_BASE=http://localhost:6000
```

### 4. Run locally (2 terminals)

**Terminal 1 — FastAPI backend:**
```bash
cd services/eco-rag
.\venv\Scripts\Activate.ps1
python main.py
# → http://localhost:6000
# → API docs: http://localhost:6000/docs
```

**Terminal 2 — Frontend:**
```bash
cd frontend
pnpm dev
# → http://localhost:5173
```

### Health check
```bash
curl http://localhost:6000/health
# {"status": "healthy", "rag_ready": true}
```

> ⏱️ On first startup, ChromaDB downloads the ONNX embedding model (~79MB). RAG becomes ready in ~30 seconds — `/health` reports `rag_ready: false` until then.

---

## 🌍 Monitored Locations

| Location | Coordinates | Key Risk |
|----------|-------------|----------|
| Amazon Basin | -3.47°N, -62.22°E | Deforestation, AQI, heat |
| Delhi, India | 28.61°N, 77.21°E | Hazardous AQI, extreme heat |
| Great Barrier Reef | -18.29°N, 147.70°E | Ocean temp, coral bleaching |
| Arctic Circle | 69.65°N, 18.96°E | Glacial melt, permafrost loss |

---

## 📁 Project Structure

```
EcoSentinels/
├── frontend/                         # React + Vite frontend (Vercel)
│   ├── src/
│   │   ├── app/components/
│   │   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── RiskMapPage.tsx
│   │   │   ├── InsightsPage.tsx
│   │   │   ├── EcoIntelligencePage.tsx
│   │   │   ├── CommunityBriefingPanel.tsx
│   │   │   ├── Realistic3DEarth.tsx
│   │   │   └── Navigation.tsx
│   │   └── lib/
│   │       ├── insightsApi.ts        # Insights page API client
│   │       └── ecosentinelsApi.ts    # Community briefing API client
│   └── package.json
├── services/eco-rag/                 # FastAPI RAG + agent backend
│   ├── main.py                       # FastAPI entry point + lifespan
│   ├── routers/
│   │   ├── rag_router.py             # /rag/* endpoints
│   │   ├── data_router.py            # /data/* endpoints
│   │   └── alert_router.py           # /alerts/* endpoints
│   ├── agents/
│   │   ├── environmental_agent.py    # DataAgent + AnalystAgent
│   │   └── alert_agent.py            # AlertAgent + translation
│   ├── rag/
│   │   ├── pipeline.py               # Gemma 4 RAG chain
│   │   └── vectorstore.py            # ChromaDB + ONNX embeddings
│   └── data/
│       ├── knowledge_base/           # 7 curated environmental docs
│       └── chroma_db/                # Persisted vector store (78 chunks)
├── docs/                             # Architecture + submission docs
├── .env.example
└── README.md
```

---

## 🌐 Multi-Language Alert Translation

Field briefings can be translated into 8 languages directly from the UI — designed for on-the-ground community responders.

### How it works

1. User runs a field briefing for a scenario (e.g. Delhi — Hazardous AQI)
2. Briefing generated by Gemma 4 via `/rag/briefing`
3. User selects a target language from the dropdown
4. Frontend extracts **alert title**, **alert summary**, and **immediate actions**
5. Focused payload sent to `POST /alerts/translate?alert_text=&language=`
6. Gemma 4 translates and returns — rendered in a dedicated translation card

### Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| ES | Spanish | AR | Arabic |
| FR | French | ZH | Chinese |
| PT | Portuguese | BN | Bengali |
| HI | Hindi | SW | Swahili |

---

## 📐 Scientific & Mathematical Architecture

EcoSentinels translates multi-variate environmental data streams into actionable field directives using four core mathematical frameworks.

---

### 1. Ecological Fragility Index

To evaluate how close a monitored ecosystem is to an irreversible threshold, ecological drift is mapped against a sigmoidal tipping function:

$$F = \frac{1}{1 + e^{-k(V - V_0)}} \times 100$$

| Variable | Meaning |
|----------|---------|
| $V$ | Raw Drift Variance of the current ecosystem vector |
| $V_0$ | Baseline tipping inflection point for that biome |
| $k$ | Scaling factor governing transition curve sharpness |

The sigmoid shape is ecologically motivated: ecosystems resist change up to a threshold, then collapse rapidly — the same S-curve that governs population dynamics and phase transitions. A fragility score approaching 100 indicates proximity to irreversible systemic collapse.

---

### 2. Multi-Variate Ecological Distance (Mahalanobis)

Raw environmental readings are correlated — heat covaries with low humidity, AQI spikes follow wind pattern shifts. Standard Euclidean distance treats each variable independently and produces misleading drift estimates. EcoSentinels uses the Mahalanobis distance to account for inter-variable covariance:

$$D_M(\vec{x}) = \sqrt{(\vec{x} - \vec{\mu})^T \Sigma^{-1} (\vec{x} - \vec{\mu})}$$

| Variable | Meaning |
|----------|---------|
| $\vec{x}$ | Live reading vector: $(T_a, \text{AQI}, \text{PM}_{2.5}, \text{Humidity})$ |
| $\vec{\mu}$ | Historical seasonal baseline means for those coordinates |
| $\Sigma^{-1}$ | Inverse covariance matrix of the environmental indicators |

A large $D_M$ indicates the current environmental state is statistically anomalous relative to historical norms — a key signal for early warning triggering.

---

### 3. Critical Slowing Down — AR(1) Trend Model

As an ecosystem's resilience degrades, its recovery rate from perturbations slows. The 6-Month Biodiversity Trend Engine detects this via a first-order autoregressive model:

$$x_{t+1} = \alpha \cdot x_t + \epsilon_t$$

| Variable | Meaning |
|----------|---------|
| $x_t$ | Ecological indicator anomaly at time $t$ |
| $\alpha$ | Lag-1 autocorrelation coefficient |
| $\epsilon_t$ | White-noise background variation |

When a system approaches a tipping point, $\alpha \to 1$ — the system "remembers" disturbances for longer rather than recovering quickly. This phenomenon, known as **Critical Slowing Down (CSD)**, is a mathematically grounded early-warning signal. A rising $\alpha$ in the biodiversity trend window triggers escalating severity classification in the Insights page.

---

### 4. RAG Directive Verification — Cosine Similarity

To ensure Gemma 4's field briefings are grounded in verified environmental regulations and protocols (not hallucinated), the RAG pipeline scores retrieved knowledge chunks by angular proximity to the incoming query:

$$\text{Similarity}(\vec{q}, \vec{d}_i) = \frac{\vec{q} \cdot \vec{d}_i}{\|\vec{q}\| \cdot \|\vec{d}_i\|} = \frac{\sum_{j=1}^{n} q_j d_{ij}}{\sqrt{\sum_{j=1}^{n} q_j^2} \cdot \sqrt{\sum_{j=1}^{n} d_{ij}^2}}$$

Only chunks with similarity above a threshold are passed to Gemma 4 as context — grounding every immediate action recommendation in locally compliant Air Quality Guidelines, environmental law, and regional emergency protocols. Trust notes in the briefing output explicitly cite which knowledge sources contributed.

---

## 🔮 Future Improvements

- Permanent cloud backend deployment (Render / Railway)
- Richer globe hotspot interaction with drill-down reports
- Stronger source provenance and citation display in briefings
- Faster multi-step briefing generation
- Mobile-optimized layouts
- Full-page translation across all sections
- User-defined custom monitoring locations

---

## 👥 Team

| Member | Role |
|--------|------|
| **Ayush Kumar** | Team Lead · Backend Architecture · RAG Pipeline · Deployment |
| **Debopriya Bose** | UI/UX Design · Frontend Implementation |
| **Durlabh Biswas** | Ideation · Writeup · Video |
| **Parthiv Dutta** | Script · Video Editing |
| **Ansh Jairaj** | Script · Writeup |

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<div align="center">

*Built for the [Kaggle Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good) · [Live Demo](https://eco-sentinels-frontend.vercel.app)*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d3320,50:1a5c2e,100:0a2e1a&height=120&section=footer" />

</div>
