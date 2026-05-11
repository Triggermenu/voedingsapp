import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const RATE_LIMIT: Record<string, { count: number; resetAt: number }> = {}
const MAX_REQUESTS_PER_HOUR = 10

function getRateLimitKey(req: VercelRequest): string {
  return req.headers['x-forwarded-for']?.toString().split(',')[0] ?? 'unknown'
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT[key]
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT[key] = { count: 1, resetAt: now + 3600_000 }
    return false
  }
  if (entry.count >= MAX_REQUESTS_PER_HOUR) return true
  entry.count++
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Auth check
  const accessCode = req.headers['x-access-code']
  if (!accessCode || accessCode !== process.env.MENUSCAN_ACCESS_CODE) {
    res.status(401).json({ error: 'Invalid access code' })
    return
  }

  // Rate limit
  const key = getRateLimitKey(req)
  if (isRateLimited(key)) {
    res.status(429).json({ error: 'Rate limit exceeded. Try again later.' })
    return
  }

  const { image, conditions, mediaType } = req.body as {
    image: string
    conditions: string[]
    mediaType: string
  }

  if (!image || !conditions?.length) {
    res.status(400).json({ error: 'Missing image or conditions' })
    return
  }

  const conditionDescriptions: Record<string, string> = {
    jicht: 'gout (avoid high-purine foods: organ meats, anchovies, sardines, alcohol especially beer)',
    migraine: 'migraine (avoid: alcohol especially red wine, aged cheese, cured meats with nitrites, MSG)',
    nierstenen: 'kidney stones (avoid high-oxalate foods: spinach, beets, nuts, dark chocolate)',
    histamine: 'histamine intolerance (avoid: aged/fermented foods, alcohol, smoked fish, aged cheese, tomatoes)',
  }

  const activeConditions = conditions
    .map((c) => conditionDescriptions[c])
    .filter(Boolean)
    .join('; ')

  const prompt = `You are a dietary advisor. Analyze this menu image and identify dishes.
For each dish, provide a traffic light score (0=safe, 1=moderate, 2=caution, 3=avoid) for each of these conditions the user has: ${activeConditions}.

Respond in JSON format:
{
  "results": [
    {
      "dish": "dish name",
      "scores": {
        ${conditions.map((c) => `"${c}": { "score": 0-3, "note": "brief Dutch explanation" }`).join(',\n        ')}
      },
      "overallNote": "brief Dutch note about this dish in general, mention preparation uncertainty if relevant"
    }
  ]
}

Important:
- When uncertain about ingredients or preparation, default to a cautious score (not green)
- Add "Vraag de bediening naar exacte bereiding" in notes when preparation matters
- Respond ONLY with valid JSON, no other text`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: (mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp') ?? 'image/jpeg',
                data: image,
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      res.status(500).json({ error: 'Unexpected response type' })
      return
    }

    const parsed = JSON.parse(content.text) as { results: unknown[] }
    res.status(200).json(parsed)
  } catch (err) {
    console.error('Menuscan error:', err)
    res.status(500).json({ error: 'Analysis failed. Try again.' })
  }
}
