import { Droplet, Thermometer, Waves, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useReadingsHistory } from '../../lib/useAquaponics';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: { value: string; direction: 'up' | 'down' | 'flat' } | null;
  progress: number;
  accentColor: string;
}

function StatCard({ icon: Icon, label, value, trend, progress, accentColor }: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="bg-card rounded-lg p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: `${accentColor}1A` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-4xl font-mono font-semibold text-foreground tracking-tight">{value}</p>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          {trend ? (
            <>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{trend.value}</span>
              <span className="text-sm">vs previous</span>
            </>
          ) : (
            <span className="text-sm">no data</span>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 h-1 bg-surface-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: accentColor }}
          />
        </div>
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

export function HeroStatsCards() {
  const rows = useReadingsHistory(30);
  const latest = rows[rows.length - 1];
  const prev = rows[rows.length - 2];

  const fmt = (v: number | null | undefined, digits: number, unit = '') =>
    v == null ? '—' : `${v.toFixed(digits)}${unit}`;

  const stats: StatCardProps[] = [
    {
      icon: Droplet,
      label: 'pH Level',
      value: fmt(latest?.ph, 2),
      trend: trendOf(latest?.ph, prev?.ph, '', 2),
      progress: latest?.ph != null ? (latest.ph / 14) * 100 : 0,
      accentColor: '#0EA5E9',
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: fmt(latest?.temp_c, 1, '°C'),
      trend: trendOf(latest?.temp_c, prev?.temp_c, '°C', 1),
      progress: latest?.temp_c != null ? (latest.temp_c / 40) * 100 : 0,
      accentColor: '#F59E0B',
    },
    {
      icon: Waves,
      label: 'Water Flow',
      value: fmt(latest?.flow_lpm, 1, ' L/m'),
      trend: trendOf(latest?.flow_lpm, prev?.flow_lpm, ' L/m', 1),
      progress: latest?.flow_lpm != null ? (latest.flow_lpm / 30) * 100 : 0,
      accentColor: '#06B6D4',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
