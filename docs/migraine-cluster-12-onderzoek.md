# Cluster 12 — Bier en sterke drank: v5-onderzoek

Opgesteld: 2026-05-20 | Branch: migraine/open-clusters-batch

---

## Trigger-mechanismen per subtype

### Gedistilleerde drank (whisky, gin, vodka, rum, tequila, cognac, jenever, absint) — Score 2

**Ethanol-pathway:** Zuivere ethanol (vodka) triggert migraine bij ~8% van migrainepatiënten
in geblindeerde challenge (Onderwater 2019 PMID 30565341). Gedistilleerde dranken bevatten
weinig biogene aminen (destillatie verwijdert hoogkokende aminen). Score 2 correct.

**Congeners:** Donkere spirits (whisky, rum, cognac) bevatten meer congeners (aldehyden,
ketonen) dan heldere spirits (vodka, gin). Congeners verhogen kater-intensiteit maar hun
rol als specifieke migrainetrigger is niet RCT-bewezen. Score 2 ongeacht kleur.

**Jenever (NL-specifiek):** Graangedistilleerd, vergelijkbaar met gin. Score 2 correct.
**Absint:** Hoog alcoholpercentage (60-75%) + thujone. Thujone-neurotoxiciteit bij extreem
hoge doses (>100mg/dag); niet relevant bij normale consumptie. Score 2 correct.

### Bier — Score 3

**Evidence-basis:** CLAUDE.md whitelist: "Alcohol (especially red wine)" voor score 3.
Alcohol breed geïnterpreteerd → bier is alcohol → score 3 toegestaan.

**Biogene aminen in bier:** Gisting produceert histamine (0-30 mg/L) en tyramine (0-15 mg/L)
in bier. Trappistenbier en lambiek: hogere biogene aminen door complexere fermentatie.

**Score-inconsistentie met cluster 10:** Rode wijn heeft score 2 en sterkere evidence-basis
voor migraine-triggering. Bier heeft score 3 maar zwakkere specifieke evidence. Dit is
een bestaande inconsistentie in de data; cleanup-taak is gedocumenteerd.

### Lambiek / Geuze — Score 3

Spontaan gefermenteerd bier (Brussel-regio). Fermentatie met wilde gist + lactobacillen.
Histamine tot 25 mg/L, tyramine tot 15 mg/L. Dual-pathway: ethanol + biogene aminen.
Score 3 met triggerType subgroep-overschat consistent.

### Alcoholvrij bier — Score 0

<0,5% ethanol per definitie (EU-norm). Geen klinisch relevante ethanoldosis. Biogene aminen
van de brouwprocess blijven aanwezig maar zijn laag. Score 0 correct.

### Likeur en vermouth — Score 2

Likeur: ethanol-basis met suiker en aroma's. Geen bekende extra migraine-pathway. Score 2.
Vermouth: gearomatiseerde wijn (kruidenextracten). Ethanol-dominant. Score 2 correct.

---

## Gap-analyse

| Vraag | Status |
|---|---|
| RCT bier vs. andere alcohol bij migraine? | Gap — Onderwater 2019 is cross-sectioneel |
| Lambiek biogene aminen NL-data? | Gap — Belgisch literatuur beschikbaar |
| Bier score 3 vs rode wijn score 2 inconsistentie? | Gedocumenteerd; cleanup-taak |
