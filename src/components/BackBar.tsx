import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'

// Gedeelde terug-balk voor de "Meer"-subpagina's (Bronnen, Methodologie, Profiel).
// Links een terug-knop (browser-historie), rechts het logo als snelle weg naar Zoeken.
export function BackBar({ label = 'Terug' }: { label?: string }) {
  const navigate = useNavigate()
  return (
    <div
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 0' }}
      className="pt-safe"
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'inherit',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        {label}
      </button>
      <Logo size={16} to="/zoeken" />
    </div>
  )
}
