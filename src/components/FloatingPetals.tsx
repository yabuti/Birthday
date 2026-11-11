import { memo, useEffect, useState } from 'react'

interface Petal {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  rotation: number
  sway: number
  opacity: number
  type: 'petal' | 'sparkle' | 'heart'
}

export const FloatingPetals = memo(function FloatingPetals() {
  const [particles, setParticles] = useState<Petal[]>([])

  useEffect(() => {
    // Generate gentle atmospheric particles
    const list: Petal[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: i % 4 === 0 ? 12 + Math.random() * 8 : i % 4 === 1 ? 4 + Math.random() * 5 : 8 + Math.random() * 6,
      duration: 11 + Math.random() * 14,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      sway: 20 + Math.random() * 40,
      opacity: 0.25 + Math.random() * 0.45,
      type: i % 5 === 0 ? 'heart' : i % 3 === 0 ? 'sparkle' : 'petal',
    }))
    setParticles(list)
  }, [])

  return (
    <div className="floating-petals" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`floating-particle floating-particle--${p.type}`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            ['--sway' as any]: `${p.sway}px`,
            ['--rot' as any]: `${p.rotation}deg`,
          }}
        >
          {p.type === 'heart' ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : p.type === 'sparkle' ? (
            <span className="floating-sparkle-dot" />
          ) : (
            <span className="floating-petal-shape" />
          )}
        </span>
      ))}
    </div>
  )
})
