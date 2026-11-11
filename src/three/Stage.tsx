import { useMemo } from 'react'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import {
  backdropTexture,
  floorPoolTexture,
  glowTexture,
  shaftTexture,
} from '../lib/textures'

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

function Hoop() {
  return (
    <group position={[0, 2.48, -2.95]}>
      <mesh>
        <torusGeometry args={[2.16, 0.021, 12, 128]} />
        <meshStandardMaterial color="#d9b071" metalness={0.92} roughness={0.26} envMapIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <torusGeometry args={[2.34, 0.005, 8, 128]} />
        <meshBasicMaterial color="#e8c894" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -2.48, 0.1]}>
        <torusGeometry args={[0.7, 0.012, 8, 64]} />
        <meshStandardMaterial color="#c9a066" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}

/** Organic balloon garland draped over the gold hoop. */
function Garland() {
  const mesh = useMemo(() => {
    const rand = mulberry32(7725)
    const count = 46
    const geometry = new THREE.SphereGeometry(1, 12, 10)
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.28,
      envMapIntensity: 1.15,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, count)
    const dummy = new THREE.Object3D()
    const palette = ['#f0b8c6', '#f9d9e0', '#dda2b2', '#e4c089', '#f7ecdd', '#c9778f']
    const color = new THREE.Color()

    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1)
      const angle = Math.PI * (0.05 + t * 0.9)
      const cluster = t < 0.16 || t > 0.84
      const radius = (cluster ? 2.02 : 2.16) + (rand() - 0.5) * 0.22
      dummy.position.set(
        Math.cos(angle) * radius,
        2.48 + Math.sin(angle) * radius,
        -2.95 + (rand() - 0.5) * 0.5,
      )
      const size = (cluster ? 0.19 : 0.1) + rand() * 0.1
      dummy.scale.setScalar(size)
      dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
      instanced.setColorAt(i, color.set(palette[Math.floor(rand() * palette.length)]))
    }

    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    return instanced
  }, [])

  return <primitive object={mesh} />
}

function buildBokeh(count: number) {
  const rand = mulberry32(4321)
  return Array.from({ length: count }, () => ({
    position: [(rand() - 0.5) * 19, 0.9 + rand() * 4.4, -6.8 + rand() * 4.2] as [
      number,
      number,
      number,
    ],
    scale: 0.24 + rand() * 0.9,
    color: rand() > 0.42 ? '#f3cf9a' : '#f3b6c5',
    opacity: 0.1 + rand() * 0.28,
  }))
}

function Bokeh() {
  const glow = useMemo(() => glowTexture(), [])
  const orbs = useMemo(() => buildBokeh(18), [])
  return (
    <group>
      {orbs.map((orb, index) => (
        <sprite key={index} position={orb.position} scale={[orb.scale, orb.scale, 1]}>
          <spriteMaterial
            map={glow}
            color={orb.color}
            transparent
            opacity={orb.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

function LightShafts() {
  const shaft = useMemo(() => shaftTexture(), [])
  return (
    <group>
      {[
        { position: [-3.1, 4.6, -2.4] as [number, number, number], rotation: 0.18 },
        { position: [3.3, 4.9, -3.2] as [number, number, number], rotation: -0.22 },
      ].map((shaftConfig, index) => (
        <mesh key={index} position={shaftConfig.position} rotation={[0, 0, shaftConfig.rotation]}>
          <coneGeometry args={[1.85, 7.4, 36, 1, true]} />
          <meshBasicMaterial
            map={shaft}
            transparent
            opacity={0.09}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export function Stage() {
  const pool = useMemo(() => floorPoolTexture(), [])
  const backdrop = useMemo(() => backdropTexture(), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[17, 72]} />
        <meshStandardMaterial color="#1d0d17" roughness={0.32} metalness={0.58} envMapIntensity={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial
          map={pool}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {[4.9, 7.6].map((radius) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
          <ringGeometry args={[radius, radius + 0.013, 128]} />
          <meshBasicMaterial color="#c9a066" transparent opacity={0.28} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh position={[0, 4.4, -13]}>
        <planeGeometry args={[34, 17]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} />
      </mesh>

      <Hoop />
      <Garland />
      <Bokeh />
      <LightShafts />

      <ContactShadows
        position={[0, 0.008, 0]}
        scale={17}
        blur={3.2}
        far={5}
        opacity={0.52}
        resolution={512}
        color="#1a0810"
        frames={1}
      />
    </group>
  )
}
