import { track } from '@/lib/analytics'

export type FeedbackType = 'idee' | 'probleem' | 'item-mist' | 'algemeen'

/**
 * Stuurt feedback naar de serverless function (api/feedback.ts → Supabase).
 * Geeft true terug bij succes. Vuurt ook een (anoniem) Plausible-event.
 */
export async function sendFeedback(
  message: string,
  type: FeedbackType = 'algemeen',
  context?: string,
): Promise<boolean> {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type, context }),
    })
    if (res.ok) track('feedback_verstuurd', { type })
    return res.ok
  } catch {
    return false
  }
}
