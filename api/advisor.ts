// Vercel serverless function: POST /api/advisor
// body: { mode: 'analyze' } or { mode: 'chat', messages: [...] }
import { advise } from './_advisor-core.js';

declare const process: { env: Record<string, string | undefined> };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await advise({
      anthropicKey: process.env.ANTHROPIC_API_KEY,
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseKey: process.env.VITE_SUPABASE_KEY,
      mode: body.mode === 'chat' ? 'chat' : 'analyze',
      messages: body.messages ?? [],
      limits: body.limits,
    });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
}
