import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { CANDLE_COUNT, toggleCandle, useParty } from '../state/party'
import {
  candleStripeTexture,
  flameTexture,
  glowTexture,
  marbleTexture,
  plaqueTexture,
} from '../lib/textures'
import { sfx } from '../lib/sfx'
import { Burst } from './Burst'

const TABLE_TOP = 1.02
const TIER1 = { radius: 0.95, height: 0.5 }
const TIER2 = { radius: 0.7, height: 0.44 }
const TOP_Y = TABLE_TOP + TIER1.height + TIER2.height

/** Half-angle of the slice removed from the front (+Z) of the cake. */
const GAP = 0.36
const SLICE_START = Math.PI / 2 - GAP
const SLICE_END = Math.PI / 2 + GAP
const BODY_START = SLICE_END
const BODY_END = SLICE_START + Math.PI * 2

function sectorGeometry(radius: number, height: number, start: number, end: number) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.absarc(0, 0, radius, start, end, false)
  shape.lineTo(0, 0)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.008,
    bevelSegments: 1,
    curveSegments: 56,
  })
  geometry.rotateX(Math.PI / 2)
  geometry.translate(0, height, 0)
  return geometry
}

function bandGeometry(
  innerRadius: number,
  outerRadius: number,
  height: number,
  start: number,
  end: number,
) {
  const shape = new THREE.Shape()
  shape.moveTo(Math.cos(start) * outerRadius, Math.sin(start) * outerRadius)
  shape.absarc(0, 0, outerRadius, start, end, false)
  shape.lineTo(Math.cos(end) * innerRadius, Math.sin(end) * innerRadius)
  shape.absarc(0, 0, innerRadius, end, start, true)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 56,
  })
  geometry.rotateX(Math.PI / 2)
  geometry.translate(0, height, 0)
  return geometry
}

interface TierProps {
  radius: number
  height: number
  y: number
  start: number
  end: number
  color: string
}

function Tier({ radius, height, y, start, end, color }: TierProps) {
  const geometry = useMemo(
    () => sectorGeometry(radius, height, start, end),
    [radius, height, start, end],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} position={[0, y, 0]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.56}
        clearcoat={0.35}
        clearcoatRoughness={0.5}
        envMapIntensity={0.95}
        sheen={0.65}
        sheenColor="#fff2e6"
        sheenRoughness={0.85}
      />
    </mesh>
  )
}

interface BandProps {
  radius: number
  thickness: number
  height: number
  y: number
  start: number
  end: number
}

function Band({ radius, thickness, height, y, start, end }: BandProps) {
  const geometry = useMemo(
    () => bandGeometry(radius - thickness, radius, height, start, end),
    [radius, thickness, height, start, end],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} position={[0, y, 0]}>
      <meshStandardMaterial
        color="#d9b273"
        metalness={0.95}
        roughness={0.22}
        envMapIntensity={1.6}
      />
    </mesh>
  )
}

const PEARL_COUNT = 20
const PEARL_ANGLES = Array.from({ length: PEARL_COUNT }, (_, i) => {
  const start = BODY_START + 0.1
  const end = BODY_END - 0.1
  return start + ((i + 0.5) / PEARL_COUNT) * (end - start)
})

function Pearls() {
  const mesh = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.028, 12, 10)
    const material = new THREE.MeshStandardMaterial({
      color: '#f7e4bb',
      metalness: 0.9,
      roughness: 0.24,
      envMapIntensity: 1.6,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, PEARL_COUNT)
    const dummy = new THREE.Object3D()
    PEARL_ANGLES.forEach((angle, index) => {
      dummy.position.set(Math.cos(angle) * 0.825, 0, Math.sin(angle) * 0.825)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      instanced.setMatrixAt(index, dummy.matrix)
    })
    instanced.instanceMatrix.needsUpdate = true
    return instanced
  }, [])

  return <primitive object={mesh} position={[0, TABLE_TOP + TIER1.height + 0.012, 0]} />
}

const CANDLE_ANGLES = Array.from({ length: CANDLE_COUNT }, (_, i) => {
  const start = BODY_START + 0.16
  const end = BODY_END - 0.16
  return start + ((i + 0.5) / CANDLE_COUNT) * (end - start)
})

interface CandleProps {
  index: number
  angle: number
  lit: boolean
  interactive: boolean
}

function Candle({ index, angle, lit, interactive }: CandleProps) {
  const flame = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const stripe = useMemo(() => candleStripeTexture(), [])
  const fire = useMemo(() => flameTexture(), [])
  useCursor(hovered && interactive)

  const height = 0.3
  const x = Math.cos(angle) * 0.4
  const z = Math.sin(angle) * 0.4

  useFrame((state) => {
    const group = flame.current
    if (!group) return
    const target = lit ? 1 : 0.0001
    group.scale.x += (target - group.scale.x) * 0.2
    group.scale.y += (target - group.scale.y) * 0.24
    group.scale.z = group.scale.x
    if (lit) {
      const t = state.clock.elapsedTime * 8 + index
      group.scale.y *= 1 + Math.sin(t) * 0.09 + Math.sin(t * 2.7) * 0.05
      group.position.x = Math.sin(t * 0.7) * 0.004
      group.position.z = Math.cos(t * 0.9) * 0.004
    }
    group.visible = group.scale.x > 0.01
  })

  return (
    <group position={[x, TOP_Y, z]}>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.034, 0.04, 0.024, 14]} />
        <meshStandardMaterial color="#d9b273" metalness={0.95} roughness={0.24} />
      </mesh>

      <mesh position={[0, height / 2 + 0.022, 0]}>
        <cylinderGeometry args={[0.017, 0.017, height, 14]} />
        <meshStandardMaterial map={stripe} roughness={0.55} metalness={0.05} />
      </mesh>

      <mesh position={[0, height + 0.034, 0]}>
        <cylinderGeometry args={[0.0018, 0.0018, 0.02, 6]} />
        <meshStandardMaterial color="#3b2a22" roughness={0.85} />
      </mesh>

      <group ref={flame} position={[0, height + 0.08, 0]} scale={0.0001} visible={false}>
        <mesh>
          <coneGeometry args={[0.014, 0.056, 8]} />
          <meshStandardMaterial
            color="#ffd9a4"
            emissive="#ffa758"
            emissiveIntensity={3.4}
            toneMapped={false}
          />
        </mesh>
        <sprite scale={[0.2, 0.2, 1]} position={[0, 0.006, 0]}>
          <spriteMaterial
            map={fire}
            color="#ffb066"
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      <mesh
        position={[0, height / 2, 0]}
        onClick={(event) => {
          event.stopPropagation()
          if (!interactive) return
          toggleCandle(index)
          if (lit) sfx.whoosh()
          else sfx.chime(1046.5)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          if (!interactive) return
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.095, 0.095, height + 0.16, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function CandleRing({ interactive }: { interactive: boolean }) {
  const { litCandles } = useParty()
  return (
    <group>
      {CANDLE_ANGLES.map((angle, index) => (
        <Candle
          key={index}
          index={index}
          angle={angle}
          lit={litCandles.includes(index)}
          interactive={interactive}
        />
      ))}
    </group>
  )
}

function Table() {
  const marble = useMemo(() => marbleTexture(), [])
  return (
    <group>
      <mesh position={[0, TABLE_TOP - 0.045, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.09, 72]} />
        <meshPhysicalMaterial
          map={marble}
          color="#fbf1e7"
          roughness={0.28}
          metalness={0.04}
          clearcoat={0.55}
          clearcoatRoughness={0.35}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, TABLE_TOP - 0.004, 0]}>
        <torusGeometry args={[1.995, 0.012, 8, 96]} />
        <meshStandardMaterial color="#d9b273" metalness={0.95} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.4, 0.46, 0.86, 48]} />
        <meshStandardMaterial map={marble} color="#f6e8dd" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.95, 1.0, 0.1, 56]} />
        <meshStandardMaterial map={marble} color="#f6e8dd" roughness={0.32} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.112, 0]}>
        <torusGeometry args={[0.95, 0.008, 6, 72]} />
        <meshStandardMaterial color="#c9a066" metalness={0.9} roughness={0.28} />
      </mesh>
    </group>
  )
}

function Plate() {
  return (
    <group position={[1.28, TABLE_TOP + 0.02, 0.3]}>
      <mesh>
        <cylinderGeometry args={[0.6, 0.56, 0.03, 56]} />
        <meshPhysicalMaterial color="#fdf4e9" roughness={0.25} clearcoat={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.017, 0]}>
        <torusGeometry args={[0.598, 0.008, 6, 72]} />
        <meshStandardMaterial color="#d9b273" metalness={0.95} roughness={0.22} />
      </mesh>
    </group>
  )
}

function Topper() {
  const plaque = useMemo(() => plaqueTexture(), [])
  return (
    <group position={[0, TOP_Y + 0.42, -0.5]}>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.34, 6]} />
        <meshStandardMaterial color="#c9a05f" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.48, 0.24]} />
        <meshBasicMaterial
          map={plaque}
          transparent
          alphaTest={0.08}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function CakeSlice() {
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const slice = group.current
    if (!slice) return
    gsap.set(slice.position, { x: 0, y: TABLE_TOP, z: 0 })
    gsap.set(slice.rotation, { y: 0 })
    const timeline = gsap.timeline({ delay: 1.5 })
    timeline
      .to(slice.position, { y: TABLE_TOP + 0.2, duration: 0.55, ease: 'power2.out' })
      .to(slice.position, { x: 1.28, z: 0.3, duration: 1.35, ease: 'power3.inOut' }, '>-0.05')
      .to(slice.rotation, { y: -0.72, duration: 1.35, ease: 'power3.inOut' }, '<')
      .to(slice.position, { y: TABLE_TOP + 0.055, duration: 0.5, ease: 'power2.in' }, '<0.85')
    return () => {
      timeline.kill()
    }
  }, [])

  return (
    <group ref={group} position={[0, TABLE_TOP, 0]}>
      <Tier
        radius={TIER1.radius}
        height={TIER1.height}
        y={0}
        start={SLICE_START}
        end={SLICE_END}
        color="#f9e0e4"
      />
      <Tier
        radius={TIER2.radius}
        height={TIER2.height}
        y={TIER1.height}
        start={SLICE_START}
        end={SLICE_END}
        color="#fdf4e9"
      />
      <Band
        radius={0.958}
        thickness={0.026}
        height={0.05}
        y={0.035}
        start={SLICE_START}
        end={SLICE_END}
      />
    </group>
  )
}

const bladeGeometry = (() => {
  const shape = new THREE.Shape()
  shape.moveTo(-0.24, -0.045)
  shape.lineTo(0.16, -0.05)
  shape.quadraticCurveTo(0.27, -0.045, 0.29, 0)
  shape.quadraticCurveTo(0.27, 0.045, 0.16, 0.05)
  shape.lineTo(-0.24, 0.045)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.002,
    bevelSize: 0.002,
    bevelSegments: 1,
    curveSegments: 12,
  })
  geometry.rotateX(Math.PI / 2)
  return geometry
})()

function Knife({ cutting, onFinish }: { cutting: boolean; onFinish: () => void }) {
  const group = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const knife = group.current
    if (!cutting || !knife) return
    const timeline = gsap.timeline({ onComplete: onFinish })
    timeline
      .set(knife.position, { x: 1.65, y: 3.8, z: 1.25 })
      .set(knife.rotation, { z: -1.1 })
      .to(knife.position, { x: 0.16, y: 2.95, z: 0.6, duration: 0.95, ease: 'power2.inOut' })
      .to(knife.rotation, { z: -1.53, duration: 0.7, ease: 'power2.inOut' }, '<')
      .to(knife.position, { y: 1.7, duration: 0.55, ease: 'power2.in' })
      .call(() => sfx.slice())
      .to(knife.position, { y: 3.5, x: 1.55, duration: 0.95, ease: 'power2.in' }, '+=0.1')
    return () => {
      timeline.kill()
    }
  }, [cutting, onFinish])

  return (
    <group ref={group} visible={cutting} position={[1.65, 3.8, 1.25]} rotation={[0, 0, -1.1]}>
      <mesh geometry={bladeGeometry}>
        <meshStandardMaterial color="#e7d3b0" metalness={1} roughness={0.19} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[-0.255, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.035, 16]} />
        <meshStandardMaterial color="#c9a05f" metalness={0.95} roughness={0.25} />
      </mesh>
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.023, 0.19, 16]} />
        <meshStandardMaterial color="#b98f52" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[-0.452, 0, 0]}>
        <sphereGeometry args={[0.036, 16, 12]} />
        <meshStandardMaterial color="#d9b273" metalness={0.95} roughness={0.22} />
      </mesh>
    </group>
  )
}

export function CakeStation() {
  const { litCandles, cakeCut, wishMade, scene } = useParty()
  const [knifeOn, setKnifeOn] = useState(false)
  const [sparks, setSparks] = useState<{ key: number } | null>(null)
  const [smoke, setSmoke] = useState<{ key: number } | null>(null)
  const previousWish = useRef(wishMade)
  const glow = useMemo(() => glowTexture(), [])

  const clearSparks = useCallback(() => setSparks(null), [])
  const clearSmoke = useCallback(() => setSmoke(null), [])
  const finishKnife = useCallback(() => setKnifeOn(false), [])

  useEffect(() => {
    if (!cakeCut) {
      setKnifeOn(false)
      setSparks(null)
      return
    }
    setKnifeOn(true)
    const timer = window.setTimeout(() => setSparks({ key: Date.now() }), 1480)
    return () => window.clearTimeout(timer)
  }, [cakeCut])

  useEffect(() => {
    if (!wishMade || previousWish.current) {
      previousWish.current = wishMade
      return
    }
    previousWish.current = wishMade
    const key = Date.now()
    setSmoke({ key })
    const timer = window.setTimeout(() => setSmoke(null), 2400)
    return () => window.clearTimeout(timer)
  }, [wishMade])

  const bodyStart = cakeCut ? BODY_START : 0
  const bodyEnd = cakeCut ? BODY_END : Math.PI * 2
  const lit = litCandles.length

  return (
    <group>
      <Table />

      <Tier
        radius={TIER1.radius}
        height={TIER1.height}
        y={TABLE_TOP}
        start={bodyStart}
        end={bodyEnd}
        color="#f9e0e4"
      />
      <Tier
        radius={TIER2.radius}
        height={TIER2.height}
        y={TABLE_TOP + TIER1.height}
        start={bodyStart}
        end={bodyEnd}
        color="#fdf4e9"
      />
      <Band
        radius={0.958}
        thickness={0.026}
        height={0.05}
        y={TABLE_TOP + 0.035}
        start={bodyStart}
        end={bodyEnd}
      />
      <Band
        radius={0.706}
        thickness={0.022}
        height={0.035}
        y={TABLE_TOP + TIER1.height + 0.018}
        start={bodyStart}
        end={bodyEnd}
      />
      <Pearls />

      <CandleRing interactive={scene === 1} />
      <Topper />
      <Plate />

      {cakeCut ? <CakeSlice /> : null}
      <Knife cutting={knifeOn} onFinish={finishKnife} />

      {sparks ? (
        <Burst
          id={sparks.key}
          position={[0.16, 1.98, 0.66]}
          colors={['#f9e7be', '#ffffff', '#e8c894', '#f3cf9a']}
          count={26}
          seed={13}
          life={1.4}
          onDone={clearSparks}
        />
      ) : null}

      {smoke ? (
        <Burst
          id={smoke.key}
          position={[0, TOP_Y + 0.22, 0]}
          colors={['#f3e7dd', '#d9c9bf', '#fdf6ef']}
          count={16}
          seed={5}
          life={2.2}
          onDone={clearSmoke}
        />
      ) : null}

      <pointLight
        position={[0, TOP_Y + 0.3, 0]}
        intensity={lit === 0 ? 0 : 0.9 + lit * 0.45}
        distance={2.6}
        decay={2}
        color="#ffb066"
      />

      <sprite position={[0, TOP_Y + 0.16, 0.1]} scale={[lit ? 0.9 + lit * 0.06 : 0.001, lit ? 0.9 : 0.001, 1]}>
        <spriteMaterial
          map={glow}
          color="#ffc27a"
          transparent
          opacity={lit ? 0.16 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
