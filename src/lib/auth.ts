import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

// Login-only auth: the operator account is pre-created in Supabase
// (Authentication -> Users). There is no signup flow.

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Map Supabase's message to something demo-friendly.
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return { error: 'Incorrect email or password.' };
    }
    return { error: error.message };
  }
  return { error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Session persisted in localStorage by supabase-js; restores login across refreshes. */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(callback: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
