import { Droplet, Thermometer, Waves, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useReadingsHistory } from '../../lib/useAquaponics';
import { THRESHOLDS } from '../../lib/health';

type Chip = { text: string; tone: 'ok' | 'warn' | 'info' };

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  trend: { value: string; direction: 'up' | 'down' | 'flat' } | null;
  progress: number;
  accentColor: string;
  chip: Chip | null;
  hint: string;
}

const CHIP_STYLE: Record<Chip['tone'], string> = {
  ok: 'bg-green-growth/15 text-green-growth',
  warn: 'bg-warm-amber/15 text-warm-amber',
  info: 'bg-white/5 text-muted-foreground',
};

function StatCard({ icon: Icon, label, value, unit, trend, progress, accentColor, chip, hint }: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderColor: `${accentColor}30` }}
    >
      {/* soft accent glow in the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}1F`, color: accentColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {chip && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CHIP_STYLE[chip.tone]}`}>{chip.text}</span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-mono text-4xl font-semibold leading-none tracking-tight text-foreground">
          {value}
          {unit && <span className="ml-1 text-lg font-medium text-muted-foreground">{unit}</span>}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trend ? (
            <>
              <TrendIcon className="h-3.5 w-3.5" />
              <span className="font-medium">{trend.value}</span>
              <span>vs previous</span>
            </>
          ) : (
            <span>no data</span>
          )}
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: accentColor }}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground/80">{hint}</p>
      </div>
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
  if (v < min) return { text: 'Below range', tone: 'warn' };
  if (v > max) return { text: 'Above range', tone: 'warn' };
  return { text: 'In range', tone: 'ok' };
}

export function HeroStatsCards() {
  const rows = useReadingsHistory(30);
  // Readings can be null when a value was rejected as a sensor glitch; use the latest valid pair.
  const latest = rows[rows.length - 1];
  const prev = rows[rows.length - 2];

  const fmt = (v: number | null | undefined, digits: number) => (v == null ? '—' : v.toFixed(digits));

  const stats: StatCardProps[] = [
    {
      icon: Droplet,
      label: 'pH Level',
      value: fmt(latest?.ph, 2),
      unit: '',
      trend: trendOf(latest?.ph, prev?.ph, '', 2),
      progress: latest?.ph != null ? (latest.ph / 14) * 100 : 0,
      accentColor: '#38BDF8',
      chip: rangeChip(latest?.ph, THRESHOLDS.ph.min, THRESHOLDS.ph.max),
      hint: `Safe range ${THRESHOLDS.ph.min}–${THRESHOLDS.ph.max}`,
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: fmt(latest?.temp_c, 1),
      unit: '°C',
      trend: trendOf(latest?.temp_c, prev?.temp_c, '°C', 1),
      progress: latest?.temp_c != null ? (latest.temp_c / 40) * 100 : 0,
      accentColor: '#FBBF24',
      chip: rangeChip(latest?.temp_c, THRESHOLDS.temp_c.min, THRESHOLDS.temp_c.max),
      hint: `Safe range ${THRESHOLDS.temp_c.min}–${THRESHOLDS.temp_c.max} °C`,
    },
    {
      icon: Waves,
      label: 'Water Flow',
      value: fmt(latest?.flow_lpm, 1),
      unit: 'L/m',
      trend: trendOf(latest?.flow_lpm, prev?.flow_lpm, ' L/m', 1),
      progress: latest?.flow_lpm != null ? (latest.flow_lpm / 30) * 100 : 0,
      accentColor: '#22D3EE',
      chip: latest?.flow_lpm != null ? { text: 'Info only', tone: 'info' } : null,
      hint: 'Sensor range 1–30 L/min',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
