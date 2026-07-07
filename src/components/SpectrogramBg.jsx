import { useRef, useEffect } from 'react'

const BANDS = 64
const HISTORY = 200

export default function SpectrogramBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const buffer = Array.from({ length: HISTORY }, () =>
      new Float32Array(BANDS)
    )
    let head = 0

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      t += 0.02

      const col = new Float32Array(BANDS)
      for (let i = 0; i < BANDS; i++) {
        const freq = i / BANDS
        const base = Math.sin(freq * 6 + t * 0.8) * 0.3
          + Math.sin(freq * 12 + t * 1.3) * 0.15
          + Math.sin(freq * 3 + t * 0.4) * 0.2
        const harmonic = Math.exp(-Math.pow(freq - 0.3 - Math.sin(t * 0.5) * 0.15, 2) * 20) * 0.6
          + Math.exp(-Math.pow(freq - 0.6 + Math.cos(t * 0.7) * 0.1, 2) * 30) * 0.4
          + Math.exp(-Math.pow(freq - 0.15 + Math.sin(t * 0.3) * 0.05, 2) * 40) * 0.3
        const noise = (Math.random() - 0.5) * 0.08
        col[i] = Math.max(0, Math.min(1, base + harmonic + noise + 0.3))
      }
      buffer[head] = col
      head = (head + 1) % HISTORY

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      const colW = w / HISTORY
      const bandH = h / BANDS

      for (let x = 0; x < HISTORY; x++) {
        const idx = (head + x) % HISTORY
        const data = buffer[idx]
        for (let y = 0; y < BANDS; y++) {
          const val = data[y]
          const r = Math.floor(val * 60)
          const g = Math.floor(val * 255 * 0.8)
          const b = Math.floor(val * 30)
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(
            x * colW,
            h - (y + 1) * bandH,
            colW + 1,
            bandH + 1
          )
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="spectrogram-wrap">
      <canvas ref={canvasRef} />
    </div>
  )
}
