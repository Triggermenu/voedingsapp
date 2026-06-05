import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getProfile, hasAcceptedDisclaimer } from '@/lib/profile'
import { Onboarding } from '@/pages/Onboarding'
import { Zoeken } from '@/pages/Zoeken'
import { Scan } from '@/pages/Scan'
import { Bronnen } from '@/pages/Bronnen'
import { Methodologie } from '@/pages/Methodologie'
import { Instellingen } from '@/pages/Instellingen'
import { ProfielInstellingen } from '@/pages/ProfielInstellingen'
import { Recepten } from '@/pages/Recepten'
import { Lijst } from '@/pages/Lijst'
import { ItemDetail } from '@/pages/ItemDetail'
import { Privacy } from '@/pages/Privacy'
import { FeedbackButton } from '@/components/FeedbackButton'

// Admin-pagina's worden lazy geladen zodat @supabase/supabase-js
// en createClient() NOOIT draaien voor gewone eindgebruikers.
// Een module-level crash in supabase.ts legt anders de hele app plat.
const Admin = lazy(() => import('@/pages/Admin').then((m) => ({ default: m.Admin })))
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminForgotPassword = lazy(() =>
  import('@/pages/AdminForgotPassword').then((m) => ({ default: m.AdminForgotPassword }))
)
const AdminPasswordReset = lazy(() =>
  import('@/pages/AdminPasswordReset').then((m) => ({ default: m.AdminPasswordReset }))
)
const AdminLayout = lazy(() => import('@/pages/AdminLayout').then((m) => ({ default: m.AdminLayout })))

function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = getProfile()
  const accepted = hasAcceptedDisclaimer()
  if (!profile || !accepted) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

function RequireNoProfile({ children }: { children: React.ReactNode }) {
  const profile = getProfile()
  const accepted = hasAcceptedDisclaimer()
  if (profile && accepted) return <Navigate to="/zoeken" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/onboarding" element={<RequireNoProfile><Onboarding /></RequireNoProfile>} />
      <Route path="/zoeken" element={<RequireProfile><Zoeken /></RequireProfile>} />
      <Route path="/item/:id" element={<RequireProfile><ItemDetail /></RequireProfile>} />
      <Route path="/recepten" element={<RequireProfile><Recepten /></RequireProfile>} />
      <Route path="/lijst" element={<RequireProfile><Lijst /></RequireProfile>} />
      <Route path="/scan" element={<RequireProfile><Scan /></RequireProfile>} />
      <Route path="/bronnen" element={<RequireProfile><Bronnen /></RequireProfile>} />
      <Route path="/methodologie" element={<RequireProfile><Methodologie /></RequireProfile>} />
      <Route path="/instellingen" element={<RequireProfile><Instellingen /></RequireProfile>} />
      <Route path="/instellingen/profiel" element={<RequireProfile><ProfielInstellingen /></RequireProfile>} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Admin routes — lazy geladen, Supabase wordt pas geïnitialiseerd bij navigatie */}
      <Route element={
        <Suspense fallback={null}>
          <AdminLayout />
        </Suspense>
      }>
        <Route path="/admin" element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        } />
      </Route>
      <Route path="/admin/login" element={
        <Suspense fallback={null}>
          <AdminLogin />
        </Suspense>
      } />
      <Route path="/admin/wachtwoord-vergeten" element={
        <Suspense fallback={null}>
          <AdminForgotPassword />
        </Suspense>
      } />
      <Route path="/admin/wachtwoord-reset" element={
        <Suspense fallback={null}>
          <AdminPasswordReset />
        </Suspense>
      } />

      <Route path="/" element={<Navigate to="/zoeken" replace />} />
      <Route path="*" element={<Navigate to="/zoeken" replace />} />
    </Routes>
    <FeedbackButton />
    </>
  )
}
