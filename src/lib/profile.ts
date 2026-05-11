import type { Condition } from '@/schemas/item'

const PROFILE_KEY = 'voedingsapp_profile_v1'
const DISCLAIMER_KEY = 'voedingsapp_disclaimer_v1'

export interface Profile {
  conditions: Condition[]
}

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Profile
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

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(DISCLAIMER_KEY)
}
