# Cluster 14 — Histamine-getriggerde groente en fruit: rationale

Opgesteld: 2026-05-20 | Branch: migraine/open-clusters-batch

---

## Paradigma

**Primaire trigger-pathway:** Histamine via twee routes:
1. **Endogene histamine in voedsel** — spinazie (30-60 mg/kg), aubergine (~26 mg/kg), tomaat (~22 mg/kg)
2. **Histamine-liberatoren** — tomaat, aardbeien, ananas, framboos: triggeren histamine-vrijgifte uit mestcellen ook zonder zelf veel histamine te bevatten

**Pathofysiologie:** DAO (diamine oxidase) breekt histamine af in de darm. DAO-deficiëntie (aanwezig bij ~10-15% van de bevolking) leidt tot histamine-accumulatie. Bij migrainepatiënten is DAO-activiteit gemiddeld lager (SIGHI-consensus; Maintz & Novak 2007).

**Relevante subgroep:** ~15-20% van migrainepatiënten met DAO-deficiëntie of verhoogde histaminegevoeligheid.

---

## Score-indeling cluster 14

| Type | Voorbeelden | Score | Redenering |
|---|---|---|---|
| Neutrale groente (histamine laag) | broccoli, wortel, komkommer | 0 | Geen histamine-risico bij normale individuen |
| Histamine-rijke groente | spinazie, aubergine, tomaat | 1 | Histamine-content of liberator-werking; subgroep-relevant |
| Gefermenteerde groente | zuurkool, kappertjes, augurk | 1 | Fermentatie = histamine-accumulatie |
| Paddenstoelen | champignons, shiitake, oesterzwam | 1 | Biogene aminen; consistent met SIGHI-niveau |
| Biogene-amine-kruiden | mierikswortel, wasabi | 1 | Scherpe biogene aminen; gevoeligheid individueel |
| Neutrale fruit | appel, banaan, peer, druif | 0 | Histamine niet relevant voor normale individuen |
| Histamine-liberator fruit | aardbeien, ananas, framboos | 1 | Klassieke liberatoren per Maintz 2007 |
| Histamine-rijk fruit | avocado | 1 | Histamine + putrescine/cadaverine |
| Exotisch biogene aminen | durian | 1 | Hoge tryptamine/serotonine concentraties |

---

## Score-fixes (pre-patch inconsistenties)

| ID | Pre | Post | Reden |
|---|---|---|---|
| 168463 Spinazie (rauw) | 0 | **1** | Histamine 30-60 mg/kg (Maintz 2007); SIGHI histamine-score 2 |
| 170457 Tomaat (rauw) | 0 | **1** | Histamine-liberator; SIGHI histamine-score 2; histamineFlags.liberator=true |
| 169251 Champignons | 0 | **1** | Inconsistent met nl-champignon-bruin (score 1); biogene aminen |
| nl-aubergine | 0 | **1** | Inconsistent met 169233 Aubergine (score 1); histamine ~26 mg/kg |
| nl-wilde-spinazie | 0 | **1** | Consistent met spinazie (score 1); histamine-content |
| 167762 Aardbeien | 0 | **1** | Klassieke histamine-liberator (Maintz 2007); ~11% zelf-rapport |
| 171706 Avocado | 0 | **1** | Histamine ~23 mg/kg + putrescine/cadaverine (Maintz 2007) |
| 169124 Ananas | 0 | **1** | Histamine-liberator + bromelain (Maintz 2007) |
| 167755 Framboos | 0 | **1** | Histamine-liberator (Maintz 2007) |

---

## Bronnen

1. **Maintz & Novak 2007 (PMID 17490952):** Comprehensive review histamine-intolerantie.
   Uitgebreide tabel met histaminegehalte per voedingsmiddel, inclusief groente en fruit.
   Histamine-liberatoren expliciet benoemd: tomaat, aardbeien, ananas, framboos, avocado.
2. **Hindiyeh 2020 (PMC7496357):** Systematisch review dieet en hoofdpijn;
   groente en fruit in het algemeen geen sterke migraine-triggers voor de bevolking als geheel.
