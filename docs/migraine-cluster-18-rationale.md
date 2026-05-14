# Cluster 18 — MSG / natriumglutamaat: rationale

---

## Item: nl-msg — MSG (natriumglutamaat, E621)

### Score-beslissing
**Score 3 → 2.** CLAUDE.md §2.2 staat score 3 toe voor MSG (whitelist), maar dit is geen verplichting. De evidence-basis voor score 3 is aantoonbaar zwakker dan voor rode wijn, waarvoor we score 2 al vastgesteld hebben. De RCT-literatuur is overwegend negatief, het mechanisme is niet ondersteund, en de internationale headache-classificatie heeft MSG in 2018 verwijderd. Score 2 + "subgroep-overschat" is intern consistent en transparanter.

### Evidence-beslissing
**Evidence B gehandhaafd.** Meerdere dubbelblinde RCTs beschikbaar — dit is goed bewijs, zij het overwegend negatief. Evidence A is niet gerechtvaardigd (vereist database of meta-analyse als primary source). Evidence C zou de sterkte van het negatieve bewijs onderschatten.

### triggerType: `subgroep-overschat`
MSG is het schoolvoorbeeld van subgroep-overschatting door nocebo-effect. De Kwok 1968-brief startte een breed maatschappelijk geloof zonder empirische basis. Latere RCTs konden het effect niet consistent reproduceren. De "gevoelige subgroep" bestaat mogelijk als statistisch artefact van hoge doses zonder voedsel — niet als een biologisch onderbouwde groep.

### primaryModulators: `["vrij-glutamaat"]`
Vrij glutamaat is het enige aanwijsbare biologische substraat. De hypothese dat dietary glutamaat de bloed-hersenbarrière passeert en hersengluatemaat verhoogt is niet ondersteund (Baker 2018, PMID 30508818). Mechanistische onderbouwing ontbreekt, waardoor de modulatorenlijst minimaal blijft.

### confidence: `laag`
Paradoxaal genoeg leidt sterke negatieve evidence tot lage confidence over het trigger-effect zelf: de RCTs sluiten effect bij hoge doses op nuchtere maag niet volledig uit (Yang 1997 threshold 2.5g). Maar bij normale voedselconsumptie (<1g per maaltijd, met voedsel) is het effect niet aangetoond.

---

## Primaire bronnen

| Bron | Bevinding |
|---|---|
| Tarasoff & Kelly 1993 (PMID 8282275) | n=71, dubbelblind, 1,5–3,15g. Geen significant verschil MSG vs placebo. |
| Yang et al. 1997 (PMID 9215242) | n=61 zelf-geselecteerde gevoelige personen. Hoofdpijn bij hoge dosis (≥2,5g) **zonder voedsel**. Op voedsel: geen effect. |
| Geha et al. 2000 (PMID 10736382) | n=130, multicenter dubbelblind (grootste studie). Zonder voedsel: wisselende reacties. Met voedsel: **geen effect**. Niet reproduceerbaar bij hertest. |
| Obayashi & Nagamura 2016 (PMID 27189588) | Systematische review (10 studies). Met voedsel: geen significant resultaat. Blinding gecompromitteerd bij hoge concentratie (>2% MSG, afwijkende smaak). |
| ICHD-3 2018 | MSG **verwijderd** van officiële headache-trigger lijst. |

---

## Evidence-hiërarchie subgroep-overschat-clusters

Overzicht van de drie vastgestelde "subgroep-overschat/bevestigd"-gevallen, voor consistentie-tracking bij toekomstige clusters:

### 1. Rode wijn — cluster 10
**Score 2 · Evidence B · Confidence hoog**

- Directe positieve RCT: Littlewood 1988 (n=11, 9/11 migraine bij gevoelige patiënten na rode wijn, 0/8 na wodka)
- Moderne cohort met kwantitatieve gap: Onderwater 2019 (n=2197, ~9% objectief consistent vs ~77% zelf-rapport)
- Mechanisme deels bevestigd: Devi/Waterhouse 2023 (in vitro IC50 quercetine-3-glucuronide op ALDH2)
- Dosis-gap: voedingsdosis bereikt mechanistische drempel niet voor de gehele populatie
- Conclusie: trigger is reëel voor kleine subgroep; populaire perceptie van omvang sterk overschat

### 2. Spek/nitriet — cluster 7
**Score 3 · Evidence B · Confidence middel**

- Directe N=1 case met enterale provocatie: Henderson & Raskin 1972 (8/13 positief)
- Mechanisme bevestigd bij farmacologische dosis: Iversen/Olesen 1989 (IV GTN → migraine 80–85%)
- Portiedosis raakt drempel: 60g spek ≈ 7–15 mg nitriet ≈ Henderson-drempel
- Maar: N=1, nooit gerepliceerd; farmacologische vs voedingsdosis kloof real
- Conclusie: directe dose-route-match rechtvaardigt score 3; subgroep kleiner dan populaire perceptie

### 3. MSG — cluster 18
**Score 2 · Evidence B · Confidence laag**

- Meerdere RCTs: overwegend negatief (Tarasoff 1993, Geha 2000)
- Gemengd positief bij hoge dosis zonder voedsel (Yang 1997, drempel 2,5g); niet reproduceerbaar bij hertest
- Mechanisme NIET ondersteund: dietary MSG passeert BBB niet, geen verhoging hersengluatemaat
- ICHD-3 2018: MSG verwijderd van officiële triggerlijst — sterkste autoritatieve afservering
- Klinische drempel niet bereikt in normaal gebruik (<1g per maaltijd met voedsel)
- Nocebo-component historisch het best gedocumenteerd van alle drie gevallen (Kwok 1968 als oorsprong)
- Conclusie: overschatting groter dan bij rode wijn; evidence voor reëel trigger-effect bij normale doses afwezig

### Volgorde van zekerheid dat het overschat is
**MSG > rode wijn > spek**

MSG: sterkste nocebo-bewijs, negatieve RCTs, ICHD-3-verwijdering, BBB-mechanisme afwezig.
Rode wijn: positieve RCT beschikbaar maar kleine n; self-report kloof kwantitatief gedocumenteerd.
Spek: directe evidence bij drempel-portie; minder evidence voor overschatting.

---

## Gaps

1. Yang 1997 laat effect zien bij 2,5g MSG zonder voedsel — dit grensscenario (bv. MSG-supplement, grote dosis smaakversterker) niet gedekt door score 2; note instrueert gebruiker over context.
2. Dataset mist industriële MSG-houdende producten (chips, instant noodles, bouillonblokjes) — gedocumenteerd in migraine-cleanup-todo.md.
3. Kwok 1968 heeft geen PMID in PubMed-database (brief in NEJM vóór PubMed-era); geciteerd via DOI 10.1056/NEJM196804042781419.
