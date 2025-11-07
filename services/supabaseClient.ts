import { createClient } from '@supabase/supabase-js';

// import.meta.env is available at build time in Vite, but TypeScript's ImportMeta
// typing may not include 'env' in all environments (especially during server builds).
// Cast to any to avoid TS2339 errors and also fall back to process.env when available.
const env: any = (typeof import.meta !== 'undefined' ? (import.meta as any).env : process.env) || process.env;
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);