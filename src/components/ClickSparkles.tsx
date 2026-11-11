import { useEffect, useState } from 'react'

interface SparkleItem {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
}

const COLORS = ['#38bdf8', '#7dd3fc', '#bae6fd', '#facc15', '#ffffff', '#e0f2fe']

export function ClickSparkles() {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([])

  useEffect(() => {
    let count = 0
    const handlePointerDown = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e
      const newItems: SparkleItem[] = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5)
        const speed = 25 + Math.random() * 45
        return {
          id: ++count,
          x,
          y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }
      })

      setSparkles((prev) => [...prev.slice(-24), ...newItems])

      setTimeout(() => {
        setSparkles((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)))
      }, 700)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div className="click-sparkles-container" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="click-sparkle"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 8px ${s.color}`,
            ['--dx' as any]: `${s.dx}px`,
            ['--dy' as any]: `${s.dy}px`,
          }}
        />
      ))}
    </div>
  )
}
