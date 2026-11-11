import { useMemo } from 'react'
import { MemoryArt } from './MemoryArt'
import { PHOTO_TONES, type PhotoConfig } from '../config'
import { getImageCandidates, useResolvedImage } from '../lib/images'
import { Heart } from 'lucide-react'

interface MemoryPhotoProps {
  photo: PhotoConfig
  index?: number
  className?: string
}

/**
 * Shows the real photograph whenever an image exists in `public/` or `public/photos/`
 * (or uploaded in the session), and otherwise shows an art-directed romantic keepsake.
 */
export function MemoryPhoto({ photo, index = 0, className = '' }: MemoryPhotoProps) {
  const candidates = useMemo(() => {
    return getImageCandidates(index, photo.id, photo.src)
  }, [index, photo.id, photo.src])

  const { src: resolvedSrc, hasImage } = useResolvedImage(candidates)
  const tone = PHOTO_TONES[photo.tone] ?? PHOTO_TONES.rose

  if (hasImage && resolvedSrc) {
    return (
      <div className={`memory-photo memory-photo--image-wrapper ${className}`}>
        <img
          className="memory-photo memory-photo--image"
          src={resolvedSrc}
          alt={photo.alt || photo.title}
          loading="lazy"
          decoding="async"
        />
        <span className="memory-photo__shine" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div
      className={`memory-photo memory-photo--keepsake ${className}`}
      role="img"
      aria-label={photo.alt || photo.title}
      style={{
        background: `linear-gradient(145deg, ${tone.from} 0%, ${tone.to} 100%)`,
        color: tone.ink,
      }}
    >
      <span className="memory-photo__glow" aria-hidden="true" />
      <span className="memory-photo__art" aria-hidden="true">
        <MemoryArt motif={photo.motif} />
      </span>
      <span className="memory-photo__grain" aria-hidden="true" />
      <div className="memory-photo__tag" aria-hidden="true">
        <Heart size={9} fill="currentColor" opacity={0.8} />
        <span>Memories</span>
      </div>
    </div>
  )
}
