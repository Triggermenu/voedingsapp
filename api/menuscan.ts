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

  const { phase, image, conditions, mediaType, dishes } = req.body ?? {}

  // Phase 1: afbeelding → scores per gerecht
  if (phase === 1 || !phase) {
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

Scan de volledige afbeelding van boven naar beneden. Geef maximaal 15 gerechten terug — kies de meest herkenbare hoofd- en bijgerechten. Sla drankjes over tenzij er verder weinig gerechten zijn.
Schrijf alle tekst in het Nederlands.

Antwoord UITSLUITEND als geldig JSON:
{
  "results": [
    {
      "dish": "naam van het gerecht",
      "scores": {
        ${scoreFields}
      },
      "overallNote": "één zin samenvatting van het advies"
    }
  ]
}`

    try {
      const client = new Anthropic()
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
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
      console.error('menuscan fase 1 error:', err)
      if (err instanceof Anthropic.AuthenticationError) {
        return res.status(500).json({ error: 'API-configuratie ontbreekt. Neem contact op met de beheerder.' })
      }
      if (err instanceof Anthropic.APIError) {
        return res.status(500).json({ error: `AI-fout (${err.status}): ${err.message}` })
      }
      return res.status(500).json({ error: 'Er ging iets mis bij de analyse. Probeer opnieuw.' })
    }
  }

  // Phase 2: tekst-only → uitleg + obervragen per gerecht
  if (phase === 2) {
    if (!Array.isArray(dishes) || dishes.length === 0 || !Array.isArray(conditions) || conditions.length === 0) {
      return res.status(400).json({ error: 'Ontbrekende velden voor fase 2' })
    }

    const activeContext = conditions
      .map((c: string) => CONDITION_CONTEXT[c] ?? c)
      .join('; ')

    const dishList = (dishes as Array<{ dish: string; scores: Record<string, { score: number }> }>)
      .map((d) => {
        const scoreStr = Object.entries(d.scores)
          .map(([k, v]) => `${k}: ${v.score}`)
          .join(', ')
        return `- ${d.dish} (scores: ${scoreStr})`
      })
      .join('\n')

    const prompt = `Je bent een voedingsadviseur voor iemand met: ${activeContext}.

De volgende gerechten zijn zojuist gescoord (0=veilig, 1=matig, 2=voorzichtig, 3=vermijden):
${dishList}

Geef per gerecht:
1. Een uitleg van 2-3 zinnen waarom dit gerecht deze scores krijgt. Benoem concrete ingrediënten of bereidingswijzen die relevant zijn.
2. 1-2 concrete vragen die de gast aan de ober kan stellen voor meer zekerheid.

Schrijf in het Nederlands. Antwoord UITSLUITEND als geldig JSON:
{
  "details": [
    {
      "dish": "exacte naam zoals hierboven",
      "explanation": "2-3 zinnen uitleg",
      "waiterQuestions": ["Vraag 1", "Vraag 2"]
    }
  ]
}`

    try {
      const client = new Anthropic()
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return res.status(500).json({ error: 'Kon uitleg niet verwerken' })

      const parsed = JSON.parse(jsonMatch[0])
      return res.status(200).json(parsed)
    } catch (err) {
      console.error('menuscan fase 2 error:', err)
      if (err instanceof Anthropic.AuthenticationError) {
        return res.status(500).json({ error: 'API-configuratie ontbreekt. Neem contact op met de beheerder.' })
      }
      if (err instanceof Anthropic.APIError) {
        return res.status(500).json({ error: `AI-fout (${err.status}): ${err.message}` })
      }
      return res.status(500).json({ error: 'Uitleg kon niet worden opgehaald.' })
    }
  }

  return res.status(400).json({ error: 'Ongeldig phase-veld' })
}
