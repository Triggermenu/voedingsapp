/**
 * patch-cluster6.cjs
 * Voegt 4 nieuwe items toe:
 *   Cluster 6 (gist-extracten): nl-marmite, nl-vegemite, nl-gistvlokken → sauzen-kruiden.json
 *   Cluster 18 (MSG/bouillon):  nl-bouillonblok-gistextract              → sauzen-kruiden.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = 'src/data/sauzen-kruiden.json';

function loadJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}
function saveJson(relPath, data) {
  fs.writeFileSync(path.join(ROOT, relPath), JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ── Shared sources ─────────────────────────────────────────────────────────

const GARDNER_1996 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/8617704/',
  title: 'Gardner DM et al. 1996 — The making of a user friendly MAOI diet (J Clin Psychiatry)',
  type: 'guideline',
  accessedAt: '2026-05-14'
};

const WALKER_1996 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/8889911/',
  title: 'Walker SE et al. 1996 — Tyramine content of previously restricted foods in MAOI diets (J Clin Psychopharmacol)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const DA_PRADA_1988 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/3283290/',
  title: 'Da Prada M et al. 1988 — On tyramine, food, beverages and the reversible MAO inhibitor moclobemide (J Neural Transm Suppl)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const PRESCRIBERS_GUIDE_2022 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg JPM & Gillman K 2022 — Prescribers\' guide to the MAOI diet: thinking through tyramine myths (J Neural Transm)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const HINDIYEH_2020 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache',
  type: 'review',
  accessedAt: '2026-05-14'
};

const KANEKO_2014 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/24553148/',
  title: 'Kaneko K et al. 2014 — Total purine and purine base content of common foodstuffs (Biol Pharm Bull)',
  type: 'database',
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

// ── MCCABE_SELLERS_2006: no PubMed PMID, cite via DOI ─────────────────────
const MCCABE_SELLERS_2006 = {
  url: 'https://doi.org/10.1016/j.jfca.2005.12.008',
  title: 'McCabe-Sellers BJ et al. 2006 — Tyramine in foods and MAO inhibitor drugs (J Food Compost Anal)',
  type: 'review',
  accessedAt: '2026-05-14'
};

// ── nl-marmite ─────────────────────────────────────────────────────────────

const NL_MARMITE = {
  id: 'nl-marmite',
  name: { nl: 'Marmite (gistextract-spread)', en: 'Marmite (yeast extract spread)' },
  category: 'sauzen-kruiden',
  subcategory: 'spreads',
  scores: {
    jicht: {
      score: 3,
      evidence: 'A',
      sources: [KANEKO_2014, USDA_PURINE],
      note: { nl: 'Geconcentreerd gistextract: >300 mg purines per 100g (categorie "zeer hoog"). Gicht-patiënten: vermijden of sterk beperken tot max 5g.' }
    },
    migraine: {
      score: 2,
      evidence: 'B',
      confidence: 'middel',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['tyramine', 'MAO-remming'],
      sources: [GARDNER_1996, WALKER_1996, DA_PRADA_1988, PRESCRIBERS_GUIDE_2022],
      note: {
        nl: 'Marmite bevat tyramine — de stof die bij gebruik van MAOI-antidepressiva gevaarlijk bloeddruk kan verhogen ("cheese reaction"). Moderne metingen: 322–650 mg tyramine per kg; een typisch sneetje brood met Marmite (5g) levert 1,6–3,25 mg tyramine, wat onder de klassieke MAOI-veiligheidsgrens van 6 mg per maaltijd valt. Voor mensen zónder MAOI-medicatie breekt het lichaam tyramine efficiënt af; geen positieve migraine-RCT beschikbaar. Gebruik je MAOI-medicatie (fenelzine, tranylcypromide, moclobemide)? Marmite dan vermijden — ook bij kleine hoeveelheden, vanwege batchvariabiliteit.',
        en: 'Marmite contains tyramine — the compound that can dangerously raise blood pressure when combined with MAOI antidepressants ("cheese reaction"). Modern measurements: 322–650 mg/kg; a typical 5g serving delivers 1.6–3.25 mg tyramine, below the classical 6 mg/meal MAOI safety threshold. For people without MAOI medication, tyramine is efficiently metabolised; no positive migraine RCT exists. On MAOI medication? Avoid Marmite due to batch variability.'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 2,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Gistextract: hoog histamine en histamineliberator. SIGHI: vermijden.' }
    }
  },
  histamineFlags: { liberator: true, daoBlocker: false },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 6
};

// ── nl-vegemite ────────────────────────────────────────────────────────────

const NL_VEGEMITE = {
  id: 'nl-vegemite',
  name: { nl: 'Vegemite (gistextract-spread)', en: 'Vegemite (yeast extract spread)' },
  category: 'sauzen-kruiden',
  subcategory: 'spreads',
  scores: {
    jicht: {
      score: 3,
      evidence: 'A',
      sources: [KANEKO_2014, USDA_PURINE],
      note: { nl: 'Geconcentreerd gistextract: >300 mg purines per 100g. Zelfde profiel als Marmite.' }
    },
    migraine: {
      score: 2,
      evidence: 'B',
      confidence: 'middel',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['tyramine', 'MAO-remming'],
      sources: [GARDNER_1996, WALKER_1996, MCCABE_SELLERS_2006, PRESCRIBERS_GUIDE_2022],
      note: {
        nl: 'Vegemite is het Australische equivalent van Marmite: eveneens autolytisch gistextract met vergelijkbaar tyramine-profiel. McCabe-Sellers 2006 documenteert tyramine in Australische gistextracten. Zelfde redenering als Marmite: relevant bij MAOI-gebruik, niet bewezen als trigger voor de algemene bevolking. Gebruik je MAOI-medicatie? Vegemite vermijden.',
        en: 'Vegemite is the Australian equivalent of Marmite: also autolysed yeast extract with a comparable tyramine profile. McCabe-Sellers 2006 documents tyramine in Australian yeast extracts. Same reasoning as Marmite: relevant under MAOI use, not established as trigger for the general population.'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 2,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Gistextract: histamineliberator. SIGHI: vermijden.' }
    }
  },
  histamineFlags: { liberator: true, daoBlocker: false },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 6
};

// ── nl-gistvlokken ─────────────────────────────────────────────────────────

const NL_GISTVLOKKEN = {
  id: 'nl-gistvlokken',
  name: { nl: 'Gistvlokken (nutritional yeast)', en: 'Nutritional yeast flakes' },
  category: 'sauzen-kruiden',
  subcategory: 'smaakversterkers',
  scores: {
    jicht: {
      score: 3,
      evidence: 'A',
      sources: [KANEKO_2014, USDA_PURINE],
      note: { nl: 'Inactieve gedroogde gist: >300 mg purines per 100g. Ondanks het gezonde imago: gicht-patiënten beperken tot max 5–10g per dag.' }
    },
    migraine: {
      score: 1,
      evidence: 'C',
      confidence: 'laag',
      triggerType: 'context-afhankelijk',
      primaryModulators: ['tyramine'],
      sources: [HINDIYEH_2020, GARDNER_1996],
      note: {
        nl: 'Gistvlokken zijn inactieve (niet-autolytische) gist: de cellen zijn verhit gedroogd zonder autolytisch enzymatisch afbraakproces. Dit leidt tot minder tyraminevorming dan bij Marmite of Vegemite. Geen directe studie voor gistvlokken als migrainetrigger. Voorzorgsscore 1 voor mensen met MAOI-medicatie of sterke tyramine-gevoeligheid.',
        en: 'Nutritional yeast is inactive (non-autolysed) yeast: cells are heat-dried without enzymatic autolysis, resulting in lower tyramine formation than Marmite or Vegemite. No direct study for nutritional yeast as a migraine trigger. Precautionary score 1 for people on MAOI medication or with strong tyramine sensitivity.'
      }
    },
    nierstenen: {
      score: 0,
      evidence: 'B',
      sources: [HARVARD_OXALATE]
    },
    histamine: {
      score: 1,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Gist kan histamine bevatten maar is minder geconcentreerd dan autolytisch extract.' }
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 6
};

// ── nl-bouillonblok-gistextract (cluster 18, niet 6) ──────────────────────

const NL_BOUILLONBLOK = {
  id: 'nl-bouillonblok-gistextract',
  name: { nl: 'Bouillonblok (met gistextract)', en: 'Bouillon cube (with yeast extract)' },
  category: 'sauzen-kruiden',
  subcategory: 'bouillon',
  scores: {
    jicht: {
      score: 1,
      evidence: 'B',
      sources: [USDA_PURINE],
      note: { nl: 'Gistextract is een component (~15–30% van product). Per 100g product ~45–90 mg purines → score 1. Portie per blokje (5g) levert weinig purines.' }
    },
    migraine: {
      score: 2,
      evidence: 'B',
      confidence: 'laag',
      triggerType: 'subgroep-overschat',
      primaryModulators: ['vrij-glutamaat', 'gistextract'],
      sources: [
        {
          url: 'https://pubmed.ncbi.nlm.nih.gov/10736382/',
          title: 'Geha RS et al. 2000 — Review of alleged reaction to MSG; multicenter double-blind placebo-controlled study (J Nutr)',
          type: 'review',
          accessedAt: '2026-05-14'
        },
        {
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4870486/',
          title: 'Obayashi Y & Nagamura Y 2016 — Does MSG really cause headache? Systematic review (J Headache Pain)',
          type: 'review',
          accessedAt: '2026-05-14'
        },
        HINDIYEH_2020
      ],
      note: {
        nl: 'Industriële bouillonblokjes bevatten gistextract als smaakstof én doorgaans MSG (E621). De tyramine-bijdrage van gistextract in bouillonblokjes is verwaarloosbaar: niet-gefermenteerde producten bevatten ≤10 mg/kg tyramine, wat per blokje neerkomt op ~0,05 mg. De migraine-relevantie loopt primair via het MSG-traject (zie cluster 18: score 2, subgroep-overschat, evidence B). Het populaire idee dat bouillon migraines veroorzaakt is grotendeels gebonden aan de MSG-component, die bij nader onderzoek in grote dubbelblinde studies geen effect toonde bij normaal gebruik.',
        en: 'Industrial bouillon cubes contain yeast extract as a flavouring and usually MSG (E621). The tyramine contribution of yeast extract in bouillon cubes is negligible: non-fermented products contain ≤10 mg/kg tyramine, yielding ~0.05 mg per cube. Migraine relevance runs primarily via the MSG pathway (cluster 18: score 2, subgroep-overschat, evidence B).'
      }
    },
    nierstenen: {
      score: 1,
      evidence: 'B',
      sources: [AUA_GUIDELINE],
      note: { nl: 'Hoog natriumgehalte (±800–1000 mg per blokje): +1 modifier per AUA-richtlijn. Basisoxalaat: 0. Score 0+1=1.' }
    },
    histamine: {
      score: 2,
      evidence: 'B',
      sources: [SIGHI],
      note: { nl: 'Gistextract + MSG: beide gelisted als incompatibel in SIGHI.' }
    }
  },
  meta: {
    addedAt: '2026-05-14',
    schemaVersion: '1.0.0',
    lastReviewed: '2026-05-14'
  },
  cluster: 18
};

// ── Apply patch ────────────────────────────────────────────────────────────

const data = loadJson(FILE);
const existing = new Set(data.items.map(i => i.id));

const newItems = [NL_MARMITE, NL_VEGEMITE, NL_GISTVLOKKEN, NL_BOUILLONBLOK];
let added = 0;

newItems.forEach(item => {
  if (!existing.has(item.id)) {
    data.items.push(item);
    console.log(`✓ ${item.id} toegevoegd (cluster ${item.cluster})`);
    added++;
  } else {
    console.log(`⏭ ${item.id} al aanwezig, overgeslagen`);
  }
});

saveJson(FILE, data);
console.log(`\nCluster-6/18 patch compleet. ${added} items toegevoegd.`);
