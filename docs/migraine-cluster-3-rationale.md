# Cluster 3 — Gerijpte/gefermenteerde kazen: rationale

Opgesteld: 2026-05-14

---

## Kernbevinding: cluster verschuift volledig van rood naar oranje

Na de cluster-3-patch bevat de dataset geen enkel gerijpt kaasitem meer met migraine-score 3.
Pre-patch hadden drie items score 3 (nl-kaas-oud-48, nl-blauwe-kaas, nl-edam-extra-belegen) op basis van CLAUDE.md §2.2-whitelist ("gerijpte kaas >6 maanden rijping").
Post-patch: de gehele cluster 3 heeft maximaal score 2 (oranje), met de meeste items op score 1.

**Reden:** de whitelist-score van 3 was gebaseerd op oude tyramine-literatuur (Hanington 1967–1970) afkomstig uit één laboratorium zonder onafhankelijke replicatie. Drie controlestudies ontkrachten causale relatie:

1. **Ziegler & Stewart 1977** (PMID 560645) — placebo-gecontroleerde crossover: tyramine-capsules vs placebo gaven niet-significant verschillende migraine-respons.
2. **Moffett 1972** (PMID 4559027) — geen significant verband tussen tyramine-inname en migrainefrequentie.
3. **Sudharta et al. 2023** (Macedonische SR, *Open Access Maced J Med Sci*) — placebo-respons 0–42,1% vs tyramine-respons 17,2–50%: overlap te groot voor causale conclusie.

Dit is de eerste cluster waar whitelist-3 systematisch naar beneden is bijgesteld op grond van controle-evidence. Precedent: vergelijkbaar met cluster 18 (MSG, score 3→2) en cluster 10 (rode wijn, behoudt score 3 vanwege eigen alcoholmechanisme naast tyramine).

---

## Scoring-regel cluster 3

### Regel: "meaningful bovengrens ≥ 6 mg tyramine per 30g portie → score 2; < 6 mg → score 1"

**Drempelkeuze 6 mg/portie:** afgeleid van de klassieke MAOI-veiligheidsgrens van 6 mg tyramine per maaltijd (Gardner 1996 PMID 8617704; Prescribers' Guide 2022 PMC9172554). Portiegrote: 30g (gangbare kaas­hoeveelheid op een sneetje brood in NL-context).

**"Meaningful bovengrens":** de bovengrens van het gemeten tyramine-bereik per kaassoort, exclusief pre-1975 uitschieters die buiten het moderne gevalideerde bereik vallen.

### Pre-1975 uitschieter-uitsluiting

Historische tyramine-metingen (o.a. Blackwell 1963, vroeg Hanington-lab) gebruikten colorimetrische methoden die minder selectief zijn dan moderne HPLC/LC-MS. Waarden van >2.000 mg/kg of extreme ranges (bijv. Cheddar 0–2.158 mg/kg in Blackwell 1963) zijn methodologisch niet vergelijkbaar met moderne data.

**Precedent:** dit uitsluitingsprincipe is ook toegepast in clusters 5 (gefermenteerd non-zuivel) en 16. Het gebruik van pre-1975 uitschieters als bovengrens voor scoring zou leiden tot kunstmatig hoge scores die niet representatief zijn voor het actuele NL-supermarktproduct.

Uitsluitend gebruikt voor scoring: moderne HPLC/LC-data — primair Prescribers' Guide 2022 (PMC9172554), Walker SE et al. 1996 (PMID 8889911), Bunkova et al. 2010 (DOI 10.1016/j.foodchem.2009.09.051), Sudharta 2023.

---

## Twee afwijkingen van de standaard-scoringregel

### Afwijking 1: nl-edam-extra-belegen — score 2 (regel zou score 1 geven)

De scoringregel geeft op basis van de beschikbare tyramine-data voor Edammer extra belegen een meaningful bovengrens onder 6 mg/30g → score 1.

**Maar: score 2 gehandhaafd.** Twee redenen:

1. **Single-source data:** het enige kwantitatieve gegeven voor extra-belegen Edammer (>12 maanden) is Bunkova et al. 2010. Één bron is onvoldoende om een lager scoringsoordeel te rechtvaardigen.
2. **Whitelist-3 floor sub-rule:** items die pre-patch score 3 hadden (whitelist-3), worden niet verder dan score 2 verlaagd tenzij er robuust meervoudig bewijs is voor een lagere score. Dit voorkomt onterecht vertrouwen wekken bij een item waar data dun is. Score 2 is de conservatieve default bij onzekerheid voor een whitelist-3-item.

Deze sub-rule is consistent met de benadering bij cluster-17 (aspartaam) en cluster-18 (MSG): whitelist-score 3 verlaagd naar 2, niet naar 1, tenzij bewijs expliciet negatief is.

### Afwijking 2: nl-brie en nl-camembert — score 1 (regel zou score 2 geven)

Historische tyramine-data voor Brie en Camembert (o.a. De Vuyst 1976) rapporteert waarden die per de standaard-regel een meaningful bovengrens ≥6 mg/30g zouden geven → score 2.

**Maar: score 1 gekozen.** Reden: NL-supermarkt context.

De Vuyst 1976 en vergelijkbare historische bronnen documenteren artisanale, rauwemelkse Brie/Camembert met variabele rijpingstijd en ongecontroleerde bacterieculturen. Dit is **niet representatief voor het Nederlandse supermarktproduct**:
- Nederlandse supermarkt Brie en Camembert zijn gepasteuriseerde, industrieel geproduceerde kazen met gestandaardiseerde starterculturen.
- Rijpingstijd in NL-retail: 4–5 weken vs traditionele artisanale varianten die maanden kunnen rijpen.
- Moderne LC-data (Prescribers' Guide 2022) geeft voor typische Brie/Camembert 0–120 mg/kg — met een meaningful range die, voor het supermarktproduct, ruim onder de 6 mg/30g drempel blijft.

**Methodologisch precedent:** dezelfde redenering als pre-1975 outlier-uitsluiting, maar dan op product-type niveau: historische artisanale data wordt niet toegepast op een fundamenteel ander (gepasteuriseerd, industrieel, NL-retail) product. Note in de items vermeldt expliciet het NL-supermarktproduct-voorbehoud.

---

## triggerType-beslissing cluster 3

**Gekozen: `subgroep-overschat` voor alle 13 cluster-3-items.**

Redenering:
- Gerijpte kazen staan als "klassieke migrainetrigger" bekend, maar RCT-bewijs is negatief of onvoldoende (zie Hanington-bevinding hieronder).
- Voor de niet-MAOI-populatie is er geen causaliteitsbewijs via het tyramine-mechanisme.
- "subgroep-overschat" communiceert actief: "dit item wordt als trigger beschouwd, maar de evidence ondersteunt dat bredere beeld niet" — wat precies de boodschap is.

**Onderscheid met cluster 6 (`context-afhankelijk`):** Marmite/Vegemite benaderen bij 5g actief de MAOI-veiligheidsgrens (1,6–3,25 mg / drempel 6 mg), met reële batchvariabiliteit naar de gevaarlijke zone. Gerijpte kazen leveren bij 30g voor de meeste items ruim onder die drempel; het MAOI-specifieke risico is minder prominent en minder herkenbaar voor de consument dan bij dedicated yeast extracts.

---

## Hanington-lab bevinding

Alle positieve RCT-evidence voor tyramine als migrainetrigger via kaas stamt uit één laboratorium: Hanington E (London, 1967–1970). De drie reproductiepogingen door onafhankelijke onderzoekers (Ziegler & Stewart 1977, Moffett et al. 1972, en de synthese in Sudharta 2023) gaven negatieve of inconclusive resultaten.

Dit is methodologisch significant: bij één-laboratorium-evidence zonder replicatie is de prior voor causaliteit laag, ongeacht de biochemische plausibiliteit (tyramine → MAO → noradrenaline-release). De score-2-cap is bewust conservatief gekozen (niet score 0) omdat:
1. Biochemische plausibiliteit bestaat — het mechanisme is reëel, alleen de klinische vertaling is niet aangetoond.
2. Er bestaat een subgroep (MAO-remming-gebruikers, genetische MAO-varianten) waar tyramine-belasting wél relevant is.
3. Voorzorgsbeginsel bij beperkte maar onzekere data.

---

## Subcategory-correcties

7 items gecorrigeerd van `kaas` of `kaas-vers` naar `kaas-gerijpt`:

| Item | Van | Naar |
|---|---|---|
| nl-brie | kaas-vers | kaas-gerijpt |
| nl-camembert | kaas-vers | kaas-gerijpt |
| nl-feta | kaas-vers | kaas-gerijpt |
| nl-raclette-kaas | kaas | kaas-gerijpt |
| nl-manchego | kaas | kaas-gerijpt |
| nl-emmentaler | kaas | kaas-gerijpt |
| nl-gruyere | kaas | kaas-gerijpt |

Subcategory-correctie is een data-kwaliteitsverbetering, niet inhoudelijk. Feta is biologisch een gepekelde rijpkaas; de overige items rijpen minimaal 3–5 weken (Brie/Camembert) tot 24 maanden (Manchego/Gruyère). Categorie `kaas-vers` is gereserveerd voor niet-gerijpte producten (Mozzarella, Ricotta, Hüttenkäse).

---

## Primaire bronnen cluster 3

| Bron | Relevantie |
|---|---|
| Moffett AM et al. 1972 — PMID 4559027 | Geen significant verband tyramine-inname en migrainefrequentie |
| Ziegler DK & Stewart R 1977 — PMID 560645 | Placebo even effectief als tyramine-capsules (crossover RCT) |
| Sudharta H et al. 2023 — DOI oamjms.eu/11484 | SR: placebo 0–42,1% vs tyramine 17,2–50%; geen causale conclusie |
| Hindiyeh NA et al. 2020 — PMC7496357 | Systematische review migraine-triggers; beperkte evidence tyramine |
| Walker SE et al. 1996 — PMID 8889911 | LC-analyse tyramine in 51 voedingsmiddelen; kwantitatieve basis |
| Finberg JPM & Gillman K 2022 — PMC9172554 | Moderne tyramine-waarden; MAOI-drempel 6 mg/maal |
| Bunkova L et al. 2010 — DOI 10.1016/j.foodchem.2009.09.051 | HPLC-data Gouda, Edam, Cheddar Tsjechische markt |
| Korean Food Composition DB 2021 — PMC7824754 | Aziatische gerijpte kazen; aanvullend voor Manchego-schatting |
