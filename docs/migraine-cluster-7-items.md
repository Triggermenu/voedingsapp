# Cluster 7 — Nitriet-vleeswaren: item-overzicht

**Primaire trigger-pathway**: nitriet/nitraat → stikstofmonoxide (NO) → vasodilatatie → migraine. Mechanisme farmacologisch bevestigd via IV-GTN-model (Iversen 1989). Voedingsdosis bereikt drempel alleen bij hoog-nitriet producten (spek/rookworst).
Paradigma: **subgroep-bevestigd** (spek, rookworst) / **context-afhankelijk** (laag nitriet of DOP-items).

*Gegenereerd: 2026-05-14 | Prompt-versie: v5 | [retroactief gereconstrueerd 2026-05-20]*

---

## Items in cluster 7 — 14 items

### A. Score 3 — subgroep-bevestigd (hoog nitriet, drempel bereikt)

| # | ID | Naam (NL) | Naam (EN) | Pre-patch score | Post-patch score | Wijziging |
|---|---|---|---|---|---|---|
| 1 | `168319` | Spek (gerookt, gecureerd) | Bacon (smoked, cured) | 3 | 3 | Ongewijzigd; nieuwe velden; bronnen vervangen |
| 2 | `nl-spek-gerookt` | Spek (gerookt) | Bacon (smoked) | 3 | 3 | Ongewijzigd; nieuwe velden; bronnen vervangen |
| 3 | `nl-rookworst-gecureerd` | Rookworst (gecureerd) | Smoked sausage (cured) | 3 | 3 | Ongewijzigd; nieuwe velden; bronnen vervangen |
| 4 | `nl-worst-rook` | Rookworst (gecureerd) | Smoked sausage (cured) | 3 | 3 | Ongewijzigd; nieuwe velden; bronnen vervangen |

**Noot items 1+2**: 168319 = USDA American-style bacon; nl-spek-gerookt = NL-specifiek gerookt spek. Verschillende producten; zelfde score verdedigbaar. Portie 60g levert ~7–15 mg nitriet → bereikt Henderson-drempel (10 mg, N=1 dubbelblinde enterale provocatie).

**Noot items 3+4**: nl-rookworst-gecureerd en nl-worst-rook zijn vermoedelijk duplicaten (identieke naam, zelfde producteigenschappen). Deprecatie nl-worst-rook pending beslissing — niet uitgevoerd in cluster-7-patch.

---

### B. Score 2 — subgroep-bevestigd (middel nitriet, onder drempel)

| # | ID | Naam (NL) | Naam (EN) | Pre-patch score | Post-patch score | Wijziging |
|---|---|---|---|---|---|---|
| 5 | `172936` | Salami | Salami | 2 | 2 | Ongewijzigd; nieuwe velden; bronnen vervangen |
| 6 | `nl-salami` | Salami (gecureerd, gerijpt) | Salami (cured, aged) | **3** | **2** | **Score 3→2 (inconsistentie opgelost)** |
| 7 | `nl-pastrami` | Pastrami | Pastrami | 2 | 2 | Ongewijzigd; nieuwe velden |
| 8 | `nl-mortadella` | Mortadella | Mortadella | 2 | 2 | Ongewijzigd; nieuwe velden |
| 9 | `nl-vleesbrood` | Vleesbrood (bewerkt) | Meatloaf (processed) | 2 | 2 | Ongewijzigd; nieuwe velden |

**Noot nl-salami**: inconsistentie met 172936 opgelost. nl-salami was score 3 (whitelist-item), 172936 was score 2. Residu droge salami ~8,20 mg/kg mediaan (Zhong 2022); portie 30g = ~2–3 mg nitriet, ruim onder Henderson-drempel. Beide naar score 2.

**Noot nl-chorizo**: zie sectie C.

---

### C. Score 2 → context-afhankelijk (laag nitriet of onzeker profiel)

| # | ID | Naam (NL) | Naam (EN) | Pre-patch score | Post-patch score | Wijziging |
|---|---|---|---|---|---|---|
| 10 | `nl-chorizo` | Chorizo (gecureerd) | Chorizo (cured) | **3** | **2** | **Score 3→2 (laag nitriet-residu)** |
| 11 | `nl-ham-gekookt` | Ham (gekookt) | Ham (cooked) | 2 | 2 | Ongewijzigd; evidence B→C; triggerType gewijzigd |
| 12 | `nl-prosciutto` | Prosciutto (rauwe ham, Italiaans) | Prosciutto (Italian cured ham) | 2 | 2 | Ongewijzigd; evidence B→C |

**Noot nl-chorizo**: residu 4,35 mg/kg mediaan — laagste van alle cluster-7-items (Zhong 2022). 30g portie = ~1,3 mg nitriet. Whitelist-drempel niet bereikt. triggerType context-afhankelijk.

**Noot nl-prosciutto**: DOP Parma-versies bevatten geen toegevoegd nitriet (EU DOP-regelgeving). Generiek label "prosciutto" onzeker. Evidence B→C: geen directe studie. Note instrueert etiketcontrole.

---

### D. Score 1–2 — context-afhankelijk (etiketcontrole vereist)

| # | ID | Naam (NL) | Naam (EN) | Pre-patch score | Post-patch score | Wijziging |
|---|---|---|---|---|---|---|
| 13 | `nl-gerookte-kip` | Gerookte kip | Smoked chicken | 1 | 1 | Ongewijzigd; evidence B→C; triggerType toegevoegd |
| 14 | `nl-gerookte-kipfilet` | Gerookte kipfilet | Smoked chicken breast | 2 | 2 | Ongewijzigd; evidence ongewijzigd |

**Noot gerookte kip**: kan zijn (a) vers gerookt zonder curing → score 0, of (b) industrieel gecureerd met E249/E250 → score 2. Score 1 gehandhaafd (blocker van Peter: score-verhoging speculatief). Note instrueert etiketcontrole.

---

## Samenvatting score-wijzigingen

| Type | Aantal |
|---|---|
| Score 3→2 (gewijzigd) | 2 (nl-chorizo, nl-salami) |
| Score gehandhaafd + nieuwe velden | 12 |
| Evidence verlaagd (B→C) | 2 (nl-ham-gekookt, nl-prosciutto, nl-gerookte-kip) |
| **Totaal bewerkt** | **14** |

---

## Selderijextract-noot

"Natural curing" via selderijextract of -sap produceert via bacteriële fermentatie nitriet dat biochemisch identiek is aan E250. Items gelabeld "zonder toegevoegde nitrieten" maar met selderijextract vallen onder hetzelfde mechanisme als conventioneel gecureerde producten.

---

## EU 2023/2108 regelgevings-noot

Van kracht 9 oktober 2025. Maximaal toegevoegd nitriet industriële vleeswaren: 150 → **80 mg/kg**. Gesteriliseerd: 100 → **55 mg/kg**. Traditioneel DOP (Parma, Serrano, droge salami): **25–50 mg/kg residu-max**. Literatuur van vóór oktober 2025 overschat huidige blootstelling bij industriële producten. Scores zijn gebaseerd op Zhong 2022-residu-data (mediaan per producttype), die conservatiever zijn dan de pre-2025 maximumwaarden.

---

## Gaps

1. Henderson & Raskin 1972 nooit gerepliceerd in moderne RCT — directe voedingsdosis-evidence blijft N=1.
2. Geen specifieke residu-data voor pastrami, mortadella, nl-vleesbrood.
3. nl-worst-rook = vermoedelijk duplicaat nl-rookworst-gecureerd — deprecatie-beslissing pending.
4. Prosciutto DOP vs generiek: dataset onderscheidt dit niet.
