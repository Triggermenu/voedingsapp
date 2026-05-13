import { useParams, useNavigate } from 'react-router-dom'
import { getProfile } from '@/lib/profile'
import { getItemById } from '@/lib/db'
import { ItemDetailPanel } from '@/components/ItemDetailPanel'

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const item = id ? getItemById(id) : null

  if (!id || !item) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#73726c] mb-4">Item niet gevonden</p>
          <button onClick={() => navigate(-1)} className="text-[#1d9e75] text-sm">← Terug</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Mobiele navigatie */}
      <div className="flex items-center justify-between px-4 pt-safe pt-3 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#5f5e5a] hover:text-[#1a1a18] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-[#9c9a92] hover:text-[#1a1a18]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <ItemDetailPanel
        id={id}
        conditions={conditions}
        showAlternatives
        onNavigate={(newId) => navigate(`/item/${newId}`)}
      />
    </div>
  )
}
