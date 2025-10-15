import { createClient } from '@supabase/supabase-js'

const VERCEL_URL = 'http://localhost:5173'; 

const SUPABASE_REST_URL = VERCEL_URL + '/api/supabase'; 
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(SUPABASE_REST_URL, SUPABASE_ANON_KEY, {
  db: {
    restUrl: SUPABASE_REST_URL + '/rest/v1' 
  }
});