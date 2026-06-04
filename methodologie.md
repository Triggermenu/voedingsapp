# Methodologie — Triggermenu

> **Doel van dit document.** Uitleggen, in begrijpelijke taal en met bronvermelding, hoe Triggermenu tot een stoplicht (groen/geel/oranje/rood) per voedingsmiddel komt. Bedoeld om te delen met diëtisten, artsen en kritische gebruikers. De operationele autoriteit blijft `CLAUDE.md`; dit document is de leesbare samenvatting daarvan.

**Status:** Triggermenu is een **informatieve beslishulp**, geen medisch hulpmiddel en geen vervanging van arts of diëtist. De stoplichten zijn **populatie-inschattingen** op basis van de best beschikbare evidence — geen individueel medisch oordeel. Individuele respons varieert, vooral bij migraine en histamine-intolerantie.

---

## 1. De scoreschaal

| Score | Kleur | Betekenis |
|---|---|---|
| 0 | groen | Veilig |
| 1 | geel-groen | Met mate |
| 2 | oranje | Spaarzaam |
| 3 | rood | Vermijden |
| (leeg) | grijs | Data niet beschikbaar |

Elke niet-lege score heeft:
- een **evidence-grade**: **A** (directe database / meta-analyse), **B** (afgeleid / consensus / richtlijn), **C** (beperkt / anekdotisch);
- minstens **één bron** met titel, type en URL.

De evidence-grade staat los van de score: hij zegt hoe sterk de onderbouwing is, niet hoe risicovol het voedingsmiddel is.

---

## 2. Jicht (purine)

**Primaire bron:** USDA Purine Database Release 2.0 (2025). **Aanvullend:** Kaneko HPLC-data, EULAR 2022, ACR 2020, Choi 2004 (NEJM).

**Drempels — mg totaal purine per 100 g:**

| Purine | Score |
|---|---|
| < 50 mg | 0 |
| 50–100 mg | 1 |
| 100–200 mg | 2 |
| > 200 mg | 3 |

De score volgt in beginsel **rechtstreeks de purinewaarde**. Op een aantal punten wijkt de evidence af van de pure biochemie; daar gelden onderbouwde uitzonderingen:

### Onderbouwde uitzonderingen

- **Koffie = groen (0).** Mendelian-randomization-data (Shirai 2022) en meta-analyse (2025) tonen een *beschermend* effect op urinezuur. Ondanks oude richtlijnen niet rood.
- **Bier = rood (3)**, ongeacht puringehalte. Mechanisme: ethanol remt de uitscheiding van urinezuur (lactaat-competitie). Geldt populatiebreed bij voldoende dosis.
- **Fructoserijke dranken (frisdrank, vruchtensap) = rood (3).** Fructose verhoogt de urinezuurproductie.
- **Peulvruchten — drempel volgen, geplafonneerd op 2.** Dit is het belangrijkste, en vaak misverstane, punt (zie §2.1).

### 2.1 Waarom peulvruchten *niet* automatisch oranje zijn

Bonen, linzen, tofu en soja bevatten biochemisch best wat purine (cooked ~65–190 mg/100 g). De klassieke jicht-voorlichting raadde ze daarom af. **Die aanname is achterhaald.**

**Choi et al. 2004 (NEJM, n = 47.150, 12 jaar follow-up)** vond dat het jichtrisico sterk afhangt van de *bron* van purine:

| Purinebron | Relatief risico op jicht |
|---|---|
| Vlees | 1,41 ↑ |
| Vis & schaaldieren | 1,51 ↑ |
| Purinerijke groente **en peulvruchten** | géén verhoogd risico |
| Plantaardig eiwit | mogelijk beschermend |

EULAR 2022 onderschrijft dit. Plantaardige purine verhoogt urinezuur niet zoals dierlijke purine dat doet.

**Gevolg voor de scoring:** "geplafonneerd op 2" is een *plafond*, geen vaste waarde.
- Laag-purine peulvruchten (< 100 mg) volgen de drempel → meestal **score 1** (met mate).
- Alleen hoog-purine soorten (≥ 100 mg, bv. linzen, kikkererwten, sojabonen) raken het **plafond van 2**.
- Géén enkele peulvrucht krijgt rood (3), want de epidemiologie laat geen verhoogd risico zien.

Dit is consistent met ons algemene principe: **epidemiologische uitkomstdata > biochemische samenstelling alleen** (zie §6).

### 2.2 Vlees, vis & schaaldieren

Voor dierlijke bronnen geldt géén neerwaartse correctie — Choi laat juist een *verhoogd* risico zien. De score volgt de purine-drempel rechtstreeks. Voorbeelden: oesters (~90 mg → 1), krab (~150–180 mg → 2), zalm (~150–210 mg → 2), viskuit / gerookte vette vis (> 200 mg → 3).

---

## 3. Nierstenen (calciumoxalaat)

**Primaire bron:** Harvard Oxalate Table 2023. **Aanvullend:** USDA FDC, AUA Guideline, EAU.

**Drempels — mg oxalaat per standaardportie:** < 10 → 0, 10–25 → 1, 25–50 → 2, > 50 → 3.
**Modifier:** natrium > 600 mg per portie → +1 (max 3).

### Onderbouwde uitzonderingen
- **Calciumrijke producten = groen.** Een normale calciuminname (1000–1200 mg/dag) *verlaagt* het steenrisico (Borghi RCT, AUA-guideline). Een laag-calciumdieet wordt afgeraden.
- **Vitamine C-supplementen = rood (3)** — worden omgezet in oxalaat.
- **Lage oxalaatgroenten worden niet als spinazie behandeld.** Boerenkool bijvoorbeeld is laag-oxalaat (~2 mg/portie) → groen, ondanks de visuele gelijkenis met spinazie.

---

## 4. Migraine

**Let op — data-arm domein.** Er bestaat geen gezaghebbende kwantitatieve database; de evidence is overwegend laag (cross-sectioneel, zelfrapportage). **Bronnen:** Hindiyeh 2020 (systematic review), American Migraine Foundation, Migraine Trust.

Daarom is **rood (3) streng beperkt.** Score 3 is alleen toegestaan voor stoffen met een populatiebreed, dosis-afhankelijk mechanisme — momenteel uitsluitend:
1. **Bier** (ethanol-mechanisme, reproduceerbaar bij voldoende dosis).
2. **Gecureerd vlees boven de Henderson-nitriet-drempel** (bv. spek/bacon ≥ 10 mg nitriet per portie).

Veel klassieke "triggers" zijn op grond van modern onderzoek **teruggebracht naar oranje (2)** met een toelichting, omdat hun effect alleen in een subgroep optreedt of niet reproduceerbaar is in geblindeerde studies:
- **Chocolade** — waarschijnlijk een vroeg symptoom (prodroom-craving), geen oorzaak.
- **MSG** — geen reproduceerbaar effect in geblindeerde studies (ICHD-3 schrapte het van de officiële lijst).
- **Gerijpte kaas** — tyramine wordt bij intacte enzymfunctie geïnactiveerd; alleen relevant in een gevoelige subgroep.
- **Gedistilleerd (whisky, gin, wodka …) en rode/versterkte wijn** — de trigger zit in dranksspecifieke congeneren/biogene aminen, niet in ethanol. Wodka (vrijwel pure ethanol) is juist de mínst provocerende drank (Onderwater 2019).

Elke migraine-score ≥ 2 heeft een `triggerType` die aangeeft of het om een populatiebreed, subgroep-, dosis- of individueel-variabel effect gaat. De app toont bij variabele triggers expliciet: *"respons verschilt per persoon."*

---

## 5. Histamine-intolerantie

**Bronnen:** SIGHI Compatibility List 2023 (licentie aangevraagd), Brazilian systematic review 2024 (HPLC-data), Montreux Consensus 2024.

De SIGHI 0–3-schaal wordt direct overgenomen. Per item worden twee extra kenmerken bijgehouden: **histamineliberator** (bv. citrus, aardbei, tomaat) en **DAO-blokker** (bv. alcohol, zwarte/groene thee).

Tegenstrijdigheden worden expliciet gemarkeerd. Voorbeeld: citrus wordt door SIGHI vaak hoog gescoord, maar San Mauro 2021 toont beperkte directe histamine-evidence → label *"omstreden"*.

Evidence is hier vrijwel nooit A: meestal B (consensus) of C (anekdotisch). Individuele DAO-drempels variëren sterk.

---

## 6. Hoe we omgaan met tegenstrijdige bronnen

Bij conflicterende bronnen geldt een vaste weging:
- **Mechanistisch sterke data (RCT, Mendelian randomization) > correlationele richtlijnen.** (koffie, calcium)
- **Epidemiologische uitkomstdata > biochemische samenstelling alleen.** (peulvruchten)
- **Geblindeerde provocatie > open-label zelfrapportage.** (MSG)
- **Beverage-specifieke evidence > generiek ethanol-argument.** (gedistilleerd)

Elke afwijking van een "klassieke" aanname is gedocumenteerd met datum, bron en onderbouwing in `CLAUDE.md` (§12 bronweging, §13 paradigma-precedenten), zodat het besluitspoor controleerbaar is.

---

## 7. Beperkingen (eerlijk benoemd)

- **Populatieniveau.** Scores zijn gemiddelden; jouw persoonlijke respons kan afwijken, vooral bij migraine en histamine.
- **Migraine-evidence is inherent zwak.** We compenseren met strenge drempels voor rood en zichtbare evidence-badges.
- **SIGHI-licentie** voor commercieel gebruik is aangevraagd, nog niet bevestigd.
- **Eén auteur, nog zonder externe domeinvalidatie.** Het besluitspoor is auditeerbaar (§6) en externe review door een diëtist/specialist wordt aanbevolen vóór commercieel gebruik. Feedback is welkom.

---

*Laatst bijgewerkt: 2026-06-04. Bronnen-URL's en exacte waarden per voedingsmiddel zijn in de app zichtbaar onder "Bronnen" en per item.*
