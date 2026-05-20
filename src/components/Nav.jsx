import { NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DonateModal from './DonateModal.jsx'

const links = [
  { to: '/', label: 'HOME', end: true },
  { to: '/team', label: 'TEAM' },
  { to: '/ool', label: 'ORIGINS OF INDESTRUCTIUM' },
  { to: '/nitro', label: 'NITRO' },
  { to: '/envy', label: 'ENVY' },
  { to: '/banane', label: 'BANANE' },
  { to: '/contact', label: 'CONTACT' },
]
// Downloads is the CTA on desktop; on mobile we fold it into the drawer menu.
const mobileLinks = [...links, { to: '/downloads', label: 'DOWNLOADS' }]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)
  const location = useLocation()

  // Close drawer automatically on route change.
  useEffect(() => setOpen(false), [location.pathname])

  // Lock background scroll when drawer is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Allow any component (e.g. Footer, Contact card) to trigger the donate flow.
  useEffect(() => {
    const onOpen = () => setDonateOpen(true)
    window.addEventListener('open-donate', onOpen)
    return () => window.removeEventListener('open-donate', onOpen)
  }, [])

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <img className="brand-logo" src="/rice_labs_logo.png" alt="" aria-hidden="true" />
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
          <button
            type="button"
            className="nav-cta nav-cta-donate"
            onClick={() => setDonateOpen(true)}
          >
            ☕ DONATE
          </button>
        </div>
      </nav>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

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
          <button
            type="button"
            className="nav-drawer-link nav-drawer-donate"
            onClick={() => { setOpen(false); setDonateOpen(true) }}
          >
            ☕ DONATE
          </button>
        </div>
      </div>
    </>
  )
}
