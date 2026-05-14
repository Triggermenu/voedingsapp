import { useParams, useNavigate } from 'react-router-dom'
import { getProfile } from '@/lib/profile'
import { getItemById } from '@/lib/db'
import { ItemDetailPanel } from '@/components/ItemDetailPanel'
import { NavBar } from '@/components/NavBar'

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const item = id ? getItemById(id) : null

  if (!id || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center px-4">
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Item niet gevonden</p>
          <button
            onClick={() => navigate(-1)}
            style={{ color: 'var(--brand)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Terug
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      {/* Mobile nav header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 4px' }}
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Terug
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ItemDetailPanel
        id={id}
        conditions={conditions}
        showAlternatives
        onNavigate={(newId) => navigate(`/item/${newId}`)}
      />

      <NavBar />
    </div>
  )
}
