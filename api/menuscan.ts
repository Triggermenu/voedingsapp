import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Expliciete functie-time-out. De vision-call (fase 1) + de Sonnet-stream (fase 2)
// kunnen samen tientallen seconden duren; zonder expliciete waarde kan een kort
// platform-default de functie midden in de AI-call killen — de verbinding wordt
// dan gereset (client ziet "kon server niet bereiken") nog vóór de catch/log draait.
export const config = { maxDuration: 60 }

// Ruime limieten: het doel is hard misbruik blokkeren, niet de AI inperken.
const fase1Schema = z.object({
  results: z.array(
    z.object({
      dish: z.string().max(500),
      scores: z.record(z.object({ score: z.number().int().min(0).max(3), note: z.string().max(500).optional() })),
      overallNote: z.string().max(1000).optional(),
    })
  ).max(20),
})

// Phase 2 streamt NDJSON (één detail per regel) — schema valideert per regel
const detailItemSchema = z.object({
  dish: z.string().max(500),
  explanation: z.string().max(2000),
  waiterQuestions: z.array(z.string().max(500)).max(5),
})

const RATE_LIMIT = 12 // scans per IP per uur (Supabase)
const MEMORY_LIMIT = 5 // conservatievere noodrem per instantie bij Supabase-outage
const RATE_WINDOW_MS = 60 * 60 * 1000 // per uur

/**
 * In-memory fallback teller per serverless-instantie.
 * Vercel serverless deelt geen geheugen tussen instanties, dus dit is geen
 * volledige vervanging van Supabase — wel een noodrem bij burst-aanvallen
 * op dezelfde instantie tijdens een Supabase-outage.
 */
const memFallback = new Map<string, { count: number; resetAt: number }>()

function checkMemoryRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = memFallback.get(ip)
  if (!entry || entry.resetAt < now) {
    memFallback.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= MEMORY_LIMIT) return false
  entry.count++
  return true
}

/**
 * Rate limiting per IP via Supabase. Geen accounts nodig (zie R-007).
 * Bij Supabase-outage: in-memory fallback (MEMORY_LIMIT=5) als noodrem.
 * De Anthropic budget-cap (acties-peter.md A-5) blijft de financiële achtervang.
 * Retourneert true als het request is toegestaan.
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  // Supabase hernoemde de service-role key naar "secret key" (sb_secret_…).
  // Accepteer beide namen zodat de bestaande Vercel-var werkt.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    console.error('menuscan: Supabase env vars ontbreken — in-memory fallback actief')
    return checkMemoryRateLimit(ip)
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
    console.error('menuscan: Supabase rate limit mislukt — in-memory fallback actief:', err)
    return checkMemoryRateLimit(ip)
  }
}

function getClientIp(req: VercelRequest): string {
  // Vercel's edge-proxy strikt client-aanpasbare x-forwarded-for niet altijd,
  // maar in de Vercel-architectuur worden BEIDE headers door de proxy gezet en
  // is de eerste waarde betrouwbaar (proxy plakt de echte client-IP vooraan).
  const vercelFwd = req.headers['x-vercel-forwarded-for']
  if (typeof vercelFwd === 'string' && vercelFwd.length > 0) return vercelFwd.split(',')[0].trim()
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

const ALLOWED_ORIGINS = new Set([
  'https://triggermenu.nl',
  'https://www.triggermenu.nl',
])

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin
  if (typeof origin === 'string' && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res)
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

    if (typeof image !== 'string' || image.length > 5_000_000) {
      return res.status(413).json({ error: 'Afbeelding te groot (max ~3,5 MB)' })
    }

    const validMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const safeMediaType = validMediaTypes.includes(mediaType) ? mediaType : 'image/jpeg'

    const validConditions = (conditions as string[]).filter((c) => c in CONDITION_CONTEXT)
    if (validConditions.length === 0) {
      return res.status(400).json({ error: 'Geen geldige aandoeningen opgegeven' })
    }

    const activeContext = validConditions
      .map((c) => CONDITION_CONTEXT[c])
      .join('; ')

    const scoreFields = validConditions
      .map((c) => `"${c}": { "score": 0, "note": "korte uitleg in het Nederlands" }`)
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
        // Phase 1: snelle score-pass op Haiku 4.5 (2-3x sneller dan Sonnet, ruim genoeg
        // voor JSON-output met scores 0-3). Phase 2 blijft op Sonnet voor uitlegkwaliteit.
        // max_tokens 2048: 15 gerechten × scores × notes hebben ~1500 tokens nodig;
        // krapper geeft truncatie en JSON.parse-fouten.
        model: 'claude-haiku-4-5',
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
      if (!jsonMatch) {
        console.error('menuscan fase 1: geen JSON in AI-response. Tekst:', text.slice(0, 500))
        return res.status(500).json({ error: 'Kon resultaat niet verwerken' })
      }

      let rawJson: unknown
      try {
        rawJson = JSON.parse(jsonMatch[0])
      } catch (parseErr) {
        console.error('menuscan fase 1: JSON.parse mislukt:', parseErr, 'JSON-blok:', jsonMatch[0].slice(0, 500))
        return res.status(500).json({ error: 'Kon resultaat niet verwerken' })
      }

      const parsed = fase1Schema.safeParse(rawJson)
      if (!parsed.success) {
        console.error('menuscan fase 1: Zod-validatie mislukt:', JSON.stringify(parsed.error.issues), 'Raw:', JSON.stringify(rawJson).slice(0, 500))
        return res.status(500).json({ error: 'Onverwacht responsformaat van AI' })
      }
      return res.status(200).json(parsed.data)
    } catch (err) {
      const errName = err instanceof Error ? err.constructor.name : typeof err
      const errMsg = err instanceof Error ? err.message : String(err)
      // Alles in één log-regel zodat Vercel-tabel het toont
      console.error(`menuscan fase 1 ${errName}: ${errMsg.replace(/\n/g, ' | ').slice(0, 800)}`)
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

    const validConditions2 = (conditions as string[]).filter((c) => c in CONDITION_CONTEXT)
    if (validConditions2.length === 0) {
      return res.status(400).json({ error: 'Geen geldige aandoeningen opgegeven' })
    }

    const activeContext = validConditions2
      .map((c) => CONDITION_CONTEXT[c])
      .join('; ')

    if ((dishes as unknown[]).length > 20) {
      return res.status(400).json({ error: 'Te veel gerechten (max 20)' })
    }

    const dishList = (dishes as Array<{ dish: string; scores: Record<string, { score: number }> }>)
      .map((d) => {
        // Sanitize dish-naam: max 100 tekens, geen newlines (prompt injection preventie)
        const safeDish = String(d.dish ?? '').replace(/[\r\n]/g, ' ').slice(0, 100)
        // Alleen bekende condition-keys en integer scores 0-3 doorlaten
        const scoreStr = Object.entries(d.scores ?? {})
          .filter(([k, v]) => k in CONDITION_CONTEXT && Number.isInteger(v.score) && v.score >= 0 && v.score <= 3)
          .map(([k, v]) => `${k}: ${v.score}`)
          .join(', ')
        return `- ${safeDish} (scores: ${scoreStr})`
      })
      .join('\n')

    const prompt = `Je bent een voedingsadviseur voor iemand met: ${activeContext}.

De volgende gerechten zijn zojuist gescoord (0=veilig, 1=matig, 2=voorzichtig, 3=vermijden):
${dishList}

Geef per gerecht:
1. Een uitleg van 2-3 zinnen waarom dit gerecht deze scores krijgt. Benoem concrete ingrediënten of bereidingswijzen die relevant zijn.
2. 1-2 ober-vragen. Strikte regels:
   - Maximaal 12 woorden per vraag
   - Eén ingrediënt of bereidingsstap per vraag (NIET "X of Y of Z" combineren)
   - Actie-gericht: "Kan dit zonder X bereid worden?" is beter dan "Bevat dit X?"
   - Vraag NIET naar dingen die je in de uitleg hierboven al noemt
   - Noem de aandoening NIET in de vraag (geen "voor jicht", "voor mijn migraine", etc.) — de gast weet zelf waarom hij vraagt
   - Schrijf de vraag zoals de gast 'm letterlijk zou uitspreken aan de ober

Goede voorbeelden:
   • "Kan dit gerecht zonder room bereid worden?"
   • "Wordt de saus met bouillonblokjes gemaakt?"
   • "Is het vlees gemarineerd of gerookt?"

Slechte voorbeelden (vermijden):
   • "Welke sauzen worden gebruikt en bevat het worcestersaus?" (te lang, multi-clause)
   • "Bevat dit gerecht worcestersaus?" (al genoemd in de uitleg → redundant)
   • "Welke ingrediënten zijn relevant voor mijn jicht?" (aandoening noemen, niet specifiek)

Schrijf in het Nederlands.

KRITIEK — output-formaat:
Antwoord in NDJSON (JSON Lines): ÉÉN compleet JSON-object PER REGEL.
GEEN omhullend object, GEEN array, GEEN markdown code-blocks, GEEN extra tekst voor of na.
Elke regel exact deze structuur:
{"dish":"exacte naam","explanation":"2-3 zinnen","waiterQuestions":["vraag 1","vraag 2"]}

Schrijf de gerechten in dezelfde volgorde als hierboven, één gerecht per regel, eindig elke regel met \\n.`

    try {
      const client = new Anthropic()
      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })

      // Streaming response: NDJSON met één gevalideerd detail per regel
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('X-Accel-Buffering', 'no') // schakel proxy-buffering uit

      let buffer = ''
      const emitLine = (raw: string) => {
        const line = raw.trim()
        if (!line || line.startsWith('```')) return
        try {
          const parsed = detailItemSchema.safeParse(JSON.parse(line))
          if (parsed.success) {
            res.write(JSON.stringify(parsed.data) + '\n')
          }
        } catch {
          // partial of malformed regel — sla over (deltas worden samengevoegd in buffer)
        }
      }

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          buffer += event.delta.text
          let nl: number
          while ((nl = buffer.indexOf('\n')) !== -1) {
            emitLine(buffer.slice(0, nl))
            buffer = buffer.slice(nl + 1)
          }
        }
      }
      emitLine(buffer) // laatste regel zonder afsluitende \n
      res.end()
      return
    } catch (err) {
      const errName = err instanceof Error ? err.constructor.name : typeof err
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`menuscan fase 2 ${errName}: ${errMsg.replace(/\n/g, ' | ').slice(0, 800)}`)
      // Headers nog niet verzonden → normale JSON-error sturen
      if (!res.headersSent) {
        if (err instanceof Anthropic.AuthenticationError) {
          return res.status(500).json({ error: 'API-configuratie ontbreekt. Neem contact op met de beheerder.' })
        }
        if (err instanceof Anthropic.APIError) {
          return res.status(500).json({ error: `AI-fout (${err.status}): ${err.message}` })
        }
        return res.status(500).json({ error: 'Uitleg kon niet worden opgehaald.' })
      }
      // Stream al gestart → netjes afsluiten; client behoudt wat hij al had
      res.end()
      return
    }
  }

  return res.status(400).json({ error: 'Ongeldig phase-veld' })
}
