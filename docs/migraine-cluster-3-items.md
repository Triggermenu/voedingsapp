# Migraine cluster 3 — Gerijpte/gefermenteerde kazen: itemslijst

Opgesteld: 2026-05-14 · FASE 1

---

## A. Cluster-3-items (gerijpte kazen) — bestaand in dataset: 13 items

### A1. Hoog tyramine — score 3 (whitelist-items)

| ID | Naam | Subcategory | Mig-score | Cluster |
|---|---|---|---|---|
| `nl-kaas-oud-48` | Oude kaas (gouda, >48 maanden) | kaas-gerijpt | 3 | — |
| `nl-blauwe-kaas` | Blauwe kaas (gerijpte kaas) | kaas-gerijpt | 3 | — |
| `nl-edam-extra-belegen` | Gerijpte Edammer (extra belegen, >12 maanden) | kaas-gerijpt | 3 | — |

### A2. Middel-hoog tyramine — score 2

| ID | Naam | Subcategory | Mig-score | Cluster | Opmerking |
|---|---|---|---|---|---|
| `nl-cheddar` | Cheddar (belegen) | kaas-gerijpt | 2 | — | |
| `nl-parmezaan` | Parmezaan | kaas-gerijpt | 2 | — | ⚠️ Score-inconsistentie: zie §C |
| `nl-gouda-belegen` | Goudse kaas (belegen) | kaas-gerijpt | 2 | — | |
| `nl-raclette-kaas` | Raclette kaas | **kaas** | 2 | — | ⚠️ Subcategory moet kaas-gerijpt zijn |
| `nl-manchego` | Manchego kaas | **kaas** | 2 | — | ⚠️ Subcategory moet kaas-gerijpt zijn |
| `nl-emmentaler` | Emmentaler kaas | **kaas** | 2 | — | ⚠️ Subcategory moet kaas-gerijpt zijn |
| `nl-gruyere` | Gruyère kaas | **kaas** | 2 | — | ⚠️ Subcategory moet kaas-gerijpt zijn |
| `nl-brie` | Brie | **kaas-vers** | 2 | — | ⚠️ Subcategory onjuist — Brie is gerijpt |
| `nl-camembert` | Camembert | **kaas-vers** | 2 | — | ⚠️ Subcategory onjuist — Camembert is gerijpt |

### A3. Laag-middel tyramine — score 1

| ID | Naam | Subcategory | Mig-score | Cluster | Opmerking |
|---|---|---|---|---|---|
| `nl-feta` | Feta | kaas-vers | 1 | — | ⚠️ Mogelijk te laag: 350–800 mg/kg tyramine; zie §C |

---

## B. Cluster-4-items (verse zuivel) — bestaand in dataset: 10 items

Niet deel van cluster 3. Score mig:0 correct. Cluster-4-toewijzing volgt bij cluster-4-onderzoek.

| ID | Naam | Subcategory | Mig-score |
|---|---|---|---|
| `nl-edammer-jong` | Edammer (jong, <3 maanden) | kaas-vers | 0 |
| `nl-gouda-jong` | Goudse kaas (jong) | kaas-vers | 0 |
| `170844` | Mozzarella (vers) | kaas-vers | 0 |
| `nl-mozzarella-vers` | Mozzarella (vers) | kaas-vers | 0 |
| `nl-smeerkaas` | Smeerkaas (Philadelphia type) | kaas-vers | 0 |
| `nl-ricotta` | Ricotta | kaas-vers | 0 |
| `nl-mascarpone` | Mascarpone | kaas-vers | 0 |
| `nl-huttenkase` | Hüttenkäse (cottage cheese) | kaas-vers | 0 |
| `nl-roomkaas` | Roomkaas (smeerkaas) | kaas-vers | 0 |
| `nl-cottage-cheese` | Cottage cheese | kaas | 0 |

---

## C. Score-inconsistenties (vergen beslissing in FASE 2)

### C1. Parmezaan — score 2 vs whitelist-drempel >6 maanden

**Parmezaan** (Parmigiano Reggiano) rijpt minimaal 12 maanden, doorgaans 24–36 maanden. CLAUDE.md §2.2 whitelist: "gerijpte kaas (>6 maanden rijping)" voor score 3. Parmezaan overschrijdt die drempel significant.

Huidige score 2 — mogelijk onderschatten. Tyramine Walker 1996: Parmezaan 400–1400 mg/kg (afhankelijk van rijping). Vergelijk: Marmite 322–650 mg/kg (score 2 na cluster-6 onderzoek). Score 3 voor Parmezaan is verdedigbaar maar vereist expliciete onderbouwing in FASE 2.

### C2. Feta — score 1 vs tyramine-profiel

Feta (pekelkaas) heeft gemeten tyramine 350–800 mg/kg (McCabe-Sellers 2006, Walker 1996). Dit is vergelijkbaar met Cheddar belegen (score 2: 72–953 mg/kg) en hoger dan de 6-maands-drempel in de CLAUDE.md-whitelist. Score 1 lijkt te laag; score 2 meer consistente toewijzing.

### C3. nl-edam-extra-belegen — score 3 vs Parmezaan score 2

Extra belegen Edammer (>12 maanden) scoort 3, maar Parmezaan (24–36 maanden, hoger tyramine) scoort 2. Interne inconsistentie. Moet in FASE 2 opgelost worden.

---

## D. Subcategory-correcties (niet-blocking, maar te herstellen)

| Item | Huidige subcategory | Correcte subcategory | Reden |
|---|---|---|---|
| `nl-brie` | kaas-vers | kaas-gerijpt | Brie rijpt 4–8 weken met Penicillium candidum schimmel |
| `nl-camembert` | kaas-vers | kaas-gerijpt | Camembert rijpt 3–5 weken met schimmelkorst |
| `nl-raclette-kaas` | kaas | kaas-gerijpt | Raclette rijpt 3–6+ maanden |
| `nl-manchego` | kaas | kaas-gerijpt | Manchego: curado/viejo varianten 3–24 maanden |
| `nl-emmentaler` | kaas | kaas-gerijpt | Emmentaler rijpt 4–15 maanden |
| `nl-gruyere` | kaas | kaas-gerijpt | Gruyère rijpt 5–24 maanden |
| `nl-feta` | kaas-vers | kaas-gerijpt | Feta is gepekeld en gerijpt, geen verse kaas |

Subcategory-correctie is een data-kwaliteitsverbetering die goed past in de cluster-3-patch. Niet inhoudelijk, wel zichtbaar in UI-categorisering.

---

## E. Duplicaten (→ cleanup-todo.md)

| Item 1 | Item 2 | Verschil | Voorstel |
|---|---|---|---|
| `170844` — Mozzarella (vers, USDA) | `nl-mozzarella-vers` — Mozzarella (vers) | Identiek product; 170844 heeft geen note | `170844` deprecaten — nl-mozzarella-vers heeft note en is NL-specifiek |
| `nl-huttenkase` — Hüttenkäse (cottage cheese) | `nl-cottage-cheese` — Cottage cheese | Identiek product, ander taalgebruik; nl-huttenkase in kaas-vers, cottage-cheese in kaas | `nl-cottage-cheese` deprecaten — nl-huttenkase heeft correcte subcategory |
| `nl-smeerkaas` — Smeerkaas (Philadelphia type) | `nl-roomkaas` — Roomkaas (smeerkaas) | Vermoedelijk identiek product; nl-roomkaas heeft geen onderscheidende note | `nl-smeerkaas` deprecaten — nl-roomkaas is het meest gangbare Nederlandse begrip |

---

## F. Gaps (mogelijk toe te voegen in FASE 3)

De dataset dekt de meest gangbare Nederlandse kaassoorten goed. Mogelijke toevoegingen:

| Item | Prioriteit | Reden |
|---|---|---|
| `nl-stilton` of `nl-roquefort` | Laag | Generieke `nl-blauwe-kaas` dekt deze voldoende voor NL-markt |
| `nl-pecorino` | Laag | Vergelijkbaar met Parmezaan; schaapmilk maar zelfde tyramine-mechanisme |
| `nl-appenzeller` | Laag | Zeldzaam in NL supermarkt |
| `nl-cheddar-extra-oud` | Middel | Extra mature cheddar (>18 maanden) heeft significant hoger tyramine dan belegen (6–12 maanden); splitsen zou precisie verbeteren |

Aanbeveling: geen nieuwe items toevoegen in cluster-3 FASE 3. De bestaande 13 items updaten is al aanzienlijk werk. Gaps gedocumenteerd voor eventuele batch-uitbreiding.

---

## Samenvatting FASE 1

- **Cluster-3-items bestaand:** 13
- **Cluster-4-items bestaand (niet in scope cluster 3):** 10
- **Score-inconsistenties:** 3 (Parmezaan, Feta, Edammer extra belegen vs Parmezaan)
- **Subcategory-correcties:** 7 items
- **Duplicaten:** 3 paren → cleanup-todo.md
- **Nieuwe items te voegen:** 0 (bestaande set is voldoende voor NL-markt)
- **Open precedent te beslissen:** triggerType context-afhankelijk vs drug-interactie (§ open vraag cluster 6)
