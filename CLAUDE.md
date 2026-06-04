# CLAUDE.md — Voedingsapp

> **Dit document is de enige autoriteit waar Claude Code, Cowork en CI naar luisteren.**
> Wijzigingen aan dit bestand vereisen Peters expliciete akkoord.
> Alle andere kwaliteitscontrole gebeurt geautomatiseerd (CI gates, Zod, e2e tests, Sentry).

---

## 1. Project

**Wat:** Nederlandse webapp die als **beslishulp** werkt voor mensen met jicht, migraine, nierstenen en/of histamine-intolerantie. Per voedingsmiddel een stoplicht (rood/oranje/groen) per aandoening, met evidence-level en bron.

**Voor wie:** mensen met één of meer van deze aandoeningen, met name overlap-patiënten (die niemand goed bedient).

**Wat het uitdrukkelijk NIET is:**
- Geen dagboek/tracker
- Geen medisch advies (zie disclaimer)
- Geen dieetschema
- Geen vervanging van arts/diëtist

**Eindgebruikersbelofte:** transparante, bronvermelde stoplichten die helpen bij snelle keuzes (supermarkt, restaurant). Niet meer, niet minder.

---

## 2. Scoringsregels per aandoening

Scores zijn altijd: **0 (groen) / 1 (geel-groen) / 2 (oranje) / 3 (rood) / null (data niet beschikbaar)**.
Elk niet-null score MOET een `evidence` (A/B/C) en `sources[]` hebben.

### 2.1 Jicht (purine)

**Primaire bron:** USDA Purine Database Release 2.0 (2025, CC0).
**Aanvullend:** Kaneko et al. HPLC-data (Japanse jichtrichtlijnen), EULAR 2022, ACR 2020.

**Drempels (mg totaal purine per 100g):**
- `< 50` → 0 (groen)
- `50–100` → 1
- `100–200` → 2 (oranje)
- `> 200` → 3 (rood)

**Verplichte regel-overrides (achterhaalde aannames):**
- **Koffie = 0 (groen).** Recente Mendelian-randomization studies (Shirai 2022, meta-analyse 2025) tonen *beschermend* effect. Ondanks oude richtlijnen NIET rood scoren. Regression-test bewaakt dit.
- **Alcohol (vooral bier) = 3 (rood)** ongeacht puringehalte. Mechanisme: lactaat-competitie urinezuur-uitscheiding.
- **Fructose-rijke dranken (frisdrank, vruchtensap) = 3.**
- **Peulvruchten = §2.1-drempel toepassen, geplafonneerd op 2 (nooit 3).** "Geplafonneerd op 2" is een *plafond*, geen vaste waarde: laag-purine peulvruchten (<100 mg) volgen de drempel (meestal score 1), alleen hoog-purine soorten (≥100 mg) raken het plafond van 2. Grond: Choi 2004 (NEJM, n=47.150) + EULAR 2022 — plantaardige/peulvrucht-purine geeft epidemiologisch géén verhoogd jichtrisico (vlees RR 1,41 / vis 1,51 wél, peulvruchten niet). Conform §13-paradigma "epidemiologische uitkomstdata > biochemische samenstelling".

**Evidence-default:** A (USDA-DB direct) of B (afgeleid).

### 2.2 Migraine

**LET OP — data-arm domein.** Er bestaat geen gezaghebbende kwantitatieve database. Evidence overwegend laag (cross-sectional, self-report). Recente reviews twijfelen aan klassieke triggers.

**Bronnen:** Hindiyeh 2020 systematic review (PubMed), American Migraine Foundation, Migraine Trust. Tyramine-tabellen alleen ter referentie, niet als enige basis.

**Whitelist voor score = 3 (rood)** — score 3 is gereserveerd voor stoffen met een populatiebreed of dosis-afhankelijk mechanisme dat niet gebonden is aan een welomschreven subgroep. "Populatiebreed" claimt géén universele reactie bij iedere patiënt, maar reproduceerbaarheid over brede populaties bij voldoende dosis. *Alleen* de onderstaande 2 stoffen:

**Toelatingscriteria — een stof komt alléén op de score-3-whitelist als ze aan álle vijf voldoet:**
1. Mechanisme direct farmacologisch/biologisch plausibel (niet louter epidemiologische associatie).
2. Een realistische portie bereikt de werkzame drempeldosis (bv. Henderson-drempel ≥10 mg nitriet, adequate ethanoldosis).
3. Effect reproduceerbaar over een brede populatie, niet afhankelijk van een geïdentificeerde subgroep — `triggerType` is `populatiebreed` of `dosis-afhankelijk` (nooit een `subgroep-*`, `individueel-variabel` of `context-afhankelijk` type).
4. Evidence-grade ≥ B met minstens 1 expliciete bron (§4.4, CI-gate 10).
5. Niet uitgesloten door een paradigma-precedent (§13) of een vastgestelde bronweging (§12).

**1. Alcohol — ethanol-mechanisme.**
- Score 3: **bier (alle varianten)**.
- Mechanisme: directe vasodilatatie, CGRP-release, mestcel-degranulatie. Populatiebreed reproduceerbaar bij voldoende dosis.
- **Uitzondering — rode wijn:** score 2 + `subgroep-overschat` vanwege dominante tyramine/histamine/sulfiet-pathway die alleen in MAO-A-gevoelige subgroep klinisch relevant is.
- **Uitzondering — gedistilleerd (whisky, gin, wodka, rum, e.d.) en versterkte wijn:** score 2 + `subgroep-overschat`. Onderwater 2019 (PMID 31254436, n≈2197): wodka — vrijwel pure ethanol + water — is de mínst provocerende drank (8,5%), rode wijn de meest (77,8%); de reproduceerbare trigger zit in congeneren/biogene aminen, niet in ethanol zelf. Geen quercetine-/ALDH2-pathway zoals bij rode wijn. Prospectief (Vives-Mestres 2022, PMC10099573) geen positieve associatie; wijn-meta-analyse 2025 (Alcohol & Alcoholism, OR 0,63) niet-significant. Verwijderd van score-3 whitelist 2026-06 (v2.0): `subgroep-overschat` is per toelatingscriterium 3 onverenigbaar met score 3.

**2. Gecureerd vlees boven Henderson-drempel.**
- Score 3: vleeswaren waarvan een typische portie ≥10 mg nitriet bereikt (spek/bacon: 60g × ~12 mg/kg ≈ 7–15 mg nitriet).
- Mechanisme: NO-gemedieerde vasodilatatie, dosis-afhankelijk.
- **Uitzondering:** gecureerde vleeswaren onder Henderson-drempel (salami 30g ≈ 2–3 mg, chorizo 30g ≈ 1,3 mg, paté/leverworst 50g ≈ 0,5–0,6 mg) krijgen score 2 + `subgroep-bevestigd`.

**Score = 2 (oranje) met expliciete `note`:**
- Aspartaam
- **Chocolade**: NIET rood. Recente evidence (2023 SR) suggereert prodroom-craving i.p.v. trigger. Note: *"mogelijk een vroeg-symptoom in plaats van oorzaak"*.
- Cafeïne in hoge doses (>400mg/dag)
- **MSG (monosodium glutamate)**: NIET rood. Verwijderd van score-3 whitelist 2026-05 na review van Obayashi 2016 SR (PMC4870486) + Geha 2000 (PMID 10736382) + ICHD-3 2018-revisie (MSG geschrapt van officiële triggerlijst). In geblindeerde studies geen reproduceerbaar effect bij normale voedselinname. Score 2 met `triggerType: subgroep-overschat` is de standaard voor MSG.
- **Gerijpte kaas (>6 maanden rijping)**: NIET rood. Verwijderd van score-3 whitelist 2026-05 (interne paradigma-extensie — geen formele guideline-revisie). Tyramine wordt bij intacte MAO-functie in darmwand/lever geïnactiveerd; effect alleen klinisch relevant in MAO-A-gevoelige subgroep of bij MAO-remmer-gebruik. Geen moderne provocatie-RCT beschikbaar. Bronnen: Finberg 2022 (PMC9172554), Maintz 2007 (PMID 17490952). Score 2 met `triggerType: subgroep-overschat`.

**Alle overige items: 0 (groen)** tenzij specifiek onderzoek anders aangeeft.

**Evidence-default:** B of C. Score = 3 vereist evidence ≥ B met expliciete bron.

### 2.2.1 — TriggerType-enum

Het `triggerType`-veld op een ScoreObject classificeert hoe een trigger zich gedraagt. Acht waarden, conform `src/schemas/item.ts` regels 21-30. Documentatie hieronder loopt in de pas met het schema sinds v1.5.

| Waarde | Definitie | Voorbeeld-cluster |
|---|---|---|
| `populatiebreed` | Mechanisme reproduceerbaar over brede populaties bij voldoende dosis; niet gebonden aan een geïdentificeerde subgroep. Direct farmacologisch. Claimt géén reactie bij iedere patiënt — wel afwezigheid van een subgroep-grens. | Bier (ethanol-mechanisme, cluster 11/12, PR #14) |
| `subgroep-bevestigd` | Welomschreven subgroep met bewezen reproduceerbare reactie. Subgroep gedefinieerd door duidelijke biologische factor (bv. enzymdeficiëntie). | Paté/leverworst sub-Henderson nitriet (cluster 7); Marmite/Vegemite tyramine (cluster 18, PR #18) |
| `subgroep-overschat` | Effect alleen in subgroep, in algemene populatie overschat. Zelfrapportage-rate hoog, geblindeerde reproduceerbaarheid laag. | MSG (PR #17), rode wijn (cluster 11/12), gerijpte kaas (PR #22) |
| `dosis-afhankelijk` | Effect treedt op boven specifieke dosis-drempel; onder drempel geen effect. | Spek/bacon Henderson-drempel (cluster 7); bietensap geconcentreerd (cluster 9, PR #28) |
| `onttrekkings-trigger` | Trigger door staken of verminderen van inname, niet door inname zelf. | Cafeïne (cluster 1) |
| `drug-interactie` | Trigger alleen in combinatie met specifieke medicatie. Gereserveerd voor toekomstig gebruik (momenteel 0 items in DB). Mogelijke toepassing: MAO-remmer + tyramine-rijke voeding. | (gereserveerd) |
| `context-afhankelijk` | Trigger-status hangt af van consumptie-context (combinatie met andere stoffen, timing t.o.v. maaltijd, fysieke staat), niet van persoonseigenschappen. Onderscheid met `subgroep-bevestigd`: subgroep zit in persoon, context zit in situatie. | (gereserveerd voor toekomstige clusters; eerder gebruikt voor Marmite/Vegemite vóór PR #18-hertoewijzing) |
| `individueel-variabel` | Modulerende factor varieert continu zonder welomschreven subgroep-grens. Effect-grootte verschilt per individu maar geen scherpe ja/nee-dichotomie. | Nitraatrijke groenten (cluster 9, microbioom-conversie-capaciteit als continue modulator, PR #28) |

**Kritisch onderscheid: `subgroep-bevestigd` vs `individueel-variabel`:**

- `subgroep-bevestigd`: subgroep is **welomschreven**. Voorbeeld: MAO-A-deficiëntie of DAO-deficiëntie zijn binaire eigenschappen — iemand heeft het of heeft het niet. Effect binnen subgroep reproduceerbaar.
- `individueel-variabel`: modulerende factor varieert **continu**. Voorbeeld: orale microbioom-samenstelling (cluster 9) — geen dichotome "wel/niet"-categorie, alleen een spectrum van conversie-capaciteit. Effect-grootte verschilt per individu langs een gradient.

**Kritisch onderscheid: `subgroep-bevestigd` vs `context-afhankelijk`:**

- `subgroep-bevestigd`: variabele zit in de **persoon** (enzymdeficiëntie, microbioom-status, genetica).
- `context-afhankelijk`: variabele zit in de **situatie** (combinatie met andere voeding, timing, lege/volle maag).

### 2.2.2 — Evidence-C-only clusters

Sommige clusters bevatten geen items met evidence-grade A of B. Dit treedt op wanneer:
- Geen RCT met het cluster-onderwerp als interventie en migraine als endpoint
- Geen formele SR met deze specifieke vraagstelling
- Wel mechanistische plausibility + observationele studies (eventueel met methodologische beperkingen erkend door de auteurs zelf)

**Scoring-regels voor evidence-C-only clusters:**
- Score-plafond standaard 1
- Score 2 alleen voor dosis-uitzonderingen waar geconcentreerde producten mechanistisch Henderson-equivalente niveaus benaderen
- Score 3 niet toegestaan binnen evidence-C-only cluster
- TriggerType bij voorkeur `individueel-variabel` of `dosis-afhankelijk` (niet `subgroep-bevestigd`, want subgroep is niet welomschreven)

**Precedent:** cluster 9 (nitraatrijke groenten), geïntroduceerd in PR #28 (2026-05-21). Gebaseerd op Gonzalez 2016 (PMID 27822557) + Gonzalez correctie 2017 (PMID 28428981) + Lundberg 2008 NO-pathway (PMID 18167491) + Webb 2008 bietensap acute effecten (PMID 18250365) + Hord 2009 nitraat-content tabel (PMID 19439460) + Hindiyeh 2020 algemene review (PMC7496357).

**Toekomstige clusters waar directe migraine-evidence ontbreekt moeten naar deze norm verwijzen.**

### 2.3 Nierstenen (calciumoxalaat — meest voorkomend)

**Primaire bron:** Harvard Oxalate Table 2023 (UAB Knight Lab).
**Aanvullend:** USDA FDC voor natrium/calcium, AUA Guideline, EAU Urolithiasis.

**Drempels (mg oxalaat per standaardportie):**
- `< 10` → 0
- `10–25` → 1
- `25–50` → 2
- `> 50` → 3

**Modifier:** natrium > 600mg per portie → +1 punt (max 3).

**Verplichte regel-overrides:**
- **Hoge-calciumitems = 0 (groen).** Normale calciuminname (1000–1200mg/dag) *verlaagt* risico (Borghi RCT, AUA-guideline). Lage-calciumdieet NIET adviseren.
- **Vitamine C supplementen = 3.** Omzetting naar oxalaat.
- **Onvoldoende vocht-waarschuwing** apart in UI, niet als score per item.

**Evidence-default:** A (Harvard direct) of B.

### 2.4 Histamine-intolerantie

**Bronnen:**
- Primair: **SIGHI Compatibility List 2023** (zie licentie-noot hieronder).
- Kwantitatief: Brazilian systematic review 2024 (343 items met HPLC-data).
- Consensus: Montreux Consensus 2024, DGAKI.

**⚠️ SIGHI LICENTIE-STATUS: AANGEVRAAGD.**
SIGHI vereist schriftelijke toestemming voor commercieel gebruik. Mail door Peter te versturen — zie `acties-peter.md`. Data wordt opgenomen onder voorbehoud (gedocumenteerd in `RISKS.md`).

**Score-overname:** SIGHI 0–3 schaal direct toepasbaar.

**Aanvullende velden per item:**
- `liberator: boolean` (citrus, aardbei, tomaat, chocolade, etc.)
- `daoBlocker: boolean` (alcohol, zwarte/groene thee, energy drinks)

**Tegenstrijdigheden expliciet markeren:**
- Citrus: SIGHI labelt vaak hoog, maar San Mauro 2021 (Nutrients) toont dat ~53% van geëxcludeerde voeding geen meetbare histamine heeft. Note toevoegen: *"omstreden — beperkte directe histamine-evidence"*.

**Evidence-default:** B (consensus) of C (anekdotisch). Vrijwel nooit A.

---

## 3. Database schema

Elk item is een TypeScript object dat aan dit Zod-schema voldoet. **CI faalt bij elke afwijking.**

```ts
// src/schemas/item.ts
type FoodItem = {
  id: string;                           // USDA FDC ID als primary key
  nevoCode?: string;                    // NL-alias
  name: { nl: string; en: string };
  category: Category;                   // enum, zie 3.1
  subcategory?: string;                 // vrij tekstveld, optioneel
  scores: {
    jicht:      ScoreObject | null;
    migraine:   ScoreObject | null;
    nierstenen: ScoreObject | null;
    histamine:  ScoreObject | null;
  };
  histamineFlags?: {
    liberator: boolean;
    daoBlocker: boolean;
  };
  meta: {
    addedAt: string;                    // ISO date
    schemaVersion: string;              // semver
    lastReviewed: string;               // ISO date
  };
};

type ScoreObject = {
  score: 0 | 1 | 2 | 3;
  evidence: 'A' | 'B' | 'C' | 'onbekend';
  sources: Source[];                    // minimaal 1
  note?: { nl: string; en?: string };
  confidence?: 'laag' | 'middel' | 'hoog';  // default impliciet 'middel'
  triggerType?: TriggerType;            // alleen migraine — zie §2.2.1
  primaryModulators?: string[];         // max 3; slug-formaat [a-z0-9-]
};

type Source = {
  url: string;                          // moet HTTP 200 returnen in CI
  title: string;
  type: 'database' | 'guideline' | 'review' | 'consensus' | 'meta-analysis';
  accessedAt: string;                   // ISO date
};
```

### 3.3 Optionele ScoreObject-velden

| Veld | Type | Gebruik |
|---|---|---|
| `confidence` | `'laag' \| 'middel' \| 'hoog'` | Mate van zekerheid over de score, los van evidence-grade. `laag` = tegenstrijdige studies of beperkte n; `middel` = default als weggelaten; `hoog` = consistente A/B-bronnen. |
| `triggerType` | `TriggerType` (8 waarden) | Classificeert het triggermechanisme. **Alleen op migraine-scores.** Verplicht bij score ≥ 2 voor migraine. Definities in §2.2.1. |
| `primaryModulators` | `string[]` (max 3) | Slug-formaat `[a-z0-9-]`. Benoemt de voornaamste modulerende factoren bij `individueel-variabel` of `context-afhankelijk` triggerType. Voorbeeld: `["microbioom", "nitraat-conversie"]`. |

### 3.1 Toegestane categorieën
`groente | fruit | granen | peulvruchten | noten-zaden | vlees | vis-schaaldieren | zuivel | eieren | dranken-alcohol | dranken-non-alcohol | zoetwaren | sauzen-kruiden | bereid-gerecht | overig`

### 3.2 Bestandsstructuur
Items worden opgeslagen in `src/data/<categorie>.json` (één JSON-bestand per categorie). Alle bestanden samen vormen de database. Geen externe DB voor MVP.

---

## 4. CI Validation Gates

Een PR mag **alleen automatisch mergen** als al deze checks groen zijn. Geen menselijke review-stap.

### 4.1 Schema-checks (verplicht)
1. Zod-validatie op elk item.
2. **Minstens 2 van 4 aandoeningen gescoord** per item (rest mag `null` met `evidence: 'onbekend'`).
3. Elke non-null score heeft `evidence` ∈ {A,B,C} én minstens 1 source.
4. Elke source-URL: HTTP HEAD/GET geeft 200 (cached, timeout 10s).
5. `id` is een geldige USDA FDC ID (numeriek) OF prefix `nl-` voor NL-specifieke items zonder FDC-equivalent.

### 4.2 Regression-tests (achterhaalde aannames)
6. **Koffie-items jicht ≤ 1.** (geen rood)
7. **Chocolade migraine ≠ 3.** (max oranje, met note)
8. **Hoge-calcium items (>200mg/100g) nierstenen ≤ 1.** (geen oranje/rood vanwege calcium alleen)

### 4.3 Whitelist-check
9. Migraine score = 3 alleen voor stoffen op de migraine-whitelist (sectie 2.2).

### 4.4 Bron-kwaliteit
10. Score = 3 vereist evidence ≥ B.
11. Evidence A alleen toegestaan bij verwijzing naar USDA, Harvard Oxalate Table, NEVO, of peer-reviewed meta-analyse.

### 4.5 Code-checks
12. TypeScript: `tsc --noEmit` zonder errors.
13. ESLint zonder errors.
14. Vitest unit tests groen.
15. Playwright e2e tests groen (golden paths: onboarding, zoeken, profielwissel, menuscan, bronnenexport).
16. Bundle size budget niet overschreden.

### 4.6 Auto-merge regel
Als alle 16 checks groen zijn én PR-author is in `trusted-authors.json` (Cowork bot + Claude Code service account) → **auto-merge**. Anders blijft PR open en stuurt CI Sentry-melding naar Peter.

---

## 5. Ruggengraat-bronnen (verplicht in `sources[]` waar van toepassing)

| Aandoening | Primair | Aanvullend |
|---|---|---|
| Jicht | USDA Purine DB 2.0 (CC0) | Kaneko HPLC, EULAR 2022 |
| Nierstenen | Harvard Oxalate Table 2023 | USDA FDC, AUA Guideline |
| Histamine | SIGHI 2023 (licentie pending) | Brazilian SR 2024, Montreux Consensus |
| Migraine | Hindiyeh 2020 SR | AMF, Migraine Trust, RCTs |
| Algemeen | USDA FoodData Central | NEVO 2025 (NL-aliassen) |

---

## 6. Cowork-instructies

**MAG:**
- Nieuwe items voorstellen + scoren (alle 4 aandoeningen overwegen).
- Bestaande items aanvullen waar scores `null` zijn.
- Bronnen ophalen + valideren.
- PR openen naar `main` met data-changes.

**MAG NIET:**
- Bestaande scores wijzigen tenzij regel in CLAUDE.md is gewijzigd.
- Drempels of regel-overrides aanpassen (alleen Peter via CLAUDE.md update).
- Items committen zonder bronvermelding.
- Score = 3 toekennen aan iets buiten de whitelist (migraine).
- Direct naar main pushen — altijd via PR.

**MOET:**
- Per item alle 4 aandoeningen overwegen, expliciet `null` markeren waar data ontbreekt.
- Minstens 1 ruggengraat-bron citeren per score.
- Engelstalige én Nederlandstalige bronnen overwegen (internationale schaalbaarheid).
- Batches van ~25 items per PR (CI-doorvoer + leesbare diff).

---

## 7. Database-groeitarget

| Fase | Items | Focus | Termijn |
|---|---|---|---|
| 1 | 150 | Sweet spot — alle 4 aandoeningen scorebaar | 1–2 weken |
| 2 | 300 | NL-supermarkt dekking | 4–6 weken |
| 3 | 500 (bereikt) | Voltooien USDA Purine + Harvard Oxalate | afgerond |
| 4 | 700 (cap bereikt) | Ontbrekende categorieën: eieren, bereid-gerecht, vis-schaaldieren | afgerond 2026-05-23 |

**Boven 700 items: NIET groeien.** Boven dit aantal zijn alleen nog USDA Branded Foods beschikbaar, waar 50%+ geen purine-/oxalaat-/histaminedata heeft. Kwaliteit > kwantiteit. Cap verhoogd van 500 → 700 op 2026-05-18 om ruimte te maken voor de categorieën eieren, bereid-gerecht en vis-schaaldieren (akkoord: Peter Wolterman).

**Cap bereikt op 2026-05-23 (700 items).** Databasegroei is voltooid; verdere wijzigingen aan de data zijn correcties/kwaliteitsverbeteringen, geen nieuwe items.

---

## 8. Profielkoppeling (gebruikersgericht)

**Admin-uitzondering:** één admin-gebruiker (Productie@triggermenu.nl) heeft via Supabase Auth toegang tot `/admin` voor feedback-inzicht en rate-limit-beheer. Auth-gate is aanwezig maar nog niet actief (zie TODO-comment in `src/App.tsx`). Eindgebruikers blijven zonder account werken; hun profiel staat in localStorage. Admin-accounts worden handmatig aangemaakt in Supabase — zie acties-peter.md C-2 voor instructies.

Het actieve profiel (1+ gekozen aandoeningen) is **leidend voor alle weergave**:

- **Zoek:** toont alleen scores voor gekozen aandoeningen.
- **Menuscan:** Anthropic API-prompt bevat het profiel; AI scoort alleen voor déze gebruiker.
- **Bronnen pagina:** filtert op aandoeningen + toont gemeenschappelijke methodologie.
- **Export:** bevat alleen relevante aandoeningen.

Profiel opgeslagen in `localStorage`. Aanpasbaar via Instellingen. Geen accountverplichting voor MVP.

### Combinatie-score
Bij meerdere aandoeningen:
- Gecombineerde score = `max(actieve scores)`
- **Maar:** als er conflict is (bv. groen voor de één, rood voor de ander), UI toont expliciet **"⚠ tegenstrijdig: zie details"** + per aandoening uitsplitsing.
- Niet wegmiddelen. Gebruiker moet conflict zien.

---

## 9. Tech stack & architectuur

### Stack
- **Frontend:** Vite + React + TypeScript
- **Styling:** TailwindCSS
- **State:** React state + localStorage (MVP)
- **i18n:** `i18next` — NL default, EN-keys vanaf dag 1 voorbereid
- **Validatie:** Zod (compile-time + runtime)
- **Tests:** Vitest (unit), Playwright (e2e)
- **Hosting:** Vercel (static + serverless functions)
- **Error tracking:** Sentry (gratis tier)
- **Analytics:** Vercel Analytics + Vercel Speed Insights (gratis tier 25k events/maand, cookieloze tracking, Core Web Vitals erbij)
- **CI/CD:** GitHub Actions → Vercel auto-deploy
- **Repo structuur:** zie sectie 11

### Principes
1. **Database = single source of truth** (JSON in repo, versioned via git).
2. **USDA FDC ID = primary key.** NEVO-code als alias-veld.
3. **API key NOOIT client-side.** Anthropic calls via `api/menuscan.ts` (Vercel function).
4. **Rate limiting** op menuscan endpoint: 12 scans/uur per IP via **Supabase** (`rate_limits` tabel, EU-regio). Geen magic link of wachtwoord — open maar gelimiteerd. Budget cap op Anthropic dashboard als financiële achtervang (acties-peter.md A-5).
5. **Geen auth op menuscan voor MVP.** Magic link was overwogen maar vervangen door IP-rate-limiting (eenvoudiger, geen account-verplichting). Bij accounts later: rate limiting per gebruiker i.p.v. per IP (zie RISKS.md R-007).
6. **i18n hooks vanaf dag 1** — alle UI-strings via `t()`.
7. **Print-stylesheet voor PDF export** — geen PDF-library nodig.
8. **PWA-manifest** vanaf dag 1 — homescreen-installatie op iPhone werkt.

---

## 10. Disclaimer & compliance

### MDR-status
**In onderzoek door Peter.** Tot uitsluitsel: app gedraagt zich conservatief en presenteert zich expliciet als *informatieve beslishulp*, niet als medisch hulpmiddel.

### Bedoeld gebruik — populatieniveau
De stoplichten zijn **populatie-inschattingen** op basis van de best beschikbare evidence, géén individueel medisch verdict. Individuele respons varieert — sterk bij migraine (subgroep-/individueel-variabele triggers, §2.2.1) en histamine (individuele DAO-drempels). De app ondersteunt snelle keuzes (§1) en is geen eliminatie-/provocatietraject onder begeleiding. De UI maakt deze variabiliteit zichtbaar via triggerType-classificatie en een expliciete *"respons verschilt per persoon"*-hint bij variabele-respons-triggers (RISKS.md R-009). Deze framing onderschrijft de conservatieve MDR-positie: informeren, niet diagnosticeren of behandelen.

### Verplichte UX-elementen
- **Onboarding-disclaimer:** vóór eerste gebruik, vereist expliciet akkoord (checkbox).
  - Tekst: *"Deze app biedt informatie als hulp bij voedingskeuzes, geen medisch advies. Overleg met arts of diëtist bij twijfel of klachten."*
- **Footer:** disclaimer-link op elk scherm.
- **Methodologie-pagina:** exporteerbaar (print → PDF) zodat gebruiker kan tonen aan arts/diëtist welke bronnen gebruikt zijn.
- **Per-score evidence-badge:** A/B/C zichtbaar — gebruiker ziet altijd wat de onderbouwing is.

---

## 11. Repo structuur

```
voedingsapp/
├── CLAUDE.md                    # dit bestand — operationeel handboek
├── RISKS.md                     # open risico's (SIGHI, MDR, migraine-evidence)
├── methodologie.md              # diëtist-leesbare uitleg van de scoringsmethode (bronvermeld)
├── acties-peter.md              # Peters actiepunten (concreet, kort)
├── README.md                    # publiek leesbaar overzicht
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example                 # ANTHROPIC_API_KEY, SENTRY_DSN, etc.
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/                    # database JSON per categorie
│   │   ├── groente.json
│   │   ├── fruit.json
│   │   └── ...
│   ├── schemas/
│   │   └── item.ts              # Zod schema's
│   ├── components/              # UI-componenten
│   ├── pages/                   # zoek, scan, bronnen, instellingen, onboarding
│   ├── lib/                     # scoring, profielkoppeling, export
│   ├── i18n/
│   │   ├── nl.json
│   │   └── en.json
│   └── styles/                  # incl. print.css
├── api/
│   ├── menuscan.ts              # Anthropic proxy + rate limit + auth
│   ├── feedback.ts              # feedback opslaan (Supabase, service role)
│   ├── _lib/
│   │   └── requireAdmin.ts      # middleware: controleert Supabase Bearer token + is_admin
│   └── admin/
│       ├── feedback.ts          # GET feedback inbox (admin only)
│       ├── rate-limits.ts       # GET rate limits per IP — laatste 24u (admin only)
│       └── reset-rate-limit.ts  # POST reset rate limit voor IP (admin only)
├── tests/
│   ├── unit/                    # Vitest
│   └── e2e/                     # Playwright
├── scripts/
│   ├── validate-db.ts           # gebruikt in CI
│   └── check-sources.ts         # URL-bereikbaarheid
├── trusted-authors.json         # PR auto-merge whitelist
└── .github/workflows/
    ├── ci.yml                   # lint, types, unit, e2e, db-validate, source-check
    ├── auto-merge.yml           # merge bij groen + trusted author
    └── deploy.yml               # Vercel deploy (auto bij merge main)
```

---

## 12. Tegenstrijdige bronnen — vastgestelde weging

Deze weging is **definitief** tenzij CLAUDE.md wordt aangepast. Cowork mag hier niet van afwijken zonder voorstel naar Peter.

| Onderwerp | Conflict | Onze weging | Reden |
|---|---|---|---|
| Koffie ↔ jicht | Oude richtlijnen: rood. Recent: beschermend. | **Groen** | Shirai 2022 MR, meta-analyse 2025 |
| Citrus ↔ histamine | SIGHI: hoog. San Mauro 2021: lage evidence. | **Oranje + note "omstreden"** | Beperkte directe histamine-data |
| Calcium ↔ nierstenen | Oud advies: laag Ca. Modern: normaal Ca. | **Groen bij normale inname** | Borghi RCT, AUA-guideline |
| Chocolade ↔ migraine | Trigger-lijsten: rood. 2023 SR: prodroom-craving. | **Oranje + note** | Hindiyeh 2020, recente SR |
| MSG ↔ migraine | Whitelist (oud): rood. SR 2016 + ICHD-3 2018: geen reproduceerbaar effect. | **Oranje + note "subgroep-overschat"** | Obayashi 2016 SR, Geha 2000, ICHD-3 2018 |
| Gerijpte kaas ↔ migraine | Klassiek: rood (Hannington 1967, Sandler 1974). Modern: MAO-functie neutraliseert tyramine; geen RCT. | **Oranje + note "subgroep-overschat"** | Finberg 2022 (PMC9172554), Maintz 2007 (PMID 17490952); interne paradigma-extensie 2026-05 |
| Peulvruchten ↔ jicht | Hoog purine. Geen verhoogd risico. | **Drempel volgen, geplafonneerd op 2** (laag-purine → 1) | Choi 2004 (NEJM), EULAR 2022 |
| Gedistilleerd ↔ migraine | §2.2 (oud): rood. Onderwater 2019: wodka mínst provocerend (8,5%) vs rode wijn 77,8% — trigger zit in congeneren, niet ethanol. | **Oranje + note "subgroep-overschat"** | Onderwater 2019 (PMID 31254436), Vives-Mestres 2022 (PMC10099573), wijn-meta-analyse 2025 |

---

## 13. Paradigma-precedenten

Chronologisch register van methodologische paradigmawijzigingen. **Bedoeld voor Cowork-agenten:** wanneer een nieuw item lijkt op een precedent hieronder, volg het bijbehorende paradigma zonder nieuwe deliberatie.

Verschil met §12 (Tegenstrijdige bronnen): §12 registreert *item-niveau* beslissingen (weging voor specifiek voedingsmiddel). §13 registreert *methodologische* paradigma's (hoe een hele klasse van evidentie te wegen).

| Datum | Onderwerp | Beslissing | Generaliseerbare regel | Versie |
|---|---|---|---|---|
| 2026-05 | Koffie ↔ jicht | Score 0 (beschermend). MR-data overwint oudere observationele richtlijnen. | Mechanistisch sterke MR-data > correlationele richtlijnen bij tegenstrijdigheid. | v1.0 |
| 2026-05 | Calcium ↔ nierstenen | Score 0 bij normale calciuminname. Borghi RCT: risicoverlaging; oud laag-Ca-advies achterhaald. | RCT met directe endpoint (steenvorming) > oud dieetadvies op correlatie. | v1.0 |
| 2026-05 | Peulvruchten ↔ jicht | Max score 2 ondanks hoog purine. EULAR 2022: geen verhoogd epidemiologisch risico. | Epidemiologische uitkomstdata > biochemische samenstelling alleen. | v1.0 |
| 2026-05-20 | MSG ↔ migraine | Score 2 + `subgroep-overschat`. Geblindeerde studies: geen reproduceerbaar effect bij normale inname. Van score-3 whitelist verwijderd (v1.3). | Geblindeerde provocatie-RCT overrulet open-label observaties. ICHD-3-revisie is leidend boven klassieke trigger-lijsten. | v1.3 |
| 2026-05-20 | Gerijpte kaas ↔ migraine | Score 2 + `subgroep-overschat`. MAO-functie neutraliseert tyramine bij intacte enzymstatus; effect alleen in MAO-A-gevoelige subgroep. Van score-3 whitelist verwijderd (v1.4). | Mechanistisch inzicht in inactivatie-pathway > klassieke observationele trigger-lijsten (Hannington 1967-stijl). | v1.4 |
| 2026-05-21 | Evidence-C-only clusters — cluster 9 | Score-plafond 1; score 2 alleen bij dosis-uitzonderingen; score 3 verboden. TriggerType `individueel-variabel`. Volledig paradigma in §2.2.2. | Clusters zonder A/B-evidence: mechanistische plausibility + observationeel = max score 1 zonder RCT-ondersteuning. | v1.5 |
| 2026-06-04 | Gedistilleerd ↔ migraine | Score 2 + `subgroep-overschat`. Wodka (vrijwel pure ethanol) is mínst provocerende drank — de reproduceerbare trigger zit in dranksspecifieke congeneren/biogene aminen, niet in ethanol. Van score-3 whitelist verwijderd (v2.0); bier blijft als enige alcohol score 3. | Beverage-specifieke congeneren-/ALDH2-evidence > generiek ethanol-vasodilatatie-argument; een `subgroep-*` triggerType sluit score 3 uit (toelatingscriterium 3). | v2.0 |

---

## 14. Open risico's

Zie `RISKS.md` voor volledig overzicht. Bij goedkeuring CLAUDE.md erkend:
- SIGHI commerciële licentie nog niet bevestigd → data opgenomen onder voorbehoud.
- MDR-classificatie nog niet bepaald → app gedraagt zich conservatief.
- Migraine evidence inherent zwak → gemitigeerd via lage drempels voor score=3 en zichtbare evidence-badges.
- Methodologische governance bij één auteur zonder externe domeinvalidatie (R-008) → gemitigeerd via auditeerbaar besluitspoor (§12/§13), evidence/confidence-badges en exporteerbare methodologie; externe review aanbevolen vóór commercieel gebruik.
- UX — populatie- vs individuniveau-misinterpretatie (R-009) → gemitigeerd via triggerType-zichtbaarheid, badges, disclaimer en de "respons verschilt per persoon"-hint (§10 Bedoeld gebruik).

---

## 15. Versiebeheer van dit document

- **Schema version:** v2.4
- **Laatste wijziging:** 2026-06-04
- **Wijzigingen:** alleen door Peter, met expliciete akkoordregistratie in commit message.
  - v1.1 (2026-05-15): §9 principes 4+5 — rate limiting via Supabase i.p.v. Vercel KV/Upstash; magic link auth vervangen door IP-limiet. Akkoord: Peter Wolterman (chat 2026-05-15).
  - v1.2 (2026-05-18): §7 database-cap verhoogd van 500 → 700 voor ontbrekende categorieën (eieren, bereid-gerecht, vis-schaaldieren). Fase 4 toegevoegd. Akkoord: Peter Wolterman (chat 2026-05-18).
  - v1.3 (2026-05-20): §2.2 MSG verwijderd van score-3 whitelist; score 2 + subgroep-overschat is nu standaard. Akkoord: Peter Wolterman (chat 2026-05-20, review PR #15 methodologische bevinding).
  - v1.4 (2026-05-20): §2.2 whitelist-audit — whitelist gecondenseerd naar 2 stoffen (was 3): alcohol-ethanol + gecureerd vlees boven Henderson-drempel. Gerijpte kaas verwijderd van whitelist (interne paradigma-extensie; Finberg 2022 + subgroep-overschat-toets; geen formele guideline-revisie). §2.2 formuleringen gepreciseerd: ethanol-mechanisme + Henderson-drempel expliciet. §12 uitgebreid met gerijpte-kaas-bronconflict. Akkoord: Peter Wolterman (chat 2026-05-20).
  - v1.5 (2026-05-21): TriggerType-enum documentatie + evidence-C-only paradigma. Nieuwe subsectie §2.2.1 TriggerType-enum met alle 8 waarden uit src/schemas/item.ts — schema en documentatie nu in de pas; CLAUDE.md liep achter sinds eerder schema-werk (PR #28 introduceerde `individueel-variabel` + `dosis-afhankelijk` impliciet maar updatete §2.2 niet). Evidence-C-only cluster-paradigma vastgelegd als formeel principe in §2.2.2: score-plafond 1, score 2 alleen voor dosis-uitzonderingen, cluster 9 als precedent. Onderscheid `subgroep-bevestigd` (welomschreven subgroep) vs `individueel-variabel` (continue modulerende factor) vs `context-afhankelijk` (situatievariabele) expliciet gedocumenteerd. `context-afhankelijk` en `drug-interactie` behouden als gereserveerde enum-waarden (0 items in DB). Geen data-wijzigingen — uitsluitend documentatie. Akkoord: Peter Wolterman (chat 2026-05-21).
  - v1.7 (2026-05-21): Nieuwe §13 Paradigma-precedenten. Chronologisch register van 6 methodologische paradigmawijzigingen (v1.0–v1.5). Onderscheid met §12 (item-niveau) expliciet. Versiebeheer hernoemd van §14 → §15. Geen data-wijzigingen. Akkoord: Peter Wolterman (chat 2026-05-21).
  - v1.6 (2026-05-21): §3 ScoreObject volledig gedocumenteerd. `confidence`, `triggerType`, `primaryModulators` toegevoegd aan type-definitie + nieuwe §3.3 met veldbeschrijvingen. `subcategory` op FoodItem toegevoegd (was al in schema). Geen data-wijzigingen. Akkoord: Peter Wolterman (chat 2026-05-21).
  - v1.8 (2026-05-23): TriggerType-enumwaarde `universeel` → `populatiebreed` hernoemd (regulatoire defensibility — "universeel" suggereerde reactie bij iedere patiënt; "populatiebreed" claimt reproduceerbaarheid over brede populaties zonder subgroep-grens, conform de reeds bestaande definitie). Doorgevoerd in `src/schemas/item.ts`, 7 bier/alcohol-items in `dranken-alcohol.json` (scores ongewijzigd — alléén label), UI-labelmap `ItemDetailPanel.tsx`, §2.2 + enum-tabel §2.2.1. Nieuw: expliciete 5-punts toelatingschecklist voor score-3-whitelist in §2.2 (consolideert verspreide criteria; geen inhoudelijke verzwaring). Geen scorewijzigingen. Akkoord: Peter Wolterman (chat 2026-05-23, review extern feedbackdocument).
  - v1.9 (2026-05-23): Consistentie-sync na fase-4-afronding + reviewpunten. §7: fase 4 op "cap bereikt (700, afgerond 2026-05-23)" — databasegroei voltooid. §10: nieuwe subsectie "Bedoeld gebruik — populatieniveau" (stoplichten zijn populatie-inschattingen, geen individueel verdict; individuele respons varieert; onderschrijft conservatieve MDR-positie). §14: twee nieuwe risico's erkend — R-008 (methodologische governance bij één auteur, gemitigeerd via §12/§13-audit-trail + externe-review-aanbeveling) en R-009 (populatie-vs-individu-misinterpretatie, gemitigeerd via triggerType-zichtbaarheid + UI-hint). Bijbehorende R-008/R-009 staan volledig in RISKS.md; UI-hint "respons verschilt per persoon" in `ItemDetailPanel.tsx`. Geen scoring-/drempelwijzigingen. Akkoord: Peter Wolterman (chat 2026-05-23, keuze "Sync + intended-use").
  - v2.4 (2026-06-04): Migraine-as consistent gemaakt met criterium 3 + nieuwe CI-gate. Audit toonde 3 gecureerd-vlees-items op score 3 met triggerType `subgroep-bevestigd` — strijdig met §2.2 criterium 3 (score 3 ⇒ populatiebreed/dosis-afhankelijk). **Spek + bacon → `dosis-afhankelijk`** (matcht hun Henderson-dosis-note + §2.2.1-voorbeeld; score 3 blijft). **Rookworst → score 2 + `subgroep-bevestigd`** (sub-Henderson, zoals salami/chorizo/paté; note beschreef al een subgroep-effect zonder dosisfiguur — Peters keuze "B"). Nieuwe **CI-gate 9b** in `scripts/validate-db.ts`: migraine score 3 vereist triggerType populatiebreed/dosis-afhankelijk — bewaakt criterium 3 automatisch. Resultaat: alle 8 migraine-score-3-items compliant (6 bier=populatiebreed, 2 spek=dosis-afhankelijk). Akkoord: Peter Wolterman (chat 2026-06-04, keuze "B").
  - v2.3 (2026-06-04): Jicht-as volledig consistent gemaakt (laatste afwijkingen) + amandelmelk-conflict opgelost. Na een complete DB-brede consistentiescan (robuuste parser voor `<`/`>`/decimaalkomma) resteerden 3 punten, alle evidence-gedreven rechtgetrokken: (1) **tamarinde** jicht 1→0 (<50 mg, vruchtvlees); (2) **gerookte zalm** jicht 2→3 — roken concentreert purine tot >200 mg/100g (~300), eerdere note (~170) was de verse-zalm-waarde; (3) **amandelmelk** nierstenen-conflict opgelost: oxalaat ~27–50 mg/kop (gespecialiseerde nierstenen-diëtistenbron) → §2.3-drempel score 2; zuivel-versie 1→2 gecorrigeerd, noten-zaden-duplicaat verwijderd (almond milk hoort als drank bij de plantaardige melken in zuivel). **Zalm in blik bewust ongewijzigd** (score 2): evidence tegenstrijdig (USDA 13 mg vs "vergelijkbaar met vers ~150"). Resultaat: 0 jicht note-vs-drempel-afwijkingen DB-breed, 0 cross-file duplicaten, 669 items. Geen nieuwe paradigma's. Akkoord: Peter Wolterman (chat 2026-06-04, "ik wil consequent zijn").
  - v2.2 (2026-06-04): Jicht-consistentie-correctie (8 niet-peulvrucht-items uit bron-inhoudsverificatie) + nieuwe `methodologie.md` (diëtist-leesbare uitleg). **Score-wijzigingen (drempel gevolgd):** asperges 23mg 1→0, waterkers 34mg 1→0, oesters 90mg 2→1, krab blik 150-180mg 3→2, langoustine 140mg 3→2, wild zwijn ~200mg 3→2. **Note-correcties (score blijft 2):** gebakken zalm + gravad lax noteerden onjuist "70-90 mg" terwijl gekookte/rauwe zalm 150-210 mg is (USDA) — note gecorrigeerd, score 2 was al correct. Choi 2004 toegevoegd aan asperges/waterkers/wild-zwijn. `methodologie.md` aangemaakt: leesbare uitleg van de scoringsmethode per aandoening met bronnen, bedoeld om te delen met diëtisten/artsen (sluit open actiepunt "methodologie.md ontbreekt"). Geen nieuwe paradigma's — uitsluitend §2.1-drempel toegepast. Akkoord: Peter Wolterman (chat 2026-06-04, "ja" + diëtist-vastlegging).
  - v2.1 (2026-06-04): §2.1 **peulvruchten-regel verduidelijkt: "max 2" → "drempel toepassen, geplafonneerd op 2"**. De oude formulering werd in de data als "altijd 2" toegepast (33/35 peulvruchten op oranje ongeacht puringehalte), terwijl "max 2" een plafond is. Verificatie (bron-inhoudscheck) toonde 19 laag-purine peulvruchten (<100 mg: bonen, tofu, tempeh, miso, natto, erwten, hummus e.d.) met score 2 terwijl hun eigen genoteerde USDA-waarde score 1 impliceert. Onderbouwing: Choi 2004 (NEJM, PMID 15014182, n=47.150) — purinerijke groente/peulvruchten geven géén verhoogd jichtrisico (vlees RR 1,41 / vis 1,51 wél); conform §13-paradigma. **19 peulvruchten jicht 2 → 1** in `peulvruchten.json`; notes herschreven; Choi 2004 als bron toegevoegd; natto-HPLC-waarde (56,6 mg) toegevoegd. Hoog-purine soorten (≥100 mg: linzen, kikkererwten, sojabonen, kapucijners) blijven op plafond 2. §12 + §13-rij bijgewerkt. Akkoord: Peter Wolterman (chat 2026-06-04, na "wat adviseer je" → "doen").
  - v2.0 (2026-06-04): §2.2 **gedistilleerd (whisky, gin, wodka, rum, e.d.) en versterkte wijn verwijderd van score-3 whitelist** — score 2 + `subgroep-overschat` is nu de standaard; bier blijft als enige alcohol op de score-3-whitelist. Onderbouwing: Onderwater 2019 (PMID 31254436) — wodka (vrijwel pure ethanol) is de mínst provocerende drank (8,5%) vs rode wijn 77,8%, dus de reproduceerbare trigger zit in dranksspecifieke congeneren/biogene aminen, niet in ethanol; Vives-Mestres 2022 (PMC10099573, prospectief) geen positieve associatie; wijn-meta-analyse 2025 (OR 0,63) niet-significant. De score-2-data bestond al en was intern consistent met toelatingscriterium 3 (`subgroep-*` ⇒ geen score 3); alleen de §2.2-prozaregel "gedistilleerd" was blijven staan. §12 + §13 uitgebreid met gedistilleerd-precedent. `cluster` toegevoegd aan `src/schemas/item.ts` (optioneel, was al 100% in data aanwezig). Nieuwe CI-regressietest in `scripts/validate-db.ts`: gedistilleerd/versterkte wijn (cluster 12, niet-bier) ≠ migraine score 3. Geen scorewijzigingen in de data. Akkoord: Peter Wolterman (chat 2026-06-04, na evidence-research).
