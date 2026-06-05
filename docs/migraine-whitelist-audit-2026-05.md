# Migraine whitelist-audit — mei 2026

> **Historisch document (v1.4-staat). Achterhaald op punt 1.** In v2.0 (2026-06-04) is **gedistilleerd en sterke/versterkte wijn van de score-3-whitelist verwijderd** — alleen **bier** blijft score 3 (`populatiebreed`). Gedistilleerd/wijn zijn score 2 + `subgroep-overschat` (Onderwater 2019). In v2.4 kreeg gecureerd vlees boven Henderson triggerType `dosis-afhankelijk` en ging rookworst naar score 2. Zie CLAUDE.md §2.2 + `docs/migraine-methodologie.md` §3.1 voor de actuele stand. Dit document blijft bewaard als besluitspoor.

## Aanleiding

Tijdens review van PR #15 (sauzen-kruiden Hindiyeh-purge) werd vastgesteld dat MSG in de CLAUDE.md §2.2 whitelist voor score=3 stond, maar de data MSG al correct op score=2 + subgroep-overschat had. Dit triggerde een bredere audit: welke stoffen op de whitelist zijn wetenschappelijk te rechtvaardigen als universele trigger (score=3)?

## Resultaat audit

### Whitelist voor score=3 — vóór audit (CLAUDE.md v1.3)

1. Alcohol (rode wijn met name)
2. Gerijpte kaas (>6 maanden rijping)
3. Gecureerd vlees (nitriethoudend)

### Whitelist voor score=3 — na audit (CLAUDE.md v1.4)

1. **Alcohol — ethanol-mechanisme** (bier, gedistilleerd, sterke wijn; score=3)
   - Rode wijn: score=2 + subgroep-overschat (tyramine/histamine/sulfiet → MAO-A-subgroep)
2. **Gecureerd vlees boven Henderson-drempel** (≥10 mg nitriet per typische portie; score=3)
   - Sub-drempel (salami, chorizo, paté): score=2 + subgroep-bevestigd

### Verwijderd van whitelist

| Stof | Oud | Nieuw | Reden |
|---|---|---|---|
| MSG (monosodium glutamaat) | score=3 | score=2 + subgroep-overschat | Obayashi 2016 SR (PMC4870486), Geha 2000 (PMID 10736382), ICHD-3 2018-revisie (MSG geschrapt). In geblindeerde studies geen reproduceerbaar effect bij normale voedselinname. CLAUDE.md v1.3 (PR #17). |
| Gerijpte kaas (>6 maanden) | score=3 | score=2 + subgroep-overschat | Tyramine wordt bij intacte MAO-functie in darmwand/lever geïnactiveerd (Finberg 2022, PMC9172554). Geen moderne provocatie-RCT. Effect klinisch relevant uitsluitend bij MAO-A-gevoelige subgroep of MAOI-gebruik. Klassieke bronnen (Hannington 1967, Sandler 1974) zijn methodologisch zwak. CLAUDE.md v1.4 (PR #21). |

## Data-impact gerijpte kaas

**Bevinding:** Geen enkel kaas-item in `src/data/zuivel.json` had migraine score=3. Alle gerijpte kaas-items waren al correct op score=2 of lager gezet in eerdere review-sessies. Geen score-downgrade vereist.

### Inventarisatie kaas-items (stand 2026-05-20)

| ID | Naam | Score | TriggerType | Confidence |
|---|---|---|---|---|
| nl-kaas-oud-48 | Oude kaas (gouda, >48 maanden) | 2 | subgroep-overschat | middel |
| nl-blauwe-kaas | Blauwe kaas (gerijpte kaas) | 2 | subgroep-overschat | laag |
| nl-cheddar | Cheddar (belegen) | 2 | subgroep-overschat | middel |
| nl-gouda-belegen | Goudse kaas (belegen) | 2 | subgroep-overschat | laag |
| nl-edam-extra-belegen | Gerijpte Edammer (>12 maanden) | 2 | subgroep-overschat | laag |
| nl-manchego | Manchego kaas | 2 | subgroep-overschat | laag |
| nl-feta | Feta | 2 | subgroep-overschat | laag |
| nl-brie | Brie | 1 | subgroep-overschat | laag |
| nl-camembert | Camembert | 1 | subgroep-overschat | laag |
| nl-parmezaan | Parmezaan | 1 | subgroep-overschat | laag |
| nl-raclette-kaas | Raclette kaas | 1 | subgroep-overschat | laag |
| nl-emmentaler | Emmentaler kaas | 1 | subgroep-overschat | laag |
| nl-gruyere | Gruyère kaas | 1 | subgroep-overschat | laag |

**Wijziging in deze branch:** Finberg 2022 (PMC9172554) toegevoegd aan `nl-raclette-kaas` en `nl-emmentaler` (ontbrak); notes bijgewerkt met MAO-inactivatie-mechanisme.

## Bronnen

- Finberg JPM & Gillman K 2022 — Prescribers' guide to the MAOI diet: thinking through tyramine myths. J Neural Transm. PMC9172554.
- Maintz L & Novak N 2007 — Histamine and histamine intolerance. Am J Clin Nutr. PMID 17490952.
- Obayashi Y & Nagamura Y 2016 — Does monosodium glutamate really cause headache? Nutrients. PMC4870486.
- Geha RS et al. 2000 — Multicenter, double-blind, placebo-controlled, multiple-challenge evaluation of reported reactions to monosodium glutamate. J Allergy Clin Immunol. PMID 10736382.
- ICHD-3 2018 — The International Classification of Headache Disorders (3rd ed.) — MSG removed from official trigger list.

## CLAUDE.md-versies

| Versie | Datum | Wijziging |
|---|---|---|
| v1.3 | 2026-05-20 | MSG verwijderd van score-3 whitelist |
| v1.4 | 2026-05-20 | Gerijpte kaas verwijderd van score-3 whitelist; whitelist precies geformuleerd (Henderson-drempel, ethanol-mechanisme) |
