import * as THREE from 'three'

const cache = new Map<string, THREE.Texture>()

function canvas(size: number, height = size) {
  const el = document.createElement('canvas')
  el.width = size
  el.height = height
  const ctx = el.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  return { el, ctx }
}

function finish(el: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(el)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** Soft radial glow used for flames, bokeh and sparkles. */
export function glowTexture(): THREE.Texture {
  const cached = cache.get('glow')
  if (cached) return cached
  const { el, ctx } = canvas(128)
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.18, 'rgba(255,246,224,0.85)')
  gradient.addColorStop(0.45, 'rgba(255,206,150,0.28)')
  gradient.addColorStop(1, 'rgba(255,190,130,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = finish(el)
  cache.set('glow', texture)
  return texture
}

/** Candle glow, tighter and warmer than the generic glow. */
export function flameTexture(): THREE.Texture {
  const cached = cache.get('flame')
  if (cached) return cached
  const { el, ctx } = canvas(128)
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.22, 'rgba(255,214,150,0.9)')
  gradient.addColorStop(0.5, 'rgba(255,138,66,0.4)')
  gradient.addColorStop(1, 'rgba(255,110,40,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = finish(el)
  cache.set('flame', texture)
  return texture
}

/** Wide, soft pool of light for the stage floor. */
export function floorPoolTexture(): THREE.Texture {
  const cached = cache.get('floor')
  if (cached) return cached
  const { el, ctx } = canvas(512)
  const gradient = ctx.createRadialGradient(256, 256, 8, 256, 256, 250)
  gradient.addColorStop(0, 'rgba(255,206,164,0.55)')
  gradient.addColorStop(0.35, 'rgba(233,150,164,0.26)')
  gradient.addColorStop(0.7, 'rgba(140,70,92,0.09)')
  gradient.addColorStop(1, 'rgba(20,8,14,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)
  const texture = finish(el)
  cache.set('floor', texture)
  return texture
}

/** Backdrop wash behind the party. */
export function backdropTexture(): THREE.Texture {
  const cached = cache.get('backdrop')
  if (cached) return cached
  const { el, ctx } = canvas(128, 512)
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#3c1a2b')
  gradient.addColorStop(0.45, '#2a1020')
  gradient.addColorStop(1, '#14070f')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 512)
  const texture = finish(el)
  cache.set('backdrop', texture)
  return texture
}

/** Vertical gradient for volumetric light shafts. */
export function shaftTexture(): THREE.Texture {
  const cached = cache.get('shaft')
  if (cached) return cached
  const { el, ctx } = canvas(64, 256)
  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, 'rgba(255,235,210,0.85)')
  gradient.addColorStop(0.55, 'rgba(255,210,180,0.25)')
  gradient.addColorStop(1, 'rgba(255,200,170,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 256)
  const texture = finish(el)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  cache.set('shaft', texture)
  return texture
}

/** Gold foil "25" cake topper. */
export function plaqueTexture(): THREE.Texture {
  const cached = cache.get('plaque')
  if (cached) return cached
  const { el, ctx } = canvas(512, 256)
  ctx.clearRect(0, 0, 512, 256)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const gradient = ctx.createLinearGradient(120, 40, 400, 220)
  gradient.addColorStop(0, '#f7e6b8')
  gradient.addColorStop(0.28, '#d8ab62')
  gradient.addColorStop(0.5, '#fff3d2')
  gradient.addColorStop(0.72, '#bb8c46')
  gradient.addColorStop(1, '#f0d49a')
  ctx.font = '300 200px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = gradient
  ctx.fillText('25', 256, 138)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,244,215,0.55)'
  ctx.strokeText('25', 256, 138)
  const texture = finish(el)
  cache.set('plaque', texture)
  return texture
}

/** Diagonal champagne stripes for the candle wax. */
export function candleStripeTexture(): THREE.Texture {
  const cached = cache.get('stripe')
  if (cached) return cached
  const { el, ctx } = canvas(64)
  ctx.fillStyle = '#f9e9d6'
  ctx.fillRect(0, 0, 64, 64)
  ctx.strokeStyle = 'rgba(216,171,98,0.85)'
  ctx.lineWidth = 9
  for (let i = -64; i < 128; i += 22) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 64, 64)
    ctx.stroke()
  }
  const texture = finish(el)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  cache.set('stripe', texture)
  return texture
}

/** Soft diagonal sheen used on the marble table. */
export function marbleTexture(): THREE.Texture {
  const cached = cache.get('marble')
  if (cached) return cached
  const { el, ctx } = canvas(512)
  ctx.fillStyle = '#f6e7dc'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 34; i += 1) {
    ctx.beginPath()
    const startX = Math.random() * 512
    const startY = Math.random() * 512
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(
      startX + Math.random() * 160 - 80,
      startY + Math.random() * 200,
      startX + Math.random() * 220 - 110,
      startY + Math.random() * 320,
      startX + Math.random() * 300 - 150,
      startY + Math.random() * 420,
    )
    ctx.strokeStyle = `rgba(${190 + Math.random() * 30}, ${150 + Math.random() * 30}, ${150 + Math.random() * 40}, ${
      0.05 + Math.random() * 0.12
    })`
    ctx.lineWidth = 0.6 + Math.random() * 2.4
    ctx.stroke()
  }
  const texture = finish(el)
  cache.set('marble', texture)
  return texture
}

export type WrapPattern = 'pinstripe' | 'damask' | 'pearl' | 'constellation'

/**
 * Wrapping paper for the gift boxes. Each pattern is drawn in the box's own
 * colours so four boxes never share the same paper.
 */
export function wrappingTexture(
  pattern: WrapPattern,
  base: string,
  accent: string,
): THREE.Texture {
  const key = `wrap:${pattern}:${base}:${accent}`
  const cached = cache.get(key)
  if (cached) return cached

  const { el, ctx } = canvas(256)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = accent
  ctx.fillStyle = accent

  if (pattern === 'pinstripe') {
    ctx.globalAlpha = 0.34
    ctx.lineWidth = 2.5
    for (let x = -256; x < 512; x += 26) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + 256, 256)
      ctx.stroke()
    }
  } else if (pattern === 'pearl') {
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const x = col * 34 + (row % 2 ? 17 : 0) + 4
        const y = row * 34 + 8
        const pearl = ctx.createRadialGradient(x - 2, y - 2, 0, x, y, 4.2)
        pearl.addColorStop(0, 'rgba(255,250,238,0.9)')
        pearl.addColorStop(0.45, accent)
        pearl.addColorStop(1, 'rgba(255,250,238,0)')
        ctx.globalAlpha = 0.72
        ctx.fillStyle = pearl
        ctx.beginPath()
        ctx.arc(x, y, 4.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.fillStyle = accent
  } else if (pattern === 'damask') {
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1.4
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const x = col * 56 + (row % 2 ? 28 : 0) + 14
        const y = row * 56 + 16
        ctx.beginPath()
        ctx.moveTo(x, y - 15)
        ctx.quadraticCurveTo(x + 13, y - 13, x + 15, y)
        ctx.quadraticCurveTo(x + 13, y + 13, x, y + 15)
        ctx.quadraticCurveTo(x - 13, y + 13, x - 15, y)
        ctx.quadraticCurveTo(x - 13, y - 13, x, y - 15)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, 4.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 28, y + 28, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  } else {
    ctx.globalAlpha = 0.32
    ctx.lineWidth = 0.9
    for (let x = 8; x < 256; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x - 22, 256)
      ctx.stroke()
    }
    ctx.globalAlpha = 0.85
    const rand = (() => {
      let state = 731
      return () => {
        state = (state * 16807) % 2147483647
        return state / 2147483647
      }
    })()
    for (let i = 0; i < 46; i += 1) {
      const x = rand() * 256
      const y = rand() * 256
      const r = 1 + rand() * 2.6
      ctx.beginPath()
      ctx.moveTo(x, y - r)
      ctx.lineTo(x + r * 0.4, y)
      ctx.lineTo(x, y + r)
      ctx.lineTo(x - r * 0.4, y)
      ctx.closePath()
      ctx.fill()
    }
  }

  ctx.globalAlpha = 1
  const texture = finish(el)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  cache.set(key, texture)
  return texture
}
