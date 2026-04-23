import { useEffect, useRef } from 'react'

// Minecraft-style animated day/night hero canvas.
function rand(a, b) { return a + Math.random() * (b - a) }
function mixColor(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16))
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16))
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

const BLOCK = {
  grass: { top: '#7CC242', side: '#8b5a3c', sideTop: '#5a9a2d' },
  dirt: { top: '#8b5a3c', side: '#7a4f34', sideTop: '#6d4730' },
  stone: { top: '#7a7f85', side: '#5c6167', sideTop: '#6a7076' },
  diamond: { top: '#4fd6e2', side: '#2fa3af', sideTop: '#3fbac7' },
  gold: { top: '#C9A227', side: '#8a6f1b', sideTop: '#a88820' },
  wood: { top: '#b27b3d', side: '#6d4a22', sideTop: '#8a6030' },
}

export default function HeroCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, dpr = 1

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = container.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
    }
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    const t0 = performance.now()
    const intensity = 0.7

    function drawIsoBlock(cx, cy, s, type) {
      const b = BLOCK[type] || BLOCK.stone
      ctx.fillStyle = b.top
      ctx.beginPath()
      ctx.moveTo(cx, cy - s * 0.5)
      ctx.lineTo(cx + s * 0.9, cy)
      ctx.lineTo(cx, cy + s * 0.5)
      ctx.lineTo(cx - s * 0.9, cy)
      ctx.closePath(); ctx.fill()

      ctx.fillStyle = b.side
      ctx.beginPath()
      ctx.moveTo(cx, cy + s * 0.5)
      ctx.lineTo(cx + s * 0.9, cy)
      ctx.lineTo(cx + s * 0.9, cy + s)
      ctx.lineTo(cx, cy + s * 1.5)
      ctx.closePath(); ctx.fill()

      ctx.fillStyle = b.sideTop
      ctx.beginPath()
      ctx.moveTo(cx, cy + s * 0.5)
      ctx.lineTo(cx - s * 0.9, cy)
      ctx.lineTo(cx - s * 0.9, cy + s)
      ctx.lineTo(cx, cy + s * 1.5)
      ctx.closePath(); ctx.fill()

      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      for (let i = 0; i < 4; i++) {
        const px = cx + rand(-s * 0.6, s * 0.6)
        const py = cy + rand(-s * 0.3, s * 0.4)
        ctx.fillRect(Math.round(px), Math.round(py), 2, 2)
      }
    }

    function drawDayNight(time) {
      const cycle = 20
      const day = (Math.sin((time / cycle) * Math.PI * 2) + 1) / 2
      const topCol = mixColor('0a0e1e', '62a7e0', day)
      const botCol = mixColor('1a2a4a', 'c9e3ff', day)
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, topCol); g.addColorStop(1, botCol)
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

      if (day < 0.5) {
        const a = (0.5 - day) * 2
        ctx.fillStyle = `rgba(255,255,255,${a * 0.8 * intensity})`
        for (let i = 0; i < 60; i++) {
          const x = (i * 47) % w
          const y = (i * 23) % (h * 0.6)
          ctx.fillRect(Math.round(x), Math.round(y), 2, 2)
        }
      }

      // Celestial body: sun traces a high arc by day, moon traces the opposite
      // arc so it's visible at night instead of disappearing below the horizon.
      const bodyX = w * 0.15 + ((time * w * 0.6) / cycle) % (w * 1.2) - w * 0.1
      const sinT = Math.sin((time / cycle) * Math.PI * 2)
      if (day > 0.5) {
        const sunY = h * 0.65 - sinT * h * 0.5
        ctx.fillStyle = '#ffe58a'
        for (let dx = -3; dx <= 3; dx++)
          for (let dy = -3; dy <= 3; dy++)
            if (dx * dx + dy * dy <= 9)
              ctx.fillRect(Math.round(bodyX + dx * 6), Math.round(sunY + dy * 6), 6, 6)
      } else {
        // Moon — inverted arc so it rises when the sun sets.
        const moonY = h * 0.65 + sinT * h * 0.5
        ctx.fillStyle = '#e6e8ee'
        for (let dx = -3; dx <= 3; dx++)
          for (let dy = -3; dy <= 3; dy++)
            if (dx * dx + dy * dy <= 9)
              ctx.fillRect(Math.round(bodyX + dx * 6), Math.round(moonY + dy * 6), 6, 6)
        // Craters for a bit of character.
        ctx.fillStyle = 'rgba(90,100,120,0.55)'
        ctx.fillRect(Math.round(bodyX - 6), Math.round(moonY - 4), 4, 4)
        ctx.fillRect(Math.round(bodyX + 4), Math.round(moonY + 2), 3, 3)
        ctx.fillRect(Math.round(bodyX - 2), Math.round(moonY + 6), 3, 3)
      }

      ctx.fillStyle = mixColor('0a1420', '556a85', day * 0.6)
      const mh = h * 0.55
      for (let x = 0; x < w; x += 6) {
        const y = mh + Math.sin(x * 0.01 + time * 0.05) * 20 + Math.sin(x * 0.03) * 12
        ctx.fillRect(x, y, 6, h - y)
      }
      ctx.fillStyle = mixColor('0a1810', '3a5a28', day * 0.7)
      const hh = h * 0.7
      for (let x = 0; x < w; x += 6) {
        const y = hh + Math.sin(x * 0.02 + time * 0.08) * 14 + Math.cos(x * 0.04) * 8
        ctx.fillRect(x, y, 6, h - y)
      }

      const rowY = h - 60
      const step = 40
      for (let x = -step; x < w + step; x += step * 0.9) {
        drawIsoBlock(x + (time * 10) % step, rowY, 28, 'grass')
      }

      ctx.fillStyle = `rgba(10,20,40,${(1 - day) * 0.4 * intensity})`
      ctx.fillRect(0, 0, w, h)
    }

    let raf = 0
    function loop() {
      const t = (performance.now() - t0) / 1000
      ctx.clearRect(0, 0, w, h)
      drawDayNight(t)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeChild(canvas)
    }
  }, [])

  return <div ref={containerRef} className="hero-canvas" />
}
