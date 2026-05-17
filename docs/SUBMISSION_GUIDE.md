# Kaggle Submission Guide

## Track

Recommended track: Global Resilience.

Secondary framing: Safety & Trust, because the MVP emphasizes grounded evidence, severity labels, and transparent fallback behavior.

## Writeup Structure

Target length: under 1,500 words.

1. Title: EcoSentinels: Local-First Environmental Intelligence for Communities at Risk
2. Subtitle: Gemma 4 turns live and offline environmental data into grounded community action.
3. Problem: communities face heat, smoke, floods, and air pollution, often with poor connectivity and limited expert access.
4. Solution: one briefing endpoint produces risk level, evidence, recommended actions, public alert, and translation.
5. Architecture: Express gateway, FastAPI AI service, Chroma RAG, Open-Meteo data, offline fallback pack, local Gemma 4 runtime.
6. Gemma 4 usage: local-first generation for synthesis, alert writing, translation, and RAG-grounded reasoning.
7. Technical choices: local model for privacy/connectivity, RAG for grounded outputs, labelled fallback data for resilience, OpenAPI for reproducibility.
8. Challenges: schema/runtime fixes, live-data failures, avoiding hallucinated emergency guidance, preserving numbers during translation.
9. Impact: schools, clinics, disaster volunteers, and local governments can produce actionable guidance quickly.
10. Demo: Delhi school heat/air-quality scenario with Hindi alert; California wildfire smoke scenario; flood-risk scenario.

## Three-Minute Video

0:00-0:25 Problem story: a school or clinic must decide what to do during dangerous air and heat conditions.
0:25-0:55 Show the input: location, coordinates, situation, language.
0:55-1:45 Show the output: threat level, live/offline data, evidence, immediate actions.
1:45-2:25 Show generated community alert and translated alert.
2:25-2:50 Explain architecture: local Gemma 4, RAG, environmental APIs, offline fallback.
2:50-3:00 Close with impact: usable where connectivity and expert access are limited.

## Required Attachments

- Kaggle writeup: final report under 1,500 words.
- Public video: YouTube link, 3 minutes or less, no login required.
- Public code repository: GitHub or Kaggle Notebook.
- Live demo: public URL or downloadable demo files.
- Media gallery: cover image plus screenshots/video.

## Repository Checklist

- Show `README.md`, `docs/ARCHITECTURE.md`, and this guide.
- Include `.env.example` before publishing.
- Include a sample request and response.
- Document how to run local Gemma 4.
- Make sure generated files and source files are committed consistently.

## Live Demo Checklist

- Health endpoint shows model and provider.
- `/api/eco/rag/briefing` works with one strong scenario.
- Response labels offline fallback if live APIs are unavailable.
- No private keys are required for the public demo.

