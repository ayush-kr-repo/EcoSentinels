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
  ChevronDown,
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

// ── Language config ──────────────────────────────────────────────────────────
const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',    badge: 'EN', region: 'US' },
  { code: 'es', label: 'Spanish',    badge: 'ES', region: 'ES' },
  { code: 'fr', label: 'French',     badge: 'FR', region: 'FR' },
  { code: 'pt', label: 'Portuguese', badge: 'PT', region: 'BR' },
  { code: 'hi', label: 'Hindi',      badge: 'HI', region: 'IN' },
  { code: 'sw', label: 'Swahili',    badge: 'SW', region: 'KE' },
  { code: 'ar', label: 'Arabic',     badge: 'AR', region: 'SA' },
  { code: 'zh', label: 'Chinese',    badge: 'ZH', region: 'CN' },
  { code: 'bn', label: 'Bengali',    badge: 'BN', region: 'BD' },
];

// Fix: Vite proxy strips /api → localhost:6000, backend has /alerts/translate
const TRANSLATE_BASE = import.meta.env.VITE_API_BASE ?? '/api';

// ── Text helpers ─────────────────────────────────────────────────────────────
function shortText(value: string, max = 620) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}

function cleanGeneratedText(value: string) {
  return value
    .replace(/â€¢/g, '•')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '—')
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

  if (cleaned.length > 1) return cleaned.slice(0, 5);

  if (cleaned.length === 1) {
    const single = cleaned[0];
    const matches = single.match(/(?:\d+\.\s[^]+?)(?=(?:\s\d+\.\s)|$)/g);
    if (matches && matches.length > 1) {
      return matches.map(formatActionItem).filter(Boolean).slice(0, 5);
    }
  }

  return cleaned.slice(0, 5);
}

function inlineDashToBullets(value: string): string[] {
  const cleaned = cleanGeneratedText(value);
  if (cleaned.includes(' - ')) {
    return cleaned
      .split(/ - /)
      .map((s) => s.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);
  }
  return cleaned
    .split(/\n/)
    .map((s) => s.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
}

function formatTimestamp(value?: string) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString();
}

// ── Translation helpers ──────────────────────────────────────────────────────
function buildTranslatableText(briefing: CommunityBriefing): string {
  const parts: string[] = [];

  // Only send the alert summary + immediate actions — avoids the
  // executive_summary which already embeds actions/evidence inline
  // and causes duplication + token bloat that truncates the translation.
  if (briefing.alert?.title) parts.push(briefing.alert.title);
  if (briefing.alert?.summary) parts.push(briefing.alert.summary);

  if (briefing.immediate_actions?.length) {
    parts.push(
      'Immediate Actions:\n' +
        briefing.immediate_actions.map((a, i) => `${i + 1}. ${a}`).join('\n'),
    );
  }

  return parts.join('\n\n');
}

async function callTranslateApi(text: string, language: string): Promise<string> {
  const params = new URLSearchParams({ alert_text: text, language });
  const res = await fetch(`${TRANSLATE_BASE}/alerts/translate?${params.toString()}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Translation failed: ${res.statusText}`);
  const data = await res.json();
  return data.translated_alert ?? '';
}

// ── Language badge component ─────────────────────────────────────────────────
function LangBadge({ badge, active }: { badge: string; active?: boolean }) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        w-8 h-5 rounded text-[10px] font-bold tracking-wider
        flex-shrink-0 font-mono
        ${active
          ? 'bg-primary-container/25 text-primary-container'
          : 'bg-outline-variant/30 text-on-surface-variant'
        }
      `}
    >
      {badge}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CommunityBriefingPanel() {
  const [selected, setSelected] = useState<BriefingScenario>(demoScenarios[0]);
  const [briefing, setBriefing] = useState<CommunityBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const runBriefing = async () => {
    setIsLoading(true);
    setError(null);
    setTranslatedText(null);
    setTranslateError(null);
    setSelectedLang(selected.language || 'en');
    try {
      const result = await createCommunityBriefing(selected);
      setBriefing(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach EcoSentinels backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const runTranslation = async () => {
    if (!briefing || selectedLang === 'en') return;
    setIsTranslating(true);
    setTranslateError(null);
    setTranslatedText(null);
    try {
      const text = buildTranslatableText(briefing);
      const result = await callTranslateApi(text, selectedLang);
      setTranslatedText(result);
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const selectedLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ?? SUPPORTED_LANGUAGES[0];

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
      {/* Header */}
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

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ── Scenario selector ── */}
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
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{scenario.location}</span>
                    </div>
                  </div>
                  <div className="text-xs text-data-mono text-primary-container uppercase flex-shrink-0">
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

          {/* ── Language selector ── */}
          {briefing && (
            <div className="glass rounded-xl p-4 border border-primary-container/30">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-primary-container flex-shrink-0" />
                <div className="text-label-caps text-primary-container">Translate Briefing</div>
              </div>

              {/* Dropdown trigger */}
              <div className="relative mb-3">
                <button
                  onClick={() => setLangDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-surface-container/30 hover:border-primary-container/50 hover:bg-surface-container/50 transition-all text-sm text-on-surface"
                >
                  <div className="flex items-center gap-2">
                    <LangBadge badge={selectedLangMeta.badge} active />
                    <span>{selectedLangMeta.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-on-surface-variant flex-shrink-0 transition-transform duration-200 ${
                      langDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {langDropdownOpen && (
                  <div className="absolute z-30 top-full mt-1 w-full rounded-xl border border-outline-variant/60 bg-[#122131] overflow-hidden shadow-xl">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isActive = lang.code === selectedLang;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLang(lang.code);
                            setLangDropdownOpen(false);
                            setTranslatedText(null);
                            setTranslateError(null);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                            isActive
                              ? 'bg-primary-container/15 text-primary-container'
                              : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                          }`}
                        >
                          <LangBadge badge={lang.badge} active={isActive} />
                          <span className="flex-1">{lang.label}</span>
                          {isActive && (
                            <span className="text-primary-container text-xs flex-shrink-0">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Translate button */}
              <button
                onClick={runTranslation}
                disabled={isTranslating || selectedLang === 'en'}
                className="w-full px-4 py-2.5 bg-primary-container/15 hover:bg-primary-container/25 disabled:opacity-40 disabled:cursor-not-allowed border border-primary-container/40 text-primary-container rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                    <span>Translating…</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {selectedLang === 'en'
                        ? 'Select a language to translate'
                        : `Translate to ${selectedLangMeta.label}`}
                    </span>
                  </>
                )}
              </button>

              {translateError && (
                <div className="mt-2 flex items-start gap-2 text-xs text-error">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{translateError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <div className="space-y-4 min-w-0">
          {error && (
            <div className="glass rounded-xl p-4 border border-error/50 bg-error-container/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
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
              {/* Executive summary */}
              <div className="glass rounded-xl p-5 border border-outline-variant">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <div className="text-label-caps text-on-surface-variant mb-1.5">Threat Level</div>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                          threatStyles[briefing.threat_level]
                        }`}
                      >
                        {briefing.threat_level}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant pt-5">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {briefing.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5 flex-shrink-0" />
                        {formatTimestamp(briefing.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right flex-shrink-0">
                    <div className="text-xs text-on-surface-variant mb-0.5">Model</div>
                    <div className="text-sm text-primary-container font-bold">
                      {briefing.model}
                      {briefing.provider ? ` via ${briefing.provider}` : ''}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-outline-variant/30 pt-4">
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

              {/* Actions + Alert */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5 border border-secondary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                    <h3 className="font-bold text-on-surface text-sm">Immediate Actions</h3>
                  </div>
                  {actionItems.length > 0 ? (
                    <div className="space-y-2.5">
                      {actionItems.map((action, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[11px] font-bold flex-shrink-0">
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
                    <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
                    <h3 className="font-bold text-on-surface text-sm">Generated Alert</h3>
                  </div>
                  {briefing.alert ? (
                    <div className="space-y-2.5">
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
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        Alert disabled in current demo mode
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        This run is focused on the core briefing path for faster and more reliable demo output.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Live translation output ── */}
              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-5 border border-primary-container/40"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-primary-container flex-shrink-0" />
                      <h3 className="font-bold text-on-surface text-sm">
                        {selectedLangMeta.label} Translation
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-primary-container bg-primary-container/15 px-2 py-0.5 rounded tracking-wider uppercase">
                        Gemma 4
                      </span>
                      <LangBadge badge={selectedLangMeta.badge} active />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {splitParagraphs(translatedText).map((paragraph, index) => (
                      <p key={index} className="text-sm text-on-surface-variant leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Legacy translated_alert fallback */}
              {!translatedText && briefing.translated_alert && (
                <div className="glass rounded-xl p-5 border border-primary-container/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Languages className="w-4 h-4 text-primary-container flex-shrink-0" />
                    <h3 className="font-bold text-on-surface text-sm">Translated Community Alert</h3>
                  </div>
                  <div className="space-y-2.5">
                    {splitParagraphs(briefing.translated_alert).map((paragraph, index) => (
                      <p key={index} className="text-sm text-on-surface-variant leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence + Trust Notes */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-5 border border-outline-variant">
                  <div className="text-label-caps text-on-surface-variant mb-3">Evidence</div>
                  <div className="space-y-3">
                    {briefing.evidence.slice(0, 3).map((source, index) => {
                      const bullets = inlineDashToBullets(source.content);
                      return (
                        <div
                          key={`${source.source_type}-${index}`}
                          className="rounded-lg border border-outline-variant/40 bg-surface-container/40 p-3"
                        >
                          <div className="mb-2">
                            <div className="text-sm font-bold text-on-surface leading-snug mb-1.5">
                              {source.title}
                            </div>
                            <span className="inline-block text-[10px] uppercase tracking-wider text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-full">
                              {source.source_type.replaceAll('_', ' ')}
                            </span>
                          </div>
                          <ul className="space-y-1 mt-2">
                            {bullets.slice(0, 4).map((bullet, bi) => (
                              <li
                                key={bi}
                                className="flex gap-2 items-start text-xs text-on-surface-variant leading-relaxed"
                              >
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-on-surface-variant/50 flex-shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                            {bullets.length > 4 && (
                              <li className="text-[11px] text-on-surface-variant/50 pl-3">
                                +{bullets.length - 4} more
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass rounded-xl p-5 border border-outline-variant">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                    <h3 className="font-bold text-on-surface text-sm">Trust Notes</h3>
                  </div>
                  <div className="space-y-2.5">
                    {briefing.trust_notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start rounded-lg border border-outline-variant/40 bg-surface-container/30 px-3 py-2.5"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary/60 flex-shrink-0" />
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