import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '../_lib/requireAdmin'
import { z } from 'zod'

const bodySchema = z.object({
  ip: z.string().min(1).max(45),
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const userId = await requireAdmin(req, res)
  if (!userId) return

  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Ongeldig IP-adres' })

  const { ip } = parsed.data

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !serviceKey) return res.status(503).json({ error: 'Serviceconfiguratie ontbreekt' })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { error, count } = await supabase
    .from('rate_limits')
    .delete({ count: 'exact' })
    .eq('ip', ip)

  if (error) {
    console.error('admin/reset-rate-limit: delete mislukt:', error)
    return res.status(500).json({ error: 'Reset mislukt' })
  }

  return res.status(200).json({ ok: true, deleted: count ?? 0 })
}
