# Cluster 1 — Cafeïne-dranken: rationale

Opgesteld: 2026-05-20 | Branch: migraine/open-clusters-batch

---

## Paradigma

**Cafeïne: een duale relatie met migraine.** Cafeïne is zowel een potentiële trigger (via
onttrekking) als een aanvalsbehandelaar (in acute fase, onderdeel van combinatie-analgetica).

**Primaire trigger-pathway:** Onttrekkings-trigger (ICHD-3 §8.3). Bij regelmatige consumptie
(>200 mg/dag) leidt abrupte staking tot compensatoire vasodilatatie en hoofdpijn binnen 12-24u.
Dit is het mechanisme achter "weekend migraine" bij vaste koffiedrinkers.

**Hoge-dose pathway (>400 mg/dag):** Score 2 per CLAUDE.md §2.2. Energiedranken bereiken
dit potentieel bij meervoudig gebruik; koffie/thee doen dit niet bij normaal gebruik.

**Aspartaam pathway:** Suikervrije cola en kauwgom bevatten aspartaam (E951) → score 2
per CLAUDE.md-regel, los van de cafeïne-content.

---

## Score-indeling cluster 1

| Type | Voorbeelden | Score | Redenering |
|---|---|---|---|
| Koffie (normaal gebruik) | koffie zwart | 0 | Beschermend/neutraal bij normaal gebruik (ICHD-3) |
| Cafeïne-thee (laag-matig) | zwarte thee, groene thee, witte thee, oolong | 0 | Minder cafeïne dan koffie; geen trigger-evidence |
| Neutrale dranken | water, kruidenthee, sappen (meeste) | 0 | Geen migraine-relevantie |
| Cola (cafeïne, matig) | cola (suikerhoudend) | 1 | Onttrekkings-trigger bij dagelijks meervoudig gebruik |
| Energiedranken | energiedrank, Red Bull | 2 | Hoog cafeïne + taurine; onttrekkings-trigger |
| Aspartaam-dranken | cola light, suikervrij kauwgom | 2 | Aspartaam-regel CLAUDE.md §2.2 |
| Kombucha | kombucha | 2 | Histamine (fermentatie) + ethanol + cafeïne |
| Citrus/aardbei dranken | grapefruitsap, aardbeienlimonade, citroenwater | 1 | Histamine-liberator pathway (consistent met cluster 14-15) |
| Biogene aminen | druivensap, tonic water | 1 | Biogene aminen / quinine |

---

## Score-fixes (pre-patch inconsistenties)

| ID | Pre | Post | Reden |
|---|---|---|---|
| nl-witte-thee | 1 | **0** | Inconsistent met koffie/zwarte thee score 0; witte thee heeft minder cafeïne |
| nl-oolong-thee | 1 | **0** | Inconsistent met groene thee score 0; vergelijkbare cafeïne-inhoud |
| nl-energiedrank | 1 | **2** | Inconsistent met nl-energydrink (score 2); zelfde productcategorie |
| nl-kauwgom-suikervrij | 1 | **2** | Aspartaam-regel CLAUDE.md §2.2 |

---

## Bronnen

1. **ICHD-3 (IHS 2018):** Caffeine-withdrawal headache als erkende ICHD-entiteit (§8.3).
   Autoriteit voor onttrekkings-trigger pathway; bevestigt dat cafeïne-onttrekking migraine uitlokt.
2. **Hindiyeh 2020 (PMC7496357):** Diet and Headache; cafeïne als context-afhankelijke trigger.
3. **Schiffman 1987 (PMID 3657889):** Aspartame en hoofdpijnrisico (NEJM).
4. **Maintz & Novak 2007 (PMID 17490952):** Histamine-pathway voor gefermenteerde/citrusdranken.
