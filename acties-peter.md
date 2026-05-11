# Acties Peter — Voedingsapp

> Dit zijn de enige dingen die jij zelf doet. Alles andere is geautomatiseerd.
> Als deze lijst leeg is = je hoeft niets meer te doen tot Sentry je een melding stuurt.

---

## A-1 · CLAUDE.md eenmalig goedkeuren

**Status:** ☐ Open
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

## A-4 · Accountsetup (éénmalig, ~15 min totaal)

**Status:** ☐ Open
**Wanneer:** zodra CLAUDE.md is goedgekeurd

1. **GitHub account** — github.com (gratis). Username noteren.
2. **Vercel account** — vercel.com, "Login met GitHub". Geen creditcard nodig voor MVP.
3. **Anthropic API key** — console.anthropic.com → API Keys → Create. Sla op in password manager.
4. **Sentry account** — sentry.io (gratis tier, 5k events/maand). Project type: React + Node.
5. **Plausible account** — plausible.io of zelf-gehost. Site toevoegen voor productie-domein.
6. **Resend account** (voor magic link mail) — resend.com (gratis tier, 100 mails/dag).

**Lever aan Claude Code (in chat):**
- GitHub username
- Anthropic API key (Claude Code zet 'm direct in Vercel env vars, niet in repo)
- Sentry DSN
- Plausible site-ID (of bevestiging "skip analytics")
- Resend API key

Claude Code regelt vervolgens:
- GitHub repo aanmaken via `gh` CLI
- Vercel project linken via `vercel` CLI
- Env vars zetten via `vercel env`
- Eerste deploy

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

## Klaar?
Als A-1 t/m A-5 op ✅ staan, draait de app autonoom.
A-6 is een eenmalige testronde — daarna is jouw rol *bestuurder bij uitzondering*: Sentry meldt incidenten, jij beslist over koers.

---

**Niets anders dan dit. Geen PR-reviews. Geen commits. Geen batch-approvals. Geen deploys.**
