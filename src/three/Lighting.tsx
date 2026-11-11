import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Builds a small warm studio environment from a canvas gradient and pre-filters
 * it with PMREM. Balloons and gold surfaces get real specular highlights from it
 * without loading an external HDRI.
 */
function useStudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const width = 1024
    const height = 512
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const sky = ctx.createLinearGradient(0, 0, 0, height)
    sky.addColorStop(0, '#fff1de')
    sky.addColorStop(0.28, '#f8d3d9')
    sky.addColorStop(0.55, '#8d4a5c')
    sky.addColorStop(0.78, '#3a1a26')
    sky.addColorStop(1, '#150910')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, height)

    const key = ctx.createRadialGradient(300, 120, 0, 300, 120, 230)
    key.addColorStop(0, 'rgba(255,255,255,1)')
    key.addColorStop(0.4, 'rgba(255,240,220,0.7)')
    key.addColorStop(1, 'rgba(255,235,210,0)')
    ctx.fillStyle = key
    ctx.fillRect(0, 0, width, height)

    const fill = ctx.createRadialGradient(760, 230, 0, 760, 230, 280)
    fill.addColorStop(0, 'rgba(255,170,190,0.75)')
    fill.addColorStop(1, 'rgba(255,170,190,0)')
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, width, height)

    const bounce = ctx.createRadialGradient(520, 430, 0, 520, 430, 300)
    bounce.addColorStop(0, 'rgba(246,205,150,0.6)')
    bounce.addColorStop(1, 'rgba(246,205,150,0)')
    ctx.fillStyle = bounce
    ctx.fillRect(0, 0, width, height)

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(gl)
    const envMap = pmrem.fromEquirectangular(texture).texture
    scene.environment = envMap

    texture.dispose()
    pmrem.dispose()

    return () => {
      scene.environment = null
      envMap.dispose()
    }
  }, [gl, scene])
}

export function Lighting() {
  useStudioEnvironment()

  return (
    <group>
      <ambientLight intensity={0.42} color="#ffe8ef" />
      <hemisphereLight args={['#ffd8e2', '#180a12', 0.65]} />
      <directionalLight position={[4.8, 7.2, 5.2]} intensity={2.1} color="#ffe6cd" />
      <pointLight position={[-4.2, 3.4, 2.6]} intensity={26} distance={16} decay={2} color="#ff9db8" />
      <pointLight position={[3.8, 2.4, -3.4]} intensity={22} distance={15} decay={2} color="#ffd6a1" />
      <pointLight position={[0, 0.6, 3.4]} intensity={10} distance={11} decay={2} color="#e79aab" />
    </group>
  )
}
