import { CheckCircle2, AlertTriangle, WifiOff, Sparkles, Bell, Waves, Wind, Wifi } from 'lucide-react';
import { useLatestReading, useSystemOnline, useActuatorStatus } from '../../lib/useAquaponics';
import { alertsFromReading, healthFromReading } from '../../lib/health';

function ago(ts?: string) {
  if (!ts) return 'no data yet';
  const s = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  const d = Math.round(s / 86400);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

interface Props {
  name: string;
  onOpenAdvisory: () => void;
  onOpenAlerts: () => void;
}

/** One answer to the first question every viewer has: "is my system OK right now?"
 *  State is carried by an icon + words, never colour alone. */
export function StatusHero({ name, onOpenAdvisory, onOpenAlerts }: Props) {
  const reading = useLatestReading();
  const online = useSystemOnline(reading);
  const pumps = useActuatorStatus();
  const alerts = alertsFromReading(reading, online);
  const { score } = healthFromReading(reading, online);

  const state = !online ? 'offline' : alerts.length ? 'attention' : 'ok';
  const view = {
    ok: { Icon: CheckCircle2, text: 'All systems normal', tone: 'text-green-growth', ring: '#4ade80', sub: 'Temperature and pH are inside their safe ranges and data is arriving live.' },
    attention: { Icon: AlertTriangle, text: 'Needs attention', tone: 'text-warm-amber', ring: '#ffb547', sub: alerts.map((a) => `${a.title}: ${a.description}`).join(' · ') },
    offline: { Icon: WifiOff, text: 'Device offline', tone: 'text-danger-red', ring: '#ff6b8a', sub: `Last reading ${ago(reading?.ts)}. Check the ESP32's power and Wi-Fi; values below are the last known ones.` },
  }[state];

  const r = 42, c = 2 * Math.PI * r;
  const pump = (on?: boolean) => (on ? 'Running' : 'Off');

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-card">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-aqua-blue/10 blur-3xl" />
      <div className="relative grid gap-6 p-5 lg:grid-cols-[1fr_auto] lg:p-7">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Welcome back, {name}</p>
          <h2 className={`mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight lg:text-3xl ${view.tone}`}>
            <view.Icon className="h-7 w-7 shrink-0" aria-hidden /> <span className="text-foreground">{view.text}</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">{view.sub}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={onOpenAdvisory} className="inline-flex items-center gap-2 rounded-xl bg-aqua-blue px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4" /> Run AI analysis
            </button>
            {alerts.length > 0 && (
              <button onClick={onOpenAlerts} className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-dark">
                <Bell className="h-4 w-4" /> {alerts.length} active alert{alerts.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 lg:gap-8">
          <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`System health ${score} percent`}>
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" className="text-border-subtle" strokeWidth="9" />
              <circle cx="50" cy="50" r={r} fill="none" stroke={view.ring} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-semibold text-foreground">{score}%</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">health</span>
            </div>
          </div>
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5">
              {online ? <Wifi className="h-4 w-4 text-green-growth" /> : <WifiOff className="h-4 w-4 text-danger-red" />}
              <dt className="w-16 text-muted-foreground">Device</dt>
              <dd className="font-medium text-foreground">{online ? 'Online' : 'Offline'}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Waves className={`h-4 w-4 ${pumps.water_pump?.state ? 'text-aqua-blue' : 'text-muted-foreground'}`} />
              <dt className="w-16 text-muted-foreground">Water</dt>
              <dd className="font-medium text-foreground">{pump(pumps.water_pump?.state)}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Wind className={`h-4 w-4 ${pumps.air_pump?.state ? 'text-aqua-blue' : 'text-muted-foreground'}`} />
              <dt className="w-16 text-muted-foreground">Air</dt>
              <dd className="font-medium text-foreground">{pump(pumps.air_pump?.state)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
