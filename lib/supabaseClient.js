// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if ((!supabaseUrl || !supabaseAnonKey) && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SUPABASE env variables (production).')
}
if (!supabaseUrl || !supabaseAnonKey) {
  // dev fallback — app will run, but API calls will fail until you add real keys
  console.warn('Warning: SUPABASE env variables are not set. Running in dev mode without backend.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
