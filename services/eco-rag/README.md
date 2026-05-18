---
title: EcoSentinels Backend
emoji: 🌍
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# EcoSentinels Backend

FastAPI backend for EcoSentinels, packaged for a Hugging Face Docker Space.

## Required Space secrets

- `GOOGLE_API_KEY`

## Optional Space variables

- `GEMMA_MODEL=gemma-4-26b-a4b-it`
- `LOG_LEVEL=info`
- `LLM_TIMEOUT_SECONDS=90`

## Main endpoints

- `/health`
- `/docs`
- `/data/analyze`
- `/rag/briefing`
- `/rag/query`
