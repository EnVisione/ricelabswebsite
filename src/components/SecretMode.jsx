import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Easter-egg overlays. Listens for three custom events from the terminal:
//   ricelabs:secret   → TheOneRing.gif chases the cursor + page goes wacky
//   ricelabs:gandalf  → "YOU SHALL NOT PASS!" banner pops onscreen
//   ricelabs:mordor   → toggles a red Eye of Sauron + screen tint
// State lives in memory only — refresh wipes it.
export default function SecretMode() {
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [gandalf, setGandalf] = useState(false)
  const [mordor, setMordor] = useState(false)

  const raf = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const gandalfTimer = useRef(0)

  // Event wiring — once.
  useEffect(() => {
    const onSecret = () => setActive(true)
    const onGandalf = () => {
      setGandalf(true)
      clearTimeout(gandalfTimer.current)
      gandalfTimer.current = setTimeout(() => setGandalf(false), 4200)
    }
    const onMordor = () => setMordor((v) => !v)
    window.addEventListener('ricelabs:secret', onSecret)
    window.addEventListener('ricelabs:gandalf', onGandalf)
    window.addEventListener('ricelabs:mordor', onMordor)
    return () => {
      window.removeEventListener('ricelabs:secret', onSecret)
      window.removeEventListener('ricelabs:gandalf', onGandalf)
      window.removeEventListener('ricelabs:mordor', onMordor)
      clearTimeout(gandalfTimer.current)
    }
  }, [])

  // Body classes for page-wide CSS overrides.
  useEffect(() => {
    document.body.classList.toggle('secret-mode', active)
    document.documentElement.dataset.secret = active ? '1' : ''
    return () => {
      document.body.classList.remove('secret-mode')
      delete document.documentElement.dataset.secret
    }
  }, [active])

  useEffect(() => {
    document.body.classList.toggle('mordor-mode', mordor)
    return () => document.body.classList.remove('mordor-mode')
  }, [mordor])

  // Mouse-follow ring with smooth lag (the ring chases your cursor).
  useEffect(() => {
    if (!active) return
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    ring.current = { ...mouse.current }

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onTouch = (e) => {
      const t = e.touches[0]
      if (t) mouse.current = { x: t.clientX, y: t.clientY }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })

    let t = 0
    const tick = () => {
      t += 1
      // Smooth chase with lag — ring drifts toward cursor each frame.
      ring.current.x += (mouse.current.x - ring.current.x) * 0.09
      ring.current.y += (mouse.current.y - ring.current.y) * 0.09
      setPos({ x: ring.current.x, y: ring.current.y })
      setScale(1 + Math.sin(t / 38) * 0.18)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      cancelAnimationFrame(raf.current)
    }
  }, [active])

  if (!active && !gandalf && !mordor) return null

  return createPortal(
    <>
      {active && (
        <div className="secret-layer" aria-hidden="true">
          <div className="secret-vignette" />
          <div className="secret-flash" />
          <div
            className="secret-ring"
            style={{
              left: pos.x + 'px',
              top: pos.y + 'px',
              transform: `translate(-50%,-50%) scale(${scale.toFixed(3)})`,
            }}
          >
            <div className="secret-ring-aura" />
            <img src="/TheOneRing.gif" alt="" className="secret-ring-gif" />
          </div>
          <div className="secret-inscription cinzel">
            ash nazg durbatulûk
          </div>
        </div>
      )}

      {gandalf && (
        <div className="gandalf-overlay" aria-hidden="true">
          <div className="gandalf-flash" />
          <div className="gandalf-staff" />
          <div className="gandalf-banner cinzel">YOU SHALL NOT PASS!</div>
        </div>
      )}

      {mordor && (
        <div className="mordor-overlay" aria-hidden="true">
          <div className="mordor-tint" />
          <div className="mordor-eye">
            <div className="mordor-eye-flame" />
            <div className="mordor-eye-pupil" />
          </div>
          <div className="mordor-text cinzel">THE EYE IS UPON YOU</div>
        </div>
      )}
    </>,
    document.body
  )
}
