import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('supabase: VITE_SUPABASE_URL of VITE_SUPABASE_ANON_KEY ontbreekt — auth werkt niet')
}

// Fallback op 'http://localhost' zodat createClient niet crasht bij ontbrekende
// env vars (bv. in CI of lokale dev zonder .env.local). Requests mislukken dan
// met een network error, maar de app start wel op.
export const supabase = createClient(
  supabaseUrl || 'http://localhost',
  supabaseAnonKey || 'placeholder-key',
)
