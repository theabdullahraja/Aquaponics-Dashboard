import { Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLatestReading, useSystemOnline } from '../../lib/useAquaponics';
import { evaluateReading, healthFromReading, type Status } from '../../lib/health';

function statusView(status: Status) {
  switch (status) {
    case 'ok':
      return { icon: Check, color: '#10B981', text: 'normal' };
    case 'high':
      return { icon: AlertTriangle, color: '#F59E0B', text: 'high' };
    case 'low':
      return { icon: AlertTriangle, color: '#F59E0B', text: 'low' };
    default:
      return { icon: HelpCircle, color: '#94A3B8', text: 'no data' };
  }
}

export function SystemHealth() {
  const reading = useLatestReading();
  const online = useSystemOnline(reading);
  const evals = evaluateReading(reading);
  const { score, label } = healthFromReading(reading, online);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const ringColor = score >= 90 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <div className="min-w-0 bg-card rounded-xl p-5 border border-border-subtle h-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">System Health</h3>

      {/* Circular Progress */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90" width="128" height="128">
            <circle cx="64" cy="64" r="54" stroke="#1F3A22" strokeWidth="12" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke={ringColor}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ filter: `drop-shadow(0 0 8px ${ringColor}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground font-mono">{score}%</span>
          </div>
        </div>
        <p className="mt-3 text-lg font-semibold" style={{ color: ringColor }}>
          {label}
        </p>
      </div>

      {/* Health Items */}
      <div className="space-y-3">
        {evals.map((item) => {
          const v = statusView(item.status);
          const Icon = v.icon;
          return (
            <div key={item.key} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${v.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: v.color }} />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs font-semibold capitalize" style={{ color: v.color }}>
                  {v.text}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm text-foreground">{item.text}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-border-subtle bg-surface-dark p-3">
        <p className="text-xs text-muted-foreground">Monitoring</p>
        <p className="text-sm font-semibold text-foreground mt-1">
          {online ? 'Live threshold checks active' : 'Device offline — no live data'}
        </p>
      </div>
    </div>
  );
}
