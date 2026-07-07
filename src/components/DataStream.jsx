import { useRef, useEffect } from 'react'

const CHARS = '01{}[]()=>|<>/;:,.+-*%#@!?ABCDEFabcdef0123456789ΔΣλπ∫∂'
const COLS = 60
const FONT_SIZE = 14

export default function DataStream() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const columns = Math.floor(canvas.width / FONT_SIZE)
    const drops = Array.from({ length: columns }, () =>
      Math.random() * -100
    )

    let animId
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE

        const brightness = Math.random()
        if (brightness > 0.95) {
          ctx.fillStyle = 'rgba(57, 255, 20, 0.9)'
          ctx.font = `bold ${FONT_SIZE}px monospace`
        } else {
          ctx.fillStyle = `rgba(57, 255, 20, ${0.08 + brightness * 0.15})`
          ctx.font = `${FONT_SIZE}px monospace`
        }

        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i] += 0.3 + Math.random() * 0.2
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
    <div className="data-stream-wrap">
      <canvas ref={canvasRef} className="data-stream-canvas" />
    </div>
  )
}
