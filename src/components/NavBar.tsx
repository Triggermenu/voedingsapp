import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getList, LIST_CHANGE_EVENT } from '@/lib/list'

export function NavBar() {
  const [listCount, setListCount] = useState(() => getList().length)

  useEffect(() => {
    const handler = () => setListCount(getList().length)
    window.addEventListener(LIST_CHANGE_EVENT, handler)
    return () => window.removeEventListener(LIST_CHANGE_EVENT, handler)
  }, [])

  const TABS = [
    {
      to: '/zoeken',
      label: 'Zoeken',
      badge: null,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      ),
    },
    {
      to: '/lijst',
      label: 'Lijstje',
      badge: listCount > 0 ? listCount : null,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
    },
    {
      to: '/scan',
      label: 'Menu scan',
      badge: null,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2M8 12h8" />
        </svg>
      ),
    },
    {
      to: '/instellingen',
      label: 'Instellingen',
      badge: null,
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
        </svg>
      ),
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 safe-area-bottom z-50 nav-blur"
      style={{ padding: '10px 6px 26px', display: 'flex' }}
    >
      <div className="flex items-stretch flex-1 max-w-lg mx-auto">
        {TABS.map(({ to, label, icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            {({ isActive }) => (
              <>
                <span style={{ position: 'relative', color: isActive ? 'var(--brand)' : 'var(--muted)' }}>
                  {icon(isActive)}
                  {badge !== null && (
                    <span style={{
                      position: 'absolute', top: -4, right: -6,
                      minWidth: 16, height: 16, borderRadius: 999,
                      background: 'var(--avoid)', color: '#fff',
                      fontSize: 9.5, fontWeight: 700, lineHeight: '16px',
                      textAlign: 'center', padding: '0 3px',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {badge}
                    </span>
                  )}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: isActive ? 600 : 500,
                  letterSpacing: 0.1, color: isActive ? 'var(--brand)' : 'var(--muted)',
                }}>
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
