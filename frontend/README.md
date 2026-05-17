# EcoSentinels Frontend

Vite/React frontend for the EcoSentinels MVP.

## Run Locally

Start the backend services first:

```bash
pnpm --filter @workspace/api-server run dev
cd services/eco-rag && RAG_PORT=6000 python3 main.py
```

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` to the
Express gateway on `http://localhost:8080`.

## Connected Flow

Open the `Eco-Intel` navigation item and run a `Gemma 4 Field Briefing`.
The panel calls:

```text
POST /api/eco/rag/briefing
```

It renders the backend response: threat level, model/provider, generated alert,
translated alert, RAG evidence, immediate actions, and trust notes.
