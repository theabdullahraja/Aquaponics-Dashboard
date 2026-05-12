import { Droplet, Thermometer, Waves, Container, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: {
    value: string;
    direction: 'up' | 'down';
    isPositive: boolean;
  };
  progress: number;
  accentColor: string;
}

function StatCard({ icon: Icon, label, value, trend, progress, accentColor }: StatCardProps) {
  const TrendIcon = trend.direction === 'up' ? TrendingUp : TrendingDown;

  return (
    <div
      className="bg-card rounded-lg p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        borderColor: `${accentColor}1A`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-4xl font-mono font-semibold text-foreground tracking-tight">{value}</p>

        <div className="flex items-center gap-1.5">
          <TrendIcon
            className="w-3.5 h-3.5"
            style={{
              color: trend.isPositive ? '#10B981' : '#EF4444',
            }}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: trend.isPositive ? '#10B981' : '#EF4444',
            }}
          >
            {trend.value}
          </span>
          <span className="text-sm text-muted-foreground">from optimal</span>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 h-1 bg-surface-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function HeroStatsCards() {
  const stats = [
    {
      icon: Droplet,
      label: 'pH Level',
      value: '7.2',
      trend: { value: '0.1', direction: 'up' as const, isPositive: true },
      progress: 72,
      accentColor: '#0EA5E9',
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: '23.5°C',
      trend: { value: '0.3°C', direction: 'up' as const, isPositive: true },
      progress: 78,
      accentColor: '#F59E0B',
    },
    {
      icon: Waves,
      label: 'Water Flow',
      value: '2.4 L/m',
      trend: { value: '0.2 L/m', direction: 'down' as const, isPositive: false },
      progress: 60,
      accentColor: '#06B6D4',
    },
    {
      icon: Container,
      label: 'Water Level',
      value: '85%',
      trend: { value: '2%', direction: 'down' as const, isPositive: true },
      progress: 85,
      accentColor: '#10B981',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
