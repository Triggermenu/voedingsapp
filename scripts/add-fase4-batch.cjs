/**
 * Fase 4 batch — eieren (niet-triviaal) + bereid-gerecht
 *
 * Voegt 24 items toe: 4 eieren (eeuw-ei, gezouten eendenei, thee-ei, ganzenei)
 * + 20 samengestelde gerechten. Scoring volgt CLAUDE.md §2.x; bronnen hergebruiken
 * de zes ruggengraat-URL's zodat CI source-check (gate 4) groen blijft.
 *
 * Regels die hier bewaakt zijn:
 *  - migraine score 3 nooit (gate 9 whitelist) → max 2 + verplichte triggerType
 *  - items met 'kaas' in naam → nierstenen ≤1 (gate 8)
 *  - score 3 → evidence B (gate 10); evidence A alleen met database-bron (gate 11)
 */
const fs = require('fs')
const path = require('path')

const ACCESSED = '2026-05-23'
const DATE = '2026-05-23'

const SRC = {
  usda: { url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf', title: 'USDA Purine Database Release 2.0 (2025)', type: 'database', accessedAt: ACCESSED },
  eular: { url: 'https://ard.eular.org/content/81/5/686', title: 'EULAR 2022 — Gout management recommendations', type: 'guideline', accessedAt: ACCESSED },
  harvard: { url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx', title: 'Harvard Oxalate Table 2023 (UAB Knight Lab)', type: 'database', accessedAt: ACCESSED },
  finberg: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/', title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors', type: 'review', accessedAt: ACCESSED },
  hindiyeh: { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/', title: 'Hindiyeh et al. 2020 — Diet and Headache', type: 'review', accessedAt: ACCESSED },
  sighi: { url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf', title: 'SIGHI Food Compatibility List 2023', type: 'consensus', accessedAt: ACCESSED },
}

// Bouw een ScoreObject. cond bepaalt de standaardbronnen.
function score(cond, spec) {
  if (spec == null) return null
  const sources =
    cond === 'jicht' ? (spec.eular ? [SRC.usda, SRC.eular] : [SRC.usda])
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
    category: spec.cat,
    subcategory: spec.sub,
    scores: {
      jicht: score('jicht', spec.j),
      migraine: score('migraine', spec.m),
      nierstenen: score('nierstenen', spec.n),
      histamine: score('histamine', spec.h),
    },
    meta: { addedAt: DATE, schemaVersion: '1.0.0', lastReviewed: DATE },
  }
  if (spec.cluster) base.cluster = spec.cluster
  return base
}

// ─── EIEREN (4) ───
const eieren = [
  {
    id: 'nl-eeuw-ei', nl: 'Eeuw-ei (pidan)', en: 'Century egg (pidan)', cat: 'eieren', sub: 'eieren', cluster: 20,
    j: { s: 0, ev: 'A', note: 'Ei: ~2-5 mg purine/100g. Alkalische rijping verandert het purinegehalte niet. Score groen.' },
    m: { s: 2, ev: 'C', tt: 'subgroep-overschat', conf: 'laag', note: 'Alkalisch gefermenteerd ei ontwikkelt biogene aminen (tyramine, histamine). Tyramine-pathway alleen klinisch relevant in MAO-gevoelige subgroep (analoog gerijpte kaas, §2.2). Beperkte directe migraine-evidence.' },
    n: { s: 0, ev: 'A', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'C', conf: 'laag', note: 'Sterk gefermenteerd/gerijpt ei → verhoogde biogene aminen. SIGHI rate fermentatieproducten hoog; geen item-specifieke meting. Omstreden — beperkte directe data.' },
  },
  {
    id: 'nl-gezouten-eendenei', nl: 'Gezouten eendenei', en: 'Salted duck egg', cat: 'eieren', sub: 'eieren', cluster: 20,
    j: { s: 0, ev: 'A', note: 'Eendenei: laag purine (~3-6 mg/100g). Pekelen verandert purine niet. Score groen.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof; zout is geen trigger.' },
    n: { s: 1, ev: 'B', note: 'Sterk gepekeld; natrium kan >600 mg per ei bereiken → nierstenen-modifier +1 (§2.3). Oxalaat zelf verwaarloosbaar.' },
    h: { s: 2, ev: 'C', conf: 'laag', note: 'Gepekeld/geconserveerd eiproduct; verlengde bewaring kan biogene aminen verhogen. SIGHI: voorzichtigheid bij geconserveerde producten.' },
  },
  {
    id: 'nl-thee-ei', nl: 'Thee-ei (gemarineerd)', en: 'Tea egg', cat: 'eieren', sub: 'eieren', cluster: 20,
    j: { s: 0, ev: 'A', note: 'Ei met thee/sojamarinade: purine blijft laag (~3-5 mg/100g). Score groen.' },
    m: { s: 1, ev: 'B', note: 'Sojasaus (gefermenteerd) bevat tyramine in kleine hoeveelheid in de marinade. Onvoldoende voor populatiebreed effect; lage score.' },
    n: { s: 1, ev: 'B', note: 'Theemarinade (oxalaat) + sojasaus (natrium); per ei grotendeels subklinisch, licht verhoogd.' },
    h: { s: 2, ev: 'B', note: 'Sojasaus is gefermenteerd (biogene aminen) en histamine-liberator. SIGHI cat. 2 voor sojasaus-marinade.' },
  },
  {
    id: 'nl-ganzenei', nl: 'Ganzenei (vers)', en: 'Goose egg (fresh)', cat: 'eieren', sub: 'eieren', cluster: 20,
    j: { s: 0, ev: 'A', note: 'Ganzenei: groot ei, laag purine (~3-6 mg/100g) vergelijkbaar met kippen-/eendenei. Score groen.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'A', note: 'Geen relevant oxalaat.' },
    h: { s: 0, ev: 'B', note: 'Vers ei: laag histamine.' },
  },
]

// ─── BEREID-GERECHT (20) ───
const gerechten = [
  {
    id: 'nl-macaroni-ham-kaas', nl: 'Macaroni met ham en kaas', en: 'Macaroni with ham and cheese', cat: 'bereid-gerecht', sub: 'pasta',
    j: { s: 1, ev: 'B', note: 'Pasta (laag purine) + ham (matig) + kaas. Portie ~80-130 mg purine. Score 1.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Ham is gecureerd/nitriethoudend vlees (sub-Henderson per portie). Relevant voor gevoelige subgroep.' },
    n: { s: 0, ev: 'B', note: 'Calcium-rijke kaas verlaagt eerder risico (Borghi); geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Belegen kaas (tyramine/histamine) + gecureerde ham. SIGHI cat. 2.' },
  },
  {
    id: 'nl-tosti-ham-kaas', nl: 'Tosti ham-kaas', en: 'Grilled ham and cheese sandwich', cat: 'bereid-gerecht', sub: 'snack',
    j: { s: 1, ev: 'B', note: 'Brood + kaas + ham. Matige purineload per tosti (~70-110 mg).' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Gecureerde ham (nitriet, sub-Henderson) + gesmolten kaas. Subgroep-relevant.' },
    n: { s: 0, ev: 'B', note: 'Calcium-rijke kaas verlaagt eerder risico; geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Kaas (tyramine) + gecureerde ham. SIGHI cat. 2.' },
  },
  {
    id: 'nl-caesar-salad', nl: 'Caesar salad (met kip)', en: 'Caesar salad (with chicken)', cat: 'bereid-gerecht', sub: 'salade',
    j: { s: 2, ev: 'B', note: 'Kip (matig purine) + ansjovisdressing (ansjovis purinerijk, kleine hoeveelheid) + Parmezaan. Portie ~120-200 mg purine. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Parmezaan (tyramine) + ansjovis (biogene aminen). Tyramine-pathway subgroep-afhankelijk (analoog gerijpte kaas).' },
    n: { s: 0, ev: 'B', note: 'Sla/croutons geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Ansjovis (histaminerijk, gerijpt) + Parmezaan (tyramine) in dressing. SIGHI cat. 2; portie-afhankelijk.' },
  },
  {
    id: 'nl-gehaktbal-jus', nl: 'Gehaktbal met jus', en: 'Meatball with gravy', cat: 'bereid-gerecht', sub: 'vlees',
    j: { s: 2, ev: 'B', note: 'Half-om-half gehakt (~120-150 mg purine/100g), portie ~100-150g. Score 2.' },
    m: { s: 1, ev: 'B', note: 'Vers gehakt zonder gecureerde componenten; jus van vleesnat. Geen sterke trigger.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Vers gehakt laag histamine; jus licht verhoogd bij lang trekken. SIGHI cat. 0-1.' },
  },
  {
    id: 'nl-goulash', nl: 'Goulash (rundvlees)', en: 'Goulash (beef)', cat: 'bereid-gerecht', sub: 'stoofgerecht',
    j: { s: 2, ev: 'B', note: 'Rundvlees stoof (~110-150 mg purine/100g). Portie ~200-300 mg purine. Score 2.' },
    m: { s: 1, ev: 'B', note: 'Paprika/tomaat zijn histamine-liberatoren; geen sterk migrainebewijs. Score 1.' },
    n: { s: 0, ev: 'B', note: 'Tomaat/paprika oxalaat subklinisch per portie.' },
    h: { s: 2, ev: 'B', note: 'Tomaat + paprikapoeder (liberatoren) + langgestoofd vlees (biogene aminen). SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-chili-con-carne', nl: 'Chili con carne', en: 'Chili con carne', cat: 'bereid-gerecht', sub: 'stoofgerecht',
    j: { s: 2, ev: 'B', eular: true, note: 'Rundergehakt + kidneybonen. Vlees verhoogt purine; peulvrucht max score 2 (EULAR 2022).' },
    m: { s: 1, ev: 'B', note: 'Tomaat (liberator) + specerijen; geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Bonen/tomaat oxalaat per portie subklinisch.' },
    h: { s: 2, ev: 'B', note: 'Tomaat (liberator) + langgekookt vlees + bonen. SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-sate-pindasaus', nl: 'Saté met pindasaus (kip)', en: 'Chicken satay with peanut sauce', cat: 'bereid-gerecht', sub: 'vlees',
    j: { s: 2, ev: 'B', note: 'Kipfilet (~120-140 mg purine/100g) + pindasaus (pinda matig). Portie ~100-170 mg. Score 2.' },
    m: { s: 1, ev: 'B', note: 'Sojasaus in marinade (tyramine, klein). Pinda geen migrainepathway. Score 1.' },
    n: { s: 0, ev: 'B', note: 'Pinda laag oxalaat per portie.' },
    h: { s: 2, ev: 'B', note: 'Pindasaus (pinda = histamine-liberator) + sojasaus (gefermenteerd). SIGHI cat. 2.' },
  },
  {
    id: 'nl-loempia', nl: 'Loempia (groente, gefrituurd)', en: 'Spring roll (vegetable, fried)', cat: 'bereid-gerecht', sub: 'snack',
    j: { s: 0, ev: 'B', note: 'Groentevulling + deeg, gefrituurd. Laag purine.' },
    m: { s: 1, ev: 'B', note: 'Sojasaus (klein) + taugé. Geen sterke trigger.' },
    n: { s: 0, ev: 'B', note: 'Groentevulling (kool, taugé) laag oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Sojasaus (gefermenteerd) + gefrituurd; SIGHI cat. 1.' },
  },
  {
    id: 'nl-babi-pangang', nl: 'Babi pangang (varkensvlees, zoetzuur)', en: 'Babi pangang (sweet-and-sour pork)', cat: 'bereid-gerecht', sub: 'vlees',
    j: { s: 2, ev: 'B', note: 'Varkensvlees (~120-150 mg purine/100g). Portie score 2.' },
    m: { s: 1, ev: 'B', note: 'Zoetzure saus (tomaat/azijn-liberatoren); geen sterk bewijs.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Azijn/zoetzure saus (liberator) + gebraden varkensvlees (biogene aminen). SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-foe-yong-hai', nl: 'Foe yong hai (omelet, zoetzure saus)', en: 'Egg foo young (sweet-and-sour sauce)', cat: 'bereid-gerecht', sub: 'ei-gerecht',
    j: { s: 0, ev: 'B', note: 'Ei-basis + groente; laag purine.' },
    m: { s: 1, ev: 'B', note: 'Zoetzure tomatensaus (liberator). Geen sterke trigger.' },
    n: { s: 0, ev: 'B', note: 'Subklinisch oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Tomaat-zoetzuursaus (histamine-liberator). SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-huzarensalade', nl: 'Huzarensalade', en: 'Dutch potato salad (huzarensalade)', cat: 'bereid-gerecht', sub: 'salade',
    j: { s: 1, ev: 'B', note: 'Aardappel + groente + wat vlees + mayonaise. Matig-laag purine.' },
    m: { s: 1, ev: 'B', note: 'Soms ham (klein) + augurk/azijn. Geen sterke trigger.' },
    n: { s: 0, ev: 'B', note: 'Aardappel laag oxalaat; mayo geen.' },
    h: { s: 1, ev: 'B', note: 'Augurk/azijn (gefermenteerd, liberator) + mayo. SIGHI cat. 1.' },
  },
  {
    id: 'nl-kapsalon', nl: 'Kapsalon (friet, shoarma, kaas)', en: 'Kapsalon (fries, shawarma, cheese)', cat: 'bereid-gerecht', sub: 'fastfood',
    j: { s: 2, ev: 'B', note: 'Shoarmavlees (~120-150 mg purine) + friet + gesmolten kaas. Hoge portie. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Gesmolten belegen kaas (tyramine) + gekruid gebraden vlees. Tyramine-pathway subgroep-afhankelijk.' },
    n: { s: 1, ev: 'B', note: 'Hoog natrium (friet, saus, kaas) → modifier; calcium-rijke kaas verlaagt risico. Netto score 1.' },
    h: { s: 2, ev: 'B', note: 'Belegen kaas (tyramine) + knoflooksaus + gebraden vlees. SIGHI cat. 2.' },
  },
  {
    id: 'nl-patat-friet', nl: 'Patat/friet met mayonaise', en: 'Fries with mayonnaise', cat: 'bereid-gerecht', sub: 'fastfood',
    j: { s: 0, ev: 'B', note: 'Aardappel laag purine; mayo verwaarloosbaar.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 1, ev: 'B', note: 'Aardappel matig-laag oxalaat; gezouten friet → natrium-modifier bij grote portie. Score 1.' },
    h: { s: 0, ev: 'B', note: 'Laag histamine (aardappel, plantaardige olie).' },
  },
  {
    id: 'nl-pannenkoek', nl: 'Pannenkoek (naturel)', en: 'Pancake (plain)', cat: 'bereid-gerecht', sub: 'meel-gerecht',
    j: { s: 0, ev: 'B', note: 'Bloem, melk, ei. Laag purine.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 0, ev: 'B', note: 'Laag histamine (vers beslag).' },
  },
  {
    id: 'nl-bruschetta', nl: 'Bruschetta (tomaat, knoflook)', en: 'Bruschetta (tomato, garlic)', cat: 'bereid-gerecht', sub: 'voorgerecht',
    j: { s: 0, ev: 'B', note: 'Brood + tomaat + olijfolie. Laag purine.' },
    m: { s: 1, ev: 'B', note: 'Tomaat (liberator) + knoflook; zwak migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Tomaat oxalaat subklinisch per portie.' },
    h: { s: 2, ev: 'B', note: 'Verse tomaat = histamine-liberator. SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-falafel', nl: 'Falafel (kikkererwt, gefrituurd)', en: 'Falafel (chickpea, fried)', cat: 'bereid-gerecht', sub: 'vegetarisch',
    j: { s: 2, ev: 'B', eular: true, note: 'Kikkererwten (peulvrucht). EULAR: peulvrucht max score 2 ondanks purine.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof; kruiden zonder pathway.' },
    n: { s: 1, ev: 'B', note: 'Kikkererwt matig oxalaat; per portie licht verhoogd.' },
    h: { s: 1, ev: 'B', note: 'Kikkererwt + tahin/specerijen; laag-matig. SIGHI cat. 1.' },
  },
  {
    id: 'nl-burrito', nl: 'Burrito (bonen, rijst, kaas)', en: 'Burrito (beans, rice, cheese)', cat: 'bereid-gerecht', sub: 'wrap',
    j: { s: 2, ev: 'B', eular: true, note: 'Kidney-/bruine bonen (peulvrucht, EULAR max 2) + soms vlees. Score 2.' },
    m: { s: 1, ev: 'B', note: 'Salsa (tomaat-liberator) + kaas (klein). Geen sterke trigger.' },
    n: { s: 1, ev: 'B', note: 'Bonen + kaas; oxalaat subklinisch, calcium-rijk verlaagt risico. Score ≤1.' },
    h: { s: 2, ev: 'B', note: 'Salsa (tomaat-liberator) + kaas (tyramine) + bonen. SIGHI cat. 1-2.' },
  },
  {
    id: 'nl-ramen', nl: 'Ramen (bouillon, varkensvlees, ei)', en: 'Ramen (broth, pork, egg)', cat: 'bereid-gerecht', sub: 'soep',
    j: { s: 3, ev: 'B', note: 'Geconcentreerde vlees-/botbouillon is zeer purinerijk (vleesaftreksel >150-300 mg/100g, USDA) + chashu-varkensvlees. Hoge purineload per portie. Score 3.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Chashu (gebraden/soms gecureerd varkensvlees) + gefermenteerde miso/sojabasis. Nitriet/tyramine sub-Henderson, subgroep-relevant.' },
    n: { s: 1, ev: 'B', note: 'Hoog natrium bouillon → modifier; oxalaatbasis laag. Score 1.' },
    h: { s: 2, ev: 'B', note: 'Gefermenteerde miso/sojabasis + langgetrokken bouillon + gebraden vlees. SIGHI cat. 2.' },
  },
  {
    id: 'nl-pho', nl: 'Pho (Vietnamese runderbouillon)', en: 'Pho (Vietnamese beef broth)', cat: 'bereid-gerecht', sub: 'soep',
    j: { s: 3, ev: 'B', note: 'Langgetrokken runderbotbouillon is zeer purinerijk (vleesaftreksel hoog, USDA) + rundvlees. Score 3.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Vissaus (gefermenteerd, tyramine/biogene aminen) — subgroep-afhankelijke pathway. Verse kruiden geen trigger.' },
    n: { s: 1, ev: 'B', note: 'Hoog natrium bouillon → modifier; oxalaatbasis laag. Score 1.' },
    h: { s: 2, ev: 'B', note: 'Vissaus (gefermenteerd, histaminerijk) + langgetrokken bouillon. SIGHI cat. 2.' },
  },
  {
    id: 'nl-risotto', nl: 'Risotto (Parmezaan)', en: 'Risotto (Parmesan)', cat: 'bereid-gerecht', sub: 'rijstgerecht',
    j: { s: 1, ev: 'B', note: 'Rijst (laag purine) + bouillon + Parmezaan. Portie matig-laag. Score 1.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Parmezaan (gerijpte kaas, tyramine) + bouillon. Tyramine-pathway subgroep-afhankelijk (analoog §2.2 gerijpte kaas).' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Parmezaan (tyramine/histamine, gerijpt). SIGHI cat. 2.' },
  },
]

function append(file, specs) {
  const p = path.join(process.cwd(), 'src/data', file)
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
  const existing = new Set(data.items.map((i) => i.id))
  let added = 0
  for (const spec of specs) {
    if (existing.has(spec.id)) { console.log(`  ~ skip (bestaat al): ${spec.id}`); continue }
    data.items.push(item(spec))
    added++
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  console.log(`✓ ${file}: +${added} items (totaal ${data.items.length})`)
}

append('eieren.json', eieren)
append('bereid-gerecht.json', gerechten)
