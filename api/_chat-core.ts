// Runtime-agnostic core for the aquaponics assistant. Used by both the Vercel
// serverless function (api/chat.ts) and the Vite dev middleware (vite.config.ts),
// so the Groq API key never reaches the browser.

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatArgs {
  groqApiKey?: string;
  groqModel?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  messages: ChatMessage[];
}

const DEFAULT_MODEL = 'openai/gpt-oss-20b'; // current Groq open-weight model (Llama 3.x deprecated 2026-06)

/** Pulls the latest reading + pump states from Supabase so the assistant can answer
 *  questions about the live system, not just give generic advice. */
async function buildContext(url?: string, key?: string): Promise<string> {
  if (!url || !key) return 'Live system data is currently unavailable.';
  try {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    const [readingsRes, statusRes] = await Promise.all([
      fetch(`${url}/rest/v1/readings?select=ts,temp_c,ph,flow_lpm&order=id.desc&limit=1`, { headers }),
      fetch(`${url}/rest/v1/actuator_status?select=target,state`, { headers }),
    ]);
    const readings = (await readingsRes.json()) as any[];
    const status = (await statusRes.json()) as any[];
    const r = readings?.[0];
    const ageSec = r ? Math.round((Date.now() - new Date(r.ts).getTime()) / 1000) : null;
    const pump = (t: string) => (status?.find((s) => s.target === t)?.state ? 'ON' : 'OFF');

    return [
      'LIVE SYSTEM DATA (use this to answer questions about the current system):',
      r
        ? `- Latest reading (${ageSec}s ago): temperature ${r.temp_c}°C, pH ${r.ph}, flow ${r.flow_lpm} L/min`
        : '- No sensor readings available yet.',
      `- Water pump: ${pump('water_pump')} | Air pump: ${pump('air_pump')}`,
      '- Safe ranges: temperature 20–26°C, pH 6.8–7.5.',
      ageSec != null && ageSec > 15 ? '- NOTE: the device appears OFFLINE (reading is stale).' : '',
    ]
      .filter(Boolean)
      .join('\n');
  } catch {
    return 'Live system data is temporarily unavailable.';
  }
}

export async function chatComplete(args: ChatArgs): Promise<{ reply: string }> {
  if (!args.groqApiKey) throw new Error('GROQ_API_KEY is not configured on the server.');

  const context = await buildContext(args.supabaseUrl, args.supabaseKey);
  const system = [
    'You are the assistant built into a Smart Aquaponics IoT monitoring dashboard (a final-year project).',
    'The system monitors water temperature, pH, and flow rate, and controls a water pump and an air pump.',
    'Answer concisely and practically. When asked about current values or system status, use the live data below.',
    'For advice, give clear, actionable steps suitable for an aquaponics operator. Do not invent sensors the',
    'system does not have (it has temperature, pH, and flow only — no water-level or dissolved-oxygen sensor).',
    '',
    context,
  ].join('\n');

  const model = args.groqModel || DEFAULT_MODEL;
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${args.groqApiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 600,
      messages: [{ role: 'system', content: system }, ...args.messages],
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Groq API ${resp.status}: ${detail.slice(0, 300)}`);
  }
  const data = (await resp.json()) as any;
  return { reply: data.choices?.[0]?.message?.content ?? '(no response)' };
}
