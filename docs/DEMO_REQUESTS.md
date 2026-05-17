# Demo Requests

## Delhi School Heat And Air Quality

```bash
curl -X POST http://localhost:8080/api/eco/rag/briefing \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Delhi, India",
    "lat": 28.6139,
    "lon": 77.2090,
    "situation": "A school principal needs to decide if outdoor classes should continue during a heat and air quality spike.",
    "alert_type": "air_quality",
    "language": "hi",
    "include_alert": true
  }'
```

## California Wildfire Smoke

```bash
curl -X POST http://localhost:8080/api/eco/rag/briefing \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Northern California foothills",
    "lat": 38.5816,
    "lon": -121.4944,
    "situation": "A rural clinic needs guidance for patients during wildfire smoke and high winds.",
    "alert_type": "wildfire",
    "language": "es",
    "include_alert": true
  }'
```

## Flood Preparedness

```bash
curl -X POST http://localhost:8080/api/eco/rag/briefing \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Low-lying river community",
    "lat": 10.3157,
    "lon": 123.8854,
    "situation": "Community volunteers need a flood-risk briefing before overnight rainfall.",
    "alert_type": "flood",
    "language": "en",
    "include_alert": true
  }'
```

