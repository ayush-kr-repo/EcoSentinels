#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== EcoSentinels RAG Service ==="
echo "Installing Python dependencies..."
pip install -r requirements.txt --quiet --no-cache-dir

echo "Starting FastAPI server on port ${RAG_PORT:-8000}..."
python main.py
