import type { MemoryMotif } from '../data/content'

interface MemoryArtProps {
  motif: MemoryMotif
}

/**
 * Hand-drawn SVG art for each memory card. Gold line work reads as embossed
 * foil on the card's gradient rather than as placeholder imagery.
 */
export function MemoryArt({ motif }: MemoryArtProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (motif === 'sparkler') {
    return (
      <svg viewBox="0 0 280 340" aria-hidden="true">
        <g {...common} opacity="0.92">
          <path d="M140 250v-96" />
          <path d="M140 154c-6-14-6-28 0-40 6 12 6 26 0 40Z" opacity="0.7" />
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2
            const inner = 22 + (i % 3) * 5
            const outer = 52 + (i % 4) * 9
            return (
              <line
                key={i}
                x1={140 + Math.cos(angle) * inner}
                y1={126 + Math.sin(angle) * inner}
                x2={140 + Math.cos(angle) * outer}
                y2={126 + Math.sin(angle) * outer}
                opacity={0.35 + (i % 5) * 0.11}
              />
            )
          })}
          <circle cx="140" cy="126" r="3.2" fill="currentColor" stroke="none" />
          <circle cx="108" cy="96" r="1.7" fill="currentColor" stroke="none" opacity="0.7" />
          <circle cx="176" cy="88" r="1.4" fill="currentColor" stroke="none" opacity="0.5" />
          <circle cx="188" cy="150" r="1.9" fill="currentColor" stroke="none" opacity="0.6" />
          <circle cx="98" cy="164" r="1.4" fill="currentColor" stroke="none" opacity="0.5" />
          <path d="M118 292h44" opacity="0.45" />
        </g>
      </svg>
    )
  }

  if (motif === 'confetti') {
    return (
      <svg viewBox="0 0 280 340" aria-hidden="true">
        <g {...common} opacity="0.9">
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 34 + ((i * 61) % 212)
            const y = 44 + ((i * 97) % 250)
            const rotation = (i * 47) % 180
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={i % 3 === 0 ? 13 : 7}
                height={i % 3 === 0 ? 5 : 11}
                rx="1"
                transform={`rotate(${rotation} ${x + 5} ${y + 5})`}
                opacity={0.35 + (i % 4) * 0.16}
              />
            )
          })}
          <path d="M40 96c34-26 62 16 96-4s56-42 96-18" opacity="0.5" />
          <path d="M30 214c40 18 70-22 106-6s56 34 104 8" opacity="0.28" />
          <circle cx="146" cy="170" r="46" opacity="0.22" />
          <circle cx="146" cy="170" r="67" opacity="0.1" />
          <circle cx="208" cy="112" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="78" cy="252" r="2" fill="currentColor" stroke="none" />
        </g>
      </svg>
    )
  }

  if (motif === 'cake') {
    return (
      <svg viewBox="0 0 280 340" aria-hidden="true">
        <g {...common} opacity="0.9">
          <path d="M62 262h156" opacity="0.6" />
          <path d="M62 262c0-9 6-16 14-16h128c8 0 14 7 14 16" />
          <path d="M78 246V204c0-8 6-14 14-14h96c8 0 14 6 14 14v42" />
          <path d="M104 190v-32c0-8 5-14 12-14h48c7 0 12 6 12 14v32" />
          <path d="M78 222h124" opacity="0.35" />
          <path d="M104 174h76" opacity="0.35" />
          <path d="M140 144v-16" />
          <path d="M140 128c-7-8-7-19 0-27 7 8 7 19 0 27Z" opacity="0.85" />
          <path d="M118 262v-14M162 262v-14" opacity="0.3" />
          <circle cx="96" cy="276" r="2.4" fill="currentColor" stroke="none" opacity="0.7" />
          <circle cx="184" cy="276" r="2.4" fill="currentColor" stroke="none" opacity="0.7" />
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx={106 + i * 12} cy={204} r={1.5} fill="currentColor" stroke="none" opacity="0.55" />
          ))}
          <path d="M40 288h200" opacity="0.22" />
        </g>
      </svg>
    )
  }

  if (motif === 'balloons') {
    return (
      <svg viewBox="0 0 280 340" aria-hidden="true">
        <g {...common} opacity="0.9">
          {[
            { x: 92, y: 118, r: 24, drop: 176 },
            { x: 146, y: 92, r: 30, drop: 200 },
            { x: 196, y: 132, r: 22, drop: 168 },
            { x: 120, y: 172, r: 18, drop: 110 },
            { x: 172, y: 178, r: 19, drop: 118 },
          ].map((balloon, i) => (
            <g key={i} opacity={0.55 + i * 0.09}>
              <ellipse cx={balloon.x} cy={balloon.y} rx={balloon.r} ry={balloon.r * 1.18} />
              <path d={`M${balloon.x} ${balloon.y + balloon.r * 1.18}l-3 6h6Z`} />
              <path
                d={`M${balloon.x} ${balloon.y + balloon.r * 1.18 + 6}c${i % 2 ? 14 : -14} 22 ${
                  i % 2 ? -10 : 10
                } 38 2 ${balloon.drop}`}
                opacity="0.55"
              />
            </g>
          ))}
          <circle cx="94" cy="318" r="2" fill="currentColor" stroke="none" opacity="0.5" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 280 340" aria-hidden="true">
      <g {...common} opacity="0.9">
        <path d="M30 288h220" opacity="0.5" />
        {[80, 140, 200].map((x, i) => (
          <g key={x} opacity={0.6 + i * 0.12}>
            <path d={`M${x} 288V${196 + i * 14}`} />
            <path d={`M${x - 12} ${196 + i * 14}h24`} />
            <path d={`M${x} ${196 + i * 14}v-12`} opacity="0.6" />
            <path
              d={`M${x} ${184 + i * 14}c-7-10-7-20 0-30 7 10 7 20 0 30Z`}
              opacity="0.9"
            />
            <line x1={x} y1={282} x2={x} y2={196 + i * 14} opacity="0.25" />
          </g>
        ))}
        <circle cx="100" cy="142" r="42" opacity="0.12" />
        <circle cx="168" cy="146" r="30" opacity="0.1" />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={i}
            cx={52 + ((i * 43) % 176)}
            cy={62 + ((i * 31) % 62)}
            r={1.2 + (i % 3) * 0.5}
            fill="currentColor"
            stroke="none"
            opacity="0.55"
          />
        ))}
        <path d="M64 320c40-10 112-10 152 0" opacity="0.28" />
      </g>
    </svg>
  )
}
