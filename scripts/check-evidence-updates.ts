/**
 * Maandelijkse check op nieuwe wetenschappelijke evidence voor de vier aandoeningen.
 * Gebruikt PubMed E-utilities (geen API key nodig) + Last-Modified op primaire bronnen.
 *
 * Exit codes:
 *   0 = niets gevonden
 *   2 = bevindingen aanwezig → workflow opent GitHub issue
 */

const PUBMED_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const TIMEOUT_MS = 15_000
const DAYS_LOOKBACK = 32

interface PubMedSearchResult {
  esearchresult: { idlist: string[]; count: string }
}

interface PubMedSummaryResult {
  result: Record<string, { uid: string; title: string; fulljournalname: string; pubdate: string }>
}

const SEARCHES = [
  {
    condition: 'Jicht',
    query: '(gout OR hyperuricemia OR "uric acid") AND (diet OR food OR purine) AND (systematic review[pt] OR meta-analysis[pt])',
  },
  {
    condition: 'Migraine',
    query: '(migraine) AND (diet OR food OR trigger) AND (systematic review[pt] OR meta-analysis[pt])',
  },
  {
    condition: 'Nierstenen',
    query: '(kidney stones OR nephrolithiasis OR oxalate) AND (diet OR food) AND (systematic review[pt] OR meta-analysis[pt])',
  },
  {
    condition: 'Histamine',
    query: '(histamine intolerance OR histaminosis) AND (diet OR food) AND (systematic review[pt] OR meta-analysis[pt] OR consensus)',
  },
]

const PRIMARY_SOURCES = [
  {
    label: 'USDA Purine Database 2.0',
    url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf',
  },
  {
    label: 'Harvard Oxalate Table 2023',
    url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx',
  },
  {
    label: 'SIGHI Food Compatibility List 2023',
    url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf',
  },
  {
    label: 'EULAR 2022 Gout Guidelines',
    url: 'https://ard.bmj.com/content/81/11/1452',
  },
  {
    label: 'Hindiyeh 2020 SR (migraine & diet)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  },
]

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function searchPubMed(query: string, daysBack: number): Promise<string[]> {
  const minDate = new Date()
  minDate.setDate(minDate.getDate() - daysBack)
  const dateStr = minDate.toISOString().split('T')[0].replace(/-/g, '/')
  const params = new URLSearchParams({
    db: 'pubmed',
    term: query,
    mindate: dateStr,
    datetype: 'pdat',
    retmode: 'json',
    retmax: '5',
  })
  const res = await fetchWithTimeout(`${PUBMED_BASE}/esearch.fcgi?${params}`)
  if (!res.ok) return []
  const data = await res.json() as PubMedSearchResult
  return data.esearchresult.idlist
}

async function getPubMedTitles(ids: string[]): Promise<Array<{ title: string; journal: string; date: string; id: string }>> {
  if (ids.length === 0) return []
  const params = new URLSearchParams({ db: 'pubmed', id: ids.join(','), retmode: 'json' })
  const res = await fetchWithTimeout(`${PUBMED_BASE}/esummary.fcgi?${params}`)
  if (!res.ok) return []
  const data = await res.json() as PubMedSummaryResult
  return ids.map(id => {
    const r = data.result[id]
    return {
      id,
      title: r?.title ?? 'onbekend',
      journal: r?.fulljournalname ?? '',
      date: r?.pubdate ?? '',
    }
  })
}

async function checkLastModified(url: string): Promise<Date | null> {
  try {
    const res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
    const lm = res.headers.get('last-modified')
    return lm ? new Date(lm) : null
  } catch {
    return null
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const findings: string[] = []
const cutoff = new Date()
cutoff.setDate(cutoff.getDate() - DAYS_LOOKBACK)
const cutoffStr = cutoff.toISOString().split('T')[0]

console.log(`Evidence update check — lookback: ${DAYS_LOOKBACK} dagen (vanaf ${cutoffStr})\n`)

// 1. PubMed: nieuwe systematic reviews / meta-analyses
console.log('── PubMed: nieuwe systematic reviews / meta-analyses ──')
for (const { condition, query } of SEARCHES) {
  try {
    const ids = await searchPubMed(query, DAYS_LOOKBACK)
    if (ids.length > 0) {
      const papers = await getPubMedTitles(ids)
      const lines = papers.map(p =>
        `  - [PMID ${p.id}](https://pubmed.ncbi.nlm.nih.gov/${p.id}/) — ${p.title} *(${p.journal}, ${p.date})*`
      )
      console.log(`\n✦ ${condition}: ${ids.length} nieuw(e) paper(s)`)
      lines.forEach(l => console.log(l))
      findings.push(`### ${condition} — ${ids.length} nieuw(e) paper(s)\n${lines.join('\n')}`)
    } else {
      console.log(`✓ ${condition}: geen nieuwe papers`)
    }
    // NCBI-richtlijn: max 3 requests/s
    await new Promise(r => setTimeout(r, 400))
  } catch (err) {
    console.warn(`⚠ PubMed search mislukt voor ${condition}: ${err}`)
  }
}

// 2. Last-Modified op primaire bronnen
console.log('\n── Primaire bronnen: Last-Modified check ──')
for (const { label, url } of PRIMARY_SOURCES) {
  try {
    const modDate = await checkLastModified(url)
    if (modDate && modDate > cutoff) {
      const modStr = modDate.toISOString().split('T')[0]
      console.log(`✦ GEWIJZIGD: ${label} (${modStr})`)
      findings.push(`### Bijgewerkte bron: ${label}\n- Last-Modified: **${modStr}**\n- URL: ${url}`)
    } else if (modDate) {
      console.log(`✓ ${label}: ongewijzigd (${modDate.toISOString().split('T')[0]})`)
    } else {
      console.log(`- ${label}: geen Last-Modified header`)
    }
  } catch (err) {
    console.warn(`⚠ Check mislukt voor ${label}: ${err}`)
  }
}

// ── Resultaat ─────────────────────────────────────────────────────────────────
if (findings.length > 0) {
  console.log(`\n⚠ ${findings.length} bevinding(en) gevonden`)
  console.log('\n---FINDINGS---')
  console.log(findings.join('\n\n'))
  process.exit(2)
} else {
  console.log('\n✓ Geen nieuwe evidence. Niets te doen.')
  process.exit(0)
}
