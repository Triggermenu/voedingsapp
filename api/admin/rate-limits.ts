import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../_lib/requireAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const userId = await requireAdmin(req, res)
  if (!userId) return

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) return res.status(503).json({ error: 'Serviceconfiguratie ontbreekt' })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from('rate_limits')
    .select('ip, requested_at')
    .gte('requested_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('requested_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('admin/rate-limits: query mislukt:', error)
    return res.status(500).json({ error: 'Ophalen mislukt' })
  }

  // Groepeer per IP
  const ipMap = new Map<string, { count: number; lastSeen: string }>()
  for (const row of data ?? []) {
    const entry = ipMap.get(row.ip)
    if (!entry) {
      ipMap.set(row.ip, { count: 1, lastSeen: row.requested_at })
    } else {
      entry.count++
      if (row.requested_at > entry.lastSeen) entry.lastSeen = row.requested_at
    }
  }

  const rateLimits = Array.from(ipMap.entries())
    .map(([ip, { count, lastSeen }]) => ({ ip, count, lastSeen }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100)

  return res.status(200).json({ rateLimits })
}
