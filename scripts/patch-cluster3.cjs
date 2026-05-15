/**
 * patch-cluster3.cjs
 * Bijwerken van 13 bestaande kaas-items in zuivel.json:
 *   - migraine score, evidence, confidence, triggerType, primaryModulators, sources, note
 *   - subcategory-correcties (7 items → kaas-gerijpt)
 *   - cluster: 3 op alle 13 items
 *   - lastReviewed bijwerken
 *
 * Score-wijzigingen:
 *   3→2: nl-kaas-oud-48, nl-blauwe-kaas, nl-edam-extra-belegen (vloer-regel)
 *   2→2: nl-cheddar, nl-gouda-belegen, nl-manchego (ongewijzigd)
 *   1→2: nl-feta
 *   2→1: nl-parmezaan, nl-raclette-kaas, nl-emmentaler, nl-gruyere, nl-brie, nl-camembert
 */

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../src/data/zuivel.json');

// ── Gedeelde bronnen ────────────────────────────────────────────────────────

const MOFFETT_1972 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/4559027/',
  title: 'Moffett A, Swash M, Scott DF 1972 — Effect of tyramine in migraine: a double-blind study (J Neurol Neurosurg Psychiatry)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const ZIEGLER_1977 = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/560645/',
  title: 'Ziegler DK & Stewart R 1977 — Failure of tyramine to induce migraine (Neurology)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const SUDHARTA_2023 = {
  url: 'https://oamjms.eu/index.php/mjms/article/view/11484',
  title: 'Sudharta H et al. 2023 — Tyramine ingestion and migraine attack: a systematic review (Open Access Macedonian J Med Sci)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const HINDIYEH_2020 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache',
  type: 'review',
  accessedAt: '2026-05-14'
};

const PRESCRIBERS_GUIDE_2022 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg JPM & Gillman K 2022 — Prescribers\' guide to the MAOI diet: thinking through tyramine myths (J Neural Transm)',
  type: 'review',
  accessedAt: '2026-05-14'
};

const KOREAN_2021 = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7824754/',
  title: 'Korean domestic market study 2021 — Quantitative analysis of biogenic amines in different cheese varieties (Foods)',
  type: 'review',
  accessedAt: '2026-05-14'
};

// Standaard bronnenset voor alle migraine-scores cluster 3
const STD_SOURCES = [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, HINDIYEH_2020];
const STD_SOURCES_TYRAMINE = [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, PRESCRIBERS_GUIDE_2022];

// ── Patch-definitie per item ────────────────────────────────────────────────
// Formaat: { subcategory?, migraine: { score, confidence, note_nl, note_en, sources? } }

const PATCHES = {

  'nl-kaas-oud-48': {
    subcategory: 'kaas-gerijpt', // al correct, maar herhalen voor volledigheid
    migraine: {
      score: 2,
      confidence: 'middel',
      note_nl: 'Oude kaas (>48 maanden rijping) bevat meer tyramine dan jonge kaas, maar in dubbelblinde studies kon tyramine bij mensen zónder MAOI-antidepressiva geen migraine reproduceerbaar veroorzaken — placebo veroorzaakte even vaak hoofdpijn (Ziegler 1977, Moffett 1972). Score oranje als voorzorgsmaatregel, en bij gebruik van MAOI-medicatie is maatregel absoluut. Batchvariabiliteit kan groot zijn.',
      note_en: 'Aged cheese (>48 months) contains more tyramine than young cheese, but double-blind studies could not reproduce tyramine-triggered migraine in people without MAOI antidepressants — placebo produced headache equally often. Score orange as a precaution, and absolute restriction under MAOI medication.',
      sources: STD_SOURCES_TYRAMINE
    }
  },

  'nl-blauwe-kaas': {
    subcategory: 'kaas-gerijpt', // al correct
    migraine: {
      score: 2,
      confidence: 'laag',
      note_nl: 'Blauwschimmelkaas heeft de grootste spreiding in tyramine-gehalte van alle kaassoorten: sommige Roquefort-monsters bevatten vrijwel geen tyramine, terwijl Tsjechische blauwschimmelkaas gemiddeld 380 mg/kg bevat (tot 875 mg/kg). Een portie van 30g levert daarmee 0,3 tot 26 mg tyramine. Dubbelblinde studies konden tyramine als migrainetrigger bij mensen zónder MAOI-medicatie niet bevestigen. Score oranje als voorzorgsmaatregel; bij blauwschimmelkaas weegt persoonlijke ervaring zwaarder dan de generieke score.',
      note_en: 'Blue cheese has the widest tyramine variability of all cheeses: some Roquefort samples contain virtually no tyramine while Czech blue cheeses average 380 mg/kg (up to 875 mg/kg). A 30g portion delivers 0.3–26 mg tyramine. Double-blind studies could not confirm tyramine as a migraine trigger without MAOI medication.',
      sources: STD_SOURCES_TYRAMINE
    }
  },

  'nl-edam-extra-belegen': {
    subcategory: 'kaas-gerijpt', // al correct
    migraine: {
      score: 2,
      confidence: 'laag',
      note_nl: 'Extra belegen Edammer bevat minder tyramine dan de meeste andere hard-gerijpte kazen: 60-120 mg/kg in de enige beschikbare studie (Bunkova et al.), wat per portie van 30g neerkomt op 2-4 mg — ruim onder drempels waarbij farmacologische studies effect zagen. Score oranje geldt als voorzorgsmaatregel consistent met het gerijpte-kazen-paradigma; score 3 is teruggebracht op basis van RCT-evidentie.',
      note_en: 'Extra-aged Edam contains less tyramine than most other hard-ripened cheeses: 60–120 mg/kg (Bunkova et al.), delivering 2–4 mg per 30g portion — well below pharmacological thresholds. Score orange as precaution consistent with the aged-cheese paradigm.',
      sources: STD_SOURCES_TYRAMINE
    }
  },

  'nl-cheddar': {
    subcategory: 'kaas-gerijpt', // al correct
    migraine: {
      score: 2,
      confidence: 'middel',
      note_nl: 'Belegen cheddar (6-12 maanden rijping) bevat 70-210 mg tyramine per kg; een portie van 30g levert 2-6 mg. Bij de bovengrens van dat bereik wordt de drempel nadert die bij MAOI-medicatie relevant is. Dubbelblinde studies konden tyramine als migrainetrigger bij mensen zónder MAOI niet reproduceerbaar bevestigen. "Kaas veroorzaakt migraine" is een wijdverbreid geloof dat in gecontroleerd onderzoek slechts zwak wordt ondersteund.',
      note_en: 'Aged cheddar (6–12 months) contains 70–210 mg tyramine/kg; 30g delivers 2–6 mg. The upper range approaches the threshold relevant under MAOI medication. Double-blind studies could not reproduce tyramine-triggered migraine without MAOI.',
      sources: STD_SOURCES_TYRAMINE
    }
  },

  'nl-gouda-belegen': {
    subcategory: 'kaas-gerijpt', // al correct
    migraine: {
      score: 2,
      confidence: 'laag',
      note_nl: 'Belegen Gouda bevat doorgaans weinig tyramine (meeste monsters <50 mg/kg), maar de spreiding is groot: tot 250 mg/kg in Komprda et al. Bij 250 mg/kg levert een portie van 30g 7,5 mg tyramine, wat de MAOI-voorzorgsgrens overschrijdt. Score oranje als voorzorgsmaatregel. Geen gecontroleerd bewijs voor migrainetriggering zonder MAOI.',
      note_en: 'Aged Gouda typically has low tyramine (most samples <50 mg/kg) but variability is high: up to 250 mg/kg (Komprda et al.). At the upper range, a 30g portion delivers 7.5 mg tyramine. Score orange as precaution; no controlled evidence for migraine triggering without MAOI.',
      sources: STD_SOURCES_TYRAMINE
    }
  },

  'nl-manchego': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 2,
      confidence: 'laag',
      note_nl: 'Manchego is schapenmelkkaas die 2-24 maanden rijpt. Er is geen directe tyramine-meting beschikbaar; op basis van vergelijkbare gerijpte kazen wordt een range van 100-400 mg/kg geschat, wat per portie van 30g neerkomt op 3-12 mg. Score oranje als voorzorgsmaatregel bij gerijpte varianten (curado/viejo). Verse manchego (fresco) heeft verwaarloosbare tyramine.',
      note_en: 'Manchego is sheep milk cheese ripened 2–24 months. No direct tyramine measurement exists; estimated 100–400 mg/kg based on comparable aged cheeses (3–12 mg per 30g portion). Score orange as precaution for aged varieties (curado/viejo).',
      sources: [...STD_SOURCES, PRESCRIBERS_GUIDE_2022]
    }
  },

  'nl-feta': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 2,
      confidence: 'laag',
      note_nl: 'Feta is een gepekelde kaas die in de handel doorgaans 60-120 dagen rijpt (vat-feta). Na 120 dagen rijping kan het tyramine-gehalte oplopen tot 246 mg/kg (Valsamaki et al.), wat per 30g portie ~7,4 mg oplevert — boven de MAOI-voorzorgsgrens. Verse feta (<30 dagen) bevat nauwelijks tyramine. Score oranje geldt voor de in NL gangbare gerijpte vat-feta; bij jonge of verse feta is score lager.',
      note_en: 'Feta typically ripens 60–120 days commercially (barrel feta). After 120 days, tyramine can reach 246 mg/kg (Valsamaki et al.), ~7.4 mg per 30g — above the MAOI precautionary threshold. Fresh feta (<30 days) contains minimal tyramine. Score orange applies to typical commercially available barrel feta.',
      sources: [...STD_SOURCES, PRESCRIBERS_GUIDE_2022]
    }
  },

  'nl-parmezaan': {
    subcategory: 'kaas-gerijpt', // al correct
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Parmezaan rijpt lang (24-36 maanden), maar moderne LC/HPLC-metingen laten zien dat het tyramine-gehalte lager is dan vroeger werd aangenomen: 20-150 mg/kg (Spizziri et al.; Koreaanse marktstudie 2021). Per portie van 30g gaat het om 0,6-4,5 mg tyramine — ruim onder de drempel die in farmacologische studies effect geeft. Geen gecontroleerd bewijs voor migrainetriggering. Score geel als attentie bij MAOI-gebruik.',
      note_en: 'Parmesan ripens long (24–36 months) but modern LC/HPLC measurements show lower tyramine than previously assumed: 20–150 mg/kg, delivering 0.6–4.5 mg per 30g portion — well below pharmacological thresholds. No controlled evidence for migraine triggering.',
      sources: [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, PRESCRIBERS_GUIDE_2022, KOREAN_2021]
    }
  },

  'nl-raclette-kaas': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Raclette rijpt 3-6 maanden en heeft een tyramine-profiel vergelijkbaar met Gruyère (<100 mg/kg). Per portie van 30g gaat het naar schatting om <3 mg tyramine — onder alle klinisch relevante drempels. Geen gecontroleerd bewijs voor migrainetriggering. Score geel als voorzorgsmaatregel.',
      note_en: 'Raclette ripens 3–6 months with a tyramine profile similar to Gruyère (<100 mg/kg). Estimated <3 mg tyramine per 30g portion — below all clinically relevant thresholds. No controlled evidence for migraine triggering.',
      sources: STD_SOURCES
    }
  },

  'nl-emmentaler': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Emmentaler bevat verrassend weinig tyramine voor een lang-gerijpte kaas: 16-82 mg/kg in moderne studies, wat per portie van 30g neerkomt op slechts 0,5-2,5 mg. Dit is onder elke klinisch relevante drempel. Score geel als voorzorgsmaatregel bij het gerijpte-kazen-paradigma, niet op basis van specifiek bewijs voor Emmentaler als trigger.',
      note_en: 'Emmental contains surprisingly little tyramine for a long-ripened cheese: 16–82 mg/kg in modern studies, delivering only 0.5–2.5 mg per 30g portion — below any clinically relevant threshold.',
      sources: [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, KOREAN_2021]
    }
  },

  'nl-gruyere': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Gruyère bevat <100 mg/kg tyramine in moderne metingen (Spizziri et al.), wat per portie van 30g neerkomt op <3 mg. Geen gecontroleerd bewijs voor migrainetriggering. Score geel als voorzorgsmaatregel.',
      note_en: 'Gruyère contains <100 mg/kg tyramine in modern measurements, delivering <3 mg per 30g portion. No controlled evidence for migraine triggering.',
      sources: [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, PRESCRIBERS_GUIDE_2022]
    }
  },

  'nl-brie': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Brie bevat in moderne supermarktversies (gepasteuriseerd, 4-6 weken rijping) zeer weinig tyramine: meeste monsters ≤5 mg/kg (≤0,15 mg per 30g). Volledig rijpe artisanale Brie kan hogere waarden bereiken — historische studies (De Vuyst 1976) melden tot 400 mg/kg bij maximaal rijpe partijen. Score geel voor standaard supermarktbrie; bij artisanale of maximaal rijpe brie is voorzichtigheid geboden, met name bij MAOI-medicatie.',
      note_en: 'Brie in modern supermarket form (pasteurised, 4–6 weeks ripening) contains very little tyramine: most samples ≤5 mg/kg (≤0.15 mg per 30g). Fully ripe artisanal Brie can reach higher values — historical studies (De Vuyst 1976) report up to 400 mg/kg at peak ripeness.',
      sources: [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, PRESCRIBERS_GUIDE_2022]
    }
  },

  'nl-camembert': {
    subcategory: 'kaas-gerijpt',
    migraine: {
      score: 1,
      confidence: 'laag',
      note_nl: 'Camembert bevat in moderne supermarktversies eveneens weinig tyramine (meeste monsters ≤5 mg/kg), vergelijkbaar met brie. Artisanale varianten (volledig rijp: zachte kern, ammoniak-geur) kunnen hogere waarden bereiken, maar dit is geen normaal NL-supermarktproduct. Score geel voor standaard supermarktcamembert; bij uitgesproken rijpe artisanale versies is voorzichtigheid geboden.',
      note_en: 'Camembert in modern supermarket form also contains little tyramine (most samples ≤5 mg/kg), similar to Brie. Artisanal fully-ripe varieties can reach higher values but are not typical Dutch supermarket products.',
      sources: [MOFFETT_1972, ZIEGLER_1977, SUDHARTA_2023, PRESCRIBERS_GUIDE_2022]
    }
  }
};

// ── Patch toepassen ─────────────────────────────────────────────────────────

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let changed = 0;

data.items.forEach(item => {
  const patch = PATCHES[item.id];
  if (!patch) return;

  // Subcategory
  if (patch.subcategory && item.subcategory !== patch.subcategory) {
    console.log(`  subcat: ${item.subcategory} → ${patch.subcategory} (${item.id})`);
    item.subcategory = patch.subcategory;
  }

  // Cluster
  const prevCluster = item.cluster;
  item.cluster = 3;

  // Migraine score
  const prev = item.scores?.migraine?.score;
  const m = patch.migraine;
  item.scores.migraine = {
    score: m.score,
    evidence: 'B',
    confidence: m.confidence,
    triggerType: 'subgroep-overschat',
    primaryModulators: ['tyramine'],
    sources: m.sources,
    note: {
      nl: m.note_nl,
      en: m.note_en
    }
  };

  // Meta
  item.meta.lastReviewed = '2026-05-14';

  console.log(`✓ ${item.id.padEnd(25)} mig: ${prev}→${m.score}  cluster: ${prevCluster ?? '—'}→3`);
  changed++;
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`\nCluster-3 patch compleet: ${changed} items bijgewerkt.`);
