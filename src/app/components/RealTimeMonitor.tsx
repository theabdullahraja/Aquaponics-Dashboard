import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const phData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 7.05 + Math.sin(i / 3) * 0.14 + (i % 5) * 0.01,
}));

const tempData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 23 + Math.sin(i / 4) * 0.9 + (i % 4) * 0.08,
}));

const flowData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 2.35 + Math.cos(i / 4) * 0.18 - (i > 16 ? 0.12 : 0),
}));

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border-subtle rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].value.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">{payload[0].payload.time}</p>
      </div>
    );
  }
  return null;
};

export function RealTimeMonitor() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Live Data Visualization</h2>
        <p className="text-sm text-muted-foreground mt-1">Last 24 hours from Firebase sensor readings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* pH History */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">pH History</h3>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={phData}>
              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[6.5, 7.5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Curve */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Temperature Curve</h3>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tempData}>
              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[20, 26]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Flow Rate */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Flow Rate</h3>
            <span className="text-xs text-muted-foreground">Last 24h</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={flowData}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 3]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06B6D4"
                strokeWidth={2}
                fill="url(#flowGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
