import { useRef, useEffect } from 'react'

export default function PrismaticBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.003,
      vy: (Math.random() - 0.5) * 0.003,
      r: 0.25 + Math.random() * 0.3,
      hue: (i / 7) * 360,
      phase: Math.random() * Math.PI * 2,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      t += 0.004

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'screen'

      for (const blob of blobs) {
        blob.x += blob.vx + Math.sin(t + blob.phase) * 0.001
        blob.y += blob.vy + Math.cos(t * 0.7 + blob.phase) * 0.001

        if (blob.x < -0.2) blob.vx = Math.abs(blob.vx)
        if (blob.x > 1.2) blob.vx = -Math.abs(blob.vx)
        if (blob.y < -0.2) blob.vy = Math.abs(blob.vy)
        if (blob.y > 1.2) blob.vy = -Math.abs(blob.vy)

        const cx = blob.x * w
        const cy = blob.y * h
        const radius = blob.r * Math.min(w, h)

        const hue = blob.hue + t * 20
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.6)`)
        grad.addColorStop(0.4, `hsla(${hue + 40}, 90%, 60%, 0.3)`)
        grad.addColorStop(1, `hsla(${hue + 80}, 80%, 50%, 0)`)

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      ctx.globalCompositeOperation = 'overlay'
      for (let i = 0; i < 3; i++) {
        const y = (Math.sin(t * 2 + i * 1.5) * 0.5 + 0.5) * h
        const grad = ctx.createLinearGradient(0, y - 60, 0, y + 60)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${0.08 + Math.sin(t * 3 + i) * 0.04})`)
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      ctx.globalCompositeOperation = 'source-over'

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="prismatic-canvas" />
}
