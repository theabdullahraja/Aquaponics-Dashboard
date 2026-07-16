export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Calls the server-side /api/chat endpoint (Groq stays hidden behind it). */
export async function askAssistant(messages: ChatMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (HTTP ${res.status})`);
  return data.reply as string;
}
