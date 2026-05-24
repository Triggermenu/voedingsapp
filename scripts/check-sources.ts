import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'src/data')
const TIMEOUT_MS = 10_000
const RETRIES = 2 // totaal aantal pogingen = RETRIES + 1
const RETRY_BACKOFF_MS = 1_000

/**
 * Bron-URL-bereikbaarheid (CLAUDE.md §4.1, gate 4).
 *
 * Deze gate draait tegen externe academische/overheidshosts (USDA, Harvard, PMC,
 * SIGHI, EULAR, …) die vanaf CI-IP's regelmatig rate-limiten, bots blokkeren of
 * timeouten. Om de gate betrouwbaar genoeg te maken om als *required* status check
 * te dienen (zodat auto-merge er écht op wacht), faalt hij UITSLUITEND op een
 * definitief "dode link"-signaal:
 *
 *   - HARD FAIL → HTTP 404 / 410: de resource bestaat echt niet (meer).
 *   - SOFT PASS → alles wat niet-definitief is: netwerkfout/timeout (na retries),
 *                 401/403/405 (auth-/bot-/HEAD-blokkade), 429 (rate-limit), 5xx
 *                 (tijdelijke serverfout). Geeft een ⚠ waarschuwing, faalt niet.
 *   - OK        → 2xx/3xx.
 *
 * Zo blijft de gate verkeerde/verdwenen links detecteren zonder op transiente
 * netwerkproblemen te flakeren. Soft-passes worden geprint zodat ze zichtbaar
 * blijven voor handmatige controle.
 */
const DEAD_STATUSES = new Set([404, 410])

type CheckResult = { ok: boolean; soft: boolean; reason?: string }
const CACHE: Record<string, CheckResult> = {}

let checked = 0
let failed = 0
let softPassed = 0

async function checkUrl(url: string): Promise<CheckResult> {
  if (url in CACHE) return CACHE[url]

  let lastError = 'onbekende netwerkfout'

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
      clearTimeout(timer)

      let result: CheckResult
      if (res.status < 400) {
        result = { ok: true, soft: false }
      } else if (DEAD_STATUSES.has(res.status)) {
        // Definitief dode link — de enige harde faalconditie.
        result = { ok: false, soft: false, reason: `HTTP ${res.status}` }
      } else {
        // 401/403/405/429/5xx: bestaat, maar het antwoord is niet-definitief.
        result = { ok: true, soft: true, reason: `HTTP ${res.status} (niet-definitief)` }
      }
      CACHE[url] = result
      return result
    } catch (e) {
      // Netwerkfout / timeout — geen HTTP-antwoord. Retry met backoff.
      lastError = e instanceof Error ? e.message : String(e)
      if (attempt < RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS * (attempt + 1)))
      }
    }
  }

  // Nooit een HTTP-antwoord gekregen (timeout/connection refused/DNS) → niet-definitief.
  const result: CheckResult = { ok: true, soft: true, reason: `netwerkfout: ${lastError}` }
  CACHE[url] = result
  return result
}

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
const urlMap: Record<string, string[]> = {}

for (const file of files) {
  const data = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8')) as {
    items: Array<{ name: { nl: string }; scores: Record<string, { sources?: Array<{ url: string }> } | null> }>
  }
  for (const item of data.items) {
    for (const score of Object.values(item.scores)) {
      if (!score) continue
      for (const src of score.sources ?? []) {
        if (!urlMap[src.url]) urlMap[src.url] = []
        urlMap[src.url].push(`${file} > ${item.name.nl}`)
      }
    }
  }
}

const uniqueUrls = Object.keys(urlMap)
console.log(`Controleren van ${uniqueUrls.length} unieke bron-URLs...`)

const results = await Promise.allSettled(
  uniqueUrls.map(async (url) => {
    checked++
    const { ok, soft, reason } = await checkUrl(url)
    if (!ok) {
      failed++
      console.error(`  ✗ Dode link: ${url}${reason ? ` (${reason})` : ''}`)
      console.error(`    Gebruikt in: ${urlMap[url].slice(0, 3).join(', ')}`)
    } else if (soft) {
      softPassed++
      console.warn(`  ⚠ Soft-pass (niet-definitief): ${url}${reason ? ` (${reason})` : ''}`)
    }
    return ok
  })
)

console.log(`\nGecontroleerd: ${checked} URLs`)
if (softPassed > 0) {
  console.warn(`⚠ ${softPassed} URL${softPassed !== 1 ? 's' : ''} soft-passed (niet-definitief — handmatig nakijken aangeraden)`)
}
if (failed > 0) {
  console.error(`✗ ${failed} dode link${failed !== 1 ? 's' : ''} (HTTP 404/410)`)
  process.exit(1)
} else {
  console.log(`✓ Geen dode links`)
}

void results
