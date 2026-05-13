import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'src/data')
const TIMEOUT_MS = 10_000
const CACHE: Record<string, boolean> = {}

let checked = 0
let failed = 0

async function checkUrl(url: string): Promise<boolean> {
  if (url in CACHE) return CACHE[url]
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
    clearTimeout(timer)
    // 403/405 = server responded but blocks bots/HEAD — URL exists
    const ok = res.status < 400 || res.status === 403 || res.status === 405
    CACHE[url] = ok
    return ok
  } catch {
    CACHE[url] = false
    return false
  }
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
    const ok = await checkUrl(url)
    if (!ok) {
      failed++
      console.error(`  ✗ Onbereikbaar: ${url}`)
      console.error(`    Gebruikt in: ${urlMap[url].slice(0, 3).join(', ')}`)
    }
    return ok
  })
)

console.log(`\nGecontroleerd: ${checked} URLs`)
if (failed > 0) {
  console.error(`✗ ${failed} URL${failed !== 1 ? 's' : ''} onbereikbaar`)
  process.exit(1)
} else {
  console.log(`✓ Alle URLs bereikbaar`)
}

void results
