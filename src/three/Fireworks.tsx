import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '../lib/useQuality'
import { glowTexture } from '../lib/textures'

const SLOTS = 4
const PER_BURST = 72
const COUNT = SLOTS * PER_BURST

interface Burst {
  active: boolean
  start: number
  life: number
  origin: THREE.Vector3
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

/** One draw call, four reusable bursts of pink-and-gold fireworks. */
export function Fireworks() {
  const { reduced } = useQuality()
  const points = useRef<THREE.Points>(null)
  const bursts = useRef<Burst[]>(
    Array.from({ length: SLOTS }, () => ({
      active: false,
      start: -100,
      life: 2.2,
      origin: new THREE.Vector3(),
    })),
  )
  const nextSpawn = useRef(0)
  const spawnIndex = useRef(0)
  const glow = useMemo(() => glowTexture(), [])

  const { geometry, material, directions, speeds } = useMemo(() => {
    const rand = mulberry32(1987)
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const directions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3 + 1] = -100
      const theta = rand() * Math.PI * 2
      const y = rand() * 1.5 - 0.42
      const r = Math.sqrt(Math.max(0, 1 - Math.min(1, y * y)))
      directions[i * 3] = Math.cos(theta) * r
      directions[i * 3 + 1] = y
      directions[i * 3 + 2] = Math.sin(theta) * r
      speeds[i] = 2.1 + rand() * 3.4
      colors[i * 3] = 0.95
      colors[i * 3 + 1] = 0.75
      colors[i * 3 + 2] = 0.6
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      map: glow,
      size: 0.16,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material, directions, speeds }
  }, [glow])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  const palette = useMemo(
    () => [
      new THREE.Color('#f3a9bd'),
      new THREE.Color('#f9dfae'),
      new THREE.Color('#fdf1de'),
      new THREE.Color('#e88fa8'),
      new THREE.Color('#e8c894'),
    ],
    [],
  )

  const spawn = (time: number) => {
    const slot = spawnIndex.current % SLOTS
    spawnIndex.current += 1
    const burst = bursts.current[slot]
    burst.active = true
    burst.start = time
    burst.life = 2 + Math.random() * 0.6
    burst.origin.set(-5 + Math.random() * 10, 3.8 + Math.random() * 2.8, -4 + Math.random() * 5)

    const colors = geometry.getAttribute('color') as THREE.BufferAttribute
    const base = palette[Math.floor(Math.random() * palette.length)]
    const temporary = new THREE.Color()
    for (let j = 0; j < PER_BURST; j += 1) {
      const index = slot * PER_BURST + j
      const variation = 0.35 + Math.random() * 0.65
      temporary.copy(base).multiplyScalar(variation)
      colors.setXYZ(index, temporary.r, temporary.g, temporary.b)
    }
    colors.needsUpdate = true
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (time >= nextSpawn.current) {
      spawn(time)
      nextSpawn.current = time + (reduced ? 3.4 : 1.15 + Math.random() * 0.85)
    }

    const positions = geometry.getAttribute('position') as THREE.BufferAttribute
    bursts.current.forEach((burst, slot) => {
      const age = time - burst.start
      const visible = burst.active && age >= 0 && age <= burst.life
      for (let j = 0; j < PER_BURST; j += 1) {
        const index = slot * PER_BURST + j
        if (!visible) {
          positions.setY(index, -100)
          continue
        }
        const progress = age / burst.life
        const drag = 1 - progress * 0.55
        const distance = speeds[index] * age * drag
        positions.setXYZ(
          index,
          burst.origin.x + directions[index * 3] * distance,
          burst.origin.y + directions[index * 3 + 1] * distance - 1.9 * age * age * 0.32,
          burst.origin.z + directions[index * 3 + 2] * distance,
        )
      }
    })
    positions.needsUpdate = true

    const pulse = 1 + Math.sin(time * 2.4) * 0.06
    material.size = 0.16 * pulse * (reduced ? 1.15 : 1)
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
