'use strict';
const fs = require('fs');

const ZUIVEL_PATH = 'C:/Users/peter/dev/voedingsapp/src/data/zuivel.json';
const EIEREN_PATH = 'C:/Users/peter/dev/voedingsapp/src/data/eieren.json';

// ── Standard sources ──────────────────────────────────────────────────────────
const USDA_PURINE = {
  url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf',
  title: 'USDA Purine Database Release 2.0 (2025)',
  type: 'database',
  accessedAt: '2026-05-20',
};
const HARVARD_OX = {
  url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx',
  title: 'Harvard Oxalate Table 2023 (UAB Knight Lab)',
  type: 'database',
  accessedAt: '2026-05-20',
};
const FINBERG = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors',
  type: 'review',
  accessedAt: '2026-05-20',
};
const HINDIYEH = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache',
  type: 'review',
  accessedAt: '2026-05-20',
};
const SIGHI = {
  url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf',
  title: 'SIGHI Food Compatibility List 2023',
  type: 'consensus',
  accessedAt: '2026-05-20',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const META = {
  addedAt: '2026-05-20',
  schemaVersion: '1.0.0',
  lastReviewed: '2026-05-20',
};

function stdMigraine() {
  return {
    score: 0,
    evidence: 'B',
    sources: [FINBERG, HINDIYEH],
    note: { nl: 'Ei bevat vrijwel geen tyramine en staat niet op enige migraine-triggerlijst. Score groen.' },
  };
}

function stdJicht(noteNl) {
  return { score: 0, evidence: 'A', sources: [USDA_PURINE], note: { nl: noteNl } };
}

function stdNierstenen(noteNl) {
  return { score: 0, evidence: 'A', sources: [HARVARD_OX], note: { nl: noteNl } };
}

function stdHistamine0() {
  return { score: 0, evidence: 'B', sources: [SIGHI] };
}

function item(id, nl, en, jicht, migraine, nierstenen, histamine) {
  return {
    id,
    name: { nl, en },
    category: 'eieren',
    subcategory: 'eieren',
    cluster: 20,
    scores: { jicht, migraine, nierstenen, histamine },
    meta: META,
  };
}

// ── Step 1: read zuivel.json ──────────────────────────────────────────────────
const zuivel = JSON.parse(fs.readFileSync(ZUIVEL_PATH, 'utf8'));
const MOVE_IDS = new Set(['748967', 'nl-ei-gebakken', 'nl-ei-hardgekookt']);
const movedItems = zuivel.items.filter(i => MOVE_IDS.has(i.id));
const remainingZuivel = zuivel.items.filter(i => !MOVE_IDS.has(i.id));

if (movedItems.length !== 3) {
  throw new Error(`Expected 3 moved items, got ${movedItems.length}`);
}

// ── Step 2: build the 10 new items ───────────────────────────────────────────
const newItems = [
  // Item 4 — Eiwit rauw
  item(
    '1124', 'Eiwit (rauw)', 'Egg white (raw)',
    stdJicht('Eiwit bevat vrijwel geen purine (<2 mg/100g).'),
    stdMigraine(),
    stdNierstenen('Eiwit bevat geen oxalaat.'),
    {
      score: 1,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Rauw eiwit remt het DAO-enzym (avidine) en kan bij gevoelige personen als histamine-liberator werken. SIGHI: licht incompatibel (cat. 1). Bij verhitting wordt avidine gedenatureerd en vervalt dit effect.' },
    },
  ),

  // Item 5 — Eidooier rauw
  item(
    '1125', 'Eidooier (rauw)', 'Egg yolk (raw)',
    stdJicht('Eidooier bevat iets meer purine dan eiwit (~4-7 mg/100g), maar ruim onder de drempel van 50 mg.'),
    stdMigraine(),
    stdNierstenen('Eidooier bevat geen oxalaat.'),
    stdHistamine0(),
  ),

  // Item 6 — Zachtgekookt
  item(
    'nl-ei-zachtgekookt', 'Zachtgekookt ei (3-4 min)', 'Soft-boiled egg',
    stdJicht('Purine: ~2-4 mg/100g. Bereidingswijze heeft geen invloed op purine-gehalte.'),
    stdMigraine(),
    stdNierstenen('Ei bevat geen oxalaat.'),
    stdHistamine0(),
  ),

  // Item 7 — Roerei
  item(
    'nl-roerei', 'Roerei (basis)', 'Scrambled eggs (basic)',
    stdJicht('Purine: ~2-4 mg/100g. Bereidingswijze heeft geen invloed op purine-gehalte.'),
    stdMigraine(),
    stdNierstenen('Ei bevat geen oxalaat.'),
    stdHistamine0(),
  ),

  // Item 8 — Omelet
  item(
    'nl-omelet', 'Omelet (basis)', 'Omelette (basic)',
    stdJicht('Purine: ~2-4 mg/100g. Bereidingswijze heeft geen invloed op purine-gehalte.'),
    stdMigraine(),
    stdNierstenen('Ei bevat geen oxalaat.'),
    stdHistamine0(),
  ),

  // Item 9 — Gepocheerd
  item(
    'nl-ei-gepocheerd', 'Gepocheerd ei', 'Poached egg',
    stdJicht('Purine: ~2-4 mg/100g. Bereidingswijze heeft geen invloed op purine-gehalte.'),
    stdMigraine(),
    stdNierstenen('Ei bevat geen oxalaat.'),
    stdHistamine0(),
  ),

  // Item 10 — Kwartelei
  item(
    'nl-kwartelei', 'Kwartelei (vers)', 'Quail egg (fresh)',
    stdJicht('Kwartelei heeft een vergelijkbaar purine-gehalte als kippeneiwit (~3-5 mg/100g). Score groen.'),
    stdMigraine(),
    stdNierstenen('Kwartelei bevat geen relevant oxalaat.'),
    stdHistamine0(),
  ),

  // Item 11 — Eendenei
  item(
    'nl-eendenei', 'Eendenei (heel, rauw)', 'Duck egg (whole, raw)',
    stdJicht('Eendenei heeft iets meer vet en eiwit dan kippeneiwit, maar een vergelijkbaar laag purine-gehalte (~3-6 mg/100g). Score groen.'),
    stdMigraine(),
    stdNierstenen('Eendenei bevat geen relevant oxalaat.'),
    stdHistamine0(),
  ),

  // Item 12 — Eipoeder
  item(
    'nl-eipoeder', 'Eipoeder (volei, gedroogd)', 'Egg powder (whole egg, dried)',
    stdJicht('Eipoeder is geconcentreerd volei. Een typische portie (15g) levert nog geen 5 mg purine. Score groen op portieniveau.'),
    stdMigraine(),
    stdNierstenen('Eipoeder bevat geen relevant oxalaat.'),
    {
      score: 1,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Gedroogd eipoeder kan door concentratie-effect en het risico op aminezuurafbraak tijdens bewaring meer biogene aminen bevatten dan vers ei. SIGHI adviseert voorzichtigheid bij histamine-intolerantie.' },
    },
  ),

  // Item 13 — Gepasteuriseerd vloeibaar ei
  item(
    'nl-ei-gepasteuriseerd', 'Gepasteuriseerd vloeibaar ei', 'Pasteurized liquid egg',
    stdJicht('Equivalent aan vers ei (~2-4 mg purine per 100g). Pasteurisatie heeft geen invloed op purine-gehalte.'),
    stdMigraine(),
    stdNierstenen('Bevat geen relevant oxalaat.'),
    stdHistamine0(),
  ),
];

// ── Step 3: assemble eieren.json (3 moved + 10 new) ──────────────────────────
const eierenItems = [...movedItems, ...newItems];
const eierenDb = { items: eierenItems };

// ── Step 4: write files ───────────────────────────────────────────────────────
fs.writeFileSync(EIEREN_PATH, JSON.stringify(eierenDb, null, 2) + '\n', 'utf8');
fs.writeFileSync(ZUIVEL_PATH, JSON.stringify({ items: remainingZuivel }, null, 2) + '\n', 'utf8');

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`eieren.json : ${eierenItems.length} items`);
console.log(`zuivel.json : ${remainingZuivel.length} items (${MOVE_IDS.size} verplaatst)`);
