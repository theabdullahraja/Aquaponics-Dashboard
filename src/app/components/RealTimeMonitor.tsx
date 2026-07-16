import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useReadingsHistory } from '../../lib/useAquaponics';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    const v = typeof p.value === 'number' ? p.value.toFixed(2) : p.value;
    return (
      <div className="bg-card border border-border-subtle rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{v}</p>
        <p className="text-xs text-muted-foreground">{p.payload.time}</p>
      </div>
    );
  }
  return null;
};

const axis = { stroke: '#94A3B8', fontSize: 12, tickLine: false, axisLine: false } as const;

export function RealTimeMonitor() {
  const rows = useReadingsHistory(30);
  const data = rows.map((r) => ({
    time: new Date(r.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ph: r.ph,
    temp: r.temp_c,
    flow: r.flow_lpm,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Live Data Visualization</h2>
        <p className="text-sm text-muted-foreground mt-1">Live sensor readings from Supabase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* pH History */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">pH History</h3>
            <span className="text-xs text-muted-foreground">Recent</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="time" {...axis} minTickGap={40} />
              <YAxis {...axis} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ph" stroke="#0EA5E9" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Curve */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Temperature Curve</h3>
            <span className="text-xs text-muted-foreground">Recent</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis dataKey="time" {...axis} minTickGap={40} />
              <YAxis {...axis} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Flow Rate */}
        <div className="bg-card rounded-lg p-5 border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Flow Rate</h3>
            <span className="text-xs text-muted-foreground">Recent</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" {...axis} minTickGap={40} />
              <YAxis {...axis} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="flow" stroke="#06B6D4" strokeWidth={2} fill="url(#flowGradient)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
