import { NavLink } from 'react-router-dom'

const TABS = [
  {
    to: '/zoeken',
    label: 'Zoeken',
    icon: (path: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={path ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    to: '/scan',
    label: 'Scan',
    icon: (path: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={path ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2M8 12h8" />
      </svg>
    ),
  },
  {
    to: '/bronnen',
    label: 'Bronnen',
    icon: (path: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={path ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h11a3 3 0 013 3v13a2 2 0 00-2-2H4z" />
        <path d="M4 4v14h12" />
      </svg>
    ),
  },
  {
    to: '/instellingen',
    label: 'Profiel',
    icon: (path: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={path ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
      </svg>
    ),
  },
]

export function NavBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 safe-area-bottom z-50 nav-blur"
      style={{ padding: '10px 6px 26px', display: 'flex' }}
    >
      <div className="flex items-stretch flex-1 max-w-lg mx-auto">
        {TABS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? 'var(--brand)' : 'var(--muted)' }}>
                  {icon(isActive)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: 0.1,
                    color: isActive ? 'var(--brand)' : 'var(--muted)',
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <div style={{ width: 18, height: 2, background: 'var(--brand)', borderRadius: 2, marginTop: -2 }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
