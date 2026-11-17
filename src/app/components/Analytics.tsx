import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useReadingsHistory } from '../../lib/useAquaponics';
import { THRESHOLDS } from '../../lib/health';

type MetricKey = 'temp_c' | 'ph' | 'flow_lpm';

const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  digits: number;
  range: { min: number; max: number } | null;
}[] = [
  { key: 'temp_c', label: 'Temperature', unit: '°C', digits: 1, get range() { return { min: THRESHOLDS.temp_c.min, max: THRESHOLDS.temp_c.max }; } },
  { key: 'ph', label: 'pH', unit: '', digits: 2, get range() { return { min: THRESHOLDS.ph.min, max: THRESHOLDS.ph.max }; } },
  { key: 'flow_lpm', label: 'Water Flow', unit: ' L/min', digits: 1, range: null },
];

function computeStats(values: number[]) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { min, max, avg, current: values[values.length - 1] };
}

export function Analytics() {
  const rows = useReadingsHistory(200);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-aqua-blue" />
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Statistics computed from the last {rows.length} reading{rows.length === 1 ? '' : 's'} (Supabase)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {METRICS.map((m) => {
          const values = rows
            .map((r) => r[m.key] as number | null)
            .filter((v): v is number => v != null);
          const s = computeStats(values);

          let status: { text: string; color: string } | null = null;
          let TrendIcon = Minus;
          if (s && m.range) {
            if (s.current < m.range.min) {
              status = { text: 'Below range', color: '#F59E0B' };
              TrendIcon = TrendingDown;
            } else if (s.current > m.range.max) {
              status = { text: 'Above range', color: '#F59E0B' };
              TrendIcon = TrendingUp;
            } else {
              status = { text: 'In range', color: '#4ade80' };
              TrendIcon = Minus;
            }
          }

          const fmt = (v: number) => `${v.toFixed(m.digits)}${m.unit}`;

          return (
            <div key={m.key} className="rounded-lg border border-border-subtle bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                {status && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ color: status.color, backgroundColor: `${status.color}18` }}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {status.text}
                  </span>
                )}
              </div>

              <p className="text-3xl font-mono font-semibold text-foreground">
                {s ? fmt(s.current) : '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">current</p>

              {s ? (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    ['Min', s.min],
                    ['Avg', s.avg],
                    ['Max', s.max],
                  ].map(([label, val]) => (
                    <div key={label as string} className="rounded-lg bg-surface-dark p-2">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-mono font-semibold text-foreground mt-0.5">
                        {fmt(val as number)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No data yet.</p>
              )}

              {m.range && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Safe range: {m.range.min}–{m.range.max}
                  {m.unit}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
