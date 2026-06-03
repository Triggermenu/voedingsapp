import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('supabase: VITE_SUPABASE_URL of VITE_SUPABASE_ANON_KEY ontbreekt — auth werkt niet')
}

// Fallback-waarden zodat createClient niet crasht bij ontbrekende env vars
// (CI, lokale dev zonder .env.local). Supabase vereist een geldige HTTPS-URL
// én een JWT-formaat key — anders gooit de library een fout die de hele app
// plat legt. De placeholder-JWT is geldig van formaat maar niet functioneel:
// auth-calls mislukken met een network error, de rest van de app werkt normaal.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.placeholder',
)
