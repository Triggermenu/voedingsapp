import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/**
 * Verwerkt de Supabase password-reset flow.
 * Supabase stuurt na "wachtwoord vergeten" een mail met een link naar:
 *   /admin/wachtwoord-reset#access_token=...&type=recovery
 * Deze pagina pikt de token op, toont een nieuw-wachtwoord-formulier,
 * en roept supabase.auth.updateUser() aan na het invullen.
 */
export function AdminPasswordReset() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenReady, setTokenReady] = useState(false)

  // Supabase zet de session automatisch via de hash-fragment in de URL.
  // onAuthStateChange vangt de PASSWORD_RECOVERY event op.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setTokenReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens zijn.')
      return
    }
    if (password !== confirm) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError('Kon wachtwoord niet instellen. Vraag een nieuwe reset-mail aan.')
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/admin/login', { replace: true }), 2500)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-sm text-[#5f5e5a]">Wachtwoord ingesteld. Je wordt doorgestuurd…</p>
        </div>
      </div>
    )
  }

  if (!tokenReady) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <p className="text-sm text-[#9c9a92]">Token verifiëren…</p>
          <p className="text-xs text-[#9c9a92]">
            Geen token ontvangen?{' '}
            <a href="/admin/wachtwoord-vergeten" className="text-[#1d9e75] hover:underline">
              Vraag een nieuwe reset-link aan
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-[#1a1a18]">Nieuw wachtwoord</h1>
          <p className="text-sm text-[#9c9a92] mt-1">Kies een sterk, uniek wachtwoord</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e0dfd7] rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#5f5e5a] uppercase tracking-widest mb-1.5">
              Nieuw wachtwoord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e0dfd7] rounded-lg px-3 py-2.5 text-sm text-[#1a1a18] placeholder-[#c8c7c0] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
              placeholder="Minimaal 8 tekens"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-xs font-semibold text-[#5f5e5a] uppercase tracking-widest mb-1.5">
              Bevestig wachtwoord
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-[#e0dfd7] rounded-lg px-3 py-2.5 text-sm text-[#1a1a18] placeholder-[#c8c7c0] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
              placeholder="Herhaal wachtwoord"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d9e75] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-[#178a64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Bezig…' : 'Wachtwoord instellen'}
          </button>
        </form>
      </div>
    </div>
  )
}
