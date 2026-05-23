/**
 * Fase 4 batch 3 (laatste) — 20 bereid-gerecht → DB op 700 (cap, §7).
 *
 * Volledig in bereid-gerecht.json. Scoring volgt CLAUDE.md §2.x:
 *  - migraine max 2 + verplichte triggerType (gecureerd vlees → subgroep-bevestigd;
 *    gefermenteerd/gerijpt/wijn/vissaus → subgroep-overschat)
 *  - items met 'kaas' in naam → nierstenen ≤1 (gate 8); cordon bleu = enige
 *  - score 3 → evidence B (gate 10); bronnen uit de zes ruggengraat-URL's (gate 4)
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
  if (spec.note) o.note = { nl: spec.note }
  return o
}

function item(spec) {
  return {
    id: spec.id,
    name: { nl: spec.nl, en: spec.en },
    category: 'bereid-gerecht',
    subcategory: spec.sub,
    scores: {
      jicht: score('jicht', spec.j),
      migraine: score('migraine', spec.m),
      nierstenen: score('nierstenen', spec.n),
      histamine: score('histamine', spec.h),
    },
    meta: { addedAt: DATE, schemaVersion: '1.0.0', lastReviewed: DATE },
  }
}

const items = [
  { id: 'nl-pizza-salami', nl: 'Pizza salami', en: 'Salami pizza', sub: 'pizza',
    j: { s: 2, ev: 'B', note: 'Salamibeleg (gecureerd) + deeg/kaas. Portie ~120-180 mg purine. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Salami is gecureerd/nitriethoudend vlees (sub-Henderson per portie) + kaas. Subgroep-relevant.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Salami (gerijpt, biogene aminen) + kaas + tomatensaus (liberator). SIGHI cat. 2.' } },
  { id: 'nl-zuurkoolschotel', nl: 'Zuurkoolschotel met worst', en: 'Sauerkraut casserole with sausage', sub: 'stamppot',
    j: { s: 2, ev: 'B', note: 'Worst/spek (purine) + aardappel + zuurkool. Portie score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Zuurkool (sterk gefermenteerd, biogene aminen/tyramine) + worst. Subgroep-afhankelijke pathway.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Zuurkool is sterk gefermenteerd → behoort tot de histaminerijkste producten. SIGHI cat. 3.' } },
  { id: 'nl-andijviestamppot-spek', nl: 'Andijviestamppot met spekjes', en: 'Endive stamppot with bacon', sub: 'stamppot',
    j: { s: 2, ev: 'B', note: 'Aardappel + andijvie + spekjes (purine). Portie score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Spekjes = gecureerd/nitriethoudend vlees (sub-Henderson). Subgroep-relevant.' },
    n: { s: 1, ev: 'B', note: 'Andijvie bevat matig oxalaat; portie licht verhoogd. Score 1.' },
    h: { s: 1, ev: 'B', note: 'Spek (gerookt) + andijvie. SIGHI cat. 1.' } },
  { id: 'nl-boeuf-bourguignon', nl: 'Boeuf bourguignon', en: 'Beef bourguignon', sub: 'stoofgerecht',
    j: { s: 2, ev: 'B', note: 'Rundvlees stoof (~110-150 mg purine/100g). Portie score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Rode wijn (tyramine/sulfiet; alcohol grotendeels verdampt) + champignons. Subgroep-afhankelijke pathway.' },
    n: { s: 0, ev: 'B', note: 'Champignon/wijn oxalaat subklinisch per portie.' },
    h: { s: 2, ev: 'B', note: 'Rode wijn + champignon + langgestoofd vlees → biogene aminen. SIGHI cat. 2.' } },
  { id: 'nl-moussaka', nl: 'Moussaka', en: 'Moussaka', sub: 'ovenschotel',
    j: { s: 2, ev: 'B', note: 'Lamsgehakt (~120-150 mg purine) + aubergine + bechamel. Score 2.' },
    m: { s: 1, ev: 'B', note: 'Aubergine + tomaat (liberatoren); geen sterk migrainebewijs.' },
    n: { s: 1, ev: 'B', note: 'Aubergine matig oxalaat; portie licht verhoogd. Score 1.' },
    h: { s: 2, ev: 'B', note: 'Aubergine + tomaat (liberatoren) + bechamel. SIGHI cat. 1-2.' } },
  { id: 'nl-spareribs', nl: 'Spareribs (varkensribben)', en: 'Spare ribs (pork)', sub: 'vlees',
    j: { s: 2, ev: 'B', note: 'Varkensribben (~120-150 mg purine/100g), grote portie. Score 2.' },
    m: { s: 1, ev: 'B', note: 'BBQ-/tomatensaus (liberator); geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Tomaten-/BBQ-marinade (liberator) + langgegaard vlees. SIGHI cat. 1-2.' } },
  { id: 'nl-cordon-bleu', nl: 'Cordon bleu (kip, ham, kaas)', en: 'Cordon bleu (chicken, ham, cheese)', sub: 'vlees',
    j: { s: 1, ev: 'B', note: 'Kipfilet + ham + kaas, gepaneerd. Portie matig. Score 1.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Gecureerde ham (nitriet, sub-Henderson) + kaas. Subgroep-relevant.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat; calcium-rijke kaas verlaagt eerder risico.' },
    h: { s: 2, ev: 'B', note: 'Kaas (tyramine) + gecureerde ham. SIGHI cat. 2.' } },
  { id: 'nl-schnitzel', nl: 'Schnitzel (varkens, gepaneerd)', en: 'Pork schnitzel (breaded)', sub: 'vlees',
    j: { s: 2, ev: 'B', note: 'Varkensschnitzel (~120-150 mg purine/100g). Score 2.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof bij verse bereiding.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Vers gepaneerd varkensvlees laag histamine. SIGHI cat. 0-1.' } },
  { id: 'nl-worstenbroodje', nl: 'Worstenbroodje', en: 'Sausage roll', sub: 'snack',
    j: { s: 2, ev: 'B', note: 'Worstvulling (gehakt/worst) in deeg. Portie score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-bevestigd', note: 'Worst kan gecureerd/nitriethoudend zijn (sub-Henderson). Subgroep-relevant.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Worstvulling; afhankelijk van rijping. SIGHI cat. 1.' } },
  { id: 'nl-tonijnsalade', nl: 'Tonijnsalade (met mayonaise)', en: 'Tuna salad (with mayonnaise)', sub: 'salade',
    j: { s: 2, ev: 'B', note: 'Ingeblikte tonijn (matig-hoog purine) + mayo. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Ingeblikte tonijn (hoge biogene aminen). Subgroep-afhankelijke pathway.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Ingeblikte tonijn behoort tot de histaminerijkste producten. SIGHI cat. 3.' } },
  { id: 'nl-garnalencocktail', nl: 'Garnalencocktail', en: 'Shrimp cocktail', sub: 'voorgerecht',
    j: { s: 2, ev: 'B', note: 'Garnalen (matig purine) + cocktailsaus. Score 2.' },
    m: { s: 0, ev: 'B', note: 'Verse garnalen geen trigger; let op histamine bij niet-verse schaaldieren.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Schaaldier + cocktailsaus (tomaat-liberator). SIGHI cat. 2.' } },
  { id: 'nl-caprese', nl: 'Caprese salade', en: 'Caprese salad', sub: 'salade',
    j: { s: 0, ev: 'B', note: 'Tomaat + mozzarella + basilicum. Laag purine.' },
    m: { s: 1, ev: 'B', note: 'Verse tomaat (liberator) + mozzarella; geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 2, ev: 'B', note: 'Verse tomaat (liberator) + mozzarella (verse kaas). SIGHI cat. 1-2.' } },
  { id: 'nl-griekse-salade', nl: 'Griekse salade (feta, olijf)', en: 'Greek salad (feta, olives)', sub: 'salade',
    j: { s: 0, ev: 'B', note: 'Groente + feta + olijven. Laag purine.' },
    m: { s: 1, ev: 'B', note: 'Tomaat (liberator) + feta (tyramine, mild); geen sterk migrainebewijs.' },
    n: { s: 1, ev: 'B', note: 'Feta/olijf gezouten → natrium-modifier mogelijk; oxalaat laag. Score ≤1.' },
    h: { s: 2, ev: 'B', note: 'Tomaat (liberator) + feta + olijven (gefermenteerd). SIGHI cat. 1-2.' } },
  { id: 'nl-quinoa-salade', nl: 'Quinoa salade (met groente)', en: 'Quinoa salad (with vegetables)', sub: 'salade',
    j: { s: 0, ev: 'B', note: 'Quinoa + groente; laag purine.' },
    m: { s: 0, ev: 'B', note: 'Geen migraine-triggerstof.' },
    n: { s: 2, ev: 'B', note: 'Quinoa is matig oxalaatrijk; portie ~25-50 mg oxalaat → score 2 (§2.3 drempel).' },
    h: { s: 0, ev: 'B', note: 'Verse plantaardige salade; laag histamine.' } },
  { id: 'nl-gevulde-paprika', nl: 'Gevulde paprika (gehakt, rijst)', en: 'Stuffed pepper (mince, rice)', sub: 'ovenschotel',
    j: { s: 2, ev: 'B', note: 'Rundergehakt + rijst in paprika. Portie score 2.' },
    m: { s: 1, ev: 'B', note: 'Paprika/tomaat (liberatoren); geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 1, ev: 'B', note: 'Paprika/tomaat (liberatoren) + gehakt. SIGHI cat. 1.' } },
  { id: 'nl-mac-and-cheese', nl: 'Mac and cheese', en: 'Macaroni and cheese', sub: 'pasta',
    j: { s: 1, ev: 'B', note: 'Pasta + kaassaus. Portie matig-laag purine. Score 1.' },
    m: { s: 1, ev: 'B', note: 'Kaas (tyramine; jonge/gesmolten kaas mild); geen sterk migrainebewijs.' },
    n: { s: 1, ev: 'B', note: 'Kaassaus calcium-rijk (verlaagt risico); geen relevant oxalaat. Score ≤1.' },
    h: { s: 2, ev: 'B', note: 'Kaassaus (tyramine/histamine). SIGHI cat. 2.' } },
  { id: 'nl-fish-and-chips', nl: 'Fish and chips', en: 'Fish and chips', sub: 'fastfood',
    j: { s: 2, ev: 'B', note: 'Gepaneerde witvis (kabeljauw) + friet. Grote portie. Score 2.' },
    m: { s: 0, ev: 'B', note: 'Verse witvis geen trigger.' },
    n: { s: 1, ev: 'B', note: 'Gezouten friet → natrium-modifier bij grote portie. Score 1.' },
    h: { s: 1, ev: 'B', note: 'Verse witvis (laag) + friet. SIGHI cat. 0-1.' } },
  { id: 'nl-pad-thai', nl: 'Pad thai (garnaal)', en: 'Pad thai (shrimp)', sub: 'noedels',
    j: { s: 2, ev: 'B', note: 'Garnalen (matig purine) + rijstnoedels + ei. Score 2.' },
    m: { s: 2, ev: 'B', tt: 'subgroep-overschat', note: 'Vissaus (gefermenteerd, tyramine/biogene aminen) + pinda. Subgroep-afhankelijke pathway.' },
    n: { s: 0, ev: 'B', note: 'Geen relevant oxalaat.' },
    h: { s: 3, ev: 'B', note: 'Vissaus (gefermenteerd, histaminerijk) + pinda (liberator) + garnaal. SIGHI cat. 2-3.' } },
  { id: 'nl-kip-tikka-masala', nl: 'Kip tikka masala', en: 'Chicken tikka masala', sub: 'curry',
    j: { s: 1, ev: 'B', note: 'Kipfilet + tomaten-roomsaus. Portie matig-laag purine. Score 1.' },
    m: { s: 1, ev: 'B', note: 'Tomatensaus (liberator) + specerijen; geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Tomaat oxalaat subklinisch per portie.' },
    h: { s: 2, ev: 'B', note: 'Tomaten-roomsaus (liberator) + specerijen. SIGHI cat. 1-2.' } },
  { id: 'nl-gnocchi-tomaat', nl: 'Gnocchi met tomatensaus', en: 'Gnocchi with tomato sauce', sub: 'pasta',
    j: { s: 0, ev: 'B', note: 'Aardappelgnocchi + tomatensaus. Laag purine.' },
    m: { s: 1, ev: 'B', note: 'Tomatensaus (liberator); geen sterk migrainebewijs.' },
    n: { s: 0, ev: 'B', note: 'Aardappel/tomaat oxalaat subklinisch per portie.' },
    h: { s: 2, ev: 'B', note: 'Tomatensaus = histamine-liberator. SIGHI cat. 1-2.' } },
]

const p = path.join(process.cwd(), 'src/data/bereid-gerecht.json')
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
console.log(`✓ bereid-gerecht.json: +${added} items (totaal ${data.items.length})`)
