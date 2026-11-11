import { useEffect, useState } from 'react'

export interface Quality {
  reduced: boolean
  compact: boolean
  lowPower: boolean
}

function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isCompact() {
  return typeof window !== 'undefined' && window.innerWidth < 820
}

/** Device + preference tier used to scale particle counts and motion. */
export function useQuality(): Quality {
  const [reduced, setReduced] = useState(prefersReduced)
  const [compact, setCompact] = useState(isCompact)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduced(motionQuery.matches)
    const onResize = () => setCompact(isCompact())
    motionQuery.addEventListener('change', onMotion)
    window.addEventListener('resize', onResize)
    return () => {
      motionQuery.removeEventListener('change', onMotion)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { reduced, compact, lowPower: reduced || compact }
}
