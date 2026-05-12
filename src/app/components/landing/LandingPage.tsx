import { useEffect, useState } from 'react';
import { LayoutDashboard, Bot } from 'lucide-react';

// ─── Drop your video file at public/aquaponics-bg.mp4
// ─── Get free footage: search "aquaponics" or "fish tank" on pexels.com or coverr.co
// ─── If the file doesn't exist, the dark background shows instead — no broken layout
const VIDEO_SRC = '/aquaponics-bg.mp4';

const CIRCUMFERENCE = 2 * Math.PI * 44;

const sensors = [
  { id: 'ph',    label: 'pH Level',    value: 7.2,  max: 14,  unit: '',    color: '#22D3EE', delay: 0   },
  { id: 'temp',  label: 'Temperature', value: 23.5, max: 40,  unit: '°C',  color: '#FB923C', delay: 120 },
  { id: 'flow',  label: 'Water Flow',  value: 2.4,  max: 4,   unit: 'L/m', color: '#4ADE80', delay: 240 },
  { id: 'level', label: 'Water Level', value: 85,   max: 100, unit: '%',   color: '#86EFAC', delay: 360 },
];

const tickerData = [
  { label: 'pH',           value: '7.2',       status: 'optimal' },
  { label: 'Temperature',  value: '23.5°C',    status: 'normal'  },
  { label: 'Water Flow',   value: '2.4 L/m',   status: 'warning' },
  { label: 'Water Level',  value: '85%',        status: 'optimal' },
  { label: 'Dissolved O₂', value: '8.2 mg/L',  status: 'optimal' },
  { label: 'Ammonia',      value: '0.02 ppm',  status: 'optimal' },
  { label: 'Nitrite',      value: '0.1 ppm',   status: 'normal'  },
  { label: 'EC',           value: '1.8 mS/cm', status: 'optimal' },
];

const STATUS_COLOR: Record<string, string> = {
  optimal: '#4ADE80',
  normal:  '#FB923C',
  warning: '#F87171',
};

// ─── Sensor Gauge ────────────────────────────────────────────────────────────

interface GaugeProps {
  label: string; value: number; max: number;
  unit: string; color: string; delay: number;
}

function SensorGauge({ label, value, max, unit, color, delay }: GaugeProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setActive(true), 300 + delay);
    return () => clearTimeout(id);
  }, [delay]);

  const dashOffset = active ? CIRCUMFERENCE * (1 - value / max) : CIRCUMFERENCE;
  const decimals   = value % 1 !== 0 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-[100px] h-[100px] sm:w-[112px] sm:h-[112px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r="44" fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="60" cy="60" r="44" fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: `stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-px pointer-events-none">
          <span className="text-xl font-mono font-bold text-foreground tabular-nums leading-none">
            {value.toFixed(decimals)}
          </span>
          {unit && (
            <span className="text-[9px] font-medium text-muted-foreground leading-none">{unit}</span>
          )}
        </div>
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase text-center">
        {label}
      </span>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenAI: () => void;
}

export function LandingPage({ onOpenDashboard, onOpenAI }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner {
          animation: ticker-scroll 38s linear infinite;
          will-change: transform;
        }
        .ticker-inner:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Video background ───────────────────────────────────────────────
          Drop aquaponics-bg.mp4 into /public. If missing, bg-background shows.
      ───────────────────────────────────────────────────────────────────── */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Gradient overlay — darker at edges, lets video breathe in the center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(7,16,9,0.94) 0%,
              rgba(7,16,9,0.72) 25%,
              rgba(7,16,9,0.68) 55%,
              rgba(7,16,9,0.90) 85%,
              rgba(7,16,9,0.98) 100%
            )
          `,
        }}
      />

      {/* All content sits above the video */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
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

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-8 sm:gap-10">

          {/* System status pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-aqua-blue/20 bg-aqua-blue/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua-blue animate-pulse" />
            <span className="text-xs font-semibold text-aqua-blue tracking-widest">
              LIVE MONITORING
            </span>
          </div>

          {/* Headline */}
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl sm:text-6xl lg:text-[5.25rem] font-bold tracking-tight leading-[1.08] mb-4">
              Your farm,{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #4ADE80 0%, #22D3EE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                live.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Real-time sensor monitoring, actuator control, and AI-powered guidance —
              built for serious aquaponics operators.
            </p>
          </div>

          {/* Gauge cluster */}
          <div
            className="flex items-center justify-center gap-5 sm:gap-8 lg:gap-12 px-5 py-5 rounded-2xl border border-white/[0.05]"
            style={{ background: 'rgba(19,34,21,0.55)', backdropFilter: 'blur(12px)' }}
          >
            {sensors.map((s) => (
              <SensorGauge key={s.id} {...s} />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenDashboard}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm active:scale-[0.98] transition-all"
              style={{
                background: '#4ADE80',
                color: '#061008',
                boxShadow: '0 4px 22px rgba(74,222,128,0.35)',
              }}
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

        {/* ── Scrolling ticker ──────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.04] py-2.5 overflow-hidden">
          <div className="ticker-inner flex whitespace-nowrap w-max">
            {[...tickerData, ...tickerData].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-5 text-xs">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLOR[item.status] ?? '#9CB89A' }}
                />
                <span className="text-muted-foreground/60">{item.label}</span>
                <span className="font-mono font-medium" style={{ color: '#C4EEC0' }}>
                  {item.value}
                </span>
                <span className="text-white/10 ml-2">·</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
