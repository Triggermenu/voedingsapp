import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const MAX_LEN = 2000
const VALID_TYPES = ['idee', 'probleem', 'item-mist', 'algemeen']

/**
 * Slaat gebruikersfeedback op in de Supabase-tabel `feedback`.
 * Bewust géén gezondheidsgegevens: alleen het bericht, een type en een korte
 * context (pagina of zoekterm). Geen profiel/aandoeningen, geen IP, geen account.
 */
const ALLOWED_ORIGINS = new Set([
  'https://triggermenu.nl',
  'https://www.triggermenu.nl',
])

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin
  if (typeof origin === 'string' && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, type, context } = req.body ?? {}
  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Leeg bericht' })
  }

  const trimmed = message.trim().slice(0, MAX_LEN)
  const safeType = typeof type === 'string' && VALID_TYPES.includes(type) ? type : 'algemeen'
  const safeContext = typeof context === 'string' ? context.replace(/[\r\n]/g, ' ').slice(0, 200) : null

  const url = process.env.SUPABASE_URL
  // Supabase hernoemde de service-role key naar "secret key" (sb_secret_…).
  // Accepteer beide namen zodat de bestaande Vercel-var werkt.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    console.error('feedback: Supabase env vars ontbreken')
    return res.status(503).json({ error: 'Feedback is tijdelijk niet beschikbaar.' })
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { error } = await supabase
      .from('feedback')
      .insert({ message: trimmed, type: safeType, context: safeContext })
    if (error) throw error
    // Best-effort mailnotificatie — blokkeert het opslaan niet als 'ie faalt.
    await notifyByEmail(safeType, trimmed, safeContext)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('feedback insert mislukt:', err)
    return res.status(500).json({ error: 'Kon feedback niet opslaan.' })
  }
}

/**
 * Stuurt een mailtje per feedback via Resend. Doet niets als RESEND_API_KEY
 * ontbreekt (dan blijft feedback gewoon in de Supabase-tabel staan).
 * Fouten worden geslikt zodat de feedback-respons nooit faalt door de mail.
 */
async function notifyByEmail(type: string, message: string, context: string | null) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const to = process.env.FEEDBACK_NOTIFY_EMAIL ?? 'peter.wolterman@gmail.com'
  const from = process.env.FEEDBACK_FROM_EMAIL ?? 'Triggermenu <onboarding@resend.dev>'
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Triggermenu feedback — ${type}`,
        text: `Type: ${type}\nPagina: ${context ?? '-'}\n\n${message}`,
      }),
    })
  } catch (err) {
    console.error('feedback: e-mailnotificatie mislukt (genegeerd):', err)
  }
}
