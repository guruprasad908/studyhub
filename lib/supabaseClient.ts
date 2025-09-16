// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in demo mode (placeholder credentials)
export const isDemoMode = () => {
  // Use typeof window to ensure this runs on client side
  if (typeof window === 'undefined') {
    // Server side check
    return (
      !supabaseUrl || 
      !supabaseAnonKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseAnonKey.includes('placeholder') ||
      supabaseUrl === 'https://placeholder.supabase.co' ||
      supabaseAnonKey === 'placeholder_anon_key_for_development'
    )
  }
  
  // Client side check using window.location or environment
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const clientKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    !clientUrl || 
    !clientKey || 
    clientUrl.includes('placeholder') || 
    clientKey.includes('placeholder') ||
    clientUrl === 'https://placeholder.supabase.co' ||
    clientKey === 'placeholder_anon_key_for_development'
  )
}

if ((!supabaseUrl || !supabaseAnonKey) && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SUPABASE env variables (production).')
}
if (isDemoMode()) {
  console.warn('🎭 Running in DEMO MODE: Supabase functionality disabled. Add real credentials to .env.local for full features.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')