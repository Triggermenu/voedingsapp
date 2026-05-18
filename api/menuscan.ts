import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const RATE_LIMIT = 12 // scans per IP
const RATE_WINDOW_MS = 60 * 60 * 1000 // per uur

/**
 * Rate limiting per IP via Supabase. Geen accounts nodig (zie R-007).
 * Faalt "open" bij een Supabase-storing: een outage mag de scan niet blokkeren —
 * de Anthropic budget-cap (acties-peter.md A-5) is de financiële achtervang.
 * Retourneert true als het request is toegestaan.
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('menuscan: Supabase env vars ontbreken — rate limiting overgeslagen')
    return true
  }
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString()

    const { count, error } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('requested_at', since)
    if (error) throw error

    if ((count ?? 0) >= RATE_LIMIT) return false

    await supabase.from('rate_limits').insert({ ip })
    // opruimen: oude rijen weghalen zodat de tabel klein blijft
    await supabase.from('rate_limits').delete().lt('requested_at', since)
    return true
  } catch (err) {
    console.error('menuscan: rate limit check mislukt, request toegestaan:', err)
    return true
  }
}

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}

const CONDITION_CONTEXT: Record<string, string> = {
  jicht: 'jicht (vermijd hoog purinegehalte >200mg/100g, alcohol altijd rood)',
  migraine: 'migraine (vermijd rode wijn, MSG, gerijpte kaas, gecureerd vlees met nitriet)',
  nierstenen: 'nierstenen (vermijd hoog oxalaat >50mg/100g, hoog natrium)',
  histamine: 'histamine-intolerantie (vermijd histamine, liberatoren en DAO-blokkers)',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const allowed = await checkRateLimit(getClientIp(req))
  if (!allowed) {
    return res.status(429).json({
      error: `Je hebt het maximum van ${RATE_LIMIT} scans per uur bereikt. Probeer het later opnieuw.`,
    })
  }

  const { image, conditions, mediaType } = req.body ?? {}
  if (!image || !Array.isArray(conditions) || conditions.length === 0) {
    return res.status(400).json({ error: 'Ontbrekende velden' })
  }

  const validMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const safeMediaType = validMediaTypes.includes(mediaType) ? mediaType : 'image/jpeg'

  const activeContext = conditions
    .map((c: string) => CONDITION_CONTEXT[c] ?? c)
    .join('; ')

  const scoreFields = conditions
    .map((c: string) => `"${c}": { "score": 0, "note": "korte uitleg in het Nederlands" }`)
    .join(',\n        ')

  const prompt = `Analyseer deze restaurantmenukaart voor iemand met: ${activeContext}.

Scoreschaal:
0 = veilig  |  1 = matig (met mate)  |  2 = voorzichtig (beperken)  |  3 = vermijden

Geef alleen gerechten terug die duidelijk leesbaar op de kaart staan. Maximaal 12 gerechten.
Schrijf alle tekst in het Nederlands.

Antwoord UITSLUITEND als geldig JSON:
{
  "results": [
    {
      "dish": "naam van het gerecht",
      "scores": {
        ${scoreFields}
      },
      "overallNote": "één zin samenvatting van het advies",
      "explanation": "2-3 zinnen waarom dit gerecht deze scores krijgt — benoem concrete ingrediënten of bereidingswijzen die relevant zijn voor de aandoening(en). Wees specifiek en informatief.",
      "waiterQuestions": [
        "Concrete vraag die de gast aan de ober kan stellen om meer zekerheid te krijgen, bijv. over bereidingswijze of ingrediënten",
        "Tweede vraag indien relevant"
      ]
    }
  ]
}`

  try {
    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: safeMediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: image,
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(500).json({ error: 'Kon resultaat niet verwerken' })

    const parsed = JSON.parse(jsonMatch[0])
    return res.status(200).json(parsed)
  } catch (err) {
    console.error('menuscan error:', err)
    if (err instanceof Anthropic.AuthenticationError) {
      return res.status(500).json({ error: 'API-configuratie ontbreekt. Neem contact op met de beheerder.' })
    }
    if (err instanceof Anthropic.APIError) {
      return res.status(500).json({ error: `AI-fout (${err.status}): ${err.message}` })
    }
    return res.status(500).json({ error: 'Er ging iets mis bij de analyse. Probeer opnieuw.' })
  }
}
