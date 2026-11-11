import { useEffect, useState } from 'react'

// In-memory registry for photos uploaded/selected during the session
const sessionPhotos: Record<string, string> = {}
const sessionListeners = new Set<() => void>()

export function setSessionPhoto(key: string, dataUrl: string) {
  sessionPhotos[key] = dataUrl
  sessionListeners.forEach((fn) => fn())
}

export function getSessionPhoto(key: string): string | undefined {
  return sessionPhotos[key]
}

export function subscribeSessionPhotos(fn: () => void) {
  sessionListeners.add(fn)
  return () => {
    sessionListeners.delete(fn)
  }
}

/**
 * Returns a list of candidate file paths for a photo, checking both
 * the `public/` root and `public/photos/` subfolder with common names and formats.
 */
export function getImageCandidates(
  index: number,
  id?: string,
  configuredSrc?: string,
): string[] {
  const candidates: string[] = []

  // 1. Session uploaded override
  if (id && sessionPhotos[id]) {
    candidates.push(sessionPhotos[id])
  }
  if (sessionPhotos[String(index)]) {
    candidates.push(sessionPhotos[String(index)])
  }

  // 2. Explicitly configured src
  if (configuredSrc && configuredSrc.trim().length > 0) {
    const clean = configuredSrc.trim()
    candidates.push(clean.startsWith('/') ? clean : `/${clean}`)
  }

  const num = index + 1
  const padded = String(num).padStart(2, '0')

  // Common extensions
  const exts = ['jpg', 'png', 'jpeg', 'webp', 'JPG', 'PNG', 'JPEG', 'avif']

  // Candidate base names
  const baseNames = [
    `yab${num === 1 ? '' : num}`,
    `yab${num}`,
    `yab-${num}`,
    `${num}`,
    padded,
    `photo${num}`,
    `photo-${num}`,
    `yeabsera-${num}`,
    `yeabsera-${padded}`,
    `yeabsera${num}`,
    `her${num}`,
    `her-${num}`,
    `pic${num}`,
    `img${num}`,
  ]

  if (id) {
    baseNames.unshift(id)
    baseNames.unshift(`yeabsera-${id}`)
  }

  // Common hero/portrait names for the first few items
  if (index === 0) {
    baseNames.unshift('hero', 'portrait', 'yeabsera', 'her', 'main', 'cover', 'birthday')
  }

  for (const base of baseNames) {
    for (const ext of exts) {
      // In public/photos/
      candidates.push(`/photos/${base}.${ext}`)
      // In public/ root
      candidates.push(`/${base}.${ext}`)
    }
  }

  // De-duplicate while preserving priority order
  return Array.from(new Set(candidates))
}

/**
 * Custom React hook that resolves the first working image URL from a list of candidates.
 */
export function useResolvedImage(candidates: string[]) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCurrentIdx(0)
    setResolvedSrc(null)
    setFailed(false)
  }, [candidates.join('|')])

  useEffect(() => {
    if (candidates.length === 0 || currentIdx >= candidates.length) {
      setFailed(true)
      return
    }

    const testUrl = candidates[currentIdx]
    let cancelled = false
    const img = new Image()

    img.onload = () => {
      if (!cancelled) {
        setResolvedSrc(testUrl)
        setFailed(false)
      }
    }

    img.onerror = () => {
      if (!cancelled) {
        // Try next candidate
        setCurrentIdx((prev) => prev + 1)
      }
    }

    img.src = testUrl

    return () => {
      cancelled = true
    }
  }, [candidates, currentIdx])

  return {
    src: resolvedSrc,
    loading: !failed && resolvedSrc === null,
    hasImage: resolvedSrc !== null,
  }
}
