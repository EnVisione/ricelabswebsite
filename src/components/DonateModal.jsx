import { useEffect } from 'react'
import { BUYMEACOFFEE_URL } from '../constants.js'

export default function DonateModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const handleAgree = () => {
    window.open(BUYMEACOFFEE_URL, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      className="donate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-modal-title"
    >
      <div className="donate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="donate-modal-icon" aria-hidden="true">☕</div>
        <div className="tag gold" style={{ marginBottom: 10 }}>◆ HEADS UP</div>
        <h2 id="donate-modal-title" style={{ marginBottom: 14 }}>
          LEAVING RICELABS
        </h2>
        <p style={{ marginBottom: 12 }}>
          You're about to be redirected to <strong>buymeacoffee.com</strong>, a
          third-party donation platform. RiceLabs doesn't process payments — Buy Me a
          Coffee handles everything.
        </p>
        <p style={{ marginBottom: 12 }}>
          <strong>Every donation goes directly toward development costs and server
          hosting</strong> — keeping the official Over Stars server online, paying for
          infrastructure, and letting us keep all our packs and mods completely free.
        </p>
        <p style={{ marginBottom: 18 }}>
          Donations are <strong>100% optional</strong>. All perks are{' '}
          <strong className="accent">purely cosmetic</strong> — never pay-to-win, never
          gameplay-affecting. We run the server because it's fun and we love this
          community.
        </p>
        <div className="donate-modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="btn btn-primary donate-btn"
            onClick={handleAgree}
          >
            ☕ I AGREE — CONTINUE
          </button>
        </div>
        <p className="mono muted" style={{ fontSize: 11, marginTop: 14, textAlign: 'center' }}>
          opens buymeacoffee.com/enviouse in a new tab
        </p>
      </div>
    </div>
  )
}
