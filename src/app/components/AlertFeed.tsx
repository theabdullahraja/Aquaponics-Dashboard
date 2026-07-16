import { AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLatestReading, useSystemOnline } from '../../lib/useAquaponics';
import { alertsFromReading, type DerivedAlert } from '../../lib/health';

function config(severity: DerivedAlert['severity']) {
  switch (severity) {
    case 'critical':
      return { icon: AlertCircle, color: '#EF4444' };
    case 'warning':
      return { icon: AlertTriangle, color: '#F59E0B' };
    case 'info':
      return { icon: Info, color: '#0EA5E9' };
  }
}

export function AlertFeed() {
  const reading = useLatestReading();
  const online = useSystemOnline(reading);
  const alerts = alertsFromReading(reading, online);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Recent Alerts</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Live threshold checks on the latest sensor reading from Supabase
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-card rounded-lg p-6 border border-border-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-growth/15">
            <CheckCircle2 className="w-5 h-5 text-green-growth" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">All readings within safe range</h3>
            <p className="text-sm text-muted-foreground">No active alerts.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const c = config(alert.severity);
            const Icon = c.icon;
            return (
              <div
                key={alert.id}
                className="bg-card rounded-lg p-5 border-l-4 border-border-subtle transition-all duration-200"
                style={{ borderLeftColor: c.color, backgroundColor: `${c.color}10` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${c.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{alert.title}</h3>
                      <span
                        className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
                        style={{ color: c.color, backgroundColor: `${c.color}18` }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
