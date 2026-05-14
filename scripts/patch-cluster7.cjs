const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('src/data/vlees.json', 'utf8'));

const SOURCES_PRIMARY = [
  { url: 'https://pubmed.ncbi.nlm.nih.gov/4117590/', title: 'Henderson WR & Raskin NH 1972 — "Hot-dog" headache: individual susceptibility to nitrite (Lancet)', type: 'review', accessedAt: '2026-05-14' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/2506503/', title: 'Iversen HK, Olesen J, Tfelt-Hansen P 1989 — IV nitroglycerin as experimental model of vascular headache (Pain)', type: 'review', accessedAt: '2026-05-14' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/27822557/', title: 'Gonzalez A et al. 2016 — Migraines correlated with nitrate/nitrite oral microbes (mSystems)', type: 'review', accessedAt: '2026-05-14' },
  { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/', title: 'Hindiyeh NA et al. 2020 — Diet and Nutrition in Migraine (Headache)', type: 'review', accessedAt: '2026-05-14' }
];

const SOURCES_LOW = [
  { url: 'https://pubmed.ncbi.nlm.nih.gov/2506503/', title: 'Iversen HK, Olesen J, Tfelt-Hansen P 1989 — IV nitroglycerin as experimental model of vascular headache (Pain)', type: 'review', accessedAt: '2026-05-14' },
  { url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/', title: 'Hindiyeh NA et al. 2020 — Diet and Nutrition in Migraine (Headache)', type: 'review', accessedAt: '2026-05-14' }
];

const patches = {
  '168319': {
    score: 3, evidence: 'B', confidence: 'middel', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide', 'enterosalivaire-conversie'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Spek en bacon bevatten nitriet (E250), dat in het lichaam omgezet kan worden naar stikstofmonoxide. Bij een deel van de mensen met migraine kan dit een aanval uitlokken. De enige directe enterale provocatiestudie (Henderson 1972, N=1) liet 8 van 13 positieve reacties zien. Een portie van 60 g bacon levert circa 7-15 mg nitriet, dicht bij de drempel uit die studie.', en: 'Bacon contains nitrite (E250) which can be converted to nitric oxide. In some people with migraine this may trigger an attack. The only direct enteral provocation study (Henderson 1972, N=1) showed 8/13 positive responses. A 60g serving delivers ~7-15 mg nitrite, close to the study threshold.' }
  },
  'nl-spek-gerookt': {
    score: 3, evidence: 'B', confidence: 'middel', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide', 'enterosalivaire-conversie'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Gerookt spek bevat nitriet (E250), dat in het lichaam omgezet kan worden naar stikstofmonoxide. Bij een deel van de mensen met migraine kan dit een aanval uitlokken. De enige directe enterale provocatiestudie (Henderson 1972, N=1) liet 8 van 13 positieve reacties zien. Een portie van 60 g levert circa 7-15 mg nitriet, dicht bij de drempel uit die studie.', en: 'Smoked bacon contains nitrite (E250) which can be converted to nitric oxide. In some people with migraine this may trigger an attack. A 60g serving delivers ~7-15 mg nitrite, close to the Henderson 1972 study threshold.' }
  },
  'nl-rookworst-gecureerd': {
    score: 3, evidence: 'B', confidence: 'middel', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide', 'enterosalivaire-conversie'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Gecureerde rookworst bevat nitriet als conserveringsmiddel. Via omzetting in de mond en het maag-darmkanaal kan dit stikstofmonoxide produceren, wat bij gevoelige mensen migraine kan veroorzaken. Gevoeligheid verschilt sterk per persoon.', en: 'Cured smoked sausage contains nitrite as a preservative. Via conversion in the mouth and gut this can produce nitric oxide, potentially triggering migraine in sensitive individuals.' }
  },
  'nl-worst-rook': {
    score: 3, evidence: 'B', confidence: 'middel', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide', 'enterosalivaire-conversie'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Gecureerde rookworst bevat nitriet als conserveringsmiddel. Via omzetting in de mond en het maag-darmkanaal kan dit stikstofmonoxide produceren, wat bij gevoelige mensen migraine kan veroorzaken. Gevoeligheid verschilt sterk per persoon.', en: 'Cured smoked sausage contains nitrite as a preservative. This may trigger migraine via nitric oxide production in sensitive individuals.' }
  },
  '172936': {
    score: 2, evidence: 'B', confidence: 'laag', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Salami bevat nitriet als conserveringsmiddel, maar het gemeten residu in gerijpte salamiworst is doorgaans lager dan in spek of rookworst. Of dit bij jou een trigger is, verschilt sterk per persoon en is niet in een directe studie onderzocht.', en: 'Salami contains nitrite as a preservative, but residual nitrite in cured salami is typically lower than in bacon or smoked sausage. Individual sensitivity varies and has not been studied directly.' }
  },
  'nl-salami': {
    score: 2, evidence: 'B', confidence: 'laag', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Gecureerde en gerijpte salami bevat nitriet. Bij traditionele droge salami is het resterend nitriet-residu lager dan bij industrieel spek of rookworst (circa 8 vs 12 mg/kg). Het mechanisme is hetzelfde maar de dosis per portie is lager. Gevoeligheid verschilt per persoon.', en: 'Cured and aged salami contains nitrite. In traditional dry salami residual nitrite is lower than in industrial bacon or smoked sausage (~8 vs ~12 mg/kg). Same mechanism, lower dose per serving.' }
  },
  'nl-chorizo': {
    score: 2, evidence: 'B', confidence: 'laag', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Gecureerde chorizo bevat nitriet, maar het gemeten residu is laag (circa 4 mg/kg mediaan). Het mechanisme via stikstofmonoxide is aannemelijk, maar of een normale portie chorizo bij mensen met migraine klachten geeft, is niet direct onderzocht. Gevoeligheid verschilt per persoon.', en: 'Cured chorizo contains nitrite, but measured residues are low (~4 mg/kg median). The nitric oxide mechanism is plausible but has not been directly studied at typical serving sizes.' }
  },
  'nl-pastrami': {
    score: 2, evidence: 'B', confidence: 'middel', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide', 'enterosalivaire-conversie'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Pastrami is zwaar gecureerd en gerookt rundvlees met nitriet. Het curing-proces is vergelijkbaar met spek. Er is geen directe studie voor pastrami als migrainetrigger, maar op basis van het mechanisme en de vergelijkbare bereiding is voorzichtigheid geboden bij migrainegevoeligheid.', en: 'Pastrami is heavily cured and smoked beef containing nitrite, comparable in preparation to bacon. No direct study exists, but the mechanism suggests caution for those with migraine sensitivity.' }
  },
  'nl-ham-gekookt': {
    score: 2, evidence: 'C', confidence: 'laag', triggerType: 'context-afhankelijk',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_LOW,
    note: { nl: 'Gekookte ham bevat nitriet, maar verhitting verlaagt het residu sterk (gemiddeld circa 11 mg/kg). Er is geen directe studie voor gekookte ham als migrainetrigger. Voor de meeste mensen waarschijnlijk geen probleem; bij hoge gevoeligheid voorzichtigheid geboden.', en: 'Cooked ham contains nitrite but heat treatment significantly reduces residual levels (~11 mg/kg average). No direct study exists. Unlikely to be a problem for most; caution for highly sensitive individuals.' }
  },
  'nl-prosciutto': {
    score: 2, evidence: 'C', confidence: 'laag', triggerType: 'context-afhankelijk',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_LOW,
    note: { nl: 'Prosciutto di Parma (DOP) bevat geen toegevoegd nitriet, verboden door EU-regelgeving voor DOP-producten. Andere merken rauwe ham kunnen wel nitriet bevatten. Check het etiket op E249 of E250. Bij twijfel voorzichtig.', en: 'Prosciutto di Parma DOP contains no added nitrite (prohibited by EU DOP regulations). Other prosciutto-style hams may contain nitrite. Check the label for E249 or E250.' }
  },
  'nl-mortadella': {
    score: 2, evidence: 'B', confidence: 'laag', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Mortadella is een industrieel verwerkte vleeswaar met nitriet. Het nitriet-residu na productie is vergelijkbaar met andere gekookte vleeswaren. Er is geen directe studie voor dit product als migrainetrigger, maar het mechanisme is aannemelijk.', en: 'Mortadella is an industrially processed meat containing nitrite. Residual nitrite is comparable to other cooked meats. No direct study exists, but the mechanism is plausible.' }
  },
  'nl-gerookte-kip': {
    score: 1, evidence: 'C', confidence: 'laag', triggerType: 'context-afhankelijk',
    primaryModulators: ['nitriet'],
    sources: SOURCES_LOW,
    note: { nl: 'Gerookte kip kan op twee manieren bereid zijn: (a) alleen gerookt zonder curing-middelen, dan is er geen nitriet en is het risico laag; (b) industrieel gecureerd met nitriet (E249/E250) of selderijextract, dan geldt hetzelfde mechanisme als bij andere gecureerde vleeswaren. Check het etiket. Staat er geen E249/E250 of selderijextract op, dan is het risico voor migraine verwaarloosbaar.', en: 'Smoked chicken can be prepared two ways: (a) smoked only without curing agents, no nitrite, low risk; (b) industrially cured with nitrite (E249/E250) or celery extract, same mechanism as other cured meats. Check the label.' }
  },
  'nl-gerookte-kipfilet': {
    score: 2, evidence: 'C', confidence: 'laag', triggerType: 'context-afhankelijk',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_LOW,
    note: { nl: 'Gerookte kipfilet is in de meeste industriele producten gecureerd met nitriet of selderijextract. Selderijextract levert biochemisch identiek nitriet op als E250. Check het etiket voor E249/E250 of selderijextract.', en: 'Most industrial smoked chicken breast is cured with nitrite or celery extract. Celery extract delivers biochemically identical nitrite to E250. Check the label for E249/E250 or celery extract.' }
  },
  'nl-vleesbrood': {
    score: 2, evidence: 'B', confidence: 'laag', triggerType: 'subgroep-bevestigd',
    primaryModulators: ['nitriet', 'stikstofmonoxide'],
    sources: SOURCES_PRIMARY,
    note: { nl: 'Bewerkt vleesbrood bevat doorgaans nitriet als conserveringsmiddel. Er is geen directe studie voor dit product als migrainetrigger, maar het mechanisme via stikstofmonoxide is aannemelijk.', en: 'Processed meatloaf typically contains nitrite as a preservative. No direct study exists for this product, but the nitric oxide mechanism is plausible.' }
  }
};

let patchCount = 0;
for (const item of raw.items) {
  const p = patches[item.id];
  if (!p) continue;
  item.scores.migraine = {
    score: p.score,
    evidence: p.evidence,
    confidence: p.confidence,
    triggerType: p.triggerType,
    primaryModulators: p.primaryModulators,
    sources: p.sources,
    note: p.note
  };
  item.cluster = 7;
  item.meta.lastReviewed = '2026-05-14';
  patchCount++;
}

fs.writeFileSync('src/data/vlees.json', JSON.stringify(raw, null, 2) + '\n');
console.log('Patched', patchCount, 'items');
