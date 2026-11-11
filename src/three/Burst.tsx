import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BurstProps {
  position: [number, number, number]
  colors?: string[]
  life?: number
  count?: number
  seed?: number
  id?: number
  onDone: (id?: number) => void
}

/**
 * Short-lived confetti burst used for balloon pops, the cake cut and blown-out
 * candles. One instanced mesh per burst keeps it to a single draw call.
 */
export function Burst({
  position,
  colors = ['#f6d9a4', '#e8a7b7', '#fdf1de', '#d7ab66', '#c9778f'],
  life = 1.5,
  count = 20,
  seed = 7,
  id,
  onDone,
}: BurstProps) {
  const elapsed = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    let state = seed * 9301 + 49297
    const rand = () => {
      state = (state * 9301 + 49297) % 233280
      return state / 233280
    }
    return Array.from({ length: count }, () => ({
      dir: [rand() - 0.5, 0.2 + rand() * 0.95, rand() - 0.5] as [number, number, number],
      speed: 1.3 + rand() * 2.8,
      spin: [rand() * 6, rand() * 6] as [number, number],
      size: 0.55 + rand() * 1.25,
      color: colors[Math.floor(rand() * colors.length)],
    }))
  }, [count, seed, colors])

  const mesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(0.07, 0.1)
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.42,
      metalness: 0.38,
      transparent: true,
      emissive: '#2a1018',
      emissiveIntensity: 0.35,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, count)
    instanced.frustumCulled = false
    const color = new THREE.Color()
    particles.forEach((particle, index) => {
      instanced.setColorAt(index, color.set(particle.color))
    })
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    material.needsUpdate = true
    return instanced
  }, [count, particles])

  useEffect(() => {
    const timer = window.setTimeout(() => onDone(id), life * 1000)
    return () => window.clearTimeout(timer)
  }, [life, onDone, id])

  useEffect(
    () => () => {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    },
    [mesh],
  )

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.06)
    const t = elapsed.current
    const fade = Math.max(0, 1 - t / life)

    particles.forEach((particle, index) => {
      dummy.position.set(
        particle.dir[0] * particle.speed * t,
        particle.dir[1] * particle.speed * t - 2.1 * t * t,
        particle.dir[2] * particle.speed * t,
      )
      dummy.rotation.set(particle.spin[0] + t * 7, particle.spin[1] + t * 5, t * 3.5)
      dummy.scale.setScalar(Math.max(0.001, particle.size * (0.35 + fade * 0.65)))
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    ;(mesh.material as THREE.MeshStandardMaterial).opacity = fade
  })

  return <primitive object={mesh} position={position} />
}
