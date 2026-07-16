import { createClient } from '@supabase/supabase-js';

// These two values are PUBLIC-SAFE by design: the publishable key is exposed in the client
// bundle and the database is guarded by RLS. Env vars take precedence (so a different project
// can be swapped in), but we fall back to the known project so the deployed site always
// connects even if a Vercel env var is missing/misconfigured.
const FALLBACK_URL = 'https://tgznzlgkxmbyuyhnemgc.supabase.co';
const FALLBACK_KEY = 'sb_publishable_7OIZZmoEtV8yYL6ZPsZLTw_Oy0-qw1T';

const url = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_URL;
const key = (import.meta.env.VITE_SUPABASE_KEY as string) || FALLBACK_KEY;

export const supabase = createClient(url, key);
