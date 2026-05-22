import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'src/data')
const TIMEOUT_MS = 10_000
const RETRIES = 2 // totaal aantal pogingen = RETRIES + 1
const RETRY_BACKOFF_MS = 1_000

/**
 * Hosts die geldig zijn maar onbetrouwbaar reageren vanaf CI-IP's
 * (bot-blocking, geo-filtering, flaky servers). Bij een NETWERKFOUT
 * (timeout / connection refused) — dus géén echt HTTP-antwoord — worden
 * deze hosts soft-passed met een waarschuwing i.p.v. de build te laten falen.
 *
 * Belangrijk: een echt HTTP-antwoord (bv. 404 = URL verplaatst) faalt nog
 * steeds. Soft-pass geldt uitsluitend voor netwerkfouten, zodat de gate
 * dode links blijft detecteren.
 *
 * - mastzellaktivierung.info → SIGHI Food Compatibility List (licentie pending,
 *   zie CLAUDE.md §2.4 / RISKS.md). Host timeout't intermitterend vanaf GitHub
 *   Actions; mirroren mag niet vanwege de licentiestatus.
 */
const FLAKY_HOSTS = ['mastzellaktivierung.info']

type CheckResult = { ok: boolean; soft: boolean; reason?: string }
const CACHE: Record<string, CheckResult> = {}

let checked = 0
let failed = 0
let softPassed = 0

function isFlakyHost(url: string): boolean {
  let host: string
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return false
  }
  return FLAKY_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
}

async function checkUrl(url: string): Promise<CheckResult> {
  if (url in CACHE) return CACHE[url]

  let lastError = 'onbekende netwerkfout'

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
      const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
      clearTimeout(timer)
      // Definitief HTTP-antwoord ontvangen. 403/405 = server blokkeert bots/HEAD,
      // maar de URL bestaat. Elke andere >=400 is een echte fout (bv. 404 verplaatst).
      const ok = res.status < 400 || res.status === 403 || res.status === 405
      const result: CheckResult = { ok, soft: false, reason: ok ? undefined : `HTTP ${res.status}` }
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

  // Alle pogingen faalden op netwerkniveau (nooit een HTTP-antwoord gekregen).
  const result: CheckResult = isFlakyHost(url)
    ? { ok: true, soft: true, reason: lastError }
    : { ok: false, soft: false, reason: lastError }
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
      console.error(`  ✗ Onbereikbaar: ${url}${reason ? ` (${reason})` : ''}`)
      console.error(`    Gebruikt in: ${urlMap[url].slice(0, 3).join(', ')}`)
    } else if (soft) {
      softPassed++
      console.warn(`  ⚠ Soft-pass (bekende onbetrouwbare host): ${url}${reason ? ` (${reason})` : ''}`)
    }
    return ok
  })
)

console.log(`\nGecontroleerd: ${checked} URLs`)
if (softPassed > 0) {
  console.warn(`⚠ ${softPassed} URL${softPassed !== 1 ? 's' : ''} soft-passed (flaky host, netwerkfout genegeerd)`)
}
if (failed > 0) {
  console.error(`✗ ${failed} URL${failed !== 1 ? 's' : ''} onbereikbaar`)
  process.exit(1)
} else {
  console.log(`✓ Alle URLs bereikbaar`)
}

void results
