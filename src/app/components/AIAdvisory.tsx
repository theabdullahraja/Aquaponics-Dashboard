import { useEffect, useRef, useState } from 'react';
import { Sparkles, RefreshCw, RotateCcw, AlertOctagon, AlertTriangle, Info, CheckCircle2, Send, Bot, ShieldCheck, Loader2, Cpu } from 'lucide-react';
import { runAnalysis, askAdvisor, callsToday, COOLDOWN_MS, DAILY_CAP, type AdvisorResult, type Finding, type ChatMessage, type Severity } from '../../lib/advisor';

// Status is always conveyed by an icon AND a text label (not colour alone).
// Colours are tuned for the light "report paper" theme of this page.
const SEV: Record<Severity, { label: string; Icon: typeof Info; color: string; tint: string }> = {
  critical: { label: 'CRITICAL', Icon: AlertOctagon, color: '#ff6b81', tint: '#ff6b8122' },
  warning: { label: 'WARNING', Icon: AlertTriangle, color: '#fbbf24', tint: '#fbbf2420' },
  info: { label: 'NOTICE', Icon: Info, color: '#7cc4ff', tint: '#7cc4ff20' },
  ok: { label: 'PASSED', Icon: CheckCircle2, color: '#7ddba3', tint: '#7ddba320' },
};
const ORDER: Record<Severity, number> = { critical: 0, warning: 1, info: 2, ok: 3 };
const STATUS_TEXT = { healthy: 'Healthy', attention: 'Needs attention', critical: 'Critical' } as const;
const STATUS_COLOR = { healthy: '#7ddba3', attention: '#fbbf24', critical: '#ff6b81' } as const;

function Spark({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 120},${30 - ((v - min) / span) * 24 - 3}`).join(' ');
  return (
    <svg viewBox="0 0 120 32" width="120" height="32" className="hidden shrink-0 sm:block" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} />
    </svg>
  );
}

function ScoreRing({ score, status }: { score: number; status: AdvisorResult['status'] }) {
  const color = STATUS_COLOR[status];
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`Health score ${score} out of 100`}>
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#3a2d22" strokeWidth="9" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-semibold text-foreground">{score}</span>
        <span className="text-[10px] tracking-widest text-muted-foreground">OUT OF 100</span>
      </div>
    </div>
  );
}

function FindingRow({ f }: { f: Finding }) {
  const s = SEV[f.severity];
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border-subtle bg-card p-4 shadow-sm" style={{ borderLeft: `4px solid ${s.color}` }}>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: s.tint, color: s.color }}>
        <s.Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider" style={{ color: s.color }}>{s.label}</span>
          <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground/80">rule: {f.rule}</p>
      </div>
      {f.spark && <Spark data={f.spark} color={s.color} />}
    </div>
  );
}

/** Minimal markdown: **bold** only, so replies don't show raw asterisks. */
function Rich({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}</>;
}

const SUGGESTED = ['Why is my pH reading so low?', 'What should I do first?', 'I just cleaned the probe. What now?'];

export function AIAdvisory() {
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextAt, setNextAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState(callsToday());
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs, typing]);

  const wait = Math.max(0, Math.ceil((nextAt - now) / 1000));

  async function run() {
    if (loading || wait > 0) return;
    setLoading(true); setError(null);
    try {
      const r = await runAnalysis();
      setResult(r);
      setNextAt(Date.now() + COOLDOWN_MS);
    } catch (e: any) { setError(String(e?.message ?? e)); }
    finally { setLoading(false); setUsed(callsToday()); }
  }

  function reset() {
    if (loading || typing) return;
    setResult(null); setError(null); setMsgs([]); setInput(''); setNextAt(0);
  }

  async function send(text: string) {
    const t = text.trim();
    if (!t || typing) return;
    const next = [...msgs, { role: 'user' as const, content: t }];
    setMsgs(next); setInput(''); setTyping(true);
    try {
      const reply = await askAdvisor(next);
      setMsgs([...next, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMsgs([...next, { role: 'assistant', content: `Sorry, the advisor could not answer: ${String(e?.message ?? e)}` }]);
    } finally { setTyping(false); setUsed(callsToday()); }
  }

  const findings = result ? [...result.findings].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]) : [];
  const issues = findings.filter((f) => f.severity !== 'ok');
  const oks = findings.filter((f) => f.severity === 'ok');
  const nCrit = findings.filter((f) => f.severity === 'critical').length;
  const nWarn = findings.filter((f) => f.severity === 'warning').length;
  const ago = result ? Math.max(0, Math.round((now - new Date(result.analysedAt).getTime()) / 1000)) : 0;
  const stamp = result ? new Date(result.analysedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';

  return (
    <div className="theme-advisor space-y-6 rounded-3xl p-4 lg:p-7">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-aqua-blue"><Sparkles className="h-3.5 w-3.5" /> Diagnostic report</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold text-foreground">AI Advisory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anomaly detection on the latest {result?.windowSize ?? 200} readings, explained by Haiku 5.5{result ? ` · analysed ${ago}s ago` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(result || msgs.length > 0 || error) && (
            <button onClick={reset} disabled={loading || typing} className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-dark disabled:opacity-50">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          )}
          <button onClick={run} disabled={loading || wait > 0} className="inline-flex items-center gap-2 rounded-xl bg-aqua-blue px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {loading ? 'Analysing…' : wait > 0 ? `Run again in ${wait}s` : result ? 'Run analysis again' : 'Run analysis'}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border p-4 text-sm" style={{ borderColor: '#ff6b8155', backgroundColor: '#ff6b8118', color: '#ff8fa0' }}>
          <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Verdict */}
      {result && (
        <section className="grid items-center gap-6 rounded-2xl border border-border-subtle bg-card p-6 shadow-sm md:grid-cols-[auto_1fr]">
          <ScoreRing score={result.score} status={result.status} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-bold tracking-wide text-[#1a0f06]" style={{ backgroundColor: STATUS_COLOR[result.status] }}>{STATUS_TEXT[result.status].toUpperCase()}</span>
              <span className="text-xs text-muted-foreground">{stamp} · {nCrit} critical · {nWarn} warning · {oks.length} passed</span>
            </div>
            <p className="mt-3 font-serif text-lg leading-relaxed text-foreground">
              {result.analysis?.summary ?? 'AI explanation unavailable. The rule-based findings below are still valid.'}
            </p>
            {result.analysisError && <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#fbbf24' }}><AlertTriangle className="h-3.5 w-3.5" /> {result.analysisError}</p>}
            {result.usage && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-surface-dark px-2 py-1 font-mono text-[11px] text-muted-foreground">
                <Cpu className="h-3 w-3" /> Haiku 5.5 · {result.usage.input} in / {result.usage.output} out tokens
              </p>
            )}
          </div>
        </section>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        {/* Left: findings + actions */}
        <div className="min-w-0 space-y-7">
          {!result && !loading && (
            <div className="rounded-2xl border border-dashed border-border-subtle bg-card/60 p-10 text-center">
              <Bot className="mx-auto h-10 w-10 text-aqua-blue" />
              <p className="mt-3 font-serif text-xl text-foreground">No report yet</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Press <b>Run analysis</b>. Rule-based checks run on the stored readings first, then Haiku 5.5 explains what they mean and what to do. Nothing is sent until you press the button.
              </p>
            </div>
          )}

          {issues.length > 0 && (
            <section>
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">Needs attention <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">{issues.length}</span></h3>
              <div className="space-y-3">{issues.map((f) => <FindingRow key={f.id} f={f} />)}</div>
            </section>
          )}

          {result?.analysis && result.analysis.actions.length > 0 && (
            <section>
              <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">What to do, in order</h3>
              <ol className="relative space-y-4 border-l-2 border-border-subtle pl-7">
                {result.analysis.actions.map((a, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[39px] flex h-8 w-8 items-center justify-center rounded-full bg-aqua-blue text-sm font-bold text-primary-foreground">{i + 1}</span>
                    <p className="font-semibold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {oks.length > 0 && (
            <section>
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">Checks passed <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">{oks.length}</span></h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {oks.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 rounded-xl border border-border-subtle bg-card/70 p-3.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: SEV.ok.color }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: chat */}
        <aside className="flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-card shadow-sm xl:sticky xl:top-24">
          <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-dark px-4 py-3">
            <Bot className="h-4 w-4 text-aqua-blue" />
            <h3 className="text-sm font-semibold text-foreground">Ask the advisor</h3>
            <span className="ml-auto text-[11px] text-muted-foreground">sees your live data</span>
          </div>
          <div ref={chatRef} className="max-h-[430px] min-h-[220px] flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Describe your situation, e.g. "the probe has been in the tank for 2 days", or try:</p>
                {SUGGESTED.map((q) => (
                  <button key={q} onClick={() => send(q)} className="block w-full rounded-lg border border-border-subtle px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-dark">{q}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-aqua-blue text-primary-foreground' : 'border border-border-subtle bg-surface-dark text-foreground'}`}>
                  <Rich text={m.content} />
                </div>
              </div>
            ))}
            {typing && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…</div>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border-subtle p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about the findings…"
              className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-input-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-aqua-blue"
            />
            <button type="submit" disabled={typing || !input.trim()} aria-label="Send" className="rounded-lg bg-aqua-blue px-4 text-primary-foreground disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </aside>
      </div>

      <p className="flex items-start gap-2 border-t border-border-subtle pt-4 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-blue" />
        <span>
          Detection method: statistical rules in code (range check, z-score, rolling slope, flat-line, impossible-value, data-gap and pump-consistency tests). Haiku 5.5 only writes the explanation and recommendations from those findings. It is advisory text and never controls a pump. AI requests today: {used} / {DAILY_CAP}.
        </span>
      </p>
    </div>
  );
}
