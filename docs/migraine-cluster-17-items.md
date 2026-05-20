# Cluster 17 — Aspartaam & kunstmatige zoetstoffen: item-overzicht

**Primaire trigger-pathway**: aspartaam → fenylalanine + methanol → (hypothese) competitie tryptofaan/bloed-hersenbarrière → serotoninedaling. Mechanisme hypothetisch, niet bewezen.
Paradigma: **context-afhankelijk** — acute dosis onschadelijk; cumulatief effect over weken mogelijk.

*Gegenereerd: 2026-05-14 | Prompt-versie: v5 | [retroactief gereconstrueerd 2026-05-20]*

---

## Items in cluster 17 (alle nieuw toegevoegd)

Cluster 17 was leeg vóór deze patch. Alle vier items zijn nieuw toegevoegd.

| # | ID | Naam (NL) | Naam (EN) | Bestand | Post-patch score | triggerType | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | `nl-cola-light` | Cola light / Cola Zero | Diet cola / Zero sugar cola | dranken-non-alcohol.json | 2 | context-afhankelijk | laag |
| 2 | `nl-tafelzoetje-aspartaam` | Tafelzoetje (aspartaam) | Table sweetener (aspartame) | zoetwaren.json | 2 | context-afhankelijk | laag |
| 3 | `nl-kauwgom-suikervrij` | Kauwgom (suikervrij) | Chewing gum (sugar-free) | dranken-non-alcohol.json | 1 | context-afhankelijk | laag |
| 4 | `nl-sucralose` | Sucralose (kunstmatige zoetstof) | Sucralose (artificial sweetener) | zoetwaren.json | 0 | — | — |

**Totaal: 4 items (allen nieuw)**

---

## Motivering cluster-toewijzing

### nl-cola-light & nl-tafelzoetje-aspartaam — Score 2
Score 2 is conform CLAUDE.md §2.2-whitelist voor aspartaam. Twee studies vinden cumulatief effect (Koehler 1988, Lindseth 2014); twee studies vinden geen effect bij acute enkelvoudige dosis (Schiffman 1987, Van den Eeden 1994). Mechanisme hypothetisch. triggerType `context-afhankelijk`: effect aantoonbaar afwezig bij incidentele inname, potentieel aanwezig bij dagelijks gebruik over weken.

### nl-kauwgom-suikervrij — Score 1
Per stukje kauwgom: ~35 mg aspartaam. Drempel voor cumulatief effect (Lindseth 2014): >900 mg/dag. Score 1 als voorzorgsmaatregel voor frequent gebruik. Evidence C: geen directe studie voor kauwgom als migrainetrigger; afgeleid van aspartaam-literatuur.

### nl-sucralose — Score 0
Sucralose is gechlooreerd suiker — fundamenteel anders dan aspartaam: geen omzetting naar fenylalanine of methanol. Geen RCT-bewijs voor migrainetriggering. Hindiyeh 2020 noemt sucralose niet als trigger. Alleen N=1 case reports (Bigal 2006 PMID 16618274, Patel 2006 PMID 16942478) — onvoldoende voor score-toewijzing. score 0 + evidence C. Paradigmatisch onderscheid: **aspartaam ≠ sucralose** — het betreft een andere stof met ander metabolisme.

---

## Score-overzicht nieuw vs pre-patch

Alle items waren nieuw (geen pre-patch waarde). Ter referentie: CLAUDE.md §2.2 stond aspartaam als score 2-item op de whitelist vóór deze patch, maar geen concreet item was in de database opgenomen.

| ID | Pre-patch | Post-patch score | Evidence | Aandoeningen-scope |
|---|---|---|---|---|
| nl-cola-light | n.v.t. | 2 | B | migraine + nierstenen (1, evidence C) |
| nl-tafelzoetje-aspartaam | n.v.t. | 2 | B | migraine |
| nl-kauwgom-suikervrij | n.v.t. | 1 | C | migraine |
| nl-sucralose | n.v.t. | 0 | C | migraine |

---

## Nierstenen-noot (nl-cola-light)

Score nierstenen: 1, evidence C. Fosforzuur in cola (~50–75 mg/250 ml) kan theoretisch niersteen-risico verhogen. Curhan et al. (NHS/HPFS cohort): geen statistisch significant verhoogd risico bij normale consumptie. Score 1 is voorzorgsmaatregel, geen sterke evidence-toewijzing.

---

## Methodologische noot: acute vs cumulatief

Kernbevinding cluster 17: studies die aspartaam acuut testen (één dosis) vinden géén effect; studies met cumulatieve blootstelling (4–8 weken) vinden wél effect. Dit is een principieel verschil in provocatie-design, niet een tegenstrijd in de literatuur. Gedocumenteerd als kandidaat voor v6 dimensie 15 (`provocatie-design`).

---

## Gaps

1. Geen moderne pre-geregistreerde RCT voor aspartaam en migraine (alle studies 1987–2014).
2. Kauwgom-item mist splitsing per zoetmiddel-type (aspartaam vs sorbitol vs xylitol).
3. Sucralose-items in gecombineerde producten (light yoghurt, proteïnerepen) niet gedekt.
4. Bigal 2006 (PMID 16618274) en Patel 2006 (PMID 16942478) zijn N=1 case reports voor sucralose — niet geverifieerd via PubMed-lookup (geen expliciete PMID-bevestiging in reconstructiesessie). [gereconstrueerd op basis van rationale; verificatie pending]
