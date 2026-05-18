export type ThreatLevel = 'low' | 'moderate' | 'high' | 'critical';

export type AlertType =
  | 'air_quality'
  | 'weather'
  | 'wildfire'
  | 'flood'
  | 'heat_wave'
  | 'general';

export interface BriefingScenario {
  id: string;
  label: string;
  location: string;
  lat: number;
  lon: number;
  situation: string;
  alert_type: AlertType;
  language: string;
}

export interface BriefingSource {
  title: string;
  content: string;
  score: number;
  source_type: string;
}

export interface BriefingAlert {
  alert_id: string;
  title: string;
  summary: string;
  detailed_message: string;
  recommendations: string[];
  threat_level: ThreatLevel;
  affected_populations: string[];
  timestamp: string;
}

export interface CommunityBriefing {
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  situation: string;
  threat_level: ThreatLevel;
  executive_summary: string;
  immediate_actions: string[];
  evidence: BriefingSource[];
  realtime_data: Record<string, unknown>;
  agent_trace: string[];
  alert: BriefingAlert | null;
  translated_alert: string | null;
  trust_notes: string[];
  model: string;
  provider?: string | null;
  timestamp: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const demoScenarios: BriefingScenario[] = [
  {
    id: 'delhi-school',
    label: 'Delhi school air and heat risk',
    location: 'Delhi, India',
    lat: 28.6139,
    lon: 77.209,
    situation:
      'A school principal needs to decide if outdoor classes should continue during a heat and air quality spike.',
    alert_type: 'air_quality',
    language: 'en',
  },
  {
    id: 'california-smoke',
    label: 'Rural clinic wildfire smoke',
    location: 'Northern California foothills',
    lat: 38.5816,
    lon: -121.4944,
    situation:
      'A rural clinic needs guidance for patients during wildfire smoke and high winds.',
    alert_type: 'wildfire',
    language: 'es',
  },
  {
    id: 'flood-volunteers',
    label: 'Flood volunteer briefing',
    location: 'Low-lying river community',
    lat: 10.3157,
    lon: 123.8854,
    situation:
      'Community volunteers need a flood-risk briefing before overnight rainfall.',
    alert_type: 'flood',
    language: 'en',
  },
];

export async function createCommunityBriefing(
  scenario: BriefingScenario,
): Promise<CommunityBriefing> {
  const response = await fetch(`${API_BASE}/rag/briefing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: scenario.location,
      lat: scenario.lat,
      lon: scenario.lon,
      situation: scenario.situation,
      alert_type: scenario.alert_type,
      language: scenario.language,
      include_alert: true, // ✅ fixed: was false, alerts now generated
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Briefing failed with status ${response.status}`);
  }

  return response.json();
}