import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

async function checkAdmin(req: VercelRequest, res: VercelResponse): Promise<string | null> {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Niet geauthenticeerd' }); return null }
  const token = auth.slice(7)
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !key) { res.status(503).json({ error: 'Serviceconfiguratie ontbreekt' }); return null }
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) { res.status(401).json({ error: 'Ongeldig token' }); return null }
  const { data: profile, error: pe } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (pe || !profile?.is_admin) { res.status(403).json({ error: 'Geen admin-rechten' }); return null }
  return user.id
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const userId = await checkAdmin(req, res)
  if (!userId) return
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return res.status(503).json({ error: 'Serviceconfiguratie ontbreekt' })
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase.from('feedback').select('id, message, type, context, created_at').order('created_at', { ascending: false }).limit(50)
  if (error) { console.error('admin/feedback:', error); return res.status(500).json({ error: 'Ophalen mislukt' }) }
  return res.status(200).json({ feedback: data ?? [] })
}
