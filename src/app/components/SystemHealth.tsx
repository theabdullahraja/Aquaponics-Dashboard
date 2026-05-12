import { Check, AlertTriangle } from 'lucide-react';

export function SystemHealth() {
  const healthScore = 94;
  const healthItems = [
    { label: 'pH', status: 'optimal', icon: Check, color: '#10B981' },
    { label: 'Temp', status: 'normal', icon: Check, color: '#10B981' },
    { label: 'Flow', status: 'low', icon: AlertTriangle, color: '#F59E0B' },
  ];

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (healthScore / 100) * circumference;

  const getHealthColor = () => {
    if (healthScore >= 90) return '#10B981';
    if (healthScore >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getHealthLabel = () => {
    if (healthScore >= 90) return 'Excellent';
    if (healthScore >= 70) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="bg-card rounded-lg p-5 border border-border-subtle h-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">System Health</h3>

      {/* Circular Progress */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90" width="128" height="128">
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="#334155"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke={getHealthColor()}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{
                filter: `drop-shadow(0 0 8px ${getHealthColor()}40)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground font-mono">{healthScore}%</span>
          </div>
        </div>
        <p className="mt-3 text-lg font-semibold" style={{ color: getHealthColor() }}>
          {getHealthLabel()}
        </p>
      </div>

      {/* Health Items */}
      <div className="space-y-3">
        {healthItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-sm font-medium text-foreground">{item.label}:</span>
              <span className="text-sm font-semibold" style={{ color: item.color }}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-border-subtle bg-surface-dark p-3">
        <p className="text-xs text-muted-foreground">Rule engine status</p>
        <p className="text-sm font-semibold text-foreground mt-1">Threshold monitoring active</p>
      </div>
    </div>
  );
}
