import { currentLimits } from './health';

export type Severity = 'critical' | 'warning' | 'info' | 'ok';

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  rule: string;
  spark?: number[];
}

export interface AdvisorResult {
  score: number;
  status: 'healthy' | 'attention' | 'critical';
  windowSize: number;
  analysedAt: string;
  findings: Finding[];
  analysis: { summary: string; actions: { title: string; detail: string }[] } | null;
  analysisError?: string;
  model?: string;
  usage?: { input: number; output: number };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ---- client-side cost guards (the server also caps tokens; the real hard cap is the
// spend limit set in the Anthropic console) ----
export const COOLDOWN_MS = 30_000;
export const DAILY_CAP = 40; // Claude calls (analysis + chat) per browser per day
const KEY = 'advisor-usage';

function readUsage(): { day: string; n: number } {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const u = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (u.day === today) return u;
  } catch { /* ignore */ }
  return { day: today, n: 0 };
}
export function callsToday() { return readUsage().n; }
function bump() {
  const u = readUsage();
  u.n += 1;
  try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* ignore */ }
}
function guard() {
  if (readUsage().n >= DAILY_CAP) throw new Error(`Daily AI limit reached (${DAILY_CAP} requests). Try again tomorrow.`);
}

async function post(body: unknown) {
  const res = await fetch('/api/advisor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (HTTP ${res.status})`);
  return data;
}

export async function runAnalysis(): Promise<AdvisorResult> {
  guard();
  const r = (await post({ mode: 'analyze', limits: currentLimits() })) as AdvisorResult;
  if (r.analysis) bump();
  return r;
}

export async function askAdvisor(messages: ChatMessage[]): Promise<string> {
  guard();
  const data = await post({ mode: 'chat', messages: messages.slice(-6), limits: currentLimits() });
  bump();
  return data.reply as string;
}
