import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const CONDITION_CONTEXT: Record<string, string> = {
  jicht: 'jicht (vermijd hoog purinegehalte >200mg/100g, alcohol altijd rood)',
  migraine: 'migraine (vermijd rode wijn, MSG, gerijpte kaas, gecureerd vlees met nitriet)',
  nierstenen: 'nierstenen (vermijd hoog oxalaat >50mg/100g, hoog natrium)',
  histamine: 'histamine-intolerantie (vermijd histamine, liberatoren en DAO-blokkers)',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const code = req.headers['x-access-code']
  const validCode = process.env.SCAN_ACCESS_CODE
  if (!validCode || code !== validCode) {
    return res.status(401).json({ error: 'Ongeldige toegangscode' })
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
Schrijf alle tekst in het Nederlands. Wees bondig in de notes (max 10 woorden per note).

Antwoord UITSLUITEND als geldig JSON:
{
  "results": [
    {
      "dish": "naam van het gerecht",
      "scores": {
        ${scoreFields}
      },
      "overallNote": "één zin samenvatting"
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
    console.error('menuscan error:', err)
    return res.status(500).json({ error: 'Er ging iets mis bij de analyse' })
  }
}
