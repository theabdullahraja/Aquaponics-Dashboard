import { Droplet, Thermometer, Waves, TrendingUp, TrendingDown, Minus, CheckCircle2, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { useReadingsHistory } from '../../lib/useAquaponics';
import { THRESHOLDS } from '../../lib/health';

type Chip = { text: string; tone: 'ok' | 'warn' | 'info'; Icon: React.ElementType };

const CHIP_STYLE: Record<Chip['tone'], string> = {
  ok: 'bg-green-growth/15 text-green-growth',
  warn: 'bg-warm-amber/15 text-warm-amber',
  info: 'bg-white/5 text-muted-foreground',
};

interface StatCardProps {
  icon: React.ElementType;
  accent: string;
  label: string;
  value: string;
  unit: string;
  trend: { value: string; direction: 'up' | 'down' | 'flat' } | null;
  chip: Chip | null;
  /** Gauge: visible domain and the safe band inside it. */
  gauge: { value: number | null | undefined; domain: [number, number]; safe?: [number, number]; ends: [string, string] };
}

/** Where the value sits relative to the safe band: far more readable than a fill bar. */
function RangeGauge({ value, domain, safe, ends }: StatCardProps['gauge']) {
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - domain[0]) / (domain[1] - domain[0])) * 100));
  return (
    <div className="mt-4">
      <div className="relative h-2 rounded-full bg-surface-dark">
        {safe && (
          <div className="absolute inset-y-0 rounded-full bg-green-growth/35" style={{ left: `${pct(safe[0])}%`, width: `${pct(safe[1]) - pct(safe[0])}%` }} />
        )}
        {value != null && (
          <div className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_0_3px_var(--card)] transition-all duration-500" style={{ left: `${pct(value)}%` }} />
        )}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground/80">
        <span>{ends[0]}</span>
        {safe && <span className="text-green-growth/90">safe {safe[0]}–{safe[1]}</span>}
        <span>{ends[1]}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, accent, label, value, unit, trend, chip, gauge }: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 transition-transform hover:-translate-y-0.5" style={{ borderColor: `${accent}40`, backgroundImage: `linear-gradient(160deg, ${accent}1f, transparent 55%)` }}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}26`, color: accent }}><Icon className="h-[18px] w-[18px]" /></span>
          {label}
        </div>
        {chip && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${CHIP_STYLE[chip.tone]}`}>
            <chip.Icon className="h-3.5 w-3.5" /> {chip.text}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-4xl font-semibold leading-none tracking-tight text-foreground">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {trend ? (<><TrendIcon className="h-3.5 w-3.5" /><span className="font-medium">{trend.value}</span><span>vs previous</span></>) : <span>no data</span>}
      </div>
      <RangeGauge {...gauge} />
    </div>
  );
}

function trendOf(latest: number | null | undefined, prev: number | null | undefined, unit: string, digits: number) {
  if (latest == null || prev == null) return null;
  const delta = latest - prev;
  const direction = Math.abs(delta) < Math.pow(10, -digits) ? 'flat' : delta > 0 ? 'up' : 'down';
  return { value: `${Math.abs(delta).toFixed(digits)}${unit}`, direction: direction as 'up' | 'down' | 'flat' };
}

function rangeChip(v: number | null | undefined, min: number, max: number): Chip | null {
  if (v == null) return null;
  if (v < min) return { text: 'Below range', tone: 'warn', Icon: ArrowDown };
  if (v > max) return { text: 'Above range', tone: 'warn', Icon: ArrowUp };
  return { text: 'In range', tone: 'ok', Icon: CheckCircle2 };
}

export function HeroStatsCards() {
  const rows = useReadingsHistory(30);
  // Readings can be null when a value was rejected as a sensor glitch; use the latest valid pair.
  const latest = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  const fmt = (v: number | null | undefined, digits: number) => (v == null ? '—' : v.toFixed(digits));

  const stats: StatCardProps[] = [
    {
      icon: Droplet, accent: '#b794f6', label: 'pH Level', value: fmt(latest?.ph, 2), unit: '',
      trend: trendOf(latest?.ph, prev?.ph, '', 2),
      chip: rangeChip(latest?.ph, THRESHOLDS.ph.min, THRESHOLDS.ph.max),
      gauge: { value: latest?.ph, domain: [4, 10], safe: [THRESHOLDS.ph.min, THRESHOLDS.ph.max], ends: ['4', '10'] },
    },
    {
      icon: Thermometer, accent: '#ff9f6b', label: 'Temperature', value: fmt(latest?.temp_c, 1), unit: '°C',
      trend: trendOf(latest?.temp_c, prev?.temp_c, '°C', 1),
      chip: rangeChip(latest?.temp_c, THRESHOLDS.temp_c.min, THRESHOLDS.temp_c.max),
      gauge: { value: latest?.temp_c, domain: [10, 36], safe: [THRESHOLDS.temp_c.min, THRESHOLDS.temp_c.max], ends: ['10°', '36°'] },
    },
    {
      icon: Waves, accent: '#4dd0e1', label: 'Water Flow', value: fmt(latest?.flow_lpm, 1), unit: 'L/min',
      trend: trendOf(latest?.flow_lpm, prev?.flow_lpm, ' L/min', 1),
      chip: latest?.flow_lpm != null ? { text: 'Info only', tone: 'info', Icon: Info } : null,
      gauge: { value: latest?.flow_lpm, domain: [0, 30], ends: ['0', '30'] },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
      {stats.map((stat) => (<StatCard key={stat.label} {...stat} />))}
    </div>
  );
}
