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

/** Gold and rose hearts drifting through the room at different depths. */
export function Hearts() {
  const { lowPower } = useQuality()
  const count = lowPower ? 9 : 18

  const { mesh, hearts } = useMemo(() => {
    const rand = mulberry32(2504)
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.32)
    shape.bezierCurveTo(0, 0.62, -0.52, 0.62, -0.52, 0.24)
    shape.bezierCurveTo(-0.52, -0.08, -0.1, -0.32, 0, -0.52)
    shape.bezierCurveTo(0.1, -0.32, 0.52, -0.08, 0.52, 0.24)
    shape.bezierCurveTo(0.52, 0.62, 0, 0.62, 0, 0.32)

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 2,
      curveSegments: 10,
    })
    geometry.center()

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.28,
      metalness: 0.55,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      emissive: new THREE.Color('#5e1f2f'),
      emissiveIntensity: 0.55,
    })

    const instanced = new THREE.InstancedMesh(geometry, material, count)
    instanced.frustumCulled = false

    const palette = ['#f0b0c1', '#e6c186', '#f9e7d3', '#d59ab4', '#f3d9a7']
    const color = new THREE.Color()
    const list = Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 11,
      baseY: rand() * 6.6,
      z: -3.6 + rand() * 7.4,
      speed: 0.11 + rand() * 0.24,
      sway: 0.2 + rand() * 0.5,
      phase: rand() * 6.283,
      scale: 0.055 + rand() * 0.075,
    }))

    list.forEach((_, index) => {
      instanced.setColorAt(index, color.set(palette[Math.floor(rand() * palette.length)]))
    })
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true

    return { mesh: instanced, hearts: list }
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
    hearts.forEach((heart, index) => {
      const y = ((heart.baseY + time * heart.speed) % 6.8) - 0.35
      dummy.position.set(
        heart.x + Math.sin(time * heart.sway + heart.phase) * 0.55,
        y,
        heart.z + Math.cos(time * 0.2 + heart.phase) * 0.2,
      )
      dummy.rotation.set(
        Math.sin(time * 0.4 + heart.phase) * 0.4,
        time * 0.35 + heart.phase,
        Math.cos(time * 0.32 + heart.phase) * 0.28,
      )
      dummy.scale.setScalar(heart.scale * (0.85 + Math.sin(time * 0.9 + heart.phase) * 0.15))
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return <primitive object={mesh} />
}
