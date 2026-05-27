// Privacy-vriendelijke, cookieloze statistieken via Plausible (EU).
// Laadt alleen wanneer VITE_PLAUSIBLE_DOMAIN gezet is — net als Sentry in main.tsx.
// Er worden NOOIT aandoeningen of andere persoonsgegevens als event-property gestuurd.

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

type PlausibleFn = (event: string, options?: { props?: Record<string, string | number | boolean> }) => void

declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[] }
  }
}

export function initPlausible(): void {
  if (!DOMAIN || typeof document === 'undefined') return
  if (document.querySelector('script[data-domain]')) return

  // Queue-stub zodat track()-calls vóór het laden niet verloren gaan.
  window.plausible =
    window.plausible ||
    function (...args: unknown[]) {
      const w = window.plausible!
      w.q = w.q || []
      w.q.push(args)
    }

  const s = document.createElement('script')
  s.defer = true
  s.setAttribute('data-domain', DOMAIN)
  s.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(s)
}

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  try {
    window.plausible?.(event, props ? { props } : undefined)
  } catch {
    // analytics mag nooit de app breken
  }
}
