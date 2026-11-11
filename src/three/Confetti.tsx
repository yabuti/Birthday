import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '../lib/useQuality'

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

/** Continuous gold confetti rain for the finale. */
export function FinaleConfetti() {
  const { lowPower } = useQuality()
  const count = lowPower ? 80 : 170

  const { mesh, particles } = useMemo(() => {
    const rand = mulberry32(1947)
    const geometry = new THREE.PlaneGeometry(0.085, 0.13)
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.42,
      metalness: 0.45,
      emissive: '#2a1018',
      emissiveIntensity: 0.3,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, count)
    instanced.frustumCulled = false

    const palette = ['#f6d9a4', '#e8a7b7', '#fdf1de', '#d7ab66', '#c9778f', '#f9e7be']
    const color = new THREE.Color()
    const list = Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 19,
      y: rand() * 13,
      z: -2.5 + rand() * 9,
      speed: 0.55 + rand() * 1.15,
      sway: rand() * 6.283,
      spin: rand() * 6.283,
      scale: 0.65 + rand() * 1.3,
      tone: palette[Math.floor(rand() * palette.length)],
    }))
    list.forEach((particle, index) => instanced.setColorAt(index, color.set(particle.tone)))
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    material.needsUpdate = true

    return { mesh: instanced, particles: list }
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    particles.forEach((particle, index) => {
      particle.y -= particle.speed * step
      if (particle.y < -0.4) {
        particle.y = 12 + Math.random() * 2.5
        particle.x = (Math.random() - 0.5) * 19
        particle.z = -2.5 + Math.random() * 9
      }
      dummy.position.set(
        particle.x + Math.sin(time * 0.6 + particle.sway) * 0.75,
        particle.y,
        particle.z,
      )
      dummy.rotation.set(
        time * 1.5 + particle.spin,
        time * 1.1 + particle.spin * 0.6,
        Math.sin(time + particle.sway) * 1.1,
      )
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return <primitive object={mesh} />
}
