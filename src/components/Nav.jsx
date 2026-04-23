import { NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const links = [
  { to: '/', label: 'HOME', end: true },
  { to: '/team', label: 'TEAM' },
  { to: '/one-ring', label: 'ONE RING' },
  { to: '/envy', label: 'ENVY' },
  { to: '/nitro', label: 'NITRO' },
  { to: '/contact', label: 'CONTACT' },
]
// Downloads is the CTA on desktop; on mobile we fold it into the drawer menu.
const mobileLinks = [...links, { to: '/downloads', label: 'DOWNLOADS' }]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close drawer automatically on route change.
  useEffect(() => setOpen(false), [location.pathname])

  // Lock background scroll when drawer is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <div className="brand-logo" aria-hidden="true"></div>
            <div className="brand-name">RICE<em>/</em>LABS</div>
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <Link className="nav-cta" to="/downloads">↓ DOWNLOADS</Link>
        </div>
      </nav>

      {/* Mobile-only burger FAB + drawer */}
      <button
        type="button"
        className={'nav-fab ' + (open ? 'open' : '')}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className="nav-fab-bar" />
        <span className="nav-fab-bar" />
        <span className="nav-fab-bar" />
      </button>

      <div
        className={'nav-drawer ' + (open ? 'open' : '')}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div className="nav-drawer-panel" onClick={(e) => e.stopPropagation()}>
          <div className="nav-drawer-title pixel">◆ NAVIGATE</div>
          {mobileLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'nav-drawer-link' + (isActive ? ' active' : '')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
