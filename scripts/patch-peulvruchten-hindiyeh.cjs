/**
 * Hindiyeh-purge peulvruchten — alle 35 items
 *
 * Score-wijzigingen: 0 (alle scores correct per CLAUDE.md §2.2)
 * Uitzonderingen bewaard op score 1:
 *   - nl-tempeh (gefermenteerd sojaproduct, tyramine)
 *   - nl-misopasta (gefermenteerd sojaproduct, biogene aminen)
 * Overige 33 items: score 0 ongewijzigd, bronnen bijgewerkt.
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'data', 'peulvruchten.json')
const ACCESSED = '2026-05-20'

const HINDIYEH = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache (Curr Pain Headache Rep)',
  type: 'review',
  accessedAt: ACCESSED,
}
const MAINTZ = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/17490952/',
  title: 'Maintz & Novak 2007 — Histamine and histamine intolerance (Am J Clin Nutr)',
  type: 'review',
  accessedAt: ACCESSED,
}
const FINBERG = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors (J Clin Pharmacol)',
  type: 'review',
  accessedAt: ACCESSED,
}

// Gefermenteerde uitzonderingen: score 1 behouden + betere bronnen
const FERMENTED = {
  'nl-tempeh': {
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'laag',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Tempeh: gefermenteerd sojaproduct (Rhizopus-schimmel). Matig tyramine door fermentatie. Mogelijke trigger bij MAO-A-gevoelige personen; niet op algemene migraine-whitelist.',
  },
  'nl-misopasta': {
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'laag',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Misopasta: lang gefermenteerde sojabonenpasta. Biogene aminen (tyramine, histamine) door fermentatie. Mogelijke trigger bij MAO-A-gevoelige personen.',
  },
}

const raw = fs.readFileSync(FILE, 'utf8')
const db = JSON.parse(raw)

let sourceUpgrades = 0
let triggerAdded = 0
let processed = 0

for (const item of db.items) {
  const m = item.scores?.migraine
  if (!m) continue

  // Controleer of het een Hindiyeh-only item is
  const isHindiyehOnly = m.sources.length === 1 &&
    m.sources[0].url.includes('PMC7496357')
  if (!isHindiyehOnly) continue

  processed++

  if (FERMENTED[item.id]) {
    const patch = FERMENTED[item.id]
    m.sources = patch.sources
    m.triggerType = patch.triggerType
    m.confidence = patch.confidence
    m.primaryModulators = patch.primaryModulators
    m.note = { nl: patch.note }
    triggerAdded++
    console.log(`✓ ${item.id} (score: ${m.score}, triggerType: ${m.triggerType}) — FERMENTED`)
  } else {
    // Alle andere peulvruchten: score 0, Finberg + Hindiyeh
    m.sources = [FINBERG, HINDIYEH]
    delete m.triggerType
    delete m.confidence
    delete m.primaryModulators
    m.note = { nl: `${item.name.nl}: peulvrucht zonder specifieke migraine-trigger-evidence. Geen biogene aminen of andere triggerstoffen (Hindiyeh 2020, Finberg 2022).` }
    console.log(`✓ ${item.id} (score: ${m.score})`)
  }

  item.meta.lastReviewed = ACCESSED
  sourceUpgrades++
}

console.log(`\nVerwerkt: ${processed} items`)
console.log(`Source-upgrades: ${sourceUpgrades}`)
console.log(`TriggerType toegevoegd: ${triggerAdded}`)

if (processed !== 35) {
  console.error(`FOUT: verwacht 35 items, verwerkt ${processed}`)
  process.exit(1)
}

fs.writeFileSync(FILE, JSON.stringify(db, null, 2), 'utf8')
console.log(`\nGeschreven: ${FILE}`)
