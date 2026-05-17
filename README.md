# 🌍 EcoSentinels

EcoSentinels is an environmental intelligence MVP built for the **Kaggle Gemma 4 Good Hackathon**.

It combines:

- 🌎 A cinematic multi-page frontend for ecological risk monitoring
- 🧠 A Python RAG backend over curated environmental knowledge
- 🌦️ Live weather and air-quality enrichment
- 🤖 Gemma-powered community-response briefings
- 🚨 Environmental threat synthesis and emergency guidance

The goal is simple:

> Turn raw environmental signals into actionable field guidance.

---

# ✨ Core Idea

EcoSentinels helps answer:

- What is happening?
- Where is the risk?
- How severe is it?
- What should responders, schools, clinics, or communities do right now?

---

# 🛰️ Main Product Areas

## 📊 Dashboard

High-level planetary monitoring overview and mission framing.

## 🗺️ Risk Map

Visual ecological hotspot monitoring and regional summaries.

## 📈 Insights

Forecasts and predictive ecosystem intelligence.

## 🧭 Eco-Intel

The primary AI workflow.

Users select a real-world environmental scenario and generate a:

- Threat briefing
- Environmental analysis
- Immediate response recommendations
- Trust-grounded evidence summary

powered by:

- Gemma
- RAG retrieval
- Environmental APIs
- Local inference

---

# 🔥 Main Live Workflow

The strongest backend-integrated feature is:

```text
Eco-Intel → Run Briefing
```

This workflow:

1. Sends a scenario to the backend
2. Fetches environmental context
3. Retrieves supporting RAG evidence
4. Synthesizes a response using Gemma
5. Returns:
   - Threat level
   - Executive summary
   - Immediate actions
   - Supporting evidence
   - Trust notes
   - Model/provider details

---

# 🏗️ Architecture

```text
Frontend (React/Vite)
        ↓
Express Gateway API
        ↓
FastAPI RAG Backend
        ↓
Environmental Agents + ChromaDB
        ↓
Gemma via Ollama
```

---

# 🧠 Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- Framer Motion
- Lucide Icons

## Backend

- FastAPI
- ChromaDB
- LangChain
- sentence-transformers
- Environmental retrieval pipeline

## AI Runtime

- Ollama
- Gemma models
- Local RAG synthesis

---

# 📁 Project Structure

```text
frontend/                  React + Vite frontend
artifacts/api-server/      Express gateway / proxy layer
services/eco-rag/          FastAPI RAG + agent backend
docs/                      Architecture and submission support docs
```

---

# ✅ Current Product State

## Fully Functional

- Multi-page UI with cinematic visual identity
- Backend health endpoint
- RAG-backed briefing generation
- Evidence + trust notes in responses
- Working scenario-based AI briefing flow
- Local Gemma inference via Ollama

## Demo-Oriented / MVP Areas

- Some dashboard metrics are presentation-oriented
- Risk Map is lightweight rather than a full GIS platform
- Certain pages are storytelling-oriented for demo clarity

This is intentional for MVP/demo purposes.

---

# ⚙️ Setup

---

# 1️⃣ Install Ollama

Download and install:

https://ollama.com/download

Then pull a Gemma model:

## Recommended for development

```bash
ollama pull gemma3:4b
```

## Larger final-demo model

```bash
ollama pull gemma4
```

---

# 2️⃣ Backend Environment

Create:

```text
services/eco-rag/.env
```

Add:

```env
GEMMA_MODEL=gemma3:4b
RAG_PORT=6000
LOG_LEVEL=info
LLM_TIMEOUT_SECONDS=90
```

---

# 3️⃣ Python Environment

Use Python 3.11 for best compatibility.

From:

```text
services/eco-rag
```

Create virtual environment:

```bash
py -3.11 -m venv venv
```

Activate environment:

## Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install ollama
```

---

# 4️⃣ Frontend Environment

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE=http://localhost:6000
```

---

# 5️⃣ Frontend Dependencies

From:

```text
frontend/
```

Run:

```bash
pnpm install
```

or:

```bash
npm install
```

---

# 🚀 Running Locally

Use **3 terminals**.

---

## 🟦 Terminal 1 — Express Gateway

```bash
cd artifacts/api-server
pnpm run dev
```

Expected port:

```text
http://localhost:8080
```

---

## 🟩 Terminal 2 — FastAPI RAG Backend

```bash
cd services/eco-rag
.\venv\Scripts\Activate.ps1
python main.py
```

Expected port:

```text
http://localhost:6000
```

---

## 🟪 Terminal 3 — Frontend

```bash
cd frontend
pnpm dev
```

Expected port:

```text
http://localhost:5173
```

---

# 🌐 Local URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| FastAPI Backend | http://localhost:6000 |
| Backend Docs | http://localhost:6000/docs |
| Express Gateway | http://localhost:8080 |

---

# ❤️ Health Check

Backend is healthy when:

```text
http://localhost:6000/health
```

returns:

```json
{
  "status": "healthy",
  "rag_ready": true
}
```

---

# 🎯 Main Demo Flow

For the strongest demo:

1. Open:

```text
http://localhost:5173
```

2. Navigate to:

```text
Eco-Intel
```

3. Select a scenario

4. Click:

```text
Run Briefing
```

5. Show:
   - Threat level
   - Executive summary
   - Immediate actions
   - Evidence
   - Trust notes
   - Model/provider details

This is the hero workflow of the project.

---

# 🧪 Recommended Demo Strategy

For reliable live demos:

- Use English output first
- Use smaller Gemma models during development
- Verify `/health` before presenting
- Verify one successful briefing before recording

---

# ⏱️ Notes About Latency

The briefing flow can be slower than simple query endpoints because it may involve:

- Live environmental API fetches
- RAG retrieval
- Summarization/generation
- Alert generation
- Translation

For smoother demos:

- Prefer `gemma3:4b`
- Use smaller retrieval depth
- Use English responses during presentations

---

# 🎤 What To Emphasize In A Demo

## Dashboard

Shows mission framing and ecological monitoring identity.

## Risk Map

Shows where issues are emerging.

## Insights

Shows trend and forecast intelligence.

## Eco-Intel

Shows actionable AI briefing generation.

---

# 💡 In One Sentence

> EcoSentinels turns environmental signals and scientific knowledge into actionable field briefings for communities under climate stress.

---

# ⚠️ Known Caveats

- Some pages are more concept-forward than backend-heavy
- Some hotspot views are static/semi-static by design
- Eco-Intel is the primary backend-integrated feature
- Model runtime must be configured correctly

---

# 🔮 Future Improvements

- Richer globe hotspot interaction
- Better markdown-to-UI formatting
- Stronger source provenance display
- Faster multi-step briefing generation
- Region-level drill-down reports
- Deployment workflows and persistence

---

# 🏁 Hackathon Note

Built as a hackathon MVP for the **Kaggle Gemma 4 Good Hackathon**.