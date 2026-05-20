# Fix-cleanup batch — 2026-05-20 samenvatting

Branch: `migraine/fix-cleanup-2026-05-20`
Baseline: `main` (600 items) → na patch: 599 items (−1 duplicaat)
validate-db: groen · unit-tests: 56/56 groen

---

## Stap 1 — PMID 9048276 (CI-blocker)

**Status: Geen actie nodig.**
Bij inspectie bleek dat de recente merge naar main al PMID 9453274 (correct) bevatte in alle chocolade-items en docs. Het foutieve PMID was al gecorrigeerd in een eerdere sessie. Geen commit vereist.

---

## Stap 2 — Bier triggerType paradigma-fix

**Commit:** `8f10555`
**Items gewijzigd:** 7

| ID | Wijziging |
|---|---|
| 168746 | triggerType subgroep-overschat → universeel; confidence middel → hoog; note ethanol-mechanisme; cluster: 12 |
| nl-bier-stout | idem |
| nl-bier-ipa | idem |
| nl-bier-weizen | idem |
| nl-bier-trappist | idem (unieke note: hoog alcoholpercentage 6-12%) |
| nl-bier-pilsener | idem |
| nl-lambiek | idem (unieke note: biogene aminen spontane gisting) |

**Onderbouwing:** score=3 + `subgroep-overschat` zijn logisch incoherent. Ethanol heeft een direct farmacologisch mechanisme (vasodilatatie, CGRP-release, mestcel-degranulatie) op populatieniveau. Rode wijn behoudt `subgroep-overschat` — tyramine/histamine-pathway is MAO-A drempel afhankelijk (subgroep-gevoelig).

**Signalering duplicaat:** `168746` (USDA FDC ID) en `nl-bier-pilsener` zijn beide Bier (pilsener). Aparte follow-up vereist — niet opgelost in deze stap.

---

## Stap 3 — nl-pate-leverworst triggerType

**Commit:** `f3e27cb`
**Items gewijzigd:** 1

`nl-pate-leverworst` (vlees.json): `subgroep-overschat` → `subgroep-bevestigd`. Score 2 correct per cluster-7 Henderson-paradigma voor nitriethoudende vleeswaren.

---

## Stap 4 — Cluster 11+12 patch.json

**Commit:** `89f0986`
**Bestanden aangemaakt:** 2

Commit `32936d8` verwerkte clusters 11 en 12 samen. Gesplitst in:
- `docs/migraine-cluster-11-patch.json` (7 items, 0 score-wijzigingen, 7 source-upgrades)
- `docs/migraine-cluster-12-patch.json` (19 items, 0 score-wijzigingen, 19 source-upgrades)

---

## Stap 5 — nl-frisdrank-cola duplicaat

**Commit:** `a66a54f`
**Items gewijzigd:** −1 item (verwijderd)

`nl-frisdrank-cola` (zoetwaren.json, categorie fout: zoetwaren/hartige-snacks) verwijderd. Canoniek item: `nl-cola` (dranken-non-alcohol.json, subcategory frisdrank). Delta-analyse: geen bruikbare delta — nl-cola heeft betere bronnen (Choi 2010 jicht, Harvard Oxalate evidence A nierstenen). De fosforzuur-nierstenen-noot in nl-frisdrank-cola is niet consistent met de oxalaat-scoringsmethodiek (CLAUDE.md §2.3).

`docs/migraine-cluster-2-items.md`: referentie bijgewerkt.

---

## Stap 6 — nl-slagroom-koffie herclassificatie

**Commit:** `9e88da1`
**Items gewijzigd:** 1

`nl-slagroom-koffie` "Koffiemelk / Koffiecreamer (plantaardig)" (zuivel.json):
- score: 1 → **0** (creamer bevat zelf geen cafeïne)
- triggerType: `onttrekkings-trigger` → **verwijderd**
- primaryModulators: `[cafeine]` → **verwijderd**
- sources: ICHD-3 caffeine-withdrawal → Finberg 2022 + Hindiyeh (standaard score-0 zuivel-patroon)

**Scenario:** A (koffiemelk/creamer zonder cafeïne). De cafeïne zit in de koffie, niet in de creamer.

---

## Open follow-ups (buiten deze branch)

| Follow-up | Prioriteit | Branch |
|---|---|---|
| `168746` vs `nl-bier-pilsener` duplicaat | Middel | aparte branch |
| ~~Cluster-veld backfill (555 items zonder cluster)~~ | ~~Laag~~ | **afgerond** `migraine/cluster-veld-backfill` |
| ~~sauzen-kruiden Hindiyeh-purge (49 items)~~ | ~~Hoog~~ | **afgerond** PR #15 |
| ~~peulvruchten Hindiyeh-purge (35 items)~~ | ~~Hoog~~ | **afgerond** PR #16 |

## Changelog cluster-veld backfill (2026-05-20)

2026-05-20: cluster-veld backfilled voor 158 items op basis van `docs/migraine-cluster-*-items.md` per cluster. Items waarvan herkomst niet eenduidig herleidbaar was (389 items), hebben géén cluster-veld gekregen (geen `cluster: 0` placeholder). Tracking-gap nu zichtbaar in plaats van gemaskeerd. Items met cluster-veld voor backfill: 51 → na backfill: 209.
