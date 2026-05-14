# Cluster 7 — Nitriet-vleeswaren: rationale per item

---

## Wetenschappelijke basis

### Primaire bronnen
- **Henderson & Raskin 1972** (PMID 4117590, *Lancet*): N=1 dubbelblind enteraal nitriet-provocatieonderzoek. Patiënt ontwikkelde hoofdpijn na 8/13 natriumnitriet-doses, 0/13 na placebo. Enige directe voedingsdosis-provocatiestudie. Nooit gerepliceerd in moderne RCT. PMID-correctie: in de instructie staat 4111922, correct is 4117590.
- **Iversen, Olesen & Tfelt-Hansen 1989** (PMID 2506503, *Pain*): IV-nitroglycerin (GTN) als NO-donor induceert vertraagde migraine bij 80–85% van migraineurs. Farmacologische IV-dosis, NIET extrapoleerbaar naar voedingsdosis.
- **Gonzalez et al. 2016** (PMID 27822557, *mSystems*): Nitrate/nitrite-reducerende orale bacteriën significant hoger bij migraineurs (p≤0,001). Observationeel — geen causaliteit bewezen.
- **Hindiyeh et al. 2020** (PMC7496357, *Headache*): Systematic review, COI Eli Lilly/Amgen. Secundaire bron.

### Residu-data
Zhong et al. 2022 (PMC9540118, *Mol Nutr Food Res*) — mediaan nitriet-residu per product:
- Bacon/spek: 12,25 mg/kg (IQR 6,55–23,04)
- Ham: 11,24 mg/kg (IQR 5,69–19,65)
- Salami: 8,20 mg/kg (IQR 3,67–23,72)
- Chorizo: 4,35 mg/kg (IQR 2,93–5,80)

### EU-regelgeving
EU Regulation 2023/2108 (van kracht 9 oktober 2025): max toegevoegd nitriet industriële vleeswaren 150 → **80 mg/kg**; gesteriliseerd: 100 → **55 mg/kg**. Traditioneel gerijpt (Parma DOP, Serrano, droge salami): **25–50 mg/kg residu-max**. Literatuur van vóór oktober 2025 overschat huidige blootstelling bij industriële producten.

---

## Paradigma: waarom score 3 voor spek consistent is met score 2 voor rode wijn

Een mogelijke inconsistentie tussen clusters: rode wijn score 3 → 2 wegens ~9% objectieve respons (Onderwater 2019), terwijl spek score 3 blijft ondanks ~5% self-report "hot dog headache". Dit verschil is **verdedigbaar op basis van dosis-route-context**:

- **Rode wijn**: geen dosis-drempel bereikbaar via voeding die mechanistisch vergelijkbaar is met de farmacologische quercetine × ethanol-dosis. Score 2 + "subgroep-overschat" communiceert dat de trigger echt is maar sterk overschat in zelf-rapportage.
- **Spek/bacon**: portie 60 g levert ~7–15 mg enteraal nitriet. Henderson & Raskin 1972 gebruikte 10 mg natriumnitriet enteraal en kreeg 8/13 positieve provocaties. De voedingsdosis bereikt de provocatie-drempel. Score 3 + "subgroep-bevestigd" is intern consistent: directe dose-route-match, whitelist-item, N=1-bewijs.

Het onderscheid is dus: bij rode wijn is er een duidelijke kloof tussen voedingsdosis en farmacologisch werkzame dosis; bij spek niet.

---

## Item-rationale

### Score 3-items (spek, rookworst)

**Spek (168319, nl-spek-gerookt)**
Score 3 gehandhaafd. Whitelist-item. Portiedosis (~60 g → ~7–15 mg nitriet) bereikt de Henderson-drempel van 10 mg. Evidence B: N=1 direct enteraal bewijs + plausibel mechanisme. Confidence "middel": N=1 is beperkt, nooit gerepliceerd. triggerType "subgroep-bevestigd": directe provocatiestudie beschikbaar, maar n is minimaal. primaryModulators inclusief "enterosalivaire-conversie": nitriet → NO loopt mede via mondbacteriën (Gonzalez 2016).

Opmerking duplicaat: 168319 (USDA = American-style bacon) en nl-spek-gerookt (NL-specifiek gerookt spek) zijn verschillende producten. Beide behouden, zelfde score/fields.

**Rookworst (nl-rookworst-gecureerd, nl-worst-rook)**
Score 3 gehandhaafd. Zelfde redenering als spek. nl-worst-rook en nl-rookworst-gecureerd hebben identieke naam "Rookworst (gecureerd)" en identieke producteigenschappen. **Voorstel: nl-worst-rook deprecaten** (addedAt 2026-05-12 vs 2026-05-11; minder specifieke ID). Dit is een aparte beslissing, niet in deze patch uitgevoerd.

---

### Score 2-items — subgroep-bevestigd (hoog/middel nitriet)

**Salami — 172936 en nl-salami**
Inconsistentie opgelost: nl-salami was score 3, 172936 was score 2. Beide naar score 2.

172936 (USDA: "Salami, cooked, beef") en nl-salami ("Salami gecureerd, gerijpt") zijn verschillende producten. Residu droge salami ~8,20 mg/kg — lager dan spek (12,25 mg/kg). Portie 30 g levert ~2–3 mg nitriet, ruim onder Henderson-drempel. Score 2 is correct. Evidence B op basis van mechanistische analogie met spek. triggerType "subgroep-bevestigd" gehandhaafd: zelfde mechanisme.

**Pastrami (nl-pastrami)**
Zwaar gecureerd en gerookt rundvlees. Curing vergelijkbaar met spek. Geen directe studie voor pastrami. Score 2, evidence B, confidence "middel".

**Mortadella (nl-mortadella)**
Industrieel product met nitriet. Residu vergelijkbaar met andere gekookte vleeswaren. Score 2 gehandhaafd.

**Vleesbrood (nl-vleesbrood)**
Bewerkt product met nitriet. Score 2 gehandhaafd.

---

### Score 2-items — context-afhankelijk (laag nitriet of onzeker)

**Chorizo (nl-chorizo)**
Score 3 → **2**. Residu 4,35 mg/kg mediaan — laagste van alle cluster-7-items. 30 g portie levert ~1,3 mg nitriet, ruim onder Henderson-drempel. Geen directe studie voor chorizo. triggerType gewijzigd naar "subgroep-bevestigd" (mechanisme aannemelijk maar laag residu). Confidence "laag".

**Ham gekookt (nl-ham-gekookt)**
Score 2 gehandhaafd. Verhitting verlaagt nitriet sterk. Evidence verlaagd B → C: Hindiyeh 2020 noemt gekookte ham niet specifiek. triggerType "context-afhankelijk".

**Prosciutto (nl-prosciutto)**
Score 2 gehandhaafd. DOP Parma-versies hebben géén toegevoegd nitriet (EU DOP-regelgeving). Generiek "prosciutto"-label onzeker. Evidence B → C: geen directe bron voor prosciutto als migrainetrigger. triggerType "context-afhankelijk". Note instrueert de gebruiker om het etiket te checken.

---

### Score 1 (ongewijzigd) — gerookte kip

**Gerookte kip (nl-gerookte-kip)**
Score **1 gehandhaafd** (blocker van Peter: score-verhoging speculatief zonder ingrediëntenverificatie). "Gerookte kip" kan zijn: (a) vers gerookt zonder curing → score 0, of (b) industrieel gecureerd met E249/E250 of selderijextract → score 2. Note instrueert de gebruiker te controleren op het etiket. Evidence verlaagd B → C. triggerType "context-afhankelijk".

**Gerookte kipfilet (nl-gerookte-kipfilet)**
Score 2 gehandhaafd. De meeste industriële kipfilet-producten in NL gebruiken celderijextract (= biochemisch identiek aan E250). Note instrueert etiketcontrole.

---

## Selderijextract-noot

"Natural curing" via selderijextract of -sap produceert via bacteriële fermentatie nitriet dat biochemisch identiek is aan E250. Er is geen biologisch verschil in NO-productie of migraine-relevantie. Items gelabeld "zonder toegevoegde nitrieten" maar met selderijextract vallen onder hetzelfde mechanisme.

---

## Gaps

1. Henderson & Raskin 1972 nooit gerepliceerd in moderne RCT — directe voedingsdosis-evidence blijft N=1.
2. Geen specifieke data voor pastrami, mortadella, nl-vleesbrood nitriet-residu.
3. nl-worst-rook = vermoedelijk duplicaat van nl-rookworst-gecureerd — deprecatie-beslissing pending.
4. Chorizo-residu (4,35 mg/kg) is laag maar varieert sterk (IQR 2,93–5,80); traditionele vs industriële chorizo niet onderscheiden in dataset.
5. Prosciutto DOP vs generiek: dataset onderscheidt dit niet — één item dekt beide varianten.
