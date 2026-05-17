import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Languages,
  Loader2,
  MapPin,
  Radio,
  ShieldCheck,
  FileText,
  Clock3,
} from 'lucide-react';
import {
  CommunityBriefing,
  BriefingScenario,
  createCommunityBriefing,
  demoScenarios,
} from '../lib/ecosentinelsApi';

const threatStyles = {
  low: 'border-secondary/40 text-secondary bg-secondary/10',
  moderate: 'border-tertiary-container/40 text-tertiary-container bg-tertiary/10',
  high: 'border-error/40 text-error bg-error-container/10',
  critical: 'border-error/60 text-error bg-error-container/20 glow-red',
};

function shortText(value: string, max = 620) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

function cleanGeneratedText(value: string) {
  return value
    .replace(/â€¢/g, '•')
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    .replace(/Â°C/g, '°C')
    .replace(/Â°F/g, '°F')
    .replace(/Î¼g\/mÂ³/g, 'μg/m³')
    .replace(/Â/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitParagraphs(value: string) {
  return cleanGeneratedText(value)
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatActionItem(value: string) {
  return cleanGeneratedText(value)
    .replace(/^\d+\.\s*/, '')
    .replace(/^[-•]\s*/, '')
    .trim();
}

function extractActionItems(actions: string[]) {
  const cleaned = actions
    .map(formatActionItem)
    .filter(Boolean)
    .filter((item) => !/^okay, here/i.test(item));

  if (cleaned.length > 1) {
    return cleaned.slice(0, 5);
  }

  if (cleaned.length === 1) {
    const single = cleaned[0];
    const matches = single.match(/(?:\d+\.\s[^]+?)(?=(?:\s\d+\.\s)|$)/g);
    if (matches && matches.length > 1) {
      return matches.map(formatActionItem).filter(Boolean).slice(0, 5);
    }
  }

  return cleaned.slice(0, 5);
}

function formatTimestamp(value?: string) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString();
}

export default function CommunityBriefingPanel() {
  const [selected, setSelected] = useState<BriefingScenario>(demoScenarios[0]);
  const [briefing, setBriefing] = useState<CommunityBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBriefing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createCommunityBriefing(selected);
      setBriefing(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach EcoSentinels backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const summaryParagraphs = useMemo(
    () => (briefing ? splitParagraphs(briefing.executive_summary).slice(0, 3) : []),
    [briefing],
  );

  const actionItems = useMemo(
    () => (briefing ? extractActionItems(briefing.immediate_actions) : []),
    [briefing],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 border border-primary-container/25 glow-cyan"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <div className="text-label-caps text-primary-container mb-2">Gemma 4 Field Briefing</div>
          <h2 className="text-headline-md text-on-surface">Community Response Console</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            Runs the EcoSentinels backend briefing pipeline: local-first Gemma synthesis,
            environmental data, RAG evidence, public alert generation, and translation.
          </p>
        </div>

        <button
          onClick={runBriefing}
          disabled={isLoading}
          className="px-5 py-3 bg-primary-container/20 hover:bg-primary-container/30 disabled:opacity-60 border border-primary-container/50 text-primary-container rounded-lg transition-all text-sm font-medium uppercase tracking-wider flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
          <span>{isLoading ? 'Running' : 'Run Briefing'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-3">
          {demoScenarios.map((scenario) => {
            const active = scenario.id === selected.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelected(scenario)}
                className={`w-full text-left rounded-xl p-4 border transition-all ${
                  active
                    ? 'glass-strong border-primary-container/60'
                    : 'glass border-outline-variant hover:border-primary-container/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-on-surface">{scenario.label}</div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{scenario.location}</span>
                    </div>
                  </div>
                  <div className="text-xs text-data-mono text-primary-container uppercase">
                    {scenario.language}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="glass rounded-xl p-4 border border-outline-variant">
            <div className="text-label-caps text-on-surface-variant mb-2">Selected Situation</div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{selected.situation}</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="glass rounded-xl p-4 border border-error/50 bg-error-container/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                <div>
                  <div className="font-bold text-error mb-1">Briefing request failed</div>
                  <p className="text-sm text-on-surface-variant">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!briefing && !error && (
            <div className="glass rounded-xl p-6 border border-outline-variant min-h-[280px] flex items-center justify-center text-center">
              <div>
                <Activity className="w-10 h-10 text-primary-container mx-auto mb-4" />
                <h3 className="text-headline-md text-on-surface mb-2">Ready for live backend data</h3>
                <p className="text-sm text-on-surface-variant max-w-md">
                  Choose a scenario and run a field briefing to show the full Gemma 4 MVP flow.
                </p>
              </div>
            </div>
          )}

          {briefing && (
            <>
              <div className="glass rounded-xl p-5 border border-outline-variant">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-label-caps text-on-surface-variant mb-1">Threat Level</div>
                      <div
                        className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${threatStyles[briefing.threat_level]}`}
                      >
                        {briefing.threat_level}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{briefing.location}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Clock3 className="w-3.5 h-3.5" />
                        <span>{formatTimestamp(briefing.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-on-surface-variant">Model</div>
                    <div className="text-sm text-primary-container font-bold">
                      {briefing.model}
                      {briefing.provider ? ` via ${briefing.provider}` : ''}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {summaryParagraphs.length > 0 ? (
                    summaryParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`leading-relaxed ${
                          index === 0
                            ? 'text-base text-on-surface font-medium'
                            : 'text-sm text-on-surface-variant'
                        }`}
                      >
                        {shortText(paragraph, index === 0 ? 420 : 520)}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {shortText(cleanGeneratedText(briefing.executive_summary))}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5 border border-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <h3 className="font-bold text-on-surface">Immediate Actions</h3>
                  </div>

                  {actionItems.length > 0 ? (
                    <div className="space-y-3">
                      {actionItems.map((action, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-on-surface-variant leading-relaxed">{action}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant">No action items were returned.</p>
                  )}
                </div>

                <div className="glass rounded-xl p-5 border border-error/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-error" />
                    <h3 className="font-bold text-on-surface">Generated Alert</h3>
                  </div>

                  {briefing.alert ? (
                    <div className="space-y-3">
                      <div className="text-sm font-bold text-on-surface">
                        {cleanGeneratedText(briefing.alert.title)}
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {cleanGeneratedText(briefing.alert.summary)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-on-surface-variant">
                        <FileText className="w-3.5 h-3.5" />
                        Alert disabled in current demo mode
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        This run is focused on the core briefing path for faster and more reliable demo output.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {briefing.translated_alert && (
                <div className="glass rounded-xl p-5 border border-primary-container/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="w-5 h-5 text-primary-container" />
                    <h3 className="font-bold text-on-surface">Translated Community Alert</h3>
                  </div>
                  <div className="space-y-3">
                    {splitParagraphs(briefing.translated_alert).map((paragraph, index) => (
                      <p key={index} className="text-sm text-on-surface-variant leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5 border border-outline-variant">
                  <div className="text-label-caps text-on-surface-variant mb-3">Evidence</div>
                  <div className="space-y-3">
                    {briefing.evidence.slice(0, 3).map((source, index) => (
                      <div
                        key={`${source.source_type}-${index}`}
                        className="rounded-lg border border-outline-variant/40 bg-surface-container/40 p-3"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="text-sm font-bold text-on-surface">{source.title}</div>
                          <div className="text-[11px] uppercase tracking-wider text-primary-container bg-primary-container/10 px-2 py-1 rounded-full flex-shrink-0">
                            {source.source_type.replaceAll('_', ' ')}
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {shortText(cleanGeneratedText(source.content), 200)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-5 border border-outline-variant">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <h3 className="font-bold text-on-surface">Trust Notes</h3>
                  </div>
                  <div className="space-y-3">
                    {briefing.trust_notes.map((note, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-outline-variant/40 bg-surface-container/30 px-3 py-3"
                      >
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {cleanGeneratedText(note)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}