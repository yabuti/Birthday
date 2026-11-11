import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { SCENES, useParty, type SceneId } from '../state/party'
import { useQuality } from '../lib/useQuality'

interface Shot {
  pos: [number, number, number]
  look: [number, number, number]
  fov: number
}

/**
 * One cinematic camera per scene. Positions are deliberately close to the
 * action: cake, slice, gifts and letter all get their own framing.
 */
const SHOTS: Record<SceneId, Shot> = {
  welcome: { pos: [0, 2.45, 10.6], look: [0, 2.1, 0], fov: 44 },
  cake: { pos: [0, 2.32, 5.15], look: [0, 1.72, 0.05], fov: 38 },
  cut: { pos: [1.55, 2.2, 4.65], look: [0.32, 1.55, 0.28], fov: 36 },
  balloons: { pos: [0, 2.5, 7.7], look: [0, 2.35, 0.2], fov: 46 },
  gifts: { pos: [-0.5, 1.85, 5.35], look: [-1.4, 0.82, 1.6], fov: 40 },
  memories: { pos: [0, 2.95, 10.8], look: [0, 2.2, 0], fov: 48 },
  letter: { pos: [0.2, 2.02, 6.6], look: [0, 1.76, 0], fov: 40 },
  finale: { pos: [0, 3.25, 11.3], look: [0, 2.35, 0], fov: 50 },
}

const ease = 'power3.inOut'

export function CameraRig() {
  const { camera, size } = useThree()
  const sceneIndex = useParty().scene
  const id = SCENES[sceneIndex].id
  const { reduced } = useQuality()

  const position = useRef(new THREE.Vector3(0, 2.4, 11))
  const target = useRef(new THREE.Vector3(0, 2.1, 0))
  const desired = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const cameraRef = useRef(camera)
  cameraRef.current = camera

  const portrait = size.height > size.width * 1.05

  useEffect(() => {
    const shot = SHOTS[id]
    const duration = reduced ? 0.5 : 2.6
    gsap.to(position.current, {
      x: shot.pos[0] * (portrait ? 1.1 : 1),
      y: shot.pos[1] + (portrait ? 0.45 : 0),
      z: shot.pos[2] * (portrait ? 1.38 : 1),
      duration,
      ease,
      overwrite: true,
    })
    gsap.to(target.current, {
      x: shot.look[0],
      y: shot.look[1],
      z: shot.look[2],
      duration,
      ease,
      overwrite: true,
    })
    const perspective = cameraRef.current as THREE.PerspectiveCamera
    gsap.to(perspective, {
      fov: shot.fov + (portrait ? 5 : 0),
      duration: reduced ? 0.5 : 2.3,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => perspective.updateProjectionMatrix(),
    })
  }, [id, portrait, reduced])

  useFrame((state, delta) => {
    const perspective = cameraRef.current
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 3.1)
    const px = reduced ? 0 : state.pointer.x
    const py = reduced ? 0 : state.pointer.y
    const breathe = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.32) * 0.035

    desired.current.copy(position.current)
    desired.current.x += px * 0.26
    desired.current.y += py * 0.13 + breathe

    // A slow cinematic drift on the finale while the fireworks play.
    if (id === 'finale' && !reduced) {
      const time = state.clock.elapsedTime
      desired.current.x += Math.sin(time * 0.15) * 0.42
      desired.current.y += Math.sin(time * 0.11) * 0.16
      desired.current.z += Math.cos(time * 0.13) * 0.3
    }
    perspective.position.lerp(desired.current, k)

    lookAt.current.copy(target.current)
    lookAt.current.x += px * 0.12
    lookAt.current.y += py * 0.07
    perspective.lookAt(lookAt.current)
  })

  return null
}
