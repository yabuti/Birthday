import { useMemo } from 'react'
import type { GiftPhotoSpec } from '../data/content'
import { getImageCandidates, useResolvedImage } from '../lib/images'
import { Sparkles } from 'lucide-react'

interface GiftPhotoProps {
  photo: GiftPhotoSpec
}

/**
 * The photograph gift. Automatically resolves photos from public/ or public/photos/
 * and otherwise renders a luxury gold keepsake frame.
 */
export function GiftPhoto({ photo }: GiftPhotoProps) {
  const candidates = useMemo(() => {
    return [
      photo.src,
      '/photo.jpg',
      '/photo.png',
      '/photos/photo.jpg',
      '/photos/1.jpg',
      '/1.jpg',
      '/yeabsera.jpg',
      '/photos/yeabsera.jpg',
      ...getImageCandidates(0, 'gift-photo', photo.src),
    ]
  }, [photo.src])

  const { src: resolvedSrc, hasImage } = useResolvedImage(candidates)

  return (
    <figure className="gift-photo">
      <div className="gift-photo__frame">
        {hasImage && resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={photo.alt}
            className="gift-photo__image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="gift-photo__fallback">
            <svg viewBox="0 0 320 240" aria-hidden="true">
              <defs>
                <linearGradient id="photoWarm" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#f8e3cf" />
                  <stop offset="0.52" stopColor="#e3ae96" />
                  <stop offset="1" stopColor="#7d3647" />
                </linearGradient>
                <radialGradient id="photoSun" cx="0.5" cy="0.5" r="0.5">
                  <stop stopColor="#fff8e8" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#fff8e8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="photoGold" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#f9e7be" />
                  <stop offset="0.5" stopColor="#d7ab66" />
                  <stop offset="1" stopColor="#f4d9a5" />
                </linearGradient>
              </defs>
              <rect width="320" height="240" fill="url(#photoWarm)" />
              <circle cx="160" cy="104" r="86" fill="url(#photoSun)" />
              <g fill="none" stroke="url(#photoGold)" strokeWidth="1.1" opacity="0.85">
                <circle cx="160" cy="104" r="52" />
                <circle cx="160" cy="104" r="66" opacity="0.4" />
                {Array.from({ length: 16 }).map((_, index) => {
                  const angle = (index / 16) * Math.PI * 2
                  return (
                    <line
                      key={index}
                      x1={160 + Math.cos(angle) * 72}
                      y1={104 + Math.sin(angle) * 72}
                      x2={160 + Math.cos(angle) * 82}
                      y2={104 + Math.sin(angle) * 82}
                    />
                  )
                })}
              </g>
              <text
                x="160"
                y="112"
                textAnchor="middle"
                fill="#fff8ec"
                fontFamily="var(--serif)"
                fontSize="38"
                fontWeight="300"
                letterSpacing="1"
              >
                Y
              </text>
            </svg>
            <div className="gift-photo__vignette" aria-hidden="true" />
          </div>
        )}
      </div>

      <figcaption className="gift-photo__caption">
        <Sparkles size={11} strokeWidth={1.5} />
        <span>{photo.caption}</span>
      </figcaption>
    </figure>
  )
}
