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
