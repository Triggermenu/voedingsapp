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
    .from('feedback')
    .select('id, message, type, context, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('admin/feedback: query mislukt:', error)
    return res.status(500).json({ error: 'Ophalen mislukt' })
  }

  return res.status(200).json({ feedback: data ?? [] })
}
