import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Float, Line, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { BALLOONS, type BalloonSpec } from '../data/balloons'
import { popBalloon, useParty } from '../state/party'
import { useQuality } from '../lib/useQuality'
import { glowTexture } from '../lib/textures'
import { sfx } from '../lib/sfx'
import { Burst } from './Burst'

const balloonGeometry = new THREE.SphereGeometry(1, 26, 20)
balloonGeometry.scale(1, 1.12, 1)
const knotGeometry = new THREE.ConeGeometry(0.07, 0.1, 12)

const stringCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, -1.17, 0),
  new THREE.Vector3(0.05, -1.5, 0.03),
  new THREE.Vector3(-0.05, -1.86, 0.06),
  new THREE.Vector3(0.02, -2.2, 0),
])
const STRING_POINTS = stringCurve.getPoints(10)

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

/** Gold flakes suspended inside the transparent balloons. */
function GlitterCore() {
  const group = useRef<THREE.Points>(null)
  const { lowPower } = useQuality()
  const sprite = useMemo(() => glowTexture(), [])

  const geometry = useMemo(() => {
    const rand = mulberry32(9173)
    const count = lowPower ? 26 : 46
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      const radius = 0.4 + rand() * 0.5
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.cos(phi) * radius * 1.05
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius
    }
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return buffer
  }, [lowPower])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    const points = group.current
    if (!points) return
    points.rotation.y += Math.min(delta, 0.05) * 0.26
    points.rotation.z = Math.sin(state.clock.elapsedTime * 0.34) * 0.14
  })

  return (
    <points ref={group} geometry={geometry}>
      <pointsMaterial
        map={sprite}
        color="#ffe4ae"
        size={0.13}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface BalloonProps {
  spec: BalloonSpec
  popped: boolean
  interactive: boolean
}

function Balloon({ spec, popped, interactive }: BalloonProps) {
  const outer = useRef<THREE.Group>(null)
  const [hidden, setHidden] = useState(popped)
  const [hovered, setHovered] = useState(false)
  const glow = useMemo(() => glowTexture(), [])
  const glass = spec.style === 'glitter'

  useCursor(hovered && interactive)

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(spec.color),
        roughness: glass ? 0.06 : spec.roughness,
        metalness: glass ? 0.05 : spec.metalness,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: glass ? 2.1 : 1.5,
        sheen: 0.55,
        sheenColor: new THREE.Color('#fff2e6'),
        sheenRoughness: 0.7,
        iridescence: glass ? 0.6 : 0,
        iridescenceIOR: 1.32,
        transparent: glass,
        opacity: glass ? 0.3 : 1,
        depthWrite: !glass,
        side: glass ? THREE.DoubleSide : THREE.FrontSide,
      }),
    [spec, glass],
  )

  useEffect(
    () => () => {
      material.dispose()
    },
    [material],
  )

  useEffect(() => {
    const group = outer.current
    if (!group) return
    if (popped) {
      const tween = gsap.to(group.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.17,
        ease: 'power2.in',
      })
      const timer = window.setTimeout(() => setHidden(true), 190)
      return () => {
        tween.kill()
        window.clearTimeout(timer)
      }
    }
    gsap.set(group.scale, { x: 1, y: 1, z: 1 })
    setHidden(false)
    return undefined
  }, [popped])

  if (hidden) return null

  return (
    <group ref={outer} position={spec.position}>
      <group scale={spec.scale}>
        <Float
          speed={0.7 + spec.seed * 0.75}
          rotationIntensity={0.16}
          floatIntensity={0.6}
          floatingRange={[-0.06, 0.14]}
        >
          <group
            rotation={[0.03 + spec.seed * 0.08, spec.seed * 6.283, (spec.seed - 0.5) * 0.09]}
            scale={hovered && interactive ? 1.05 : 1}
          >
            {hovered && interactive ? (
              <sprite scale={[2.7, 2.7, 1]}>
                <spriteMaterial
                  map={glow}
                  color={spec.color}
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </sprite>
            ) : null}

            <mesh geometry={balloonGeometry} material={material} />
            <mesh
              geometry={knotGeometry}
              material={material}
              position={[0, -1.13, 0]}
              rotation={[Math.PI, 0, 0]}
            />

            {glass ? <GlitterCore /> : null}

            <Line points={STRING_POINTS} color="#e2c9a4" lineWidth={0.9} transparent opacity={0.45} />

            <mesh position={[0, -2.26, 0]}>
              <sphereGeometry args={[0.045, 8, 6]} />
              <meshStandardMaterial color="#d8b273" metalness={0.9} roughness={0.3} />
            </mesh>

            <mesh
              position={[0, 0.15, 0]}
              onClick={(event) => {
                event.stopPropagation()
                if (!interactive || popped) return
                popBalloon(spec.id, spec.message)
              }}
              onPointerOver={(event) => {
                event.stopPropagation()
                if (!interactive) return
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
            >
              <sphereGeometry args={[1.14, 12, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        </Float>
      </group>
    </group>
  )
}

interface BurstItem {
  key: number
  position: [number, number, number]
  colors: string[]
}

export function Balloons() {
  const { scene, popped } = useParty()
  const interactive = scene === 3
  const [bursts, setBursts] = useState<BurstItem[]>([])
  const seen = useRef<string[]>([])
  const counter = useRef(0)

  useEffect(() => {
    const added = popped.filter((id) => !seen.current.includes(id))
    seen.current = popped
    if (!added.length) return

    const next: BurstItem[] = []
    let notePopped = false
    added.forEach((id) => {
      const spec = BALLOONS.find((balloon) => balloon.id === id)
      if (!spec) return
      counter.current += 1
      if (spec.message) notePopped = true
      next.push({
        key: counter.current,
        position: spec.position,
        colors: [
          spec.color,
          '#f9e7be',
          '#fdf6ef',
          '#e8a7b7',
          spec.style === 'champagne' ? '#fff4d8' : '#d7ab66',
        ],
      })
    })
    if (!next.length) return
    setBursts((current) => [...current, ...next])
    sfx.pop()
    if (notePopped) sfx.chime(1174.66)
  }, [popped])

  const removeBurst = useCallback((id?: number) => {
    setBursts((current) => current.filter((burst) => burst.key !== id))
  }, [])

  return (
    <group>
      {BALLOONS.map((spec) => (
        <Balloon
          key={spec.id}
          spec={spec}
          popped={popped.includes(spec.id)}
          interactive={interactive}
        />
      ))}

      {bursts.map((burst) => (
        <Burst
          key={burst.key}
          id={burst.key}
          position={burst.position}
          colors={burst.colors}
          count={24}
          seed={burst.key + 3}
          life={1.5}
          onDone={removeBurst}
        />
      ))}
    </group>
  )
}
