/**
 * Hindiyeh-purge sauzen-kruiden PT2 — kruiden en specerijen
 *
 * 27 items: Hindiyeh 2020 sole-source vervangen door betere bronnen.
 * Score-wijzigingen:
 *   1→0: curry-poeder, chili-vers, nootmuskaat, cayennepeper
 *        (geen specifieke migraine-evidence per CLAUDE.md §2.2 default)
 * Overig: score 0 behoudt, bronnen verbeterd.
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'data', 'sauzen-kruiden.json')
const ACCESSED = '2026-05-20'

const HINDIYEH = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache (Curr Pain Headache Rep)',
  type: 'review',
  accessedAt: ACCESSED,
}
const FINBERG = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors (J Clin Pharmacol)',
  type: 'review',
  accessedAt: ACCESSED,
}

// Alle kruiden/specerijen → score 0, Finberg + Hindiyeh, geen triggerType
// Score-wijzigingen: curry-poeder, chili-vers, nootmuskaat, cayennepeper: 1→0
const PT2_IDS = [
  'nl-kurkuma',
  'nl-gember',
  'nl-peper-zwart',
  'nl-kaneel',
  'nl-peterselie',
  'nl-basilicum',
  'nl-dille-vers',
  'nl-rozemarijn',
  'nl-tijm-vers',
  'nl-bieslook-vers',
  'nl-dragon-vers',
  'nl-majoraan-vers',
  'nl-oregano-vers',
  'nl-koriander-vers',
  'nl-munt-vers',
  'nl-chili-vers',
  'nl-nootmuskaat',
  'nl-kardemom',
  'nl-steranijs',
  'nl-cayennepeper',
  'nl-laurierblad',
  'nl-komijn',
  'nl-knoflookpoeder',
  'nl-uienpoeder',
  'nl-salie-vers',
  'nl-paprikapoeder',
  'nl-curry-poeder',
]

// Item-specifieke notes
const NOTES = {
  'nl-kurkuma':      'Kurkuma (curcumine): anti-inflammatoir; geen bewijs voor migraine-triggering. Eerder gezien als neutraal of beschermend.',
  'nl-gember':       'Gember: anti-inflammatoire eigenschappen; in sommige studies helpt het bij migraine-symptomen. Geen trigger-evidence.',
  'nl-peper-zwart':  'Zwarte peper: piperine; geen specifieke migraine-trigger-evidence in gangbare hoeveelheden.',
  'nl-kaneel':       'Kaneel: geen specifieke migraine-trigger-evidence in gangbare hoeveelheden.',
  'nl-peterselie':   'Peterselie: geen biogene aminen of bekende migraine-triggerstoffen.',
  'nl-basilicum':    'Basilicum: geen specifieke migraine-trigger-evidence.',
  'nl-dille-vers':   'Dille: geen specifieke migraine-trigger-evidence.',
  'nl-rozemarijn':   'Rozemarijn: geen specifieke migraine-trigger-evidence.',
  'nl-tijm-vers':    'Tijm: geen specifieke migraine-trigger-evidence.',
  'nl-bieslook-vers':'Bieslook: geen specifieke migraine-trigger-evidence.',
  'nl-dragon-vers':  'Dragon: geen specifieke migraine-trigger-evidence.',
  'nl-majoraan-vers':'Majoraan: geen specifieke migraine-trigger-evidence.',
  'nl-oregano-vers': 'Oregano: geen specifieke migraine-trigger-evidence.',
  'nl-koriander-vers':'Koriander: geen specifieke migraine-trigger-evidence.',
  'nl-munt-vers':    'Munt: geen cafeïne; geen specifieke migraine-trigger-evidence.',
  'nl-chili-vers':   'Verse chilipeper (capsaïcine): geen bewezen migraine-trigger; capsaïcine soms therapeutisch gebruikt. Eerder score 1 op basis van Hindiyeh sole-source.',
  'nl-nootmuskaat':  'Nootmuskaat: geen specifieke migraine-trigger-evidence in gangbare hoeveelheden. Eerder score 1 op basis van Hindiyeh sole-source.',
  'nl-kardemom':     'Kardemom: geen specifieke migraine-trigger-evidence.',
  'nl-steranijs':    'Steranijs: geen specifieke migraine-trigger-evidence.',
  'nl-cayennepeper': 'Cayennepeper (capsaïcine): geen bewezen migraine-triggermechanisme. Eerder score 1 op basis van Hindiyeh sole-source.',
  'nl-laurierblad':  'Laurierblad: geen specifieke migraine-trigger-evidence.',
  'nl-komijn':       'Komijn: geen specifieke migraine-trigger-evidence.',
  'nl-knoflookpoeder':'Knoflookpoeder: knoflook zelf geen established migraine-trigger; geen specifieke evidence.',
  'nl-uienpoeder':   'Uienpoeder: geen specifieke migraine-trigger-evidence.',
  'nl-salie-vers':   'Salie: geen specifieke migraine-trigger-evidence.',
  'nl-paprikapoeder':'Paprikapoeder: geen specifieke migraine-trigger-evidence.',
  'nl-curry-poeder': 'Currypoeder (mengsel kruiden/specerijen): geen specifieke migraine-trigger-evidence als mengsel. Eerder score 1 op basis van Hindiyeh sole-source.',
}

const raw = fs.readFileSync(FILE, 'utf8')
const db = JSON.parse(raw)

let scoreChanges = 0
let sourceUpgrades = 0
const scoreFixes = []

for (const item of db.items) {
  if (!PT2_IDS.includes(item.id)) continue

  const m = item.scores.migraine
  if (!m) {
    console.error(`SKIP ${item.id}: geen migraine-score`)
    continue
  }

  const oldScore = m.score

  // Alle PT2 items → score 0
  if (m.score !== 0) {
    scoreFixes.push({ id: item.id, name: item.name.nl, scoreBefore: m.score, scoreAfter: 0 })
    m.score = 0
    scoreChanges++
  }

  m.sources = [FINBERG, HINDIYEH]
  delete m.triggerType
  delete m.confidence
  delete m.primaryModulators
  m.note = { nl: NOTES[item.id] || 'Geen specifieke migraine-trigger-evidence.' }
  item.meta.lastReviewed = ACCESSED

  sourceUpgrades++
  console.log(`✓ ${item.id} (score: ${oldScore}→${m.score})`)
}

console.log(`\nScore-wijzigingen: ${scoreChanges}`)
console.log(`Source-upgrades: ${sourceUpgrades}`)

if (sourceUpgrades !== PT2_IDS.length) {
  console.error(`FOUT: verwacht ${PT2_IDS.length}, uitgevoerd ${sourceUpgrades}`)
  process.exit(1)
}

if (scoreChanges > 0) {
  console.log('\nScore fixes:')
  scoreFixes.forEach(f => console.log(`  ${f.id}: ${f.scoreBefore} → ${f.scoreAfter}`))
}

fs.writeFileSync(FILE, JSON.stringify(db, null, 2), 'utf8')
console.log(`\nGeschreven: ${FILE}`)
