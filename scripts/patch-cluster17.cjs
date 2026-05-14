/**
 * patch-cluster17.cjs
 * Voegt 4 nieuwe cluster-17 items toe (aspartaam & kunstmatige zoetstoffen).
 * Items nl-cola-light en nl-kauwgom-suikervrij → dranken-non-alcohol.json
 * Items nl-tafelzoetje-aspartaam en nl-sucralose → zoetwaren.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function loadJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function saveJson(relPath, data) {
  fs.writeFileSync(path.join(ROOT, relPath), JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ── Sources ─────────────────────────────────────────────────────────────────

const HINDIYEH_2020 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache',
  type: 'review',
  accessedAt: '2026-05-14'
};

const SCHIFFMAN_1987 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/3657889/',
  title: 'Schiffman SS et al. 1987 — Aspartame and susceptibility to headache (NEJM)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const VAN_DEN_EEDEN_1994 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/7936222/',
  title: 'Van den Eeden SK et al. 1994 — Aspartame ingestion and headaches: randomized crossover trial (Neurology)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const KOEHLER_1988 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/3277925/',
  title: 'Koehler SM & Glaros A 1988 — Effect of aspartame on migraine headache (Headache)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const LINDSETH_2014 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/24700203/',
  title: 'Lindseth GN et al. 2014 — Neurobehavioral effects of aspartame consumption (Res Nurs Health)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const USDA_PURINE = {
  url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf',
  title: 'USDA Purine Database Release 2.0 (2025)',
  type: 'database',
  accessedAt: '2026-05-14'
};

const HARVARD_OXALATE = {
  url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx',
  title: 'Harvard Oxalate Table 2023 (UAB Knight Lab)',
  type: 'database',
  accessedAt: '2026-05-14'
};

const SIGHI = {
  url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf',
  title: 'SIGHI Food Compatibility List 2023',
  type: 'consensus',
  accessedAt: '2026-05-14'
};

const AUA_GUIDELINE = {
  url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-guideline',
  title: 'AUA Medical Management of Kidney Stones Guideline',
  type: 'guideline',
  accessedAt: '2026-05-14'
};

// ── New items ────────────────────────────────────────────────────────────────

const NL_COLA_LIGHT = {
  id: 'nl-cola-light',
  name: { nl: 'Cola light / diet cola', en: 'Diet cola / cola light' },
  category: 'dranken-non-alcohol',
  subcategory: 'frisdranken',
  scores: {
    jicht: {
      score: 0,
      evidence: 'A',
      sources: [USDA_PURINE],
      note: { nl: 'Geen purines. Suikervrij, dus geen fructose-risico voor jicht.' }
    },
    migraine: {
      score: 2,
      evidence: 'B',
      confidence: 'laag',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['aspartaam', 'fenylalanine', 'serotonine-pad'],
      sources: [SCHIFFMAN_1987, VAN_DEN_EEDEN_1994, KOEHLER_1988, LINDSETH_2014, HINDIYEH_2020],
      note: {
        nl: 'Cola light bevat aspartaam (E951), dat in enkelvoudige acute proeven geen extra hoofdpijn veroorzaakte. Bij gebruik van meerdere weken achtereen rapporteerden gevoelige migrainepatiënten meer aanvallen (Lindseth 2014). Of aspartaam echt triggert of dat het om een cumulatief of nocebo-effect gaat, is nog niet opgehelderd. Bij twijfel: wissel tijdelijk naar sucroseversie en kijk of het verschil maakt.',
        en: 'Diet cola contains aspartame (E951), which did not cause more headaches in single-dose trials. With several weeks of continuous use, sensitive migraine patients reported more attacks (Lindseth 2014). Whether aspartame is a genuine trigger or a cumulative/nocebo effect is unresolved.'
      }
    },
    nierstenen: {
      score: 1,
      evidence: 'C',
      confidence: 'laag',
      sources: [AUA_GUIDELINE],
      note: {
        nl: 'Fosforzuur in cola kan niersteen-risico licht verhogen bij hoge inname. Curhan cohort-studies toonden geen significant verhoogd risico bij normaal gebruik. Score 1 (geel) als voorzorgsmaatregel.'
      }
    },
    histamine: {
      score: 0,
      evidence: 'B',
      sources: [SIGHI]
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 17
};

const NL_KAUWGOM_SUIKERVRIJ = {
  id: 'nl-kauwgom-suikervrij',
  name: { nl: 'Kauwgom (suikervrij)', en: 'Chewing gum (sugar-free)' },
  category: 'dranken-non-alcohol',
  subcategory: 'overig-drank',
  scores: {
    jicht: {
      score: 0,
      evidence: 'A',
      sources: [USDA_PURINE]
    },
    migraine: {
      score: 1,
      evidence: 'C',
      confidence: 'laag',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['aspartaam'],
      sources: [HINDIYEH_2020],
      note: {
        nl: 'Suikervrije kauwgom bevat zoetstoffen (vaak aspartaam of sorbitol). De hoeveelheid aspartaam per stukje is klein (~35 mg) en bewijs voor migrainetriggering is slechts anekdotisch. Score 1 als voorzorgsmaatregel voor zeer gevoelige personen.',
        en: 'Sugar-free gum contains sweeteners (often aspartame or sorbitol). The amount of aspartame per piece is small (~35 mg) and evidence for migraine triggering is anecdotal only.'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 0,
      evidence: 'B',
      sources: [SIGHI]
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 17
};

const NL_TAFELZOETJE_ASPARTAAM = {
  id: 'nl-tafelzoetje-aspartaam',
  name: { nl: 'Tafelzoetje (aspartaam, E951)', en: 'Tabletop sweetener (aspartame, E951)' },
  category: 'zoetwaren',
  subcategory: 'zoetstoffen',
  scores: {
    jicht: {
      score: 0,
      evidence: 'A',
      sources: [USDA_PURINE]
    },
    migraine: {
      score: 2,
      evidence: 'B',
      confidence: 'laag',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['aspartaam', 'fenylalanine', 'serotonine-pad'],
      sources: [SCHIFFMAN_1987, VAN_DEN_EEDEN_1994, KOEHLER_1988, LINDSETH_2014],
      note: {
        nl: 'Aspartaam (E951) wordt al decennialang in verband gebracht met migraine, maar grote dubbelblinde studies konden het effect bij eenmalige inname niet bevestigen. Studies waarbij meerdere weken dagelijks aspartaam werd gebruikt, lieten wel meer aanvallen zien bij migrainepatiënten (Koehler & Glaros 1988, Lindseth 2014). Wie regelmatig aspartaam gebruikt en meer aanvallen ervaart, kan twee weken stoppen om het verband te testen.',
        en: 'Aspartame (E951) has long been associated with migraine, but large double-blind studies could not confirm this with single doses. Studies with several weeks of daily use did show more attacks in migraine patients (Koehler & Glaros 1988, Lindseth 2014).'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 0,
      evidence: 'B',
      sources: [SIGHI]
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 17
};

const NL_SUCRALOSE = {
  id: 'nl-sucralose',
  name: { nl: 'Sucralose (E955)', en: 'Sucralose (E955)' },
  category: 'zoetwaren',
  subcategory: 'zoetstoffen',
  scores: {
    jicht: {
      score: 0,
      evidence: 'A',
      sources: [USDA_PURINE]
    },
    migraine: {
      score: 0,
      evidence: 'C',
      sources: [HINDIYEH_2020],
      note: {
        nl: 'Sucralose wordt niet omgezet tot fenylalanine en heeft geen bekend werkingsmechanisme voor migraine. Geen RCT-bewijs voor triggering. Score groen.',
        en: 'Sucralose is not metabolised to phenylalanine and has no known mechanism for migraine. No RCT evidence for triggering.'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 0,
      evidence: 'B',
      sources: [SIGHI]
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 17
};

// ── Apply patch ──────────────────────────────────────────────────────────────

// dranken-non-alcohol: nl-cola-light, nl-kauwgom-suikervrij
const drankenFile = 'src/data/dranken-non-alcohol.json';
const dranken = loadJson(drankenFile);
const existingDrankenIds = dranken.items.map(i => i.id);

if (!existingDrankenIds.includes('nl-cola-light')) {
  dranken.items.push(NL_COLA_LIGHT);
  console.log('✓ nl-cola-light toegevoegd');
} else {
  console.log('⏭ nl-cola-light al aanwezig, overgeslagen');
}

if (!existingDrankenIds.includes('nl-kauwgom-suikervrij')) {
  dranken.items.push(NL_KAUWGOM_SUIKERVRIJ);
  console.log('✓ nl-kauwgom-suikervrij toegevoegd');
} else {
  console.log('⏭ nl-kauwgom-suikervrij al aanwezig, overgeslagen');
}

saveJson(drankenFile, dranken);

// zoetwaren: nl-tafelzoetje-aspartaam, nl-sucralose
const zoetwarenFile = 'src/data/zoetwaren.json';
const zoetwaren = loadJson(zoetwarenFile);
const existingZoetIds = zoetwaren.items.map(i => i.id);

if (!existingZoetIds.includes('nl-tafelzoetje-aspartaam')) {
  zoetwaren.items.push(NL_TAFELZOETJE_ASPARTAAM);
  console.log('✓ nl-tafelzoetje-aspartaam toegevoegd');
} else {
  console.log('⏭ nl-tafelzoetje-aspartaam al aanwezig, overgeslagen');
}

if (!existingZoetIds.includes('nl-sucralose')) {
  zoetwaren.items.push(NL_SUCRALOSE);
  console.log('✓ nl-sucralose toegevoegd');
} else {
  console.log('⏭ nl-sucralose al aanwezig, overgeslagen');
}

saveJson(zoetwarenFile, zoetwaren);

console.log('\nCluster-17 patch compleet.');
