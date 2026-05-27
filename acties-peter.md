# Acties Peter — Voedingsapp

> Dit zijn de enige dingen die jij zelf doet. Alles andere is geautomatiseerd.
> Als deze lijst leeg is = je hoeft niets meer te doen tot Sentry je een melding stuurt.

---

## A-1 · CLAUDE.md eenmalig goedkeuren

**Status:** ✅ Goedgekeurd 2026-05-12
**Tijd:** ~30 min lezen
**Actie:** Lees `CLAUDE.md`. Reageer met *"akkoord"* of geef correcties.
**Belang:** Na akkoord start Claude Code de volledige bouw autonoom. Dit is je laatste menselijke check-in.

---

## A-2 · SIGHI commerciële licentie aanvragen

**Status:** ☐ Open
**Tijd:** ~5 min (mail versturen)
**Deadline:** Vóór publieke launch
**Eigenaar mail:** Heinz Lamprecht, SIGHI (Swiss Interest Group Histamine Intolerance)
**Contact:** via [mastzellaktivierung.info](https://www.mastzellaktivierung.info/) → contactformulier of e-mail uit hun publicaties

### Conceptmail (kopieer, vul `[…]` in, verstuur)

```
Onderwerp: License request — Commercial use of SIGHI Food Compatibility List

Dear Mr Lamprecht / SIGHI team,

I am developing a Dutch-language web application that helps people with histamine
intolerance (and related conditions: gout, kidney stones, migraine) make informed
food choices. The application provides a traffic-light indication per food item,
with transparent source attribution and an evidence-level badge.

I would like to use the SIGHI Food Compatibility List (2023 edition) as a primary
reference for histamine scoring. I understand commercial use requires written
permission, hence this request.

Details of the intended use:
- Application: voedingsapp (working title), publicly accessible web app
- Audience: individuals with histamine intolerance and overlapping conditions
- Use: SIGHI 0–3 scores as one of the inputs to a per-item score, with full
  attribution and a link to the SIGHI source on every relevant food item
- Modifications: scores are not altered; we add a Dutch translation of food names
  and supplementary fields (liberator/DAO-blocker flags) consistent with SIGHI's
  own classification
- Geographic scope: initially the Netherlands, with possible expansion to other
  EU markets and English-language users later
- Business model: [vul in: gratis / freemium / betaald — wat van toepassing is]

I would gladly:
- Display SIGHI as the primary source on every histamine item
- Link to your publications on the methodology page
- Provide updates if the SIGHI list is revised
- Adhere to any conditions you set

Could you let me know under what terms commercial use is possible, and whether
any licence fee applies?

Thank you very much for the work SIGHI has done in this field — it remains the
most concrete reference for practitioners and patients.

Kind regards,
[jouw naam]
[jouw e-mail]
[optioneel: bedrijfsnaam / KvK-nummer]
[optioneel: link naar app of demo zodra beschikbaar]
```

**Na ontvangst antwoord:**
- Antwoord ja → markeer A-2 als ✅, update RISKS.md R-001 naar "geaccepteerd"
- Antwoord nee → schakel feature flag `HISTAMINE_ENABLED=false` (Claude Code regelt binnen 1 release), update RISKS.md
- Antwoord met voorwaarden → bespreek met Claude Code voor implementatie

---

## A-3 · MDR-classificatie onderzoeken

**Status:** ☐ Open
**Tijd:** afhankelijk van advies (juridisch ~1u, IGJ-meldpunt onbekend)
**Deadline:** Vóór publieke launch
**Actie:**
1. Optioneel: stuur korte beschrijving naar IGJ-meldpunt (Inspectie Gezondheidszorg & Jeugd) of een MDR-jurist met de vraag *"kwalificeert dit als medisch hulpmiddel klasse I, IIa, of valt het buiten MDR?"*
2. Beschrijving om mee te sturen:
   *"Een Nederlandse webapp die per voedingsmiddel een stoplichtindicatie toont voor mensen met jicht, migraine, nierstenen of histamine-intolerantie. App geeft geen diagnose, geen behandeling, geen monitoring. Gebruiker kiest aandoening(en) zelf. App toont voedingsinformatie + per-item evidence-niveau + bronvermelding. Disclaimer vereist akkoord vóór gebruik."*
3. Bij twijfel: blijf onder "lifestyle / informatief", verwijder elke claim die diagnose of behandeling suggereert.

**Resultaat noteren in:** RISKS.md R-002

---

## A-4 · Accountsetup

**Status:** 🟡 Grotendeels klaar — Sentry-DSN fixen, Plausible + Resend nog open

1. **GitHub** — ✅ repo `Triggermenu/voedingsapp` live, CI/CD draait.
2. **Vercel** — ✅ project `voedingsapp` live op triggermenu.nl, auto-deploy bij push naar main.
3. **Anthropic API key** — ✅ staat in Vercel, menuscan werkt.
4. **Sentry** — ⚠️ DSN staat in Vercel maar is **ongeldig** (console: *"Invalid Sentry Dsn"*) → foutregistratie initialiseert nu niet. **Actie:** juiste DSN uit sentry.io kopiëren en `VITE_SENTRY_DSN` in Vercel corrigeren.
5. **Plausible** — ☐ nog niet opgezet. **Actie:** account op plausible.io (EU), site `triggermenu.nl` toevoegen, dan `VITE_PLAUSIBLE_DOMAIN=triggermenu.nl` in Vercel zetten. Code is al gewired (no-op tot de var staat).
6. **Resend** (voor feedback-mailnotificatie) — ☐ nog niet opgezet. **Actie:** account op resend.com (gratis: 100 mails/dag), API key maken, `RESEND_API_KEY` in Vercel zetten. Dan krijg je per feedback een mailtje. Zonder key blijft feedback gewoon in de Supabase-tabel staan. Optioneel: domein verifiëren voor een net afzendadres (anders `onboarding@resend.dev`).

**Supabase (nieuw, 2026-05-27):** ✅ aparte EU-org "Triggermenu's Org" + project (ref `jjfwkawiufplmqjomall`, Frankfurt). Tabellen `rate_limits` + `feedback` aangemaakt. `SUPABASE_URL` + secret key in Vercel. Hierdoor werkt de menuscan-rate-limiting nu (was eerder inactief) én de in-app feedback.

---

## A-5 · Anthropic budget cap instellen

**Status:** ☐ Open
**Tijd:** ~2 min
**Wanneer:** ná A-4
**Actie:** console.anthropic.com → Billing → Set spending limit. Aanbeveling: € 25/maand voor MVP-fase.
**Reden:** mitigatie R-005 (zie RISKS.md).

---

## A-6 · Jerry-test (na alpha-release)

**Status:** ☐ Open (start na fase 1: 150 items + alpha live)
**Tijd:** verspreid over 2 weken
**Actie:**
1. Deel productie-URL met Jerry.
2. Vraag hem 2 weken normaal te gebruiken (supermarkt + restaurant).
3. Verzamel feedback informeel (mail/app). Geen formulieren — wel duidelijke vragen:
   - Welke producten zocht je die er niet in zaten?
   - Begreep je de stoplichten?
   - Heb je de menuscan gebruikt? Wat ging goed/fout?
   - Wat zou je willen?
4. Mail samenvatting naar jezelf, plak in chat met Claude Code — wordt automatisch verwerkt.

---

## A-7 · AVG/privacy-compliance regelen

**Status:** ☐ Open
**Tijd:** ~2–4u (privacyverklaring + DPA's); evt. jurist-consult apart
**Deadline:** Basis vóór kleine test; volledig vóór publieke launch
**Reden:** mitigatie R-007 — de menuscan verwerkt gezondheidsgegevens (aandoeningen + foto) naar Vercel en Anthropic.

### Vóór kleine test (5–10 mensen) — minimumset
1. **Privacyverklaring** (NL) — ✅ live (v1.1, met Plausible- en feedback-secties; `/privacy`).
2. **DPA's** klik-akkoord in dashboards (~15 min totaal) — ☐ open:
   - Vercel, Anthropic, Sentry, Supabase (nieuwe org)
3. **Anthropic budget cap** op €10 — ☐ open — console.anthropic.com → Billing. Nu extra relevant: de menuscan werkt.

*Noot: aandoeningen die naar Anthropic gaan (in de prompt) zijn technisch gezondheidsdata (AVG art. 9), maar pseudoniem (geen naam/e-mail meegestuurd). De ScanConsentGate geeft de vereiste expliciete toestemming. Risico is laag voor kleine test.*

### Vóór publieke launch (aanvullend)
4. **Anthropic Zero Data Retention** aanvragen — ☐ open — console.anthropic.com. Voorkomt dat Anthropic requests 30 dagen logt. Best practice, geen blokkade voor de test.
5. **EU-regio Supabase** — ✅ nieuw project staat in Frankfurt (eu-central-1).
6. **Datalek-meldprocedure** paraat — ☐ open: bij lek met gezondheidsdata binnen 72u melden bij Autoriteit Persoonsgegevens.

### Bij accounts erbij (later)
7. **DPIA** (Data Protection Impact Assessment) — verplicht bij grootschalige verwerking.
8. Jurist-consult (combineerbaar met A-3 MDR).

**Technisch al gedaan door Claude Code:** ScanConsentGate (aparte toestemming vóór scan), Sentry-scrubbing (geen foto/aandoening in logs), foto niet bewaard na scan, Vercel-functies op Frankfurt (fra1).

**Resultaat noteren in:** RISKS.md R-007

---

## C-1 · Desktop drie-koloms layout bouwen

**Status:** ✅ Gebouwd (zoeklijst links, detail midden, alternatieven rechts)

---

## Stand van zaken (2026-05-27)
De app is **technisch test-klaar** en draait live op triggermenu.nl: nieuwe scorelabels
(Veilig/Met mate/Spaarzaam/Vermijden), bewijs in mensentaal, Tonijn-voorbeeldkaart, Jerry-verhaal,
in-app feedbackknop (→ Supabase + optioneel mail), "niet gevonden"-melding, en de menuscan met
nu wél actieve rate-limiting. Database 700 items.

**Nog te doen vóór je de link breed deelt:**
- ☐ **DPA's** klikken (Vercel, Anthropic, Supabase, Sentry) — A-7
- ☐ **Budget cap €10** op Anthropic — A-5
- ☐ **Sentry-DSN** corrigeren in Vercel (nu ongeldig) — A-4
- ☐ *(optioneel)* **Plausible** account + `VITE_PLAUSIBLE_DOMAIN` — voor gebruiksstatistieken
- ☐ *(optioneel)* **Resend** account + `RESEND_API_KEY` — voor mail per feedback

## Klaar voor publieke launch?
Als A-2 + A-3 + A-5 + A-7 volledig op ✅ staan → publiek launchen.
A-6 is een eenmalige testronde — daarna is jouw rol *bestuurder bij uitzondering*: Sentry meldt incidenten, jij beslist over koers.

---

**Niets anders dan dit. Geen PR-reviews. Geen commits. Geen batch-approvals. Geen deploys.**
