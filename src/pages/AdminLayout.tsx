import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getSession, getAdminStatus } from '@/lib/auth'

type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * Beveiligde wrapper voor /admin routes.
 * Controleert Supabase-sessie + is_admin flag in de profiles tabel.
 * Redirect naar /admin/login als niet ingelogd of geen admin-rechten.
 *
 * Dit layout is in App.tsx actief als wrapper rond de /admin-routes en valt
 * dicht bij twijfel. Inloggen werkt operationeel pas zodra het Supabase-
 * adminaccount bestaat met is_admin=true en de env-vars staan — zie
 * acties-peter.md C-2.
 */
export function AdminLayout() {
  const [authState, setAuthState] = useState<AuthState>('loading')

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      try {
        const session = await getSession()
        if (!session) {
          if (!cancelled) setAuthState('unauthenticated')
          return
        }
        const isAdmin = await getAdminStatus(session.user.id)
        if (!cancelled) {
          setAuthState(isAdmin ? 'authenticated' : 'unauthenticated')
        }
      } catch {
        if (!cancelled) setAuthState('unauthenticated')
      }
    }

    void checkAuth()
    return () => { cancelled = true }
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="text-sm text-[#9c9a92]">Laden…</div>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
