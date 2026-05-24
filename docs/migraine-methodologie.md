# Methodologie Voedingsgids / Pulse — migraine-as

**Versie:** 0.4 concept (sectie 1-6 + bijlage A)
**Datum:** 2026-05-23
**Auteur:** Peter Wolterman
**Status:** intern concept; niet voor externe deling tot v1.0

---

## Samenvatting

Voedingsgids (Pulse) is een Nederlandstalige, informatieve beslishulp — uitdrukkelijk **geen medisch hulpmiddel** — die voedingsmiddelen scoort op vier aandoeningen. Dit document beschrijft de methodologie voor de **migraine-as**. Elk voedingsmiddel krijgt een ordinale score van 0 tot 3, met een onafhankelijke evidence-grade (A/B/C) en, vanaf score 2, een verplichte classificatie van het triggermechanisme (`triggerType`).

De methodologie is bewust terughoudend, passend bij de zwakke migraine-voedingsliteratuur. De hoogste score is gereserveerd voor een restrictieve whitelist (in de praktijk alleen alcohol en gecureerd vlees boven de nitrietdrempel — tien van de 700 items). Klassieke "triggers" als MSG, gerijpte kaas, rode wijn en chocolade worden bewust niet op score 3 gezet maar op 2, op grond van geblindeerde evidence boven observationele trigger-lijsten. Triggers worden gegroepeerd per mechanistisch pathway-cluster; clusters zonder sterk bewijs kennen een verlaagd score-plafond. Methodologische keuzes zijn vastgelegd als toetsbare paradigma-precedenten.

De doc is geschreven voor medisch-wetenschappelijke en regulatoire lezers die willen beoordelen of de scoring methodologisch verdedigbaar is.

---

## Inhoudsopgave

- [1. Inleiding en scope](#1-inleiding-en-scope)
  - [1.1 Wat het systeem is](#11-wat-het-systeem-is)
  - [1.2 Wat het systeem niet is](#12-wat-het-systeem-niet-is)
  - [1.3 Voor wie deze doc is geschreven](#13-voor-wie-deze-doc-is-geschreven)
  - [1.4 Niet-doelen](#14-niet-doelen)
- [2. Scoring-schema](#2-scoring-schema)
  - [2.1 De ordinale schaal 0-3](#21-de-ordinale-schaal-0-3)
  - [2.2 Evidence-grading](#22-evidence-grading)
  - [2.3 Confidence](#23-confidence)
  - [2.4 Vier aandoeningen — waarom deze vier?](#24-vier-aandoeningen--waarom-deze-vier)
- [3. Migraine-specifieke methodologie](#3-migraine-specifieke-methodologie)
  - [3.1 Het score-3-principe: een restrictieve whitelist](#31-het-score-3-principe-een-restrictieve-whitelist)
  - [3.2 Waarom klassieke triggers géén score 3 krijgen](#32-waarom-klassieke-triggers-géén-score-3-krijgen)
  - [3.3 De triggerType-taxonomie](#33-de-triggertype-taxonomie)
- [4. Clustersysteem](#4-clustersysteem)
  - [4.1 Pathway-clustering: scoren per mechanisme, niet per product](#41-pathway-clustering-scoren-per-mechanisme-niet-per-product)
  - [4.2 Evidence-C-only clusters: een verlaagd score-plafond](#42-evidence-c-only-clusters-een-verlaagd-score-plafond)
  - [4.3 Paradigma-precedenten als register](#43-paradigma-precedenten-als-register)
- [5. Beperkingen, onzekerheid en onderhoud](#5-beperkingen-onzekerheid-en-onderhoud)
  - [5.1 Inherente beperkingen van de migraine-evidence](#51-inherente-beperkingen-van-de-migraine-evidence)
  - [5.2 Bron- en methodologie-caveats](#52-bron--en-methodologie-caveats)
  - [5.3 Onderhoud en kwaliteitsborging](#53-onderhoud-en-kwaliteitsborging)
  - [5.4 Wat dit betekent voor de lezer](#54-wat-dit-betekent-voor-de-lezer)
- [6. Versiebeheer en bronnen](#6-versiebeheer-en-bronnen)
  - [6.1 Versiebeheer en audit trail](#61-versiebeheer-en-audit-trail)
  - [6.2 Kernbronnen](#62-kernbronnen)
- [Bijlage A. Twee uitgewerkte scoringsvoorbeelden](#bijlage-a-twee-uitgewerkte-scoringsvoorbeelden)
  - [A.1 Spek (gerookt) — score 3](#a1-spek-gerookt--score-3)
  - [A.2 Oude kaas (>48 maanden) — score 2](#a2-oude-kaas-48-maanden--score-2)

---

## 1. Inleiding en scope

### 1.1 Wat het systeem is

Voedingsgids (intern ook bekend als Pulse) is een Nederlandstalige informatieve beslishulp die voedingsmiddelen scoort op vier voedingsgerelateerde aandoeningen: migraine, jicht, nierstenen en histamine-intolerantie. De applicatie geeft per voedingsmiddel een ordinale score van 0 tot 3 per aandoening, samen met een korte motivering, bronnen en mate van zekerheid.

De applicatie is ontworpen voor zelfregie: een gebruiker die met een van deze aandoeningen leeft, kan voor een specifiek voedingsmiddel snel inzien of het waarschijnlijk goed verdragen wordt, mogelijk problematisch is, of waarschijnlijk een trigger vormt. De scoring is gebaseerd op de huidige wetenschappelijke literatuur en wordt onderhouden door één auteur met een achtergrond in financieel-juridische analyse en methodologische rigueur, niet door een medisch professional.

Deze methodologie-doc beschrijft hoe de scoring tot stand komt voor de **migraine-as**. De andere drie aandoeningen volgen vergelijkbare maar niet identieke paradigma's; deze worden in toekomstige delen behandeld.

### 1.2 Wat het systeem niet is

De applicatie **positioneert zich uitdrukkelijk als informatieve beslishulp en niet als medisch hulpmiddel** in de zin van de EU Medical Device Regulation (MDR) 2017/745: ze stelt geen diagnose, geeft geen behandeladvies en maakt geen diagnostische of therapeutische claims. De scoring is een informatieve heuristiek op basis van gepubliceerde literatuur en is geen vervanging voor medisch advies van een huisarts, neuroloog, diëtist of andere zorgverlener. De definitieve MDR-classificatie is onderwerp van juridische toetsing; tot uitsluitsel gedraagt de applicatie zich conservatief conform de hierboven beschreven afbakening.

Concreet betekent dit:
- De scores claimen geen diagnostische waarde. Een score 3 zegt niet dat een product een migraine-aanval zal veroorzaken; het zegt dat de literatuur dit product met substantieel risico associeert.
- De scores claimen geen therapeutische waarde. Het vermijden van score 3-producten is geen behandeling van migraine en wordt niet als zodanig gepresenteerd.
- Er worden geen claims gedaan over individuele uitkomsten. Migraine-triggers zijn sterk individueel; het systeem beschrijft populatie-niveau associaties, niet persoonlijke voorspellingen.

### 1.3 Voor wie deze doc is geschreven

Primaire doelgroep: medisch en wetenschappelijk geïnteresseerde lezers die willen beoordelen of de scoring-methodologie methodologisch verdedigbaar is. Dit omvat:
- Neurologen en huisartsen die overwegen het systeem aan patiënten te noemen
- Diëtisten die migraine-patiënten begeleiden
- Onderzoekers in migraine-voedingstriggers
- Patiëntorganisaties (Hoofdpijnnet, Migraine Trust NL)

Secundaire doelgroep: juridisch en regulatoire lezers (RIVM, IGJ, eventuele MDR-toetsende instanties) die willen verifiëren of het systeem zich houdt aan de uitgangspunten van een niet-medisch-hulpmiddel.

De doc gaat ervan uit dat de lezer bekend is met basisbegrippen uit klinische evidence-grading (RCT, SR, observationeel onderzoek) en met de aandoening migraine zelf. Er wordt niet uitgelegd wat migraine is of hoe ICHD-3 classificeert; daarvoor wordt verwezen naar de gangbare literatuur.

### 1.4 Niet-doelen

Drie zaken die deze methodologie expliciet niet doet:

1. **Geen persoonlijke trigger-identificatie.** Het systeem zegt niet "U krijgt waarschijnlijk migraine van rode wijn." Het zegt "Rode wijn wordt in de literatuur geassocieerd met migraine in een specifieke subgroep, vermoedelijk via tyramine/histamine-pathway."

2. **Geen volledig dieetadvies.** Het systeem scoort losse voedingsmiddelen. Het doet geen uitspraken over dieetcomposities, maaltijdfrequentie, of nutritionele adequaatheid. Een gebruiker die op basis van de scores producten elimineert, kan in nutritionele tekorten terechtkomen. Hiervoor wordt naar een diëtist verwezen.

3. **Geen claim van volledigheid.** De huidige database bevat 700 voedingsmiddelen (per 2026-05-23, de vastgestelde cap). Producten die niet in de database staan, worden niet automatisch als "veilig" of "onveilig" beschouwd — ze zijn simpelweg nog niet gescoord.

---

## 2. Scoring-schema

### 2.1 De ordinale schaal 0-3

Elk voedingsmiddel krijgt per aandoening een ordinale score van 0 tot 3. De schaal is bewust grof gehouden:

| Score | Betekenis migraine-as |
|---|---|
| 0 | Geen significante associatie met migraine-trigger-status in de huidige literatuur. Producten in deze categorie worden door het systeem niet aangemerkt als aandachtspunt voor migraine-patiënten. |
| 1 | Zwakke associatie. Mechanistische plausibility en/of beperkte observationele data; geen reproduceerbare trigger in algemene populatie. |
| 2 | Matige associatie. Reproduceerbare trigger in welomschreven subgroep, of substantieel mechanistisch onderbouwd. In algemene populatie vaak overschat. |
| 3 | Sterke associatie. Trigger met populatiebreed of dosis-afhankelijk mechanisme dat in de algemene migraine-populatie reproduceerbaar effect heeft. |

De keuze voor vier niveaus in plaats van een continue schaal is bewust:
- **Reproduceerbaarheid.** Een ordinale schaal met scherpe definities is consistenter te hanteren bij honderden items dan een continue 0-10 schaal.
- **Communiceerbaarheid.** Gebruikers begrijpen "rood / oranje / geel / groen" semantiek intuïtief.
- **Eerlijkheid over onzekerheid.** Een score van 7.3 suggereert precisie die de onderliggende evidence niet ondersteunt.

Belangrijk: de schaal is niet lineair-kwantitatief. Het verschil tussen score 0 en 1 is niet hetzelfde als tussen 2 en 3. Score 3 is een **kwalitatieve sprong** — alleen producten die de score-3-whitelist passeren (zie §3.1) krijgen deze score.

### 2.2 Evidence-grading

Naast de score krijgt elk item een evidence-grade die de kwaliteit van het onderliggende bewijs uitdrukt:

| Grade | Criterium |
|---|---|
| A | Bewijs uit ten minste één RCT of peer-reviewed meta-analyse met directe link tussen het item en migraine-uitkomst. |
| B | Bewijs uit één SR met methodologische beperkingen, of meerdere observationele studies met consistente bevindingen, of sterke mechanistische onderbouwing gecombineerd met klinische ervaring. |
| C | Bewijs uit observationele studies met methodologische beperkingen (surrogaat-uitkomsten, klein cohort, zelfrapportage zonder blindering), of mechanistische plausibility zonder directe migraine-evidence. |

Een vierde schemawaarde, `onbekend`, is geen evidence-grade in eigenlijke zin: deze is gereserveerd voor aandoeningen die voor een item niet gescoord zijn (score `null`). In de migraine-as komt `onbekend` daarom niet voor — gescoorde migraine-items dragen altijd A, B of C.

De evidence-grade is **onafhankelijk** van de score. Binnen de migraine-as komt dit bijvoorbeeld tot uiting in een item met score 1 + evidence B (zwakke trigger, redelijk onderbouwd) naast een item met score 3 + evidence B (sterke trigger, dezelfde bewijskwaliteit maar klinisch zwaarder wegend). Deze ontkoppeling is essentieel: de score zegt iets over de **klinische sterkte** van de trigger, de evidence-grade over de **wetenschappelijke onderbouwing**. (In andere assen dan migraine — waar wél grade A voorkomt, bv. jicht via de USDA Purine Database — kan de ontkoppeling scherper zijn: een zwakke maar sterk bewezen associatie, score 1 + evidence A.)

In de huidige database (per 2026-05-23) is geen enkel **migraine-item** geclassificeerd als grade A; de migraine-as gebruikt uitsluitend grades B en C. Reden: directe RCT's met voedingsmiddel-interventie en migraine-aanval als primair endpoint zijn zeldzaam; de meeste literatuur is observationeel of mechanistisch. Dit is een eerlijke weerspiegeling van de staat van het veld, niet een tekortkoming van de methodologie. (Ter contrast: de jicht- en nierstenen-assen bevatten wél veel grade A-scores, omdat daar wel kwantitatieve referentiedatabases bestaan — USDA Purine Database 2.0 respectievelijk de Harvard Oxalate Table.)

### 2.3 Confidence

Naast score en evidence krijgt elk item een confidence-aanduiding (laag, middel, hoog) die uitdrukt hoe zeker de auteur is over de toegekende score gegeven de huidige literatuur. Confidence verschilt subtiel van evidence-grade:

- **Evidence-grade** beschrijft de kwaliteit van het bewijs.
- **Confidence** beschrijft hoe overtuigd de scoring-keuze is, gegeven het bewijs én de paradigma-keuzes (welk cluster, welke triggerType, welke score binnen het cluster-plafond).

Een item kan evidence C hebben (zwak bewijs) maar confidence hoog (de auteur is zeker dat dit zwakke bewijs een score 1 rechtvaardigt en niet 2). Andersom: evidence B (redelijk bewijs) met confidence laag (de paradigma-toewijzing is onzeker — past dit item bij cluster X of cluster Y?).

Wordt confidence weggelaten, dan geldt impliciet `middel`.

### 2.4 Vier aandoeningen — waarom deze vier?

De applicatie scoort op migraine, jicht, nierstenen en histamine-intolerantie. Deze keuze is niet willekeurig:

- **Migraine en histamine-intolerantie** hebben overlappende mechanistische pathways (biogene aminen, MAO-A), maar verschillen klinisch substantieel. Een gebruiker met DAO-deficiëntie (histamine-intolerantie) heeft andere triggers dan een algemene migraine-patiënt zonder enzymdeficiëntie. Het apart scoren voorkomt vermenging.

- **Jicht** is een metabole aandoening met sterke voedingsgevoeligheid (purinerijke producten, fructose, alcohol). De evidence-basis is robuuster dan voor migraine — directe RCT's en grote cohortstudies bestaan.

- **Nierstenen** zijn divers in pathogenese (calciumoxalaat, urinezuur, struviet); de scoring richt zich op de meest voorkomende typen waar voeding een bekende rol speelt.

Andere aandoeningen waar voeding een rol speelt (PDS, glutenintolerantie, lactose-intolerantie, diabetes type 2) zijn bewust buiten scope. Reden: ofwel is de evidence-basis onvoldoende voor stoffelijke scoring (PDS), ofwel is de voedings-triggerstatus voldoende eenduidig om geen scoring nodig te hebben (lactose), ofwel valt het buiten de informatieve-beslishulp-scope (diabetes vergt persoonlijke glucose-monitoring).

Deze methodologie-doc behandelt alleen de migraine-as. De andere drie assen volgen vergelijkbare maar niet-identieke principes en worden in toekomstige deelversies behandeld.

---

## 3. Migraine-specifieke methodologie

De algemene scoring-principes uit sectie 2 gelden voor alle vier aandoeningen. De migraine-as kent daarbovenop drie eigenheden die deze sectie behandelt: een uitzonderlijk restrictieve drempel voor de hoogste score (§3.1), een expliciete weging tegen klassieke trigger-lijsten (§3.2), en een verplichte classificatie van het triggermechanisme (§3.3).

### 3.1 Het score-3-principe: een restrictieve whitelist

Score 3 is op de migraine-as bewust zeldzaam. Van de 700 gescoorde items dragen er **tien** een migraine-score 3 (1,4%). De score-verdeling per 2026-05-23:

| Score | Aantal items |
|---|---|
| 0 | 476 |
| 1 | 119 |
| 2 | 95 |
| 3 | 10 |

De reden voor deze terughoudendheid is principieel. De migraine-voedingsliteratuur is methodologisch zwak: de meeste "triggers" berusten op zelfrapportage en cross-sectioneel onderzoek, en moderne geblindeerde studies reproduceren het effect zelden in de algemene populatie. Een score die "sterke, in de algemene populatie reproduceerbare associatie" claimt, mag daarom niet lichtvaardig worden toegekend.

Concreet wordt score 3 gereserveerd voor stoffen waarvan het mechanisme **populatiebreed** is (reproduceerbaar over brede populaties bij voldoende dosis, niet gebonden aan een geïdentificeerde subgroep — géén claim dat iedere patiënt reageert) **of dosis-afhankelijk** met een drempel die via normale voeding daadwerkelijk bereikt wordt. Slechts twee stofklassen voldoen hieraan, en zij vormen samen de volledige score-3-populatie:

1. **Alcoholische dranken** (bier in alle varianten, gedistilleerd, sterke wijn) — zes items, mechanisme `populatiebreed`. De trigger is het ethanol-mechanisme zelf (directe vasodilatatie, CGRP-release, mestcel-degranulatie), dat dosis-afhankelijk over brede populaties optreedt en niet beperkt is tot een geïdentificeerde subgroep.
2. **Gecureerd vlees boven de Henderson-nitrietdrempel** (spek/bacon, gerookte/gecureerde worst) — vier items, mechanisme `subgroep-bevestigd`. Een typische portie bereikt ≥10 mg nitriet, de dosis waarbij Henderson & Raskin (1972) in direct enteraal provocatieonderzoek migraine opwekten. De dose-route-match rechtvaardigt de hoogste score, ook al rust de directe evidence op een kleine n.

Een nieuw item kan alleen score 3 krijgen als het op deze whitelist past; dit wordt geautomatiseerd bewaakt. Daarbij geldt een ondergrens voor de bewijskwaliteit: score 3 vereist evidence-grade ≥ B.

### 3.2 Waarom klassieke triggers géén score 3 krijgen

Een aanzienlijk deel van de publieke migraine-trigger-lijsten (chocolade, monosodiumglutamaat, gerijpte kaas, rode wijn) wordt door dit systeem **niet** op score 3 gezet, maar op score 2 met een toelichtende note. Dit is een expliciete methodologische keuze, geen omissie. De onderliggende regel: **geblindeerde provocatie- en RCT-evidence weegt zwaarder dan observationele trigger-lijsten, en mechanistisch inzicht in inactivatie-pathways weegt zwaarder dan klassieke associatie.**

Per geval:

- **MSG.** Meerdere dubbelblinde RCT's tonen geen reproduceerbaar effect bij normale voedselinname; ICHD-3 verwijderde MSG in 2018 van de officiële triggerlijst. Score 2, `subgroep-overschat`.
- **Gerijpte kaas.** Tyramine wordt bij een intacte MAO-functie in darmwand en lever geïnactiveerd; het effect is alleen klinisch relevant in een MAO-A-gevoelige subgroep of bij MAO-remmer-gebruik. Geen moderne provocatie-RCT. Score 2, `subgroep-overschat`.
- **Rode wijn.** Er bestaat een positieve RCT (Littlewood 1988) maar met kleine n, en een groot cohort (Onderwater 2019) toont een forse kloof tussen ~77% zelf-rapportage en ~9% objectief consistente respons. Score 2, `subgroep-overschat`.
- **Chocolade.** Recente systematische reviews suggereren dat chocolade-craving eerder een vroeg prodroom-symptoom is dan een oorzaak. Score 2, met note.

Deze downgrades zijn als formele paradigma-precedenten vastgelegd, zodat een toekomstig item dat op een precedent lijkt zonder hernieuwde discussie dezelfde weging volgt.

### 3.3 De triggerType-taxonomie

Elke migraine-score van 2 of hoger draagt een `triggerType`: een classificatie van hóé de trigger zich gedraagt. Dit veld is verplicht vanaf score 2 (geautomatiseerd afgedwongen) en dwingt tot expliciteit over het mechanisme in plaats van een kale risico-score. Er zijn acht waarden:

| Waarde | Betekenis |
|---|---|
| `populatiebreed` | Mechanisme reproduceerbaar over brede populaties bij voldoende dosis; niet gebonden aan een geïdentificeerde subgroep; direct farmacologisch. Claimt géén reactie bij iedere patiënt — wel afwezigheid van een subgroep-grens. |
| `dosis-afhankelijk` | Effect treedt op boven een specifieke dosisdrempel; daaronder niet. |
| `subgroep-bevestigd` | Reproduceerbaar effect in een welomschreven subgroep, gedefinieerd door een duidelijke biologische factor (bv. enzymdeficiëntie). |
| `subgroep-overschat` | Effect bestaat alleen in een subgroep en wordt in de algemene populatie overschat: hoge zelf-rapportage, lage geblindeerde reproduceerbaarheid. |
| `onttrekkings-trigger` | Trigger door het staken/verminderen van inname, niet door de inname zelf (bv. cafeïne). |
| `context-afhankelijk` | Trigger-status hangt af van de situatie of het specifieke product (samenstelling per producent, combinatie met andere stoffen, timing), niet van persoonseigenschappen. |
| `individueel-variabel` | Modulerende factor varieert continu zonder scherpe subgroep-grens; effectgrootte verschilt per individu langs een gradiënt. |
| `drug-interactie` | Trigger alleen in combinatie met specifieke medicatie. Gereserveerd voor toekomstig gebruik (momenteel nul items). |

Drie onderscheidingen zijn essentieel en bepalen in de praktijk de meeste classificatie-keuzes:

- **`subgroep-bevestigd` vs `subgroep-overschat`** — niet *of* er een subgroep is, maar of het effect bínnen die subgroep geblindeerd reproduceerbaar is (bevestigd) dan wel vooral op zelf-rapportage berust (overschat).
- **`subgroep-bevestigd` vs `individueel-variabel`** — een subgroep is een dichotome eigenschap (men heeft de enzymdeficiëntie wel of niet); een individueel-variabele factor is een continuüm zonder scherpe grens.
- **`subgroep-bevestigd` vs `context-afhankelijk`** — de bepalende variabele zit in de **persoon** (enzym, genetica, microbioom) versus in de **situatie of het product** (welk merk, welke combinatie, welk tijdstip).

Dat de taxonomie consistent wordt toegepast blijkt onder meer hieruit: `drug-interactie` is gereserveerd en kent nul items; en items met `individueel-variabel` blijven binnen het score-plafond van hun (bewijszwakke) cluster, waarover meer in een latere sectie.

---

## 4. Clustersysteem

De score, evidence-grade en triggerType (sectie 2-3) worden per item toegekend, maar niet per item *bedacht*. Daaronder ligt een organiserend principe dat consistentie waarborgt over honderden items: het clustersysteem.

### 4.1 Pathway-clustering: scoren per mechanisme, niet per product

Migraine-triggers worden gegroepeerd op hun **primaire trigger-stof of -pathway**, niet op culinaire categorie. De dataset kent een twintigtal van zulke clusters, geordend in families: stimulantia/xanthines (cafeïne, theobromine), biogene aminen uit gefermenteerde producten (tyramine, histamine), de nitriet/NO-pathway, alcohol, histamine uit vis en plantaardige bronnen, vasoactieve fenolen, en additieven (aspartaam, MSG, sulfieten).

Het voordeel van clusteren op mechanisme in plaats van op productsoort is consistentie. Eén pathway krijgt één scoringregel en wordt als één onderzoeksbatch behandeld; alle items binnen het cluster worden tegen diezelfde regel en bronnenset gewogen. Zo voorkomt het systeem dat twee chemisch vergelijkbare producten — bijvoorbeeld een gerijpte kaas en een gefermenteerde vis, beide rijk aan biogene aminen — toevallig uiteenlopende scores krijgen doordat ze in verschillende categorieën zijn ingevoerd.

Een trigger-stof kan in meerdere productgroepen voorkomen. Tyramine zit zowel in gerijpte kaas (cluster gerijpte/gefermenteerde kazen) als in gistextracten; histamine in gerijpte vis (cluster histamine-rijke vis), in gefermenteerde groenten en in bepaald fruit. Items die mechanistisch op de grens van twee clusters liggen, krijgen het cluster van het **dominante mechanisme voor migraine**, niet het eerst-passende. Een gefermenteerde haring valt daarom onder het histamine-viscluster (histamine dominant), niet onder het kaas-tyramine-cluster — een onderscheid dat in de praktijk bepalend is voor de gekozen bronnenset en modulatoren.

### 4.2 Evidence-C-only clusters: een verlaagd score-plafond

Niet elk cluster rust op even sterk bewijs. Sommige clusters bevatten uitsluitend items met evidence-grade C: er is geen RCT met het cluster-onderwerp als interventie, geen systematische review met deze specifieke vraagstelling, alleen mechanistische plausibiliteit en observationeel onderzoek met door de auteurs zelf erkende beperkingen.

Voor zulke **evidence-C-only clusters** geldt een strenger scoringregime, om te voorkomen dat zwak bewijs tot een sterke risico-uitspraak leidt:

- Het score-plafond is standaard **1**.
- Score **2** is alleen toegestaan als dosis-uitzondering, waar geconcentreerde producten mechanistisch een drempel benaderen die vergelijkbaar is met een bewezen pathway.
- Score **3** is binnen zo'n cluster **niet toegestaan**.
- De triggerType is bij voorkeur `individueel-variabel` of `dosis-afhankelijk`, niet `subgroep-bevestigd` — want bij ontbrekend bewijs is de subgroep niet welomschreven.

Het precedent is het cluster nitraatrijke groenten: mechanistische plausibiliteit (nitraat → enterosalivaire conversie naar NO, met het mondmicrobioom als modulator) plus observationeel onderzoek, maar geen directe migraine-RCT. Items daar blijven op score 1, op een enkele geconcentreerde dosis-uitzondering na. Toekomstige clusters waar directe migraine-evidence ontbreekt, volgen deze norm.

### 4.3 Paradigma-precedenten als register

Methodologische beslissingen die verder reiken dan één item — bijvoorbeeld het verlagen van een hele klasse van "klassieke triggers" (sectie 3.2), of het instellen van het evidence-C-plafond — worden vastgelegd in een chronologisch register van paradigma-precedenten. Elk precedent koppelt een concrete beslissing aan een generaliseerbare regel.

Het doel is tweeledig. Ten eerste **consistentie over tijd**: een nieuw item dat lijkt op een eerder beslist geval volgt hetzelfde paradigma zonder dat de afweging opnieuw gemaakt wordt. Ten tweede **toetsbaarheid**: een externe lezer kan nagaan wélke regel op een item is toegepast en waaróm, in plaats van een losse score te moeten vertrouwen.

Voorbeelden van vastgelegde migraine-precedenten:

- **Geblindeerd bewijs verslaat trigger-lijsten.** Een geblindeerde provocatie- of RCT-uitkomst overrulet open-label observaties en klassieke trigger-lijsten (toegepast op MSG: van klassieke "rode" trigger naar score 2).
- **Mechanistisch inactivatie-inzicht verslaat klassieke associatie.** Inzicht dat tyramine bij intacte MAO-functie wordt geïnactiveerd, weegt zwaarder dan historische associatie-lijsten (toegepast op gerijpte kaas).
- **Eén-laboratorium-evidence zonder replicatie geeft een lage prior.** Positief bewijs dat uitsluitend uit één onderzoeksgroep komt en niet onafhankelijk gerepliceerd is, rechtvaardigt geen hoge score, ongeacht de biochemische plausibiliteit (toegepast op de tyramine-kaas-literatuur).
- **Evidence-C-only ⇒ score-plafond 1** (zie §4.2).

Deze precedenten zijn geen losse meningen maar staan in een gedeeld register dat onderdeel is van de projectdocumentatie; ze worden hier weergegeven omdat ze de scoring op de migraine-as direct bepalen.

---

## 5. Beperkingen, onzekerheid en onderhoud

Een methodologie is alleen verdedigbaar als ze haar eigen grenzen benoemt. Deze sectie maakt expliciet wat het systeem niet weet, waar het bewijs dun is, en hoe de scoring over tijd onderhouden en bewaakt wordt.

### 5.1 Inherente beperkingen van de migraine-evidence

De grootste beperking is het veld zelf. Er bestaan vrijwel geen gerandomiseerde, geblindeerde studies met een voedingsmiddel als interventie en een migraine-aanval als primair eindpunt. De beschikbare literatuur is overwegend observationeel, cross-sectioneel of mechanistisch, en leunt sterk op zelfrapportage — een methode die voor migraine-triggers notoir gevoelig is voor recall-bias en nocebo-effecten.

De directe consequentie is zichtbaar in de data: op de migraine-as is **geen enkel item geclassificeerd als evidence-grade A** (zie §2.2). De as gebruikt uitsluitend B en C. Dit is geen tekortkoming van de methodologie maar een eerlijke weerspiegeling van de staat van het onderzoek. Waar de jicht- en nierstenen-assen kunnen terugvallen op kwantitatieve referentiedatabases (USDA Purine Database, Harvard Oxalate Table), bestaat voor migraine geen equivalent.

Deze onzekerheid is bewust in het ontwerp verwerkt: de grove ordinale schaal (§2.1), de restrictieve score-3-whitelist (§3.1) en de zichtbare evidence- en confidence-aanduidingen zijn alle bedoeld om niet méér zekerheid te suggereren dan het bewijs draagt.

### 5.2 Bron- en methodologie-caveats

- **Secundaire bronnen.** Een belangrijk deel van de migraine-scores leunt op systematische reviews (o.a. Hindiyeh 2020) in plaats van op primaire interventiestudies. Sommige van die reviews hebben gemelde belangenverstrengelingen (farmaceutische sponsoring); dit wordt waar relevant in de item-notes vermeld en verandert niets aan de transparantie van de onderbouwing, maar de lezer dient het te wegen.
- **Tyramine-tabellen als referentie, niet als bewijs.** Klassieke tyramine-gehaltetabellen worden gebruikt om producten te rangschikken, niet als zelfstandig bewijs van trigger-status. Een hoog tyramine-gehalte leidt niet automatisch tot een hoge score; de klinische reproduceerbaarheid (§3.2) is leidend.
- **Productvariatie.** Voor samengestelde of bewerkte producten verschilt de samenstelling per producent (zie `context-afhankelijk`, §3.3). De score beschrijft een typisch product; het etiket van een specifiek product kan afwijken.

### 5.3 Onderhoud en kwaliteitsborging

De scoring is geen eenmalige momentopname maar een onderhouden dataset. Drie mechanismen borgen de kwaliteit:

- **Geautomatiseerde validatie.** Elke wijziging passeert een geautomatiseerde controle vóór publicatie: schema-conformiteit (elk niet-leeg oordeel heeft een score, evidence-grade en minstens één bron), de score-3-whitelist-bewaking, de verplichting van een `triggerType` vanaf score 2, en een bereikbaarheidscontrole van alle bron-URL's. Een wijziging die een van deze regels schendt, wordt niet doorgevoerd.
- **Paradigma-precedenten.** Methodologische beslissingen (zoals de downgrades in §3.2) worden vastgelegd in een chronologisch register, zodat vergelijkbare toekomstige gevallen consistent worden gewogen zonder telkens opnieuw te beslissen.
- **Herzieningsdatum per item.** Elk item draagt een datum van laatste herziening, zodat veroudering zichtbaar en traceerbaar is.

### 5.4 Wat dit betekent voor de lezer

De scores zijn een hulpmiddel bij het oriënteren, geen voorspelling van een individuele reactie. Migraine-triggers zijn sterk persoonlijk; het systeem beschrijft associaties op populatieniveau en de mate van zekerheid daarover. Een gebruiker die wil weten of een specifiek product voor hém of haar een trigger is, kan dat alleen vaststellen via zorgvuldige eigen observatie, bij voorkeur in overleg met een huisarts, neuroloog of diëtist. Deze methodologie ondersteunt dat gesprek; ze vervangt het niet.

---

## 6. Versiebeheer en bronnen

### 6.1 Versiebeheer en audit trail

De methodologie is geen statische publicatie maar een onderhouden, versiebeheerd systeem. Vier lagen vormen samen een traceerbaar spoor van wat is gescoord, op welke basis, en wanneer het laatst is herzien:

- **Eén autoritatief regeldocument.** De scoringregels, drempels, het schema en de kwaliteitspoorten zijn vastgelegd in één centraal document dat onder semantisch versiebeheer staat. Wijzigingen daaraan vereisen expliciete goedkeuring van de auteur en worden met een changelog-regel (versie, datum, motivering) geregistreerd.
- **Versiebeheerde dataset.** De volledige dataset staat onder git: elke score-wijziging is een traceerbare commit met motivering, doorgaans via een pull request met geautomatiseerde controle.
- **Paradigma-precedenten-register.** Methodologische paradigmawijzigingen worden chronologisch vastgelegd (§4.3), met per precedent de beslissing, de generaliseerbare regel en de versie waarin ze is ingevoerd.
- **Herzieningsdatum per item.** Elk item draagt een datum van toevoeging én van laatste herziening, zodat veroudering zichtbaar is.

Voor een regulatoire of audit-context betekent dit dat elke individuele score herleidbaar is tot een regelversie, een bronnenset en een revisiedatum.

### 6.2 Kernbronnen

Onderstaande bronnen worden in deze methodologie-doc structureel aangehaald of liggen ten grondslag aan de besproken paradigma's. Dit is geen uitputtende bibliografie: de volledige, per-item bronvermelding (inclusief alle identifiers) is onderdeel van de dataset zelf en van de cluster-onderzoeksdocumentatie.

**Algemeen migraine-voeding**
- Hindiyeh NA et al. 2020 — *The Role of Diet and Nutrition in Migraine Triggers and Treatment: A Systematic Review* (PMC7496357)
- ICHD-3, International Classification of Headache Disorders, 3e editie (2018)

**Nitriet / NO-pathway (gecureerd vlees, nitraatgroenten)**
- Henderson WR & Raskin NH 1972 — enteraal nitriet-provocatieonderzoek (PMID 4117590)
- Iversen HK, Olesen J & Tfelt-Hansen P 1989 — NO-donor (GTN) en migraine (PMID 2506503)
- Gonzalez H et al. 2016 — nitraat/nitriet-reducerende orale bacteriën bij migraineurs (PMID 27822557)
- Zhong J et al. 2022 — nitraat/nitriet food-composition database (PMC9540118)

**Biogene aminen — tyramine (gerijpte kaas)**
- Ziegler DK & Stewart R 1977 — placebo-gecontroleerde tyramine-crossover (PMID 560645)
- Moffett AM et al. 1972 — tyramine-inname en migrainefrequentie (PMID 4559027)
- Finberg JPM & Gillman K 2022 — dieet-tyramine en MAO (PMC9172554)

**Biogene aminen — histamine (vis)**
- Maintz L & Novak N 2007 — *Histamine and histamine intolerance* (PMID 17490952)

**Additieven (MSG)**
- Obayashi Y & Nagamura Y 2016 — *Does monosodium glutamate really cause headache?* (systematische review, PMC4870486)

**Alcohol / rode wijn**
- Littlewood JT et al. 1988 — rode wijn als migrainetrigger (provocatiestudie)
- Onderwater GLJ et al. 2019 — alcohol als zelf-gerapporteerde vs objectieve trigger (cohort, n≈2.197)

**Chocolade**
- Marcus DA et al. 1997 — chocolade vs placebo, geen reproduceerbaar trigger-effect

---

## Bijlage A. Twee uitgewerkte scoringsvoorbeelden

Ter illustratie van de methodologie van begin tot eind, twee items die bewust contrasteren: één dat de hoogste score *verdient*, en één klassieke "trigger" die bewust *lager* wordt gescoord. Samen tonen ze zowel dat het systeem naar score 3 gaat wanneer het bewijs dat draagt, als dat het de klassieke trigger-lijsten weerstaat wanneer dat niet zo is.

### A.1 Spek (gerookt) — score 3

| Stap | Uitkomst |
|---|---|
| **Item** | Gerookt spek (`nl-spek-gerookt`) |
| **Cluster** | 7 — nitriet/NO-pathway |
| **Mechanisme** | Nitriet (E250) → stikstofmonoxide via maagzuur en de enterosalivaire cyclus → vasodilatatie |
| **Dosis-data** | Een portie van ~60 g levert ~7–15 mg nitriet |
| **Toets** | Henderson & Raskin (1972) wekten in enteraal provocatieonderzoek migraine op bij ~10 mg nitriet. De voedingsdosis bereikt die drempel: dose-route-match. Gecureerd vlees boven de Henderson-drempel is één van de twee stofklassen op de score-3-whitelist (§3.1). |
| **Resultaat** | **score 3** · evidence **B** · triggerType **`subgroep-bevestigd`** · confidence **middel** · modulatoren `nitriet`, `stikstofmonoxide`, `enterosalivaire-conversie` |
| **Waarom geen evidence A** | De directe provocatie is een N=1-bevinding, nooit in een moderne RCT gerepliceerd → B, niet A (§2.2). |

De score is hoog én de onzekerheid wordt eerlijk meegegeven: een sterke, dosis-onderbouwde associatie, maar gedragen door beperkte directe evidence.

### A.2 Oude kaas (>48 maanden) — score 2

| Stap | Uitkomst |
|---|---|
| **Item** | Oude Goudse kaas, >48 maanden (`nl-kaas-oud-48`) |
| **Cluster** | 3 — gerijpte/gefermenteerde kazen, tyramine/MAO-A-pathway |
| **Mechanisme** | Hoog tyramine-gehalte; klassiek geassocieerd met migraine via noradrenaline-release |
| **Tegen-evidence** | Geblindeerde studies (Ziegler & Stewart 1977, Moffett 1972) tonen géén reproduceerbaar effect bij personen zónder MAO-remmers; tyramine wordt bij intacte MAO-functie in darmwand en lever geïnactiveerd |
| **Toets** | Twee precedenten verlagen de score (§3.2, §4.3): geblindeerd bewijs verslaat klassieke trigger-lijsten, en mechanistisch inactivatie-inzicht verslaat historische associatie. Score 3 is daarom uitgesloten. De whitelist-3-floor houdt het item op score 2 (niet 1) als conservatieve default bij een historisch als trigger bekend product. |
| **Resultaat** | **score 2** · evidence **B** · triggerType **`subgroep-overschat`** · confidence **middel** · modulator `tyramine` |
| **Boodschap** | "Wordt vaak als trigger genoemd, maar het bredere bewijs ondersteunt dat niet; relevant vooral in een MAO-gevoelige subgroep." |

Hetzelfde product dat op klassieke trigger-lijsten "rood" zou zijn, krijgt hier expliciet een lagere, beter onderbouwde score — met de reden zichtbaar voor de gebruiker.

---

*[Einde concept sectie 1-6 + bijlage A. Volledige migraine-as-methodologie gedekt; klaar voor inhoudelijke en juridische review vóór v1.0 / externe deling.]*
