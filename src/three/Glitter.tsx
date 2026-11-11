import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '../lib/useQuality'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSeed;
  varying float vTwinkle;

  void main() {
    vec3 p = position;
    float drift = 0.055 + aSeed * 0.11;
    p.y = mod(p.y + uTime * drift, 7.6);
    p.x += sin(uTime * 0.34 + aSeed * 6.2831) * 0.34;
    p.z += cos(uTime * 0.27 + aSeed * 4.0) * 0.22;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vTwinkle = 0.3 + 0.7 * abs(sin(uTime * 1.5 + aSeed * 13.0));
    gl_PointSize = clamp(uSize * aScale * uPixelRatio * (10.0 / max(0.1, -mv.z)), 1.0, 26.0);
  }
`

const fragmentShader = /* glsl */ `
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.42, 0.0, d);
    float halo = smoothstep(0.5, 0.12, d);
    vec3 warm = mix(vec3(1.0, 0.79, 0.47), vec3(1.0, 0.97, 0.9), vTwinkle);
    float alpha = (core * 0.9 + halo * 0.3) * vTwinkle * 0.5;
    gl_FragColor = vec4(warm, alpha);
  }
`

export function Glitter() {
  const { lowPower } = useQuality()
  const { gl } = useThree()
  const count = lowPower ? 280 : 720

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = Math.random() * 7.6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 11
      scales[i] = 0.45 + Math.random() * 1.4
      seeds[i] = Math.random()
    }

    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    buffer.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    buffer.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const shader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.1 },
        uPixelRatio: { value: 1 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: buffer, material: shader }
  }, [count])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = gl.getPixelRatio()
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
