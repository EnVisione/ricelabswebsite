import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Secret mode: the One Ring descends onto the page and starts shifting
// everything. Activated by `window.dispatchEvent(new Event('ricelabs:secret'))`
// from the terminal. State lives in memory only — refresh wipes it.
export default function SecretMode() {
  const [active, setActive] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const raf = useRef(0)

  // Listen for the activation event.
  useEffect(() => {
    const on = () => setActive(true)
    window.addEventListener('ricelabs:secret', on)
    return () => window.removeEventListener('ricelabs:secret', on)
  }, [])

  // Toggle the body class + a root-level data attribute so page-wide CSS
  // overrides can cascade without per-component wiring.
  useEffect(() => {
    if (active) {
      document.body.classList.add('secret-mode')
      document.documentElement.dataset.secret = '1'
    } else {
      document.body.classList.remove('secret-mode')
      delete document.documentElement.dataset.secret
    }
    return () => {
      document.body.classList.remove('secret-mode')
      delete document.documentElement.dataset.secret
    }
  }, [active])

  // Ring drifts slowly — orbits the screen center with a little wander.
  useEffect(() => {
    if (!active) return
    let t = 0
    const tick = () => {
      t += 1
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setX(cx + Math.sin(t / 160) * 140 + Math.cos(t / 73) * 40)
      setY(cy + Math.cos(t / 140) * 90 + Math.sin(t / 81) * 30)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [active])

  if (!active) return null
  return createPortal(
    <div className="secret-layer" aria-hidden="true">
      <div className="secret-vignette" />
      <div
        className="secret-ring"
        style={{ left: x + 'px', top: y + 'px' }}
      >
        <div className="secret-ring-glow" />
        <div className="secret-ring-band" />
        <div className="secret-ring-inner" />
        <div className="secret-ring-runes pixel">
          ᛟ · ᚱ · ᛁ · ᚲ · ᛖ · ᛚ · ᚨ · ᛒ · ᛋ · ᛟ · ᚱ · ᛁ · ᚲ · ᛖ · ᛚ · ᚨ · ᛒ · ᛋ
        </div>
      </div>
      <div className="secret-inscription cinzel">
        ash nazg durbatulûk
      </div>
    </div>,
    document.body
  )
}
