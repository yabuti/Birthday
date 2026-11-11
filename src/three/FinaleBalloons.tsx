import { useEffect, useMemo } from 'react'
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

/** Pink and gold balloons rising through the finale, one draw call. */
export function FinaleBalloons() {
  const { lowPower } = useQuality()
  const count = lowPower ? 12 : 22

  const { mesh, balloons } = useMemo(() => {
    const rand = mulberry32(772)
    const geometry = new THREE.SphereGeometry(1, 14, 10)
    geometry.scale(1, 1.15, 1)
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.24,
      metalness: 0.25,
      envMapIntensity: 1.35,
    })
    const instanced = new THREE.InstancedMesh(geometry, material, count)
    instanced.frustumCulled = false

    const palette = ['#f2b3c3', '#e6c186', '#f7e3d2', '#d98fa5', '#f9e7be']
    const color = new THREE.Color()
    const list = Array.from({ length: count }, () => ({
      x: -7 + rand() * 14,
      z: -3.5 + rand() * 7.5,
      baseY: rand() * 11,
      speed: 0.55 + rand() * 0.7,
      sway: 0.25 + rand() * 0.45,
      phase: rand() * 6.283,
      scale: 0.12 + rand() * 0.17,
    }))

    list.forEach((_, index) => {
      instanced.setColorAt(index, color.set(palette[Math.floor(rand() * palette.length)]))
    })
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true

    return { mesh: instanced, balloons: list }
  }, [count])

  useEffect(
    () => () => {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    },
    [mesh],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    balloons.forEach((balloon, index) => {
      const y = ((balloon.baseY + time * balloon.speed) % 11.5) - 0.4
      dummy.position.set(
        balloon.x + Math.sin(time * balloon.sway + balloon.phase) * 0.5,
        y,
        balloon.z + Math.cos(time * 0.24 + balloon.phase) * 0.3,
      )
      dummy.rotation.set(
        Math.sin(time * 0.5 + balloon.phase) * 0.18,
        time * 0.25 + balloon.phase,
        Math.cos(time * 0.4 + balloon.phase) * 0.12,
      )
      dummy.scale.setScalar(balloon.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return <primitive object={mesh} />
}
