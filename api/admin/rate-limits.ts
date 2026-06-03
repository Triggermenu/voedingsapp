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
  const { data, error } = await supabase.from('rate_limits').select('ip, requested_at').gte('requested_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).order('requested_at', { ascending: false }).limit(500)
  if (error) { console.error('admin/rate-limits:', error); return res.status(500).json({ error: 'Ophalen mislukt' }) }
  const ipMap = new Map<string, { count: number; lastSeen: string }>()
  for (const row of data ?? []) {
    const e = ipMap.get(row.ip)
    if (!e) ipMap.set(row.ip, { count: 1, lastSeen: row.requested_at })
    else { e.count++; if (row.requested_at > e.lastSeen) e.lastSeen = row.requested_at }
  }
  const rateLimits = Array.from(ipMap.entries()).map(([ip, { count, lastSeen }]) => ({ ip, count, lastSeen })).sort((a, b) => b.count - a.count).slice(0, 100)
  return res.status(200).json({ rateLimits })
}
