import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_KEY as string;

if (!url || !key) {
  // Surfaces a clear error instead of a cryptic network failure if .env is missing.
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_KEY — copy .env.example to .env');
}

export const supabase = createClient(url, key);
