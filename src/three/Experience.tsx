import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useParty } from '../state/party'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { Stage } from './Stage'
import { Balloons } from './Balloons'
import { CakeStation } from './CakeStation'
import { Gifts } from './Gifts'
import { Glitter } from './Glitter'
import { Hearts } from './Hearts'
import { FinaleConfetti } from './Confetti'
import { Fireworks } from './Fireworks'
import { FinaleBalloons } from './FinaleBalloons'

export function Experience() {
  const { scene } = useParty()

  return (
    <Canvas
      dpr={[1, 1.85]}
      camera={{ position: [0, 2.4, 10.4], fov: 44, near: 0.1, far: 70 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
      }}
    >
      <fog attach="fog" args={['#1d0a15', 13, 36]} />
      <Lighting />
      <CameraRig />
      <Stage />
      <Balloons />
      <CakeStation />
      <Gifts />
      <Hearts />
      <Glitter />
      {scene === 7 ? (
        <>
          <FinaleConfetti />
          <Fireworks />
          <FinaleBalloons />
        </>
      ) : null}
    </Canvas>
  )
}
