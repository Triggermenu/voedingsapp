import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordForEmail } from '@/lib/auth'

export function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: authError } = await resetPasswordForEmail(email)
      if (authError) {
        setError('Kon geen reset-mail sturen. Controleer het e-mailadres.')
      } else {
        setSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-[#1a1a18]">Wachtwoord vergeten</h1>
          <p className="text-sm text-[#9c9a92] mt-1">Ontvang een herstelmail</p>
        </div>

        {sent ? (
          <div className="bg-white border border-[#e0dfd7] rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">✉️</div>
            <p className="text-sm text-[#5f5e5a]">
              Als dit e-mailadres bekend is, ontvang je een herstelmail. Controleer ook je spam-map.
            </p>
            <Link
              to="/admin/login"
              className="block mt-4 text-xs text-[#1d9e75] hover:underline"
            >
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#e0dfd7] rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#5f5e5a] uppercase tracking-widest mb-1.5">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#e0dfd7] rounded-lg px-3 py-2.5 text-sm text-[#1a1a18] placeholder-[#c8c7c0] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
                placeholder="admin@voorbeeld.nl"
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
              {loading ? 'Bezig…' : 'Herstelmail sturen'}
            </button>

            <p className="text-center text-xs text-[#9c9a92]">
              <Link to="/admin/login" className="hover:text-[#1a1a18] transition-colors">
                Terug naar inloggen
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
