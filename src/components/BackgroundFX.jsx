import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Drifting voxel particles that gently respond to the cursor.
// Rendered into <body> via portal so z-index never fights the nav.
export default function BackgroundFX() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, dpr = 1, raf = 0
    let mx = -9999, my = -9999

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
    }
    window.addEventListener('resize', resize)
    resize()

    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })

    const COLORS = ['#7CC242', '#C9A227', '#6a5cff', '#4fd6e2', '#e0533d', '#8b5a3c']
    // Three layers with different size + speed for a bit of parallax depth.
    const LAYERS = [
      { count: 80, sizeMin: 2, sizeMax: 4, speed: 0.04, alpha: 0.35 }, // far
      { count: 55, sizeMin: 4, sizeMax: 7, speed: 0.07, alpha: 0.55 }, // mid
      { count: 30, sizeMin: 7, sizeMax: 11, speed: 0.11, alpha: 0.7 }, // near
    ]
    const blocks = []
    LAYERS.forEach((L, layerIdx) => {
      for (let i = 0; i < L.count; i++) {
        blocks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(L.speed * (0.6 + Math.random() * 0.8)),
          s: L.sizeMin + Math.random() * (L.sizeMax - L.sizeMin),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          wobble: Math.random() * Math.PI * 2,
          alpha: L.alpha,
          layer: layerIdx,
        })
      }
    })

    function tick() {
      ctx.clearRect(0, 0, w, h)
      for (const b of blocks) {
        b.wobble += 0.008 + b.layer * 0.003
        const dx = b.x - mx
        const dy = b.y - my
        const d2 = dx * dx + dy * dy
        const reach = 180 + b.layer * 40
        if (d2 < reach * reach) {
          const d = Math.sqrt(d2) || 1
          const f = (reach - d) / reach
          b.vx += (dx / d) * 0.06 * f * (1 + b.layer * 0.3)
          b.vy += (dy / d) * 0.06 * f * (1 + b.layer * 0.3)
        }
        b.vx *= 0.985
        b.vy *= 0.985
        b.x += b.vx + Math.sin(b.wobble) * 0.18
        b.y += b.vy
        if (b.y < -30) { b.y = h + 20; b.x = Math.random() * w }
        if (b.y > h + 40) { b.y = -20; b.x = Math.random() * w }
        if (b.x < -30) b.x = w + 20
        if (b.x > w + 30) b.x = -20

        ctx.globalAlpha = b.alpha
        ctx.fillStyle = b.color
        ctx.fillRect(Math.round(b.x), Math.round(b.y), b.s, b.s)
        ctx.globalAlpha = b.alpha * 0.3
        ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, b.s + 2, b.s + 2)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return createPortal(
    <canvas ref={canvasRef} className="bg-voxels" aria-hidden="true" />,
    document.body
  )
}
