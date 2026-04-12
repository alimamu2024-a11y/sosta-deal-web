// lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

export const createBrowserSupabaseClient = (url: string, key: string) => {
  return createBrowserClient(url, key);
};