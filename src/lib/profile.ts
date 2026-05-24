import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'

const PROFILE_KEY = 'voedingsapp_profile_v1'
const DISCLAIMER_KEY = 'voedingsapp_disclaimer_v1'
// Aparte, uitdrukkelijke toestemming voor de menuscan — los van de medische
// disclaimer (RISKS.md R-007 / acties-peter.md A-7). De scan verwerkt
// gezondheidsgegevens (gekozen aandoeningen + foto) naar Vercel en Anthropic.
const SCAN_CONSENT_KEY = 'voedingsapp_scan_consent_v1'

export interface Profile {
  conditions: Condition[]
}

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const obj = parsed as Record<string, unknown>
    if (!Array.isArray(obj.conditions)) return null
    // Filter to only known, valid Condition values to prevent injection
    const conditions = (obj.conditions as unknown[]).filter(
      (c): c is Condition => typeof c === 'string' && (CONDITIONS as readonly string[]).includes(c)
    )
    if (conditions.length === 0) return null
    return { conditions }
  } catch {
    return null
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function hasAcceptedDisclaimer(): boolean {
  return localStorage.getItem(DISCLAIMER_KEY) === 'true'
}

export function acceptDisclaimer(): void {
  localStorage.setItem(DISCLAIMER_KEY, 'true')
}

export function hasAcceptedScanConsent(): boolean {
  return localStorage.getItem(SCAN_CONSENT_KEY) === 'true'
}

export function acceptScanConsent(): void {
  localStorage.setItem(SCAN_CONSENT_KEY, 'true')
}

export function revokeScanConsent(): void {
  localStorage.removeItem(SCAN_CONSENT_KEY)
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(DISCLAIMER_KEY)
  localStorage.removeItem(SCAN_CONSENT_KEY)
}
