# Voedingsapp

Beslishulp bij voedingskeuzes voor mensen met jicht, migraine, nierstenen en/of histamine-intolerantie. Bereikbaar via [triggermenu.nl](https://triggermenu.nl).

## Voor Jeffrey (gebruiker)

Open de app op je iPhone via de link die je ontvangen hebt. Zet hem op je beginscherm via Safari → Delen → Zet op beginscherm.

## Voor de beheerder

### Setup (éénmalig)
Zie `acties-peter.md` voor de stappen.

### Database uitbreiden
Database-items staan in `src/data/<categorie>.json`. CI valideert automatisch alle scores, bronnen en regression-tests. PR's van Cowork mergen automatisch als CI groen is.

### Menuscan
Vereist `ANTHROPIC_API_KEY`, `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars.
De scan is beperkt tot 12 keer per uur per IP-adres (rate limiting via Supabase, zie RISKS.md R-007).

## Technisch

- **Stack:** Vite + React + TypeScript + TailwindCSS
- **Hosting:** Vercel (automatisch deploy bij push naar main)
- **Database:** JSON bestanden in `src/data/` (versioned in git)
- **API:** Vercel serverless function (`api/menuscan.ts`)

## Scripts

```bash
npm run dev          # lokale dev server
npm run validate-db  # database validatie (ook in CI)
npm run check-sources # URL bereikbaarheids-check
npm run typecheck    # TypeScript check
npm test             # unit tests
npm run test:e2e     # e2e tests (vereist dev server)
```

## Licenties & compliance

- **SIGHI-data:** commercieel gebruik aangevraagd (zie `acties-peter.md`)
- **MDR-status:** in onderzoek
- **USDA Purine Database:** CC0 (vrij gebruik)
- **Harvard Oxalate Table:** publiek beschikbaar
- **NEVO:** zie RIVM gebruiksvoorwaarden
