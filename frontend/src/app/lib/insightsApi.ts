export interface InsightsLocationOption {
  id: string;
  label: string;
  location: string;
  lat: number;
  lon: number;
}

export interface InsightsAnalysisResponse {
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  air_quality?: {
    aqi?: number;
    aqi_category?: string;
    readings?: Record<string, { value: number; unit: string }>;
  } | null;
  weather?: {
    temperature_c?: number;
    feels_like_c?: number;
    humidity_pct?: number;
    wind_speed_mph?: number;
    weather_description?: string;
    forecast_3day?: Array<{
      date: string;
      temp_max?: number;
      temp_min?: number;
      precipitation_mm?: number;
      wind_speed_max_mph?: number;
      uv_index_max?: number;
    }>;
  } | null;
  risk_flags: string[];
  overall_severity: 'low' | 'moderate' | 'high' | 'critical';
  summary: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE || '/api/eco').replace(/\/$/, '');

export const INSIGHTS_LOCATIONS: InsightsLocationOption[] = [
  {
    id: 'amazon',
    label: 'Amazon Basin',
    location: 'Amazon Basin',
    lat: -3.4653,
    lon: -62.2159,
  },
  {
    id: 'delhi',
    label: 'Delhi, India',
    location: 'Delhi, India',
    lat: 28.6139,
    lon: 77.209,
  },
  {
    id: 'reef',
    label: 'Great Barrier Reef',
    location: 'Great Barrier Reef',
    lat: -18.2871,
    lon: 147.6992,
  },
  {
    id: 'arctic',
    label: 'Arctic Circle',
    location: 'Arctic Circle',
    lat: 69.6492,
    lon: 18.9553,
  },
];

export async function fetchInsightsAnalysis(
  selectedLocation: InsightsLocationOption,
): Promise<InsightsAnalysisResponse> {
  const response = await fetch(`${API_BASE}/data/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: selectedLocation.location,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      include_air_quality: true,
      include_weather: true,
      detailed: false,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Insights fetch failed with status ${response.status}`);
  }

  return response.json();
}