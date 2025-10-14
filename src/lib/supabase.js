import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function cleanSupabaseUrl(url) {
  if (typeof url === 'string' && url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
}

const cleanedUrl = cleanSupabaseUrl(SUPABASE_URL);

export const supabase = createClient(cleanedUrl, SUPABASE_ANON_KEY)