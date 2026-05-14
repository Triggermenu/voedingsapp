# Cluster 17 — Aspartaam & kunstmatige zoetstoffen: rationale

---

## Overzicht

Cluster 17 was leeg vóór deze patch — de dataset bevatte geen aspartaam-specifieke items. Vier nieuwe items toegevoegd:

| Item | Bestand | Migraine-score | triggerType | Confidence |
|---|---|---|---|---|
| nl-cola-light | dranken-non-alcohol.json | 2 | context-afhankelijk | laag |
| nl-tafelzoetje-aspartaam | zoetwaren.json | 2 | context-afhankelijk | laag |
| nl-kauwgom-suikervrij | dranken-non-alcohol.json | 1 | context-afhankelijk | laag |
| nl-sucralose | zoetwaren.json | 0 | — | — |

---

## Primaire bronnen

| Bron | Bevinding |
|---|---|
| Schiffman SS et al. 1987 (PMID 3657889, NEJM) | n=25 migraineurs, dubbelblind crossover. Geen significant verschil aspartaam vs placebo na acute enkelvoudige dosis. |
| Van den Eeden SK et al. 1994 (PMID 7936222, Neurology) | n=40, dubbelblind crossover, meerdere doses over meerdere dagen. Geen significante toename hoofdpijn. |
| Koehler SM & Glaros A 1988 (PMID 3277925, Headache) | n=11 zelfgeselecteerde migraineurs, 4 weken aspartaam vs placebo. Significant meer aanvallen met aspartaam (p<0.05). Kleine n, zelf-selectie-bias. |
| Lindseth GN et al. 2014 (PMID 24700203, Res Nurs Health) | n=28, crossover 8 days hoog-aspartaam vs laag-aspartaam dieet. Meer hoofdpijn, irritabiliteit en depressie met hoog-aspartaam. Krachtigste cumulatieve bewijs. |
| Hindiyeh et al. 2020 (PMC7496357) | Systematic review. Secondaire bron, vermeldt aspartaam als potentieel trigger zonder definitieve uitspraak. |
| EFSA 2013 | Veiligheidsbevestiging ADI 40 mg/kg/dag. Scope: algemene populatieveiligheid — niet migraine-subgroep. |

---

## Score-beslissingen per item

### nl-cola-light & nl-tafelzoetje-aspartaam — Score 2

**Score 2 (oranje).** Aspartaam staat op de CLAUDE.md-whitelist voor migraine-score 2 (§2.2). Evidence B: positief RCT-bewijs beschikbaar, maar klein n en methodologische beperkingen. Twee studies (Schiffman 1987, Van den Eeden 1994) vinden geen effect bij acute enkelvoudige dosis. Twee studies (Koehler 1988, Lindseth 2014) vinden cumulatief effect bij dagelijks gebruik over meerdere weken.

**Mechanisme hypothetisch**: aspartaam wordt gemetaboliseerd tot fenylalanine en methanol. Fenylalanine kan serotonine-synthese beïnvloeden via competitie met tryptofaan om de bloed-hersenbarrière. Of dit de klinisch relevante route is, is niet bewezen.

**triggerType `context-afhankelijk`**: het onderscheid acute vs cumulatieve blootstelling is bepalend. Bij incidentele inname (één blikje) is effect niet aangetoond. Bij dagelijks gebruik over weken is er cumulatief bewijs.

**Confidence `laag`**: kleine steekproeven, zelf-selectie-bias in positieve studies, geen moderne geplande RCT.

### nl-kauwgom-suikervrij — Score 1

**Score 1.** De hoeveelheid aspartaam per stukje kauwgom is klein (~35 mg, versus drempel >~900 mg/dag voor effect in Lindseth 2014). Geen directe studie voor kauwgom als migrainetrigger. Score 1 als voorzorgsmaatregel voor personen die veel kauwgom gebruiken als aspartaam-innameroute.

Evidence C: geen directe studie, afgeleid van aspartaam-literatuur.

### nl-sucralose — Score 0

**Score 0.** Sucralose is gechlooreerd suiker — metabolisch fundamenteel anders dan aspartaam. Geen omzetting naar fenylalanine of methanol. Geen RCT-bewijs voor migrainetriggering. Hindiyeh 2020 noemt sucralose niet als trigger. Alleen N=1 case reports in literatuur, onvoldoende voor score-toewijzing.

**Onderscheid aspartaam ≠ sucralose paradigma**: score 0 voor sucralose is weloverwogen en niet inconsistent met score 2 voor aspartaam — het betreft een fundamenteel andere stof.

---

## Methodologische noot 1: nl-cola-light nierstenen

**Score 1, evidence C, confidence laag.**

Fosforzuur in cola (ca. 50–75 mg/250 ml) kan theoretisch niersteen-risico verhogen via verhoogd urinefosfaat en potentieel verlaagde pH. Curhan en collega's (NHS cohort, HPFS cohort) onderzochten cola-consumptie en nierstenen in grote prospectieve cohorten. Bevinding: **geen statistisch significant verhoogd risico bij normale consumptie in de meeste analyses.**

Score 1 is een voorzorgsmaatregel, geen sterke evidence-based toewijzing. Confidence laag, want:
- Mechanisme plausibel maar niet bewezen bij normale consumptie
- Cohort-studies tonen overwegend geen significant effect
- Fosforzuurgehalte per portie is laag in verhouding tot dieet-totaal

Dit onderscheidt cola-light van cola-normaal, waarbij de suiker/fructose een afzonderlijk jicht-risico (score 0 hier omdat suikervrij) en mogelijk nierstenen-risico vormt.

---

## Methodologische noot 2: Acute vs cumulatieve provocatie-design

De aspartaam-literatuur onthult een patroon dat relevant kan zijn voor toekomstige clusters en mogelijk een aparte dimensie verdient in een v6 onderzoeksformat:

**Het probleem:** Studies die aspartaam acuut testen (één dosis, één dag) vinden overwegend géén effect. Studies die cumulatieve blootstelling testen (dagelijks gebruik over 4–8 weken) vinden wél effect. Dit zijn principieel verschillende testparadigma's.

**Vergelijkbare patronen in andere clusters:**
- Chocolade: acute trigger-test → negatief; chronisch gebruik → niet getest
- MSG: hoge acute dosis zonder voedsel → grenseffect; dagelijks gebruik → niet systematisch getest
- Cafeïne-onttrekking (cluster 1): per definitie cumulatief fenomeen, niet acuut

**Huidige dekking in v5 dimensies:**
- Dimensie 3 (dosis-drempel) dekt deels: "eenmalige dosis vs dagelijks gebruik"
- Dimensie 4 (context-modifiers) dekt deels: "nuchter vs met voedsel, tijdstip"

**Voorstel voor v6:** Expliciete 15e dimensie: `provocatie-design` (waarden: `acuut-enkelvoudig | cumulatief-meerdere-dagen | onttrekkings-protocol | N/A`). Dit maakt het verschil zichtbaar tussen "één keer getest en negatief" vs "weken getest en positief" — een onderscheid dat nu impliciet blijft onder dimensie 3 en 4.

**Beslissing voor nu:** niet retroactief doorvoeren in bestaande clusters. Documenteren als v6-kandidaat.

---

## triggerType-toelichting: `context-afhankelijk`

Gekozen boven `subgroep-overschat` omdat:
- Het effect is niet per se overschat in perceptie (aspartaam staat minder prominent in populaire trigger-lijsten dan MSG of rode wijn)
- Het effect is echt context-afhankelijk: aantoonbaar afwezig bij acute inname, potentieel aanwezig bij cumulatieve inname
- De subgroep is niet duidelijk afgebakend door biologische eigenschappen

`context-afhankelijk` communiceert "het kan een trigger zijn, maar hangt sterk af van hoe en hoeveel je gebruikt" — wat klinisch de meest bruikbare boodschap is.

---

## Gaps

1. Geen moderne RCT met pre-geregistreerd protocol voor aspartaam en migraine — alle bestaande studies zijn oud (1987–2014).
2. Fenylketonurie (PKU) patiënten vallen buiten scope van deze app (medische aandoening, niet voedingsadvies).
3. Kauwgom-item mist splitsing per zoetmiddel-type (aspartaam vs sorbitol vs xylitol) — één item dekt alle varianten.
4. Sucralose-items in gecombineerde producten (light yoghurt, proteinrepen) niet gedekt door dit cluster — gedocumenteerd voor batch-uitbreiding.
