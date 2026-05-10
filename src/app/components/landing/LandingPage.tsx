import { useEffect, useState } from 'react';
import { LayoutDashboard, Bot } from 'lucide-react';

const CIRCUMFERENCE = 2 * Math.PI * 44; // 276.46

const sensors = [
  { id: 'ph',    label: 'pH Level',     value: 7.2,  max: 14,  unit: '',    color: '#0EA5E9', delay: 0   },
  { id: 'temp',  label: 'Temperature',  value: 23.5, max: 40,  unit: '°C',  color: '#F59E0B', delay: 120 },
  { id: 'flow',  label: 'Water Flow',   value: 2.4,  max: 4,   unit: 'L/m', color: '#06B6D4', delay: 240 },
  { id: 'level', label: 'Water Level',  value: 85,   max: 100, unit: '%',   color: '#10B981', delay: 360 },
];

const tickerData = [
  { label: 'pH',          value: '7.2',       status: 'optimal' },
  { label: 'Temperature', value: '23.5°C',    status: 'normal'  },
  { label: 'Water Flow',  value: '2.4 L/m',   status: 'warning' },
  { label: 'Water Level', value: '85%',        status: 'optimal' },
  { label: 'Dissolved O₂', value: '8.2 mg/L', status: 'optimal' },
  { label: 'Ammonia',     value: '0.02 ppm',  status: 'optimal' },
  { label: 'Nitrite',     value: '0.1 ppm',   status: 'normal'  },
  { label: 'EC',          value: '1.8 mS/cm', status: 'optimal' },
];

const STATUS_COLOR: Record<string, string> = {
  optimal: '#10B981',
  normal:  '#F59E0B',
  warning: '#EF4444',
};

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  delay: number;
}

function SensorGauge({ label, value, max, unit, color, delay }: GaugeProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setActive(true), 300 + delay);
    return () => clearTimeout(id);
  }, [delay]);

  const progress   = value / max;
  const dashOffset = active ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE;
  const decimals   = value % 1 !== 0 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[108px] h-[108px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden>
          {/* Track */}
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          {/* Arc */}
          <circle
            cx="60" cy="60" r="44"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              filter: `drop-shadow(0 0 5px ${color}70)`,
            }}
          />
        </svg>

        {/* Center reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
          <span className="text-xl font-mono font-bold text-foreground tabular-nums leading-none">
            {value.toFixed(decimals)}
          </span>
          {unit && (
            <span className="text-[9px] font-medium text-muted-foreground leading-none">{unit}</span>
          )}
        </div>
      </div>

      <span className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase text-center">
        {label}
      </span>
    </div>
  );
}

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenAI: () => void;
}

export function LandingPage({ onOpenDashboard, onOpenAI }: LandingPageProps) {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col select-none"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(248,250,252,0.025) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker-scroll 35s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aqua-blue to-green-growth flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" opacity="0.7" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">AquaponicsAI</span>
        </div>

        <button
          onClick={onOpenDashboard}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          Open Dashboard <span className="text-aqua-blue">→</span>
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-8 sm:gap-10">

        {/* System status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-growth/20 bg-green-growth/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-growth animate-pulse" />
          <span className="text-xs font-medium text-green-growth tracking-wide">
            LIVE · 12 SENSORS ACTIVE
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-bold tracking-tight leading-[1.08] mb-4">
            Your farm,{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #0EA5E9, #06B6D4 50%, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              live.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Real-time sensor monitoring, actuator control, and AI-powered guidance — in one clean interface.
          </p>
        </div>

        {/* Gauge ring cluster — the real hero */}
        <div
          className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-14 px-4 py-6 rounded-2xl border border-white/[0.04]"
          style={{ background: 'rgba(30,41,59,0.45)', backdropFilter: 'blur(4px)' }}
        >
          {sensors.map((s) => (
            <SensorGauge key={s.id} {...s} />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenDashboard}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-aqua-blue text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Dashboard
          </button>
          <button
            onClick={onOpenAI}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border-subtle text-foreground font-semibold text-sm hover:border-aqua-blue/40 hover:bg-white/[0.03] active:scale-[0.98] transition-all"
          >
            <Bot className="w-4 h-4 text-muted-foreground" />
            Try AI Assistant
          </button>
        </div>

      </main>

      {/* ── Scrolling ticker ────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.04] py-2.5 overflow-hidden">
        <div className="ticker-inner flex whitespace-nowrap w-max">
          {[...tickerData, ...tickerData].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 text-xs"
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLOR[item.status] ?? '#94A3B8' }}
              />
              <span className="text-muted-foreground/60">{item.label}</span>
              <span className="font-mono font-medium" style={{ color: '#CBD5E1' }}>
                {item.value}
              </span>
              <span className="text-white/10 ml-2">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
