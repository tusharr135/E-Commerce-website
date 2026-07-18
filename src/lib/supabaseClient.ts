/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_PROJECT_ID') &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey.length > 20;

// Always log so we can confirm in browser console
console.log('[Supabase] URL:', supabaseUrl || '(missing)');
console.log('[Supabase] Key set:', Boolean(supabaseAnonKey));
console.log('[Supabase] isConfigured:', isSupabaseConfigured);

if (!isSupabaseConfigured) {
  console.warn('[Supabase] NOT configured — using localStorage mock. Check .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);

// Live connection test
if (isSupabaseConfigured) {
  supabase.from('products').select('*', { count: 'exact', head: true }).then(({ count, error }) => {
    if (error) {
      console.error('[Supabase] Connection FAILED:', error.message);
    } else {
      console.log(`[Supabase] ✅ Connected — products: ${count} rows`);
    }
  });
}
