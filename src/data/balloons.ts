import { BIRTHDAY } from '../config'

export type BalloonStyle = 'blush' | 'roseGold' | 'champagne' | 'glitter' | 'ivory'

export interface BalloonSpec {
  id: string
  position: [number, number, number]
  scale: number
  color: string
  metalness: number
  roughness: number
  style: BalloonStyle
  message?: string
  seed: number
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface StyleLook {
  color: string
  metalness: number
  roughness: number
}

const STYLE_LOOK: Record<BalloonStyle, StyleLook> = {
  blush: { color: '#f2b8c6', metalness: 0.03, roughness: 0.22 },
  roseGold: { color: '#d59a94', metalness: 0.62, roughness: 0.24 },
  champagne: { color: '#e6c186', metalness: 0.9, roughness: 0.2 },
  glitter: { color: '#f7e2c4', metalness: 0.05, roughness: 0.08 },
  ivory: { color: '#f7efe2', metalness: 0.02, roughness: 0.32 },
}

const STYLE_CYCLE: BalloonStyle[] = [
  'blush',
  'roseGold',
  'glitter',
  'champagne',
  'ivory',
  'roseGold',
  'blush',
  'ivory',
  'glitter',
  'champagne',
]

interface Spot {
  position: [number, number, number]
  scale: number
}

/**
 * Balloons are arranged in three loose depths in front of the camera so the
 * cluster reads as a real room full of balloons rather than a flat wall.
 */
const SPOTS: Spot[] = [
  { position: [-2.45, 1.5, 3.9], scale: 0.42 },
  { position: [-1.55, 2.3, 4.05], scale: 0.36 },
  { position: [-0.55, 1.25, 3.8], scale: 0.44 },
  { position: [0.45, 1.9, 4.1], scale: 0.38 },
  { position: [1.35, 1.3, 3.85], scale: 0.44 },
  { position: [2.2, 1.95, 4.0], scale: 0.35 },
  { position: [-0.05, 2.95, 4.0], scale: 0.33 },
  { position: [2.75, 2.75, 3.75], scale: 0.3 },
  { position: [-2.9, 2.6, 3.7], scale: 0.3 },
  { position: [-2.0, 3.2, 3.3], scale: 0.3 },
  { position: [-1.1, 2.75, 3.35], scale: 0.33 },
  { position: [-0.25, 3.5, 3.25], scale: 0.28 },
  { position: [0.65, 2.75, 3.3], scale: 0.32 },
  { position: [1.55, 3.3, 3.35], scale: 0.3 },
  { position: [2.5, 1.45, 3.25], scale: 0.34 },
  { position: [-1.6, 1.35, 3.3], scale: 0.35 },
  { position: [0.9, 1.35, 3.4], scale: 0.34 },
  { position: [-0.9, 1.7, 3.1], scale: 0.29 },
  { position: [-2.7, 2.05, 2.7], scale: 0.28 },
  { position: [-1.9, 2.35, 2.55], scale: 0.26 },
  { position: [-0.95, 3.7, 2.6], scale: 0.24 },
  { position: [0.1, 3.9, 2.7], scale: 0.24 },
  { position: [1.05, 3.65, 2.6], scale: 0.25 },
  { position: [2.75, 3.15, 2.65], scale: 0.24 },
  { position: [-2.2, 3.55, 2.5], scale: 0.24 },
  { position: [-1.35, 1.15, 2.45], scale: 0.3 },
  { position: [-0.3, 1.15, 2.55], scale: 0.3 },
  { position: [0.55, 1.2, 2.65], scale: 0.3 },
  { position: [1.45, 1.05, 2.5], scale: 0.32 },
  { position: [2.65, 1.4, 2.45], scale: 0.26 },
]

/** Five of the balloons are hiding a note (editable in src/config.ts). */
const MESSAGE_SPOTS: Record<number, string | undefined> = {
  2: BIRTHDAY.balloonMessages[0],
  9: BIRTHDAY.balloonMessages[1],
  14: BIRTHDAY.balloonMessages[2],
  21: BIRTHDAY.balloonMessages[3],
  27: BIRTHDAY.balloonMessages[4],
}

function buildBalloons(): BalloonSpec[] {
  const rand = mulberry32(25104)

  return SPOTS.map((spot, index) => {
    const style = STYLE_CYCLE[index % STYLE_CYCLE.length]
    const look = STYLE_LOOK[style]
    return {
      id: `balloon-${index}`,
      position: spot.position,
      scale: spot.scale,
      color: look.color,
      metalness: look.metalness,
      roughness: look.roughness,
      style,
      message: MESSAGE_SPOTS[index],
      seed: rand(),
    }
  })
}

export const BALLOONS = buildBalloons()
export const BALLOON_IDS = BALLOONS.map((balloon) => balloon.id)
export const NOTE_BALLOONS = BALLOONS.filter((balloon) => balloon.message)
