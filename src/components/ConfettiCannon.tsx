import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  tilt: number
  vTilt: number
  opacity: number
  shape: 'rect' | 'circle' | 'ribbon'
  decay: number
}

const PALETTE = [
  '#38bdf8', // sky blue
  '#7dd3fc', // baby blue
  '#0284c7', // royal cyan
  '#bae6fd', // light ice blue
  '#facc15', // champagne gold
  '#f59e0b', // deep amber gold
  '#fef08a', // starlight yellow
  '#ffffff', // pearl white
  '#a5b4fc', // soft periwinkle
]

export function ConfettiCannon() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const onResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const particles: Particle[] = []

    const fireCannon = (
      xOrigin: number,
      yOrigin: number,
      angleDeg: number,
      count: number,
      spread: number
    ) => {
      const angleRad = (angleDeg * Math.PI) / 180
      for (let i = 0; i < count; i++) {
        const spreadRad = ((Math.random() - 0.5) * spread * Math.PI) / 180
        const finalAngle = angleRad + spreadRad
        const speed = 16 + Math.random() * 26
        const shapes: ('rect' | 'circle' | 'ribbon')[] = ['rect', 'rect', 'circle', 'ribbon']

        particles.push({
          x: xOrigin,
          y: yOrigin,
          vx: Math.cos(finalAngle) * speed,
          vy: Math.sin(finalAngle) * speed,
          size: 7 + Math.random() * 10,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          tilt: Math.random() * 10,
          vTilt: 0.05 + Math.random() * 0.12,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          decay: 0.0025 + Math.random() * 0.004,
        })
      }
    }

    // Launch opening cannons from bottom corners
    const launchOpeningCannons = () => {
      // Left cannon shooting up-right across screen
      fireCannon(width * 0.06, height * 0.98, -65, 75, 45)
      // Right cannon shooting up-left across screen
      fireCannon(width * 0.94, height * 0.98, -115, 75, 45)
    }

    launchOpeningCannons()

    // Second celebratory salvo after 850ms
    const timer1 = setTimeout(() => {
      fireCannon(width * 0.15, height * 0.95, -55, 50, 40)
      fireCannon(width * 0.85, height * 0.95, -125, 50, 40)
      // Sky golden shower
      fireCannon(width * 0.5, height * 0.55, -90, 60, 180)
    }, 850)

    // Third gentle high-altitude burst after 1.8s
    const timer2 = setTimeout(() => {
      fireCannon(width * 0.25, height * 0.85, -60, 40, 45)
      fireCannon(width * 0.75, height * 0.85, -120, 40, 45)
    }, 1800)

    // Ambient floating confetti gently falling in the background
    const interval = setInterval(() => {
      if (particles.length < 90) {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: Math.random() * width,
            y: -25,
            vx: (Math.random() - 0.5) * 1.4,
            vy: 1.2 + Math.random() * 2.2,
            size: 6 + Math.random() * 9,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.09,
            tilt: Math.random() * 10,
            vTilt: 0.04 + Math.random() * 0.08,
            opacity: 0.85,
            shape: Math.random() > 0.4 ? 'ribbon' : 'rect',
            decay: 0.0018,
          })
        }
      }
    }, 1200)

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.38 // gravity
        p.vx *= 0.985 // drag
        p.vy *= 0.985
        p.rotation += p.vRot
        p.tilt += p.vTilt
        p.opacity -= p.decay

        if (p.opacity <= 0 || p.y > height + 40) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        const xTilt = Math.sin(p.tilt)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'ribbon') {
          ctx.beginPath()
          ctx.rect(-p.size * 0.3 * xTilt, -p.size * 1.5, p.size * 0.6 * xTilt, p.size * 3)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.rect(-p.size * 0.5 * xTilt, -p.size * 0.5, p.size * xTilt, p.size)
          ctx.fill()
        }

        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearInterval(interval)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="story-confetti-cannon-canvas"
      aria-hidden="true"
    />
  )
}
