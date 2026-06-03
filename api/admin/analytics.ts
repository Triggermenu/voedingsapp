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

  const vercelToken = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID ?? 'prj_B6s3v78MeKcUZh8sTeiaFurnPzUV'
  const teamId = process.env.VERCEL_TEAM_ID ?? 'team_keQZk3lB1CHshJGSoasHoqWn'

  if (!vercelToken) {
    // Geen token geconfigureerd — stuur lege data terug zodat het dashboard
    // een nette "niet beschikbaar" melding kan tonen.
    return res.status(200).json({ available: false, reason: 'VERCEL_TOKEN niet geconfigureerd' })
  }

  try {
    // Haal stats op voor de afgelopen 7 dagen
    const params = new URLSearchParams({
      projectId,
      teamId,
      environment: 'production',
      filter: JSON.stringify({ period: '7d' }),
    })

    const statsRes = await fetch(
      `https://vercel.com/api/web/insights/stats?${params}`,
      { headers: { Authorization: `Bearer ${vercelToken}` } }
    )

    if (!statsRes.ok) {
      const text = await statsRes.text()
      console.error('analytics: Vercel API fout:', statsRes.status, text.slice(0, 200))
      return res.status(200).json({ available: false, reason: `Vercel API: ${statsRes.status}` })
    }

    const data = await statsRes.json() as Record<string, unknown>

    // Top pagina's ophalen
    const pagesParams = new URLSearchParams({
      projectId,
      teamId,
      environment: 'production',
      filter: JSON.stringify({ period: '7d' }),
      limit: '10',
    })

    const pagesRes = await fetch(
      `https://vercel.com/api/web/insights/pages?${pagesParams}`,
      { headers: { Authorization: `Bearer ${vercelToken}` } }
    )

    const pagesData = pagesRes.ok ? await pagesRes.json() as Record<string, unknown> : {}

    return res.status(200).json({
      available: true,
      stats: data,
      pages: pagesData,
    })
  } catch (err) {
    console.error('analytics: onverwachte fout:', err)
    return res.status(200).json({ available: false, reason: 'Ophalen mislukt' })
  }
}
