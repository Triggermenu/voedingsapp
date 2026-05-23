/**
 * Fase 4 batch 2 — vis-schaaldieren (25 items)
 *
 * Volledig in vis-schaaldieren.json (onaangeraakt door open PR's #42/#43) om
 * merge-conflicten te vermijden. Scoring gekalibreerd tegen bestaande vis-items:
 *  - oliehoudend/ingeblikt/gerookt/kuit → jicht 3, histamine 2-3, migraine subgroep-overschat
 *  - verse magere witvis → jicht 1, histamine 0-1, migraine 0
 *  - schaal-/weekdieren → jicht 2
 * cluster 13 (migraine biogene-aminen) krijgt elk item met een migraine-triggerType.
 */
const fs = require('fs')
const path = require('path')

const ACCESSED = '2026-05-23'
const DATE = '2026-05-23'

const SRC = {
  usda: { url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf', title: 'USDA Purine Database Release 2.0 (2025)', type: 'database', accessedAt: ACCESSED },
  harvard: { url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx', title: 'Harvard Oxalate Table 2023 (UAB Knight Lab)', type: 'database', accessedAt: ACCESSED },
  finberg: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/', title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors', type: 'review', accessedAt: ACCESSED },
  hindiyeh: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/', title: 'Hindiyeh et al. 2020 — Diet and Headache', type: 'review', accessedAt: ACCESSED },
  sighi: { url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf', title: 'SIGHI Food Compatibility List 2023', type: 'consensus', accessedAt: ACCESSED },
}

function score(cond, spec) {
  if (spec == null) return null
  const sources =
    cond === 'jicht' ? [SRC.usda]
    : cond === 'migraine' ? [SRC.finberg, SRC.hindiyeh]
    : cond === 'nierstenen' ? [SRC.harvard]
    : [SRC.sighi]
  const o = { score: spec.s, evidence: spec.ev, sources }
  if (spec.tt) o.triggerType = spec.tt
  if (spec.conf) o.confidence = spec.conf
  if (spec.note) o.note = { nl: spec.note }
  return o
}

function item(spec) {
  const base = {
    id: spec.id,
    name: { nl: spec.nl, en: spec.en },
    category: 'vis-schaaldieren',
    subcategory: spec.sub,
    scores: {
      jicht: score('jicht', spec.j),
      migraine: score('migraine', spec.m),
      nierstenen: score('nierstenen', spec.n),
      histamine: score('histamine', spec.h),
    },
    meta: { addedAt: DATE, schemaVersion: '1.0.0', lastReviewed: DATE },
  }
  // cluster 13 = migraine biogene-aminen-cluster: elk item met migraine-triggerType
  if (spec.m && spec.m.tt) base.cluster = 13
  return base
}

const items = [
  { id: 'nl-haringkuit', nl: 'Haringkuit', en: 'Herring roe', sub: 'kuit',
    j: { s: 3, ev: 'B', note: 'Viskuit behoort tot de purinerijkste producten (>200 mg/100g, USDA). Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Visproduct met biogene aminen; tyramine/histamine-pathway subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Viskuit bevat biogene aminen; vers matig, snel oplopend bij bewaring. SIGHI cat. 1-2.' } },
  { id: 'nl-kaviaar', nl: 'Kaviaar (gezouten steurkuit)', en: 'Caviar (salted sturgeon roe)', sub: 'kuit',
    j: { s: 3, ev: 'B', note: 'Steurkuit zeer purinerijk (>200 mg/100g). Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Gezouten viskuit; biogene aminen subgroep-afhankelijk.' },
    n: { s: 1, ev: 'B', note: 'Zwaar gezouten → natrium-modifier +1 (§2.3). Oxalaat verwaarloosbaar.' },
    h: { s: 2, ev: 'B', note: 'Gezouten gerijpte kuit → verhoogde biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-zalmkuit', nl: 'Zalmkuit (rode kaviaar)', en: 'Salmon roe (red caviar)', sub: 'kuit',
    j: { s: 3, ev: 'B', note: 'Zalmkuit purinerijk (roe, >200 mg/100g). Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Gezouten viskuit; biogene aminen subgroep-afhankelijk.' },
    n: { s: 1, ev: 'B', note: 'Gezouten → natrium-modifier +1. Oxalaat verwaarloosbaar.' },
    h: { s: 2, ev: 'B', note: 'Gezouten kuit, biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-stokvis', nl: 'Stokvis (gedroogde kabeljauw)', en: 'Stockfish (dried cod)', sub: 'gedroogd',
    j: { s: 3, ev: 'B', note: 'Drogen concentreert purine ~4-5×; gereconstitueerde portie hoog (>200 mg). Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Gedroogd/gerijpt visproduct; biogene aminen subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Ongezouten gedroogd; geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Lang gedroogd visproduct → biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-klipvis', nl: 'Klipvis (gezouten gedroogde kabeljauw)', en: 'Salt cod (bacalhau)', sub: 'gedroogd',
    j: { s: 3, ev: 'B', note: 'Gezouten gedroogde kabeljauw; geconcentreerde purine. Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Gezouten gedroogd visproduct; biogene aminen subgroep-afhankelijk.' },
    n: { s: 1, ev: 'B', note: 'Zwaar gezouten; restnatrium hoog → modifier +1 (§2.3).' },
    h: { s: 2, ev: 'B', note: 'Gezouten gedroogd visproduct → biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-octopus', nl: 'Octopus (vers)', en: 'Octopus (fresh)', sub: 'inktvissen',
    j: { s: 2, ev: 'B', note: 'Koppotige; matig-hoog purine (~130-160 mg/100g). Portie score 2.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof bij verse bereiding.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Vers laag histamine; loopt snel op bij bewaring. SIGHI cat. 1.' } },
  { id: 'nl-wulk', nl: 'Wulk (zeeslak, gekookt)', en: 'Whelk (cooked)', sub: 'schaaldieren',
    j: { s: 2, ev: 'B', note: 'Weekdier; matig purine. Portie score 2.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Gekookt weekdier laag-matig histamine. SIGHI cat. 1.' } },
  { id: 'nl-bokking', nl: 'Bokking (gerookte volle haring)', en: 'Bokking (whole smoked herring)', sub: 'gerookt',
    j: { s: 3, ev: 'B', note: 'Volle haring (oliehoudend, purinerijk); roken concentreert. Score 3.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Gerookte oliehoudende vis = hoge biogene aminen (histamine/tyramine). Subgroep-afhankelijke pathway.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Gerookte volle haring behoort tot de histaminerijkste producten. SIGHI cat. 3.' } },
  { id: 'nl-gerookte-forel', nl: 'Gerookte forel', en: 'Smoked trout', sub: 'gerookt',
    j: { s: 1, ev: 'B', note: 'Forel matig-laag purine; roken verandert weinig. Score 1.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Gerookte vis → biogene aminen; subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Gerookte vis → hoge histamine. SIGHI cat. 2-3.' } },
  { id: 'nl-gerookte-heilbot', nl: 'Gerookte heilbot', en: 'Smoked halibut', sub: 'gerookt',
    j: { s: 1, ev: 'B', note: 'Heilbot mager, laag purine. Score 1.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Gerookte vis → biogene aminen; subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Gerookte vis → hoge histamine. SIGHI cat. 2-3.' } },
  { id: 'nl-sardines-tomaat', nl: 'Sardines in tomatensaus (blik)', en: 'Canned sardines in tomato sauce', sub: 'blik',
    j: { s: 3, ev: 'B', note: 'Sardine zeer purinerijk (>200 mg/100g). Score 3.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Ingeblikte oliehoudende vis + tomaat (liberator); biogene aminen subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Tomatensaus oxalaat subklinisch per portie.' },
    h: { s: 3, ev: 'B', note: 'Ingeblikte sardine (hoge histamine) + tomaat (liberator). SIGHI cat. 3.' } },
  { id: 'nl-makreel-tomaat', nl: 'Makreel in tomatensaus (blik)', en: 'Canned mackerel in tomato sauce', sub: 'blik',
    j: { s: 2, ev: 'B', note: 'Makreel matig-hoog purine; blik. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Ingeblikte makreel (hoge biogene aminen) + tomaat. Subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Tomatensaus oxalaat subklinisch per portie.' },
    h: { s: 3, ev: 'B', note: 'Ingeblikte makreel + tomaat (liberator). SIGHI cat. 3.' } },
  { id: 'nl-koolvis', nl: 'Koolvis (pollak, vers)', en: 'Pollack (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere witvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-heek', nl: 'Heek (vers)', en: 'Hake (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere witvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-zeewolf', nl: 'Zeewolf (vers)', en: 'Wolffish (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere witvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-rode-poon', nl: 'Rode poon (vers)', en: 'Red gurnard (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere witvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-horsmakreel', nl: 'Horsmakreel (vers)', en: 'Horse mackerel (fresh)', sub: 'vette-vis',
    j: { s: 2, ev: 'B', note: 'Oliehoudende vis; matig-hoog purine. Score 2.' },
    m: { s: 0, ev: 'B', note: 'Vers geen trigger; let op scombroïde histamine bij niet-verse vis.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Scombroïde vis; vers matig, snel oplopend. SIGHI cat. 2.' } },
  { id: 'nl-paling-vers', nl: 'Paling (vers)', en: 'Eel (fresh)', sub: 'vette-vis',
    j: { s: 2, ev: 'B', note: 'Paling vethoudend; matig purine. Score 2.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof bij verse bereiding.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Vette vis, degradeert snel → biogene aminen. SIGHI cat. 1-2.' } },
  { id: 'nl-victoriabaars', nl: 'Victoriabaars (nijlbaars, vers)', en: 'Nile perch (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere witvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-zalm-sashimi', nl: 'Zalm sashimi (rauw)', en: 'Salmon sashimi (raw)', sub: 'rauw',
    j: { s: 2, ev: 'B', note: 'Zalm matig purine (~110-140 mg/100g). Score 2.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Rauwe vis; biogene aminen afhankelijk van versheid/subgroep.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Rauwe vis: bij topversheid laag, snel oplopend. SIGHI cat. 2; versheid cruciaal.' } },
  { id: 'nl-mosselen-blik', nl: 'Mosselen (blik, in saus)', en: 'Canned mussels', sub: 'blik',
    j: { s: 2, ev: 'B', note: 'Mosselen matig purine; blik. Score 2.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Ingeblikt weekdier; biogene aminen subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Ingeblikt weekdier, biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-tongschar', nl: 'Tongschar (vers)', en: 'Lemon sole (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere platvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-tong', nl: 'Tong (zeetong, vers)', en: 'Dover sole (fresh)', sub: 'witvis',
    j: { s: 1, ev: 'B', note: 'Magere platvis, laag purine. Score 1.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-rog', nl: 'Rog (vleugel, vers)', en: 'Skate wing (fresh)', sub: 'witvis',
    j: { s: 2, ev: 'B', note: 'Kraakbeenvis; matig purine. Score 2.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Kraakbeenvis accumuleert ureum→ammoniak; biogene aminen subgroep-afhankelijk.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Rog/haaiachtigen: ammoniak/biogene aminen lopen snel op. SIGHI cat. 2.' } },
  { id: 'nl-tonijn-olie', nl: 'Tonijn (in blik, olie)', en: 'Canned tuna in oil', sub: 'blik',
    j: { s: 2, ev: 'B', note: 'Tonijn matig-hoog purine; blik. Score 2.' },
    m: { s: 1, ev: 'B', tt: 'subgroep-overschat', note: 'Ingeblikte tonijn; biogene aminen subgroep-afhankelijk (vgl. tonijn in water).' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Ingeblikte tonijn behoort tot histaminerijke producten. SIGHI cat. 3.' } },
]

const p = path.join(process.cwd(), 'src/data/vis-schaaldieren.json')
const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
const existing = new Set(data.items.map((i) => i.id))
const existingNames = new Set(data.items.map((i) => i.name.nl.toLowerCase()))
let added = 0
for (const spec of items) {
  if (existing.has(spec.id) || existingNames.has(spec.nl.toLowerCase())) { console.log(`  ~ skip (bestaat al): ${spec.id}`); continue }
  data.items.push(item(spec))
  added++
}
fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
console.log(`✓ vis-schaaldieren.json: +${added} items (totaal ${data.items.length})`)
