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
  type: 'petal' | 'sparkle' | 'heart' | 'butterfly'
}

export const FloatingPetals = memo(function FloatingPetals() {
  const [particles, setParticles] = useState<Petal[]>([])

  useEffect(() => {
    // Generate gentle atmospheric particles
    const list: Petal[] = Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: i % 4 === 0 ? 16 + Math.random() * 8 : i % 4 === 1 ? 5 + Math.random() * 5 : 10 + Math.random() * 7,
      duration: 11 + Math.random() * 14,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      sway: 20 + Math.random() * 40,
      opacity: 0.35 + Math.random() * 0.45,
      type: i % 4 === 0 ? 'butterfly' : i % 3 === 0 ? 'sparkle' : i % 2 === 0 ? 'heart' : 'petal',
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
          {p.type === 'butterfly' ? (
            <span className="floating-butterfly">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10c-.8-2.5-3-4.5-6-4.5-3.3 0-5 2.5-5 5.5 0 3.5 3.5 6 7 7.5-1.5 1-2.5 2.5-2.5 4 0 1.5 1 2.5 2.5 2.5 2 0 4-2.5 4-5 .8 2.5 2.8 5 4 5 1.5 0 2.5-1 2.5-2.5 0-1.5-1-3-2.5-4 3.5-1.5 7-4 7-7.5 0-3-1.7-5.5-5-5.5-3 0-5.2 2-6 4.5z" />
              </svg>
            </span>
          ) : p.type === 'heart' ? (
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
