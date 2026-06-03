import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Middleware voor admin-only API endpoints.
 * Verwacht een Supabase access token in de Authorization header als Bearer token.
 * Controleert is_admin=true in de profiles tabel.
 * Retourneert de user ID bij succes, null bij falen (response is al gestuurd).
 */
export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): Promise<string | null> {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Niet geauthenticeerd' })
    return null
  }

  const token = auth.slice(7)
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) {
    res.status(503).json({ error: 'Serviceconfiguratie ontbreekt' })
    return null
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    res.status(401).json({ error: 'Ongeldig of verlopen token' })
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    res.status(403).json({ error: 'Geen admin-rechten' })
    return null
  }

  return user.id
}
