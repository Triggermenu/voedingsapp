// Privacy-vriendelijke, cookieloze statistieken via Plausible (EU).
// Laadt alleen wanneer VITE_PLAUSIBLE_SCRIPT_ID gezet is — net als Sentry in main.tsx.
// Er worden NOOIT aandoeningen of andere persoonsgegevens als event-property gestuurd.

const SCRIPT_ID = import.meta.env.VITE_PLAUSIBLE_SCRIPT_ID as string | undefined

type PlausibleFn = (event: string, options?: { props?: Record<string, string | number | boolean> }) => void
type PlausibleInit = (opts?: Record<string, unknown>) => void

declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[]; o?: Record<string, unknown>; init?: PlausibleInit }
  }
}

export function initPlausible(): void {
  if (!SCRIPT_ID || typeof document === 'undefined') return
  if (document.querySelector('script[data-plausible-init]')) return

  // Queue-stubs zodat track()- en init()-calls vóór het laden niet verloren gaan.
  // Patroon overgenomen van Plausible's officiële embed-snippet.
  window.plausible =
    window.plausible ||
    function (...args: unknown[]) {
      const w = window.plausible!
      w.q = w.q || []
      w.q.push(args)
    }
  if (!window.plausible.init) {
    window.plausible.init = (opts?: Record<string, unknown>) => {
      window.plausible!.o = opts || {}
    }
  }
  window.plausible.init()

  const s = document.createElement('script')
  s.async = true
  s.src = `https://plausible.io/js/${SCRIPT_ID}.js`
  s.setAttribute('data-plausible-init', 'true')
  document.head.appendChild(s)
}

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  try {
    window.plausible?.(event, props ? { props } : undefined)
  } catch {
    // analytics mag nooit de app breken
  }
}
