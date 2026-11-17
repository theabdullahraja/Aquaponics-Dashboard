import { useState, useSyncExternalStore } from 'react';
import { SlidersHorizontal, Save, RotateCcw, CheckCircle2, AlertTriangle, Droplet, Thermometer, Waves } from 'lucide-react';
import { THRESHOLDS, DEFAULT_THRESHOLDS, saveThresholds, resetThresholds, validateRanges, subscribeThresholds, thresholdsVersion } from '../../lib/health';

function Field({ label, value, onChange, step, suffix }: { label: string; value: string; onChange: (v: string) => void; step: number; suffix: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-border-subtle bg-input-background focus-within:border-aqua-blue">
        <input type="number" inputMode="decimal" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-3 py-2.5 font-mono text-foreground outline-none" />
        {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

export function SettingsPanel() {
  useSyncExternalStore(subscribeThresholds, thresholdsVersion);
  const [ph, setPh] = useState<[string, string]>([String(THRESHOLDS.ph.min), String(THRESHOLDS.ph.max)]);
  const [t, setT] = useState<[string, string]>([String(THRESHOLDS.temp_c.min), String(THRESHOLDS.temp_c.max)]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const parsed = { ph: [parseFloat(ph[0]), parseFloat(ph[1])] as [number, number], temp_c: [parseFloat(t[0]), parseFloat(t[1])] as [number, number] };
  const error = validateRanges(parsed);
  const dirty = parsed.ph[0] !== THRESHOLDS.ph.min || parsed.ph[1] !== THRESHOLDS.ph.max || parsed.temp_c[0] !== THRESHOLDS.temp_c.min || parsed.temp_c[1] !== THRESHOLDS.temp_c.max;

  function save() {
    if (error) { setMsg({ ok: false, text: error }); return; }
    saveThresholds(parsed);
    setMsg({ ok: true, text: 'Saved. Alerts, charts, health score and the AI Advisory now use these ranges.' });
  }
  function reset() {
    resetThresholds();
    setPh([String(DEFAULT_THRESHOLDS.ph.min), String(DEFAULT_THRESHOLDS.ph.max)]);
    setT([String(DEFAULT_THRESHOLDS.temp_c.min), String(DEFAULT_THRESHOLDS.temp_c.max)]);
    setMsg({ ok: true, text: 'Restored the default ranges.' });
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-5 lg:p-7">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="h-5 w-5 text-aqua-blue" />
        <h2 className="text-2xl font-semibold text-foreground">Threshold Settings</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Safe ranges used for alerts, the health score, chart bands and the AI Advisory. Saved in this browser.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border p-4" style={{ borderColor: '#b794f640', backgroundImage: 'linear-gradient(160deg, #b794f61a, transparent 60%)' }}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Droplet className="h-4 w-4" style={{ color: '#b794f6' }} /> pH safe range</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum" value={ph[0]} onChange={(v) => setPh([v, ph[1]])} step={0.1} suffix="" />
            <Field label="Maximum" value={ph[1]} onChange={(v) => setPh([ph[0], v])} step={0.1} suffix="" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Default {DEFAULT_THRESHOLDS.ph.min} to {DEFAULT_THRESHOLDS.ph.max}</p>
        </section>

        <section className="rounded-xl border p-4" style={{ borderColor: '#ff9f6b40', backgroundImage: 'linear-gradient(160deg, #ff9f6b1a, transparent 60%)' }}>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground"><Thermometer className="h-4 w-4" style={{ color: '#ff9f6b' }} /> Temperature safe range</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum" value={t[0]} onChange={(v) => setT([v, t[1]])} step={0.5} suffix="°C" />
            <Field label="Maximum" value={t[1]} onChange={(v) => setT([t[0], v])} step={0.5} suffix="°C" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Default {DEFAULT_THRESHOLDS.temp_c.min} to {DEFAULT_THRESHOLDS.temp_c.max} °C</p>
        </section>

        <section className="rounded-xl border border-border-subtle bg-surface-dark p-4 md:col-span-2">
          <h3 className="flex items-center gap-2 font-semibold text-foreground"><Waves className="h-4 w-4" style={{ color: '#4dd0e1' }} /> Water flow</h3>
          <p className="mt-1 font-mono text-foreground">1 – 30 L/min <span className="font-sans text-sm text-muted-foreground">· sensor range, information only (0 is normal when the water pump is off)</span></p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={!dirty || !!error} className="inline-flex items-center gap-2 rounded-xl bg-aqua-blue px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          <Save className="h-4 w-4" /> Save changes
        </button>
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-dark">
          <RotateCcw className="h-4 w-4" /> Reset to defaults
        </button>
        {error && dirty && <span className="flex items-center gap-1.5 text-sm text-warm-amber"><AlertTriangle className="h-4 w-4" /> {error}</span>}
        {msg && !(error && dirty) && <span className={`flex items-center gap-1.5 text-sm ${msg.ok ? 'text-green-growth' : 'text-warm-amber'}`}>{msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} {msg.text}</span>}
      </div>
    </div>
  );
}
