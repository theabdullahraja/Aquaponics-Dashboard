import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

// ---- Types (mirror the Supabase tables the ESP32 firmware uses) ----
export type Reading = {
  id: number;
  ts: string;
  temp_c: number | null;
  ph: number | null;
  flow_lpm: number | null;
};

export type ActuatorTarget = 'water_pump' | 'air_pump';

export type ActuatorStatus = {
  target: ActuatorTarget;
  state: boolean;
  updated_at: string;
};

// Poll cadence: ESP pushes readings every ~3s, so 2s polling shows fresh data within ~2s.
const POLL_MS = 2000;

/** Latest sensor reading, refreshed every 2s. */
export function useLatestReading() {
  const [reading, setReading] = useState<Reading | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from('readings')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
      if (active && data && data[0]) setReading(data[0] as Reading);
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);
  return reading;
}

/** Recent readings (oldest→newest) for charts, refreshed every 2s. */
export function useReadingsHistory(limit = 60) {
  const [rows, setRows] = useState<Reading[]>([]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from('readings')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);
      if (active && data) setRows([...(data as Reading[])].reverse());
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [limit]);
  return rows;
}

/** Reported actuator states keyed by target (what the pumps are actually doing). */
export function useActuatorStatus() {
  const [status, setStatus] = useState<Partial<Record<ActuatorTarget, ActuatorStatus>>>({});
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase.from('actuator_status').select('*');
      if (active && data) {
        const byTarget: Partial<Record<ActuatorTarget, ActuatorStatus>> = {};
        for (const row of data as ActuatorStatus[]) byTarget[row.target] = row;
        setStatus(byTarget);
      }
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);
  return status;
}

/** Write a desired pump state (dashboard → commands). ESP applies it within ~1s and
 *  writes back actuator_status. "now" is cast to a timestamp by Postgres (no trigger needed). */
export async function setPumpCommand(target: ActuatorTarget, state: boolean) {
  return supabase.from('commands').update({ state, updated_at: 'now' }).eq('target', target);
}

/** True while the newest reading is fresh (device is pushing). Drives the "System Online" badge. */
export function useSystemOnline(reading: Reading | null, thresholdMs = 12000) {
  const [online, setOnline] = useState(false);
  const readingRef = useRef(reading);
  readingRef.current = reading;
  useEffect(() => {
    const check = () => {
      const r = readingRef.current;
      setOnline(!!r && Date.now() - new Date(r.ts).getTime() < thresholdMs);
    };
    check();
    const t = setInterval(check, 2000);
    return () => clearInterval(t);
  }, [thresholdMs]);
  return online;
}
