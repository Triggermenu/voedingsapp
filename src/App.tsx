import { Routes, Route, Navigate } from 'react-router-dom'
import { getProfile, hasAcceptedDisclaimer } from '@/lib/profile'
import { Onboarding } from '@/pages/Onboarding'
import { Zoeken } from '@/pages/Zoeken'
import { Scan } from '@/pages/Scan'
import { Bronnen } from '@/pages/Bronnen'
import { Instellingen } from '@/pages/Instellingen'
import { Recepten } from '@/pages/Recepten'
import { Lijst } from '@/pages/Lijst'
import { ItemDetail } from '@/pages/ItemDetail'
import { Privacy } from '@/pages/Privacy'
import { Admin } from '@/pages/Admin'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminForgotPassword } from '@/pages/AdminForgotPassword'
import { AdminLayout } from '@/pages/AdminLayout'
import { FeedbackButton } from '@/components/FeedbackButton'

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
      <Route path="/instellingen" element={<RequireProfile><Instellingen /></RequireProfile>} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Admin routes — beveiligd via AdminLayout (vereist Supabase-sessie + is_admin) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/wachtwoord-vergeten" element={<AdminForgotPassword />} />

      <Route path="/" element={<Navigate to="/zoeken" replace />} />
      <Route path="*" element={<Navigate to="/zoeken" replace />} />
    </Routes>
    <FeedbackButton />
    </>
  )
}
