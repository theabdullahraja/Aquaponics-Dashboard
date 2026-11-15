import { Area, AreaChart, CartesianGrid, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReadingsHistory } from '../../lib/useAquaponics';
import { THRESHOLDS } from '../../lib/health';

type Point = { time: string; ph: number | null; temp: number | null; flow: number | null };

const axis = { stroke: '#7E9A80', fontSize: 11, tickLine: false, axisLine: false } as const;

function ChartTooltip({ active, payload, unit, digits }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border-subtle bg-card/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="font-mono text-sm font-semibold text-foreground">
        {typeof p.value === 'number' ? p.value.toFixed(digits) : '—'}
        {unit}
      </p>
      <p className="text-xs text-muted-foreground">{p.payload.time}</p>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  data: Point[];
  dataKey: 'ph' | 'temp' | 'flow';
  color: string;
  unit: string;
  digits: number;
  safe?: { min: number; max: number };
  fixedDomain?: [number, number];
}

function ChartCard({ title, data, dataKey, color, unit, digits, safe, fixedDomain }: ChartCardProps) {
  const gradId = `grad-${dataKey}`;
  const latest = [...data].reverse().find((d) => d[dataKey] != null)?.[dataKey] ?? null;
  const inRange = safe && latest != null ? latest >= safe.min && latest <= safe.max : null;

  // Pad the auto-scale so the line never hugs the edges, and always keep the safe band visible.
  const domain: [any, any] = fixedDomain ?? [
    (min: number) => Math.floor((Math.min(min, safe?.min ?? min) - 0.3) * 10) / 10,
    (max: number) => Math.ceil((Math.max(max, safe?.max ?? max) + 0.3) * 10) / 10,
  ];

  return (
    <div className="min-w-0 rounded-xl border border-border-subtle bg-card p-5 transition-colors hover:border-white/10">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="mt-1 font-mono text-2xl font-semibold leading-none tracking-tight text-foreground">
            {latest != null ? latest.toFixed(digits) : '—'}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>
        {inRange != null && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              inRange ? 'bg-green-growth/15 text-green-growth' : 'bg-warm-amber/15 text-warm-amber'
            }`}
          >
            {inRange ? 'In range' : 'Out of range'}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
          {safe && <ReferenceArea y1={safe.min} y2={safe.max} fill="#4ADE80" fillOpacity={0.07} stroke="#4ADE80" strokeOpacity={0.25} strokeDasharray="3 3" />}
          <XAxis dataKey="time" {...axis} minTickGap={48} interval="preserveStartEnd" />
          <YAxis {...axis} domain={domain} width={38} tickFormatter={(v) => Number(v).toFixed(1)} />
          <Tooltip content={<ChartTooltip unit={unit} digits={digits} />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            connectNulls
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RealTimeMonitor() {
  const rows = useReadingsHistory(30);
  const data: Point[] = rows.map((r) => ({
    time: new Date(r.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ph: r.ph,
    temp: r.temp_c,
    flow: r.flow_lpm,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Live Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Last 30 readings from the ESP32-S3 · shaded band = safe range
        </p>
      </div>

      {/* Container query: 3 across when there is room, stacked when the chat panel narrows the column. */}
      <div className="@container">
        <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-3">
          <ChartCard
            title="pH"
            data={data}
            dataKey="ph"
            color="#38BDF8"
            unit=""
            digits={2}
            safe={{ min: THRESHOLDS.ph.min, max: THRESHOLDS.ph.max }}
          />
          <ChartCard
            title="Temperature"
            data={data}
            dataKey="temp"
            color="#FBBF24"
            unit="°C"
            digits={1}
            safe={{ min: THRESHOLDS.temp_c.min, max: THRESHOLDS.temp_c.max }}
          />
          <ChartCard title="Water Flow" data={data} dataKey="flow" color="#22D3EE" unit=" L/m" digits={1} fixedDomain={[0, 30]} />
        </div>
      </div>
    </div>
  );
}
