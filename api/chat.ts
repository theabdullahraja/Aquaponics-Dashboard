// Vercel serverless function: POST /api/chat
// Keeps the Groq API key server-side (never shipped to the browser).
import { chatComplete } from './_chat-core.js'; // .js extension required under Vercel's ESM/nodenext resolution

// `process` is a Node runtime global; declare it so the function type-checks without @types/node.
declare const process: { env: Record<string, string | undefined> };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await chatComplete({
      groqApiKey: process.env.GROQ_API_KEY,
      groqModel: process.env.GROQ_MODEL,
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseKey: process.env.VITE_SUPABASE_KEY,
      messages: body.messages ?? [],
    });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
}
