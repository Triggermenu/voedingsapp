// Bezoekersstatistieken en custom events via Vercel Analytics + Speed Insights.
// De <Analytics /> en <SpeedInsights /> componenten staan in main.tsx en
// laden hun scripts automatisch op Vercel-deployments.
//
// Er worden NOOIT aandoeningen of andere persoonsgegevens als event-property
// gestuurd — Vercel Analytics ondersteunt alleen string/number/null/boolean,
// hier verder ingeperkt tot string/number/boolean.

import { track as vercelTrack } from '@vercel/analytics'

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  try {
    vercelTrack(event, props)
  } catch {
    // analytics mag nooit de app breken
  }
}
