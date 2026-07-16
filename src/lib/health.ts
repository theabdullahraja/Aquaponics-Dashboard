import type { Reading } from './useAquaponics';

// Aquaponics safe ranges (also shown on the Settings page). pH + temperature drive
// health/alerts; flow is shown as info (0 is normal when the water pump is off, so a
// blanket low-flow alert would be noise).
export const THRESHOLDS = {
  temp_c: { min: 20, max: 26, label: 'Temperature', unit: '°C', digits: 1 },
  ph: { min: 6.8, max: 7.5, label: 'pH', unit: '', digits: 2 },
} as const;

export type SensorKey = keyof typeof THRESHOLDS;
export type Status = 'ok' | 'high' | 'low' | 'unknown';

export interface SensorEval {
  key: SensorKey;
  label: string;
  value: number | null;
  text: string; // formatted value + unit, or "—"
  status: Status;
}

function classify(value: number | null | undefined, min: number, max: number): Status {
  if (value == null) return 'unknown';
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'ok';
}

export function evaluateReading(reading: Reading | null): SensorEval[] {
  return (Object.keys(THRESHOLDS) as SensorKey[]).map((key) => {
    const t = THRESHOLDS[key];
    const value = reading ? (reading[key] as number | null) : null;
    return {
      key,
      label: t.label,
      value,
      text: value == null ? '—' : `${value.toFixed(t.digits)}${t.unit}`,
      status: classify(value, t.min, t.max),
    };
  });
}

export interface DerivedAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
}

/** Alerts derived from the latest reading + whether the device is online. */
export function alertsFromReading(reading: Reading | null, online: boolean): DerivedAlert[] {
  const alerts: DerivedAlert[] = [];

  if (!online) {
    alerts.push({
      id: 'offline',
      severity: 'critical',
      title: 'Device Offline',
      description: 'No recent sensor readings received from the ESP32-S3.',
    });
    return alerts;
  }

  for (const s of evaluateReading(reading)) {
    if (s.status === 'high' || s.status === 'low') {
      const t = THRESHOLDS[s.key];
      alerts.push({
        id: s.key,
        severity: 'warning',
        title: `${s.label} ${s.status === 'high' ? 'High' : 'Low'}`,
        description: `Current: ${s.text} (safe: ${t.min}–${t.max}${t.unit})`,
      });
    }
  }
  return alerts;
}

/** 0–100 health score: share of monitored sensors in range, penalised if offline. */
export function healthFromReading(reading: Reading | null, online: boolean): { score: number; label: string } {
  if (!online) return { score: 0, label: 'Offline' };
  const evals = evaluateReading(reading);
  const known = evals.filter((e) => e.status !== 'unknown');
  const ok = known.filter((e) => e.status === 'ok').length;
  const score = known.length === 0 ? 0 : Math.round((ok / known.length) * 100);
  const label = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score > 0 ? 'Needs Attention' : 'No Data';
  return { score, label };
}
