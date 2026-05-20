# Cluster 13 — Histamine-rijke vis en zeevruchten: rationale

Opgesteld: 2026-05-20 | Branch: migraine/open-clusters-batch

---

## Paradigma

**Primaire trigger-pathway:** Histamine. Vis (met name vette vis) bevat histidine dat door
bacteriën wordt omgezet naar histamine. De snelheid van histamine-accumulatie is sterk
afhankelijk van versheid, temperatuur en verwerkingswijze.

**EU Regulation 2073/2005:** Maximale histamine-limieten in vis:
- Vis voor directe consumptie: ≤100 mg/kg (scombridae, engraulidae)
- Enzyme-gerijpte visproducten: ≤200-400 mg/kg

**Score-indeling cluster 13:**
| Type | Voorbeelden | Score | Redenering |
|---|---|---|---|
| Verse vis | zalm, kabeljauw, forel | 0 | Histamine laag bij adequate koeling |
| Ingeblikt magere vis | tonijn blik | 1 | Histamine variabel (10-50 mg/kg) |
| Ingeblikt vette vis | sardines blik, zalm blik | 1-2 | Hogere histamine-potentieel |
| Ansjovis (blik/pot) | ansjovis | 2 | Hoog histamine door rijpingsproces |
| Gerookt/gerijpt | gerookte zalm, makreel, paling | 2 | Langdurig histamine-opbouw |
| Zout-gerijpt | maatjesharing | 2 | Rijpingsproces = histamine-productie |

---

## Score-fixes (pre-patch inconsistenties)

| ID | Pre | Post | Reden |
|---|---|---|---|
| 175080 Ansjovis (ingeblikt) | 0 | **2** | Inconsistent met nl-ansjovis-blik (score 2) |
| 175139 Sardines (blik, olie) | 0 | **1** | Inconsistent met nl-sardines-blik (score 1) |
| 175159 Tonijn (blik, water) | 0 | **1** | Inconsistent met nl-tonijn-blik (score 1) |
| nl-zalm-gerookt | 0 | **2** | Inconsistent met nl-gerookte-zalm (score 2) |
| nl-sprotjes-blik | 0 | **2** | Canned sprats: histamine-rijk (analoog ansjovis) |
| nl-haring-zuur | 0 | **2** | Maatjesharing = zout-gerijpte vis, hoog histamine |
| nl-zalm-blik | 0 | **1** | Canned salmon: matig histamine (analoog sardines) |

---

## Bronnen

1. **Maintz & Novak 2007 (PMID 17490952):** Comprehensive review histamine-intolerantie.
   Vis expliciet als belangrijkste histamine-bron. HPLC-data per producttype.
2. **Hindiyeh 2020 (PMC7496357):** Systematisch review; vis als mogelijke migraine-trigger
   via histamine-intolerantie pathway.
