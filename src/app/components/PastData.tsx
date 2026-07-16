import { useEffect, useState } from 'react';
import { Download, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Reading } from '../../lib/useAquaponics';

const RANGES = [
  { label: 'Last 50', limit: 50 },
  { label: 'Last 200', limit: 200 },
  { label: 'Last 1000', limit: 1000 },
];

function fmt(v: number | null, digits: number) {
  return v == null ? '—' : v.toFixed(digits);
}

export function PastData() {
  const [limit, setLimit] = useState(50);
  const [rows, setRows] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (n: number) => {
    setLoading(true);
    const { data } = await supabase
      .from('readings')
      .select('*')
      .order('id', { ascending: false })
      .limit(n);
    setRows((data as Reading[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load(limit);
  }, [limit]);

  const exportCsv = () => {
    const header = 'id,timestamp,temp_c,ph,flow_lpm\n';
    const body = rows
      .map((r) => `${r.id},${r.ts},${r.temp_c ?? ''},${r.ph ?? ''},${r.flow_lpm ?? ''}`)
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquaponics-readings-${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-aqua-blue" />
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Past Data</h2>
            <p className="text-sm text-muted-foreground">Historical sensor readings from Supabase</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.limit}
              onClick={() => setLimit(r.limit)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                limit === r.limit
                  ? 'border-aqua-blue/40 bg-aqua-blue/10 text-aqua-blue'
                  : 'border-border-subtle text-muted-foreground hover:bg-surface-dark'
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => load(limit)}
            aria-label="Refresh"
            className="p-2 rounded-lg border border-border-subtle text-muted-foreground hover:bg-surface-dark transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-foreground hover:bg-surface-dark transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-dark text-muted-foreground">
              <th className="text-left font-medium px-4 py-3">#</th>
              <th className="text-left font-medium px-4 py-3">Timestamp</th>
              <th className="text-right font-medium px-4 py-3">Temp (°C)</th>
              <th className="text-right font-medium px-4 py-3">pH</th>
              <th className="text-right font-medium px-4 py-3">Flow (L/min)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No readings yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border-subtle hover:bg-surface-dark/50">
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{r.id}</td>
                <td className="px-4 py-2.5 text-foreground">{new Date(r.ts).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{fmt(r.temp_c, 2)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{fmt(r.ph, 3)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{fmt(r.flow_lpm, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Showing {rows.length} row{rows.length === 1 ? '' : 's'} (newest first).
      </p>
    </div>
  );
}
