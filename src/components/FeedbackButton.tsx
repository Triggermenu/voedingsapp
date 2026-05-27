import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sendFeedback, type FeedbackType } from '@/lib/feedback'

// Routes waar de knop NIET hoort: onboarding (eerste indruk) en losse juridische pagina's.
const HIDDEN_PREFIXES = ['/onboarding', '/privacy', '/admin']

const TYPE_OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: 'idee', label: 'Idee' },
  { value: 'probleem', label: 'Probleem' },
  { value: 'item-mist', label: 'Item mist' },
]

export function FeedbackButton() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<FeedbackType>('idee')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  if (HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p))) return null

  const close = () => {
    setOpen(false)
    // reset na de sluit-animatie zodat de gebruiker niet de reset ziet
    setTimeout(() => { setMessage(''); setType('idee'); setStatus('idle') }, 200)
  }

  const submit = async () => {
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    const ok = await sendFeedback(message, type, location.pathname)
    setStatus(ok ? 'done' : 'error')
    if (ok) setTimeout(close, 1400)
  }

  return (
    <>
      {/* Zwevende knop — boven de NavBar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Feedback geven"
        style={{
          position: 'fixed', right: 16, bottom: 84, zIndex: 60,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '10px 14px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--paper)',
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
        Feedback
      </button>

      {/* Bottom-sheet */}
      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 70,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520, background: 'var(--bg)',
              borderTopLeftRadius: 18, borderTopRightRadius: 18,
              padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
              maxHeight: '85vh', overflowY: 'auto',
            }}
          >
            {status === 'done' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🙏</div>
                <p className="serif" style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)', margin: 0 }}>
                  Dank je!
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>
                  Dit komt direct bij de maker terecht.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <h2 className="serif" style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: 0, letterSpacing: -0.3 }}>
                    Help Triggermenu beter te maken
                  </h2>
                  <button onClick={close} aria-label="Sluiten" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, marginRight: -4, flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 14px', lineHeight: 1.45 }}>
                  Wat werkt goed, wat mist er, of wat ging mis? Eén regel is al genoeg.
                </p>

                {/* Type-keuze */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {TYPE_OPTIONS.map((o) => {
                    const active = type === o.value
                    return (
                      <button
                        key={o.value}
                        onClick={() => setType(o.value)}
                        style={{
                          fontSize: 12.5, padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                          background: active ? 'var(--ink)' : 'transparent',
                          color: active ? 'var(--paper)' : 'var(--ink-soft)',
                          border: active ? 'none' : '1px solid var(--rule)',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {o.label}
                      </button>
                    )
                  })}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bijv. 'ik zocht havermelk maar vond het niet'"
                  rows={4}
                  maxLength={2000}
                  autoFocus
                  style={{
                    width: '100%', resize: 'vertical', boxSizing: 'border-box',
                    padding: '12px 14px', borderRadius: 12, fontFamily: 'inherit', fontSize: 14,
                    background: 'var(--paper)', border: '1px solid var(--rule)', color: 'var(--ink)',
                    outline: 'none', lineHeight: 1.45,
                  }}
                />
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '8px 0 0', lineHeight: 1.4 }}>
                  Deel hier geen persoonlijke of medische gegevens. We bewaren alleen je bericht, geen naam.
                </p>

                {status === 'error' && (
                  <p style={{ fontSize: 12.5, color: 'var(--avoid)', margin: '8px 0 0' }}>
                    Versturen lukte niet. Probeer het later opnieuw.
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={!message.trim() || status === 'sending'}
                  style={{
                    width: '100%', height: 46, borderRadius: 12, marginTop: 14, fontFamily: 'inherit',
                    background: !message.trim() ? 'var(--rule)' : 'var(--brand)',
                    color: !message.trim() ? 'var(--muted)' : '#fff',
                    border: 'none', fontSize: 14, fontWeight: 600,
                    cursor: !message.trim() || status === 'sending' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'sending' ? 'Versturen…' : 'Versturen'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
