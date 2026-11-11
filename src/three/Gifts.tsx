import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { GIFTS, type GiftSpec } from '../data/content'
import { openGift, useParty, type GiftId } from '../state/party'
import { glowTexture, plaqueTexture, wrappingTexture } from '../lib/textures'
import { sfx } from '../lib/sfx'
import { Burst } from './Burst'

const GOLD = '#d9b273'

function GoldMaterial() {
  return <meshStandardMaterial color={GOLD} roughness={0.26} metalness={0.92} envMapIntensity={1.5} />
}

function RibbonMaterial({ color }: { color: string }) {
  return <meshStandardMaterial color={color} roughness={0.32} metalness={0.55} envMapIntensity={1.3} />
}

interface RibbonsProps {
  gift: GiftSpec
  height: number
  y: number
  scale: number
}

/** Ribbon layout differs per box: crossed, diagonal, single or double bands. */
function Ribbons({ gift, height, y, scale }: RibbonsProps) {
  const s = gift.size * scale
  const band = height * 1.004
  const color = gift.ribbonColor

  if (gift.ribbon === 'single') {
    return (
      <mesh position={[0, y, 0]}>
        <boxGeometry args={[s * 0.2, band, s * 1.015]} />
        <RibbonMaterial color={color} />
      </mesh>
    )
  }

  if (gift.ribbon === 'diagonal') {
    return (
      <group rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, y, 0]}>
          <boxGeometry args={[s * 1.4, band, s * 0.12]} />
          <RibbonMaterial color={color} />
        </mesh>
        <mesh position={[0, y, 0]}>
          <boxGeometry args={[s * 0.12, band, s * 1.4]} />
          <RibbonMaterial color={color} />
        </mesh>
      </group>
    )
  }

  if (gift.ribbon === 'double') {
    return (
      <group>
        <mesh position={[-s * 0.19, y, 0]}>
          <boxGeometry args={[s * 0.075, band, s * 1.015]} />
          <RibbonMaterial color={color} />
        </mesh>
        <mesh position={[s * 0.19, y, 0]}>
          <boxGeometry args={[s * 0.075, band, s * 1.015]} />
          <RibbonMaterial color={color} />
        </mesh>
        <mesh position={[0, y, 0]}>
          <boxGeometry args={[s * 1.015, band, s * 0.075]} />
          <RibbonMaterial color={color} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <mesh position={[0, y, 0]}>
        <boxGeometry args={[s * 1.014, band, s * 0.15]} />
        <RibbonMaterial color={color} />
      </mesh>
      <mesh position={[0, y, 0]}>
        <boxGeometry args={[s * 0.15, band, s * 1.014]} />
        <RibbonMaterial color={color} />
      </mesh>
    </group>
  )
}

interface GiftBoxProps {
  gift: GiftSpec
  open: boolean
  interactive: boolean
}

function GiftBox({ gift, open, interactive }: GiftBoxProps) {
  const lid = useRef<THREE.Group>(null)
  const bow = useRef<THREE.Group>(null)
  const content = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const glow = useMemo(() => glowTexture(), [])
  const plaque = useMemo(() => plaqueTexture(), [])
  const wrap = useMemo(
    () => wrappingTexture(gift.wrap, gift.boxColor, gift.wrapColor),
    [gift],
  )
  useCursor(hovered && interactive)

  const size = gift.size
  const bodyHeight = size * 0.72
  const lidHeight = size * 0.16
  const lidRest = bodyHeight + lidHeight / 2
  const bowScale = gift.ribbon === 'single' ? 1.28 : gift.ribbon === 'double' ? 1.12 : 1

  useLayoutEffect(() => {
    const lidGroup = lid.current
    const bowGroup = bow.current
    const contentGroup = content.current
    if (!lidGroup || !bowGroup || !contentGroup) return

    const context = gsap.context(() => {
      if (open) {
        // Untie the bow first, then lift the lid clear of the box.
        gsap.to(bowGroup.scale, {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: 0.45,
          ease: 'power2.in',
        })
        gsap.to(bowGroup.rotation, { z: 0.85, y: 0.4, duration: 0.5, ease: 'power2.in' })
        gsap.to(lidGroup.position, {
          y: lidRest + size * 0.55,
          x: size * 0.32,
          duration: 1.15,
          delay: 0.34,
          ease: 'power2.out',
        })
        gsap.to(lidGroup.rotation, {
          z: 0.4,
          x: -0.16,
          duration: 1.15,
          delay: 0.34,
          ease: 'power2.out',
        })
        gsap.fromTo(
          contentGroup.scale,
          { x: 0.001, y: 0.001, z: 0.001 },
          { x: 1, y: 1, z: 1, duration: 0.9, delay: 0.62, ease: 'back.out(1.8)' },
        )
        gsap.fromTo(
          contentGroup.position,
          { y: bodyHeight * 0.35 },
          { y: bodyHeight + size * 0.64, duration: 1.1, delay: 0.62, ease: 'power2.out' },
        )
      } else {
        gsap.set(bowGroup.scale, { x: 1, y: 1, z: 1 })
        gsap.set(bowGroup.rotation, { z: 0, y: 0 })
        gsap.to(lidGroup.position, { y: lidRest, x: 0, duration: 0.55, ease: 'power2.out' })
        gsap.to(lidGroup.rotation, { z: 0, x: 0, duration: 0.55, ease: 'power2.out' })
        gsap.to(contentGroup.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.4 })
      }
    })

    return () => context.revert()
  }, [open, lidRest, bodyHeight, size])

  const handleOpen = () => {
    if (!interactive) return
    if (!open) sfx.sparkle()
    openGift(gift.id)
  }

  return (
    <group
      position={gift.position}
      rotation={[0, gift.rotation, 0]}
      onClick={(event) => {
        event.stopPropagation()
        handleOpen()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (interactive) setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {hovered && interactive ? (
        <sprite position={[0, bodyHeight * 0.7, 0]} scale={[size * 3.4, size * 3.4, 1]}>
          <spriteMaterial
            map={glow}
            color="#ffd9a0"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ) : null}

      <mesh position={[0, bodyHeight / 2, 0]}>
        <boxGeometry args={[size, bodyHeight, size]} />
        <meshStandardMaterial
          map={wrap}
          roughness={0.44}
          metalness={0.22}
          envMapIntensity={1.2}
        />
      </mesh>

      <Ribbons gift={gift} height={bodyHeight} y={bodyHeight / 2} scale={1} />

      <mesh position={[size * 0.24, bodyHeight * 0.64, size * 0.502]}>
        <planeGeometry args={[size * 0.3, size * 0.15]} />
        <meshBasicMaterial map={plaque} transparent alphaTest={0.06} toneMapped={false} />
      </mesh>

      <group ref={lid} position={[0, lidRest, 0]}>
        <mesh>
          <boxGeometry args={[size * 1.07, lidHeight, size * 1.07]} />
          <meshStandardMaterial
            color={gift.lidColor}
            roughness={0.38}
            metalness={0.26}
            envMapIntensity={1.3}
          />
        </mesh>

        <mesh position={[0, -lidHeight / 2 + 0.007, 0]}>
          <boxGeometry args={[size * 1.085, 0.013, size * 1.085]} />
          <GoldMaterial />
        </mesh>

        <Ribbons gift={gift} height={lidHeight} y={0} scale={1.07} />

        <group ref={bow} position={[0, lidHeight / 2 + 0.018, 0]} scale={bowScale}>
          <mesh position={[-size * 0.068, size * 0.075, 0]} rotation={[0, 0, 0.62]}>
            <torusGeometry args={[size * 0.1, size * 0.023, 8, 18, Math.PI * 1.2]} />
            <RibbonMaterial color={gift.ribbonColor} />
          </mesh>
          <mesh position={[size * 0.068, size * 0.075, 0]} rotation={[0, 0, Math.PI - 0.62]}>
            <torusGeometry args={[size * 0.1, size * 0.023, 8, 18, Math.PI * 1.2]} />
            <RibbonMaterial color={gift.ribbonColor} />
          </mesh>
          <mesh position={[0, size * 0.02, 0]}>
            <sphereGeometry args={[size * 0.04, 12, 10]} />
            <RibbonMaterial color={gift.ribbonColor} />
          </mesh>
          <mesh position={[-size * 0.15, -size * 0.015, 0]} rotation={[0, 0, -0.28]}>
            <boxGeometry args={[size * 0.18, size * 0.032, size * 0.012]} />
            <RibbonMaterial color={gift.ribbonColor} />
          </mesh>
          <mesh position={[size * 0.15, -size * 0.015, 0]} rotation={[0, 0, 0.28]}>
            <boxGeometry args={[size * 0.18, size * 0.032, size * 0.012]} />
            <RibbonMaterial color={gift.ribbonColor} />
          </mesh>
        </group>

        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([sx, sz]) => (
          <mesh
            key={`${sx}-${sz}`}
            position={[sx * size * 0.475, lidHeight / 2 + 0.004, sz * size * 0.475]}
          >
            <sphereGeometry args={[size * 0.022, 8, 6]} />
            <GoldMaterial />
          </mesh>
        ))}
      </group>

      <group ref={content} position={[0, bodyHeight * 0.35, 0]} scale={0.001}>
        <mesh>
          <icosahedronGeometry args={[size * 0.17, 0]} />
          <meshStandardMaterial
            color="#f7e3b4"
            emissive="#d9a558"
            emissiveIntensity={1.7}
            metalness={0.9}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <sprite scale={[size * 1.7, size * 1.7, 1]}>
          <spriteMaterial
            map={glow}
            color="#ffd9a0"
            transparent
            opacity={0.72}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {open ? (
        <pointLight
          position={[0, bodyHeight + 0.08, 0]}
          intensity={1.7}
          distance={1.6}
          decay={2}
          color="#ffd9a0"
        />
      ) : null}
    </group>
  )
}

interface GiftBurst {
  key: number
  position: [number, number, number]
  colors: string[]
  count: number
  life: number
  seed: number
}

export function Gifts() {
  const { openedGifts, scene } = useParty()
  const [bursts, setBursts] = useState<GiftBurst[]>([])
  const seen = useRef<GiftId[]>([])
  const counter = useRef(0)

  useEffect(() => {
    const added = openedGifts.filter((id) => !seen.current.includes(id))
    seen.current = openedGifts
    if (!added.length) return

    const next: GiftBurst[] = []
    added.forEach((id) => {
      const gift = GIFTS.find((entry) => entry.id === id)
      if (!gift) return
      const [x, , z] = gift.position
      const top = gift.size * 0.95
      counter.current += 1
      next.push({
        key: counter.current,
        position: [x, top + 0.12, z],
        colors: [gift.ribbonColor, '#f9e7be', '#fdf6ef', gift.lidColor, '#e8a7b7'],
        count: 30,
        life: 1.9,
        seed: counter.current + 4,
      })
      counter.current += 1
      next.push({
        key: counter.current,
        position: [x, top + 0.62, z],
        colors: ['#ffe6b0', '#fff4d8', '#e8c894', '#f6d9a4'],
        count: 14,
        life: 1.6,
        seed: counter.current + 11,
      })
    })
    if (!next.length) return
    setBursts((current) => [...current, ...next])
    sfx.reveal()
  }, [openedGifts])

  const removeBurst = (id?: number) => {
    setBursts((current) => current.filter((burst) => burst.key !== id))
  }

  return (
    <group>
      {GIFTS.map((gift) => (
        <GiftBox
          key={gift.id}
          gift={gift}
          open={openedGifts.includes(gift.id)}
          interactive={scene === 4}
        />
      ))}

      {bursts.map((burst) => (
        <Burst
          key={burst.key}
          id={burst.key}
          position={burst.position}
          colors={burst.colors}
          count={burst.count}
          life={burst.life}
          seed={burst.seed}
          onDone={removeBurst}
        />
      ))}
    </group>
  )
}
