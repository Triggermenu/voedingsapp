import { createClient } from '@supabase/supabase-js'

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Valideert of de string een echte HTTP(S)-URL is — vangt ook "undefined" als string op */
function isValidHttpUrl(val: unknown): val is string {
  if (typeof val !== 'string' || !val) return false
  try {
    const u = new URL(val)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : PLACEHOLDER_URL
const supabaseAnonKey = (typeof rawKey === 'string' && rawKey.length > 10) ? rawKey : PLACEHOLDER_KEY

if (supabaseUrl === PLACEHOLDER_URL) {
  console.warn('supabase: VITE_SUPABASE_URL ontbreekt of ongeldig — admin-auth werkt niet')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
